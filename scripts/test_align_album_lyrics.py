import importlib.util
import sys
import unittest
from pathlib import Path


SCRIPT = Path(__file__).with_name("align_album_lyrics.py")
SPEC = importlib.util.spec_from_file_location("align_album_lyrics", SCRIPT)
MODULE = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = MODULE
SPEC.loader.exec_module(MODULE)


class LyricAlignmentTests(unittest.TestCase):
    def test_canonical_lines_remove_headers_and_preserve_words(self):
        source = """VERSE 1
This is the first authored line

[Chorus]
This is a second line that must remain exactly as written.
© Musiq Matrix
"""
        self.assertEqual(
            MODULE.canonical_lines(source),
            [
                "This is the first authored line",
                "This is a second line that must remain exactly as written.",
            ],
        )

    def test_repeated_lines_align_in_sequence(self):
        lines = ["I am the signal", "I am the signal", "Always on frequency"]
        words = [
            MODULE.Word("i", 1.0, 1.1, 1),
            MODULE.Word("am", 1.1, 1.2, 1),
            MODULE.Word("the", 1.2, 1.3, 1),
            MODULE.Word("signal", 1.3, 1.6, 1),
            MODULE.Word("i", 2.0, 2.1, 1),
            MODULE.Word("am", 2.1, 2.2, 1),
            MODULE.Word("the", 2.2, 2.3, 1),
            MODULE.Word("signal", 2.3, 2.6, 1),
            MODULE.Word("always", 3.0, 3.2, 1),
            MODULE.Word("on", 3.2, 3.3, 1),
            MODULE.Word("frequency", 3.3, 3.8, 1),
        ]
        rows, metrics = MODULE.align_lines(lines, words)
        self.assertEqual([row["start_ms"] for row in rows], [1000, 2000, 3000])
        self.assertEqual(metrics["unresolved_lines"], 0)
        self.assertEqual(metrics["word_match_ratio"], 1.0)

    def test_low_confidence_transcript_cannot_look_approved(self):
        lines = ["The flame remembers", "The signal returns"]
        words = [
            MODULE.Word("unrelated", 1.0, 1.2, 0.4),
            MODULE.Word("noise", 1.3, 1.5, 0.4),
        ]
        rows, metrics = MODULE.align_lines(lines, words)
        self.assertLess(metrics["weighted_confidence"], 0.72)
        self.assertTrue(any(row["start_ms"] is None for row in rows))


if __name__ == "__main__":
    unittest.main()
