# Act III batch lyric alignment

This pipeline aligns the official lyrics already stored in `lyrics_protocol`
against the album audio and produces reviewed, transactional SQL for
`track_lyrics`.

It never writes to Supabase directly.

## Environment

WhisperX and PyTorch do not currently support this workspace's system Python
3.14. Use Python 3.11 in a dedicated virtual environment:

```powershell
py -3.11 -m venv .venv-lyrics
.\.venv-lyrics\Scripts\python.exe -m pip install --upgrade pip
.\.venv-lyrics\Scripts\python.exe -m pip install -r scripts\lyrics-alignment\requirements.txt
```

WhisperX also requires `ffmpeg` on `PATH`. GPU execution is preferred for a
32-track album, but CPU mode is supported.

## Album workflow

```powershell
python scripts\align_album_lyrics.py manifest
.\.venv-lyrics\Scripts\python.exe scripts\align_album_lyrics.py transcribe --device cuda --compute-type float16 --batch-size 8
python scripts\align_album_lyrics.py align
python scripts\align_album_lyrics.py sql
```

Use `--device cpu --compute-type int8 --batch-size 2` without a supported GPU.

Outputs are written under `outputs/lyrics-alignment/act-three/`:

- `manifest.json`: tracks, audio URLs, and canonical authored lyric lines.
- `transcripts/`: raw WhisperX word timings, one file per track.
- `review.json`: line timings, confidence, and review status.
- `apply-reviewed.sql`: one transaction for approved tracks only.

Tracks with missing official lyrics are blocked. A track becomes
`auto_approved` only when every line is resolved without interpolation and both
the weighted confidence and word-match thresholds pass. Reviewers may change
`needs_review` to `approved` after correcting that track's timestamps.
