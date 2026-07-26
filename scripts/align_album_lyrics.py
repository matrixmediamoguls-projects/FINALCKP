"""Batch-align official album lyrics to audio and produce reviewable SQL.

Workflow:
  1. manifest  - read tracks + authored lyrics from Supabase
  2. transcribe - run WhisperX for every ready track (optional dependency)
  3. align     - map WhisperX word timestamps onto the authored lyric lines
  4. sql       - create one transactional, review-gated Supabase update

No live lyric rows are written by this script. The SQL command only includes
tracks whose line-level confidence passes the configured review threshold,
unless the reviewer explicitly marks a track approved in review.json.
"""

from __future__ import annotations

import argparse
import json
import math
import os
import re
import sys
import urllib.parse
import urllib.request
from dataclasses import dataclass
from difflib import SequenceMatcher
from pathlib import Path
from typing import Any, Iterable


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_OUTPUT = ROOT / "outputs" / "lyrics-alignment" / "act-three"
DEFAULT_R2_BASE = "https://media.chromakeyprotocol.com"
SECTION_RE = re.compile(
    r"^\s*[\[(]?(intro|outro|verse|pre[\s-]?chorus|chorus|hook|bridge|refrain|"
    r"breakdown|interlude|spoken|tag|final chorus|post[\s-]?chorus)"
    r"(?:\s+\d+|\s+[ivx]+)?[\])\s:.-]*$",
    re.IGNORECASE,
)
METADATA_RE = re.compile(
    r"^\s*(?:©|copyright|artist\s*/|artist:|producer:|composer:|songwriter:|"
    r"all rights reserved)",
    re.IGNORECASE,
)
TOKEN_RE = re.compile(r"[a-z0-9]+(?:'[a-z0-9]+)?", re.IGNORECASE)


@dataclass(frozen=True)
class Word:
    text: str
    start: float
    end: float
    score: float


def load_env(path: Path) -> dict[str, str]:
    values: dict[str, str] = {}
    if not path.exists():
        return values
    for raw in path.read_text(encoding="utf-8-sig").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        values[key.strip()] = value.strip().strip("'\"")
    return values


def write_json(path: Path, payload: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


def read_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def supabase_get(
    base_url: str,
    key: str,
    table: str,
    select: str,
    query: dict[str, str] | None = None,
) -> list[dict[str, Any]]:
    params = {"select": select, **(query or {})}
    url = f"{base_url.rstrip('/')}/rest/v1/{table}?{urllib.parse.urlencode(params)}"
    request = urllib.request.Request(
        url,
        headers={
            "apikey": key,
            "Authorization": f"Bearer {key}",
            "Accept": "application/json",
        },
    )
    with urllib.request.urlopen(request, timeout=60) as response:
        return json.loads(response.read().decode("utf-8"))


def canonical_lines(text: str, max_words: int = 16) -> list[str]:
    """Return display-ready authored lyric lines without section metadata."""
    raw_lines = [line.strip() for line in text.replace("\r", "\n").split("\n")]
    filtered: list[str] = []
    for line in raw_lines:
        line = re.sub(r"\s+", " ", line).strip(" \t")
        if not line or SECTION_RE.match(line) or METADATA_RE.match(line):
            continue
        # Standalone bracketed production notes are not sung lyric lines.
        if re.fullmatch(r"[\[(].{1,80}[\])]", line):
            continue
        words = line.split()
        if len(words) <= max_words:
            filtered.append(line)
            continue
        # Long prose-shaped workbook lines are split at punctuation first, then
        # into bounded display lines. Wording is never rewritten.
        clauses = [
            clause.strip()
            for clause in re.split(r"(?<=[,;:!?])\s+", line)
            if clause.strip()
        ]
        for clause in clauses:
            clause_words = clause.split()
            for start in range(0, len(clause_words), max_words):
                filtered.append(" ".join(clause_words[start : start + max_words]))
    return filtered


def normalize_token(value: str) -> str:
    value = (
        value.lower()
        .replace("’", "'")
        .replace("‘", "'")
        .replace("`", "'")
        .replace("&", " and ")
    )
    tokens = TOKEN_RE.findall(value)
    return "".join(tokens)


def tokenize_lines(lines: list[str]) -> tuple[list[str], list[int]]:
    tokens: list[str] = []
    owners: list[int] = []
    for line_index, line in enumerate(lines):
        for token in TOKEN_RE.findall(line.replace("’", "'")):
            normalized = normalize_token(token)
            if normalized:
                tokens.append(normalized)
                owners.append(line_index)
    return tokens, owners


def word_similarity(authored: str, heard: str) -> float:
    if authored == heard:
        return 1.0
    if not authored or not heard:
        return 0.0
    if authored.rstrip("s") == heard.rstrip("s") and min(len(authored), len(heard)) > 3:
        return 0.88
    ratio = SequenceMatcher(None, authored, heard).ratio()
    return ratio if ratio >= 0.76 else 0.0


def global_word_alignment(
    authored: list[str],
    heard: list[str],
) -> list[tuple[int, int, float]]:
    """Needleman-Wunsch alignment preserving repeated chorus order."""
    rows, cols = len(authored) + 1, len(heard) + 1
    gap = -1.15
    scores = [[0.0] * cols for _ in range(rows)]
    moves = [bytearray(cols) for _ in range(rows)]  # 1 diag, 2 up, 3 left
    for i in range(1, rows):
        scores[i][0] = i * gap
        moves[i][0] = 2
    for j in range(1, cols):
        scores[0][j] = j * gap
        moves[0][j] = 3

    for i in range(1, rows):
        left_word = authored[i - 1]
        for j in range(1, cols):
            similarity = word_similarity(left_word, heard[j - 1])
            diagonal = scores[i - 1][j - 1] + (3.0 * similarity if similarity else -1.8)
            up = scores[i - 1][j] + gap
            left = scores[i][j - 1] + gap
            best = max(diagonal, up, left)
            scores[i][j] = best
            moves[i][j] = 1 if best == diagonal else 2 if best == up else 3

    matches: list[tuple[int, int, float]] = []
    i, j = len(authored), len(heard)
    while i or j:
        move = moves[i][j]
        if move == 1:
            similarity = word_similarity(authored[i - 1], heard[j - 1])
            if similarity:
                matches.append((i - 1, j - 1, similarity))
            i -= 1
            j -= 1
        elif move == 2:
            i -= 1
        else:
            j -= 1
    matches.reverse()
    return matches


def extract_words(transcript: dict[str, Any]) -> list[Word]:
    candidates = transcript.get("word_segments")
    if not candidates:
        candidates = [
            word
            for segment in transcript.get("segments", [])
            for word in segment.get("words", [])
        ]
    words: list[Word] = []
    for item in candidates or []:
        text = normalize_token(str(item.get("word", item.get("text", ""))))
        start, end = item.get("start"), item.get("end")
        if not text or start is None or end is None:
            continue
        words.append(
            Word(
                text=text,
                start=float(start),
                end=float(end),
                score=float(item.get("score", item.get("probability", 1.0)) or 0),
            )
        )
    return words


def align_lines(
    lines: list[str],
    transcript_words: list[Word],
    minimum_line_ms: int = 280,
) -> tuple[list[dict[str, Any]], dict[str, Any]]:
    authored_tokens, owners = tokenize_lines(lines)
    heard_tokens = [word.text for word in transcript_words]
    matches = global_word_alignment(authored_tokens, heard_tokens)

    by_line: list[list[tuple[Word, float]]] = [[] for _ in lines]
    authored_counts = [0] * len(lines)
    for owner in owners:
        authored_counts[owner] += 1
    for authored_index, heard_index, similarity in matches:
        by_line[owners[authored_index]].append((transcript_words[heard_index], similarity))

    rows: list[dict[str, Any]] = []
    for index, line in enumerate(lines):
        aligned = by_line[index]
        confidence = (
            sum(similarity * word.score for word, similarity in aligned)
            / max(1, authored_counts[index])
        )
        if aligned:
            start_ms = round(min(word.start for word, _ in aligned) * 1000)
            end_ms = round(max(word.end for word, _ in aligned) * 1000)
            method = "forced-word-match"
        else:
            start_ms = end_ms = None
            method = "unmatched"
        rows.append(
            {
                "line_order": index,
                "line_text": line,
                "start_ms": start_ms,
                "end_ms": end_ms,
                "confidence": round(confidence, 4),
                "matched_words": len(aligned),
                "authored_words": authored_counts[index],
                "method": method,
            }
        )

    # Interpolate unmatched lines only between trustworthy neighbors. They stay
    # flagged for review and can never auto-approve a track.
    for index, row in enumerate(rows):
        if row["start_ms"] is not None:
            continue
        previous = next(
            (rows[i] for i in range(index - 1, -1, -1) if rows[i]["end_ms"] is not None),
            None,
        )
        following = next(
            (rows[i] for i in range(index + 1, len(rows)) if rows[i]["start_ms"] is not None),
            None,
        )
        if previous and following and following["start_ms"] > previous["end_ms"]:
            missing_group = [
                i
                for i in range(index, len(rows))
                if rows[i]["start_ms"] is None
                and not any(rows[k]["start_ms"] is not None for k in range(index, i))
            ]
            group_end = next(
                (i for i in range(index, len(rows)) if rows[i]["start_ms"] is not None),
                len(rows),
            )
            group = [i for i in range(index, group_end) if rows[i]["start_ms"] is None]
            if index != group[0]:
                continue
            span = following["start_ms"] - previous["end_ms"]
            slice_ms = max(minimum_line_ms, span // max(1, len(group)))
            for offset, missing_index in enumerate(group):
                start_ms = previous["end_ms"] + offset * slice_ms
                rows[missing_index]["start_ms"] = start_ms
                rows[missing_index]["end_ms"] = min(
                    following["start_ms"] - 1,
                    start_ms + slice_ms,
                )
                rows[missing_index]["method"] = "interpolated-review-required"

    previous_end = 0
    for row in rows:
        if row["start_ms"] is None:
            continue
        row["start_ms"] = max(previous_end, int(row["start_ms"]))
        row["end_ms"] = max(
            row["start_ms"] + minimum_line_ms,
            int(row["end_ms"] or row["start_ms"]),
        )
        previous_end = row["end_ms"]

    matched_lines = sum(row["method"] == "forced-word-match" for row in rows)
    interpolated = sum(row["method"].startswith("interpolated") for row in rows)
    unresolved = sum(row["start_ms"] is None for row in rows)
    weighted_confidence = (
        sum(row["confidence"] * max(1, row["authored_words"]) for row in rows)
        / max(1, sum(max(1, row["authored_words"]) for row in rows))
    )
    metrics = {
        "line_count": len(rows),
        "matched_lines": matched_lines,
        "interpolated_lines": interpolated,
        "unresolved_lines": unresolved,
        "word_match_ratio": round(len(matches) / max(1, len(authored_tokens)), 4),
        "weighted_confidence": round(weighted_confidence, 4),
    }
    return rows, metrics


def command_manifest(args: argparse.Namespace) -> int:
    env = {**load_env(ROOT / "backend" / ".env"), **os.environ}
    base_url = env.get("SUPABASE_URL")
    key = env.get("SUPABASE_KEY") or env.get("SUPABASE_SERVICE_ROLE_KEY")
    if not base_url or not key:
        raise SystemExit("SUPABASE_URL and SUPABASE_KEY are required in backend/.env or the environment.")

    tracks = supabase_get(
        base_url,
        key,
        "tracks",
        "id,title,queue_index,r2_audio_key,duration_ms",
        {"queue_index": "gte.1", "order": "queue_index.asc", "limit": "32"},
    )
    protocols = supabase_get(
        base_url,
        key,
        "lyrics_protocol",
        "track_id,lyrics_clean,lyrics_full",
    )
    lyrics_by_track = {row["track_id"]: row for row in protocols}
    base = args.r2_base.rstrip("/")
    records = []
    for track in tracks:
        protocol = lyrics_by_track.get(track["id"], {})
        lyrics = (protocol.get("lyrics_clean") or protocol.get("lyrics_full") or "").strip()
        lines = canonical_lines(lyrics)
        records.append(
            {
                **track,
                "audio_url": f"{base}/{str(track['r2_audio_key']).lstrip('/')}",
                "lyrics": lyrics,
                "lines": lines,
                "status": "ready" if lines else "blocked_missing_lyrics",
            }
        )
    payload = {
        "album": args.album,
        "schema_version": 1,
        "tracks": records,
        "summary": {
            "total": len(records),
            "ready": sum(record["status"] == "ready" for record in records),
            "blocked_missing_lyrics": sum(
                record["status"] == "blocked_missing_lyrics" for record in records
            ),
        },
    }
    write_json(args.output / "manifest.json", payload)
    print(json.dumps(payload["summary"], indent=2))
    return 0 if payload["summary"]["ready"] else 1


def command_transcribe(args: argparse.Namespace) -> int:
    try:
        import whisperx  # type: ignore
    except ImportError as error:
        raise SystemExit(
            "WhisperX is not installed. Use the pinned alignment environment "
            "documented in scripts/lyrics-alignment/README.md."
        ) from error

    manifest = read_json(args.output / "manifest.json")
    transcripts = args.output / "transcripts"
    audio_dir = args.output / "audio"
    transcripts.mkdir(parents=True, exist_ok=True)
    audio_dir.mkdir(parents=True, exist_ok=True)

    model = whisperx.load_model(
        args.model,
        args.device,
        compute_type=args.compute_type,
        language=args.language,
    )
    align_models: dict[str, tuple[Any, Any]] = {}
    processed = 0
    for track in manifest["tracks"]:
        if track["status"] != "ready":
            continue
        destination = transcripts / f"{int(track['queue_index']):02d}-{track['id']}.json"
        if destination.exists() and not args.force:
            continue
        suffix = Path(urllib.parse.urlparse(track["audio_url"]).path).suffix or ".audio"
        audio_path = audio_dir / f"{int(track['queue_index']):02d}{suffix}"
        if not audio_path.exists() or args.force:
            urllib.request.urlretrieve(track["audio_url"], audio_path)
        audio = whisperx.load_audio(str(audio_path))
        result = model.transcribe(audio, batch_size=args.batch_size)
        language = result.get("language") or args.language
        if language not in align_models:
            align_models[language] = whisperx.load_align_model(
                language_code=language,
                device=args.device,
            )
        align_model, metadata = align_models[language]
        aligned = whisperx.align(
            result["segments"],
            align_model,
            metadata,
            audio,
            args.device,
            return_char_alignments=False,
        )
        aligned["track_id"] = track["id"]
        aligned["queue_index"] = track["queue_index"]
        aligned["title"] = track["title"]
        write_json(destination, aligned)
        processed += 1
        print(f"[{track['queue_index']:02d}] aligned {track['title']}")
    print(f"Processed {processed} tracks.")
    return 0


def transcript_path(output: Path, track: dict[str, Any]) -> Path | None:
    matches = list((output / "transcripts").glob(f"{int(track['queue_index']):02d}-*.json"))
    return matches[0] if len(matches) == 1 else None


def command_align(args: argparse.Namespace) -> int:
    manifest = read_json(args.output / "manifest.json")
    review_tracks = []
    for track in manifest["tracks"]:
        if track["status"] != "ready":
            review_tracks.append({**track, "review_status": track["status"], "timed_lines": []})
            continue
        source = transcript_path(args.output, track)
        if not source:
            review_tracks.append(
                {**track, "review_status": "blocked_missing_transcript", "timed_lines": []}
            )
            continue
        words = extract_words(read_json(source))
        timed_lines, metrics = align_lines(track["lines"], words)
        auto_approved = (
            metrics["weighted_confidence"] >= args.confidence
            and metrics["word_match_ratio"] >= args.word_match_ratio
            and metrics["interpolated_lines"] == 0
            and metrics["unresolved_lines"] == 0
        )
        review_tracks.append(
            {
                "id": track["id"],
                "queue_index": track["queue_index"],
                "title": track["title"],
                "review_status": "auto_approved" if auto_approved else "needs_review",
                "metrics": metrics,
                "transcript": str(source.relative_to(args.output)),
                "timed_lines": timed_lines,
            }
        )
    review = {
        "schema_version": 1,
        "thresholds": {
            "confidence": args.confidence,
            "word_match_ratio": args.word_match_ratio,
        },
        "tracks": review_tracks,
        "summary": {
            status: sum(track["review_status"] == status for track in review_tracks)
            for status in sorted({track["review_status"] for track in review_tracks})
        },
    }
    write_json(args.output / "review.json", review)
    print(json.dumps(review["summary"], indent=2))
    return 0


def sql_literal(value: str) -> str:
    return "'" + value.replace("'", "''") + "'"


def command_sql(args: argparse.Namespace) -> int:
    review = read_json(args.output / "review.json")
    approved = [
        track
        for track in review["tracks"]
        if track["review_status"] in {"auto_approved", "approved"}
        and track.get("timed_lines")
        and all(line.get("start_ms") is not None for line in track["timed_lines"])
    ]
    if not approved:
        raise SystemExit("No approved tracks are available. Review review.json first.")

    lines = [
        "begin;",
        "",
        "-- Generated from reviewed forced-alignment output.",
        "-- Only tracks marked auto_approved or approved are replaced.",
    ]
    ids = ", ".join(sql_literal(track["id"]) + "::uuid" for track in approved)
    lines += [
        f"delete from public.track_lyrics where track_id in ({ids});",
        "",
        "insert into public.track_lyrics",
        "  (track_id, line_order, line_text, start_ms, end_ms)",
        "values",
    ]
    value_rows = []
    for track in approved:
        for row in track["timed_lines"]:
            value_rows.append(
                "  ("
                + ", ".join(
                    [
                        sql_literal(track["id"]) + "::uuid",
                        str(int(row["line_order"])),
                        sql_literal(row["line_text"]),
                        str(int(row["start_ms"])),
                        str(int(row["end_ms"])),
                    ]
                )
                + ")"
            )
    lines.append(",\n".join(value_rows) + ";")
    lines += [
        "",
        "update public.lyrics_protocol",
        "set timestamp_sync = aligned.payload,",
        "    display_mode = 'karaoke',",
        "    updated_at = now()",
        "from (values",
    ]
    payload_rows = []
    for track in approved:
        payload = [
            {
                "line_order": row["line_order"],
                "line_text": row["line_text"],
                "start_ms": row["start_ms"],
                "end_ms": row["end_ms"],
            }
            for row in track["timed_lines"]
        ]
        payload_rows.append(
            f"  ({sql_literal(track['id'])}::uuid, "
            f"{sql_literal(json.dumps(payload, ensure_ascii=False))}::jsonb)"
        )
    lines.append(",\n".join(payload_rows))
    lines += [
        ") as aligned(track_id, payload)",
        "where lyrics_protocol.track_id = aligned.track_id;",
        "",
        "commit;",
        "",
        f"-- Approved tracks: {len(approved)}",
        f"-- Timed lines: {len(value_rows)}",
    ]
    target = args.output / "apply-reviewed.sql"
    target.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"Wrote {target} with {len(approved)} tracks and {len(value_rows)} timed lines.")
    return 0


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    subparsers = parser.add_subparsers(dest="command", required=True)

    manifest = subparsers.add_parser("manifest", help="Build the live album manifest.")
    manifest.add_argument("--album", default="Act III: Reclamation")
    manifest.add_argument("--r2-base", default=DEFAULT_R2_BASE)
    manifest.set_defaults(handler=command_manifest)

    transcribe = subparsers.add_parser("transcribe", help="Run WhisperX across ready tracks.")
    transcribe.add_argument("--model", default="large-v3")
    transcribe.add_argument("--language", default="en")
    transcribe.add_argument("--device", choices=["cpu", "cuda"], default="cpu")
    transcribe.add_argument("--compute-type", default="int8")
    transcribe.add_argument("--batch-size", type=int, default=4)
    transcribe.add_argument("--force", action="store_true")
    transcribe.set_defaults(handler=command_transcribe)

    align = subparsers.add_parser("align", help="Map word timestamps to authored lines.")
    align.add_argument("--confidence", type=float, default=0.72)
    align.add_argument("--word-match-ratio", type=float, default=0.78)
    align.set_defaults(handler=command_align)

    sql = subparsers.add_parser("sql", help="Generate transactional SQL for approved tracks.")
    sql.set_defaults(handler=command_sql)
    return parser


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)
    args.output = args.output.resolve()
    return int(args.handler(args))


if __name__ == "__main__":
    raise SystemExit(main())
