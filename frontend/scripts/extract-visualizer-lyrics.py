"""Extract user-supplied visualizer lyrics from the amended tracker workbook."""

import json
import re
import sys
import xml.etree.ElementTree as ET
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "outputs/lyrical-architecture/ChromaKey_Complete_VisualResonance_Tracker_Lyrical_Amended.xlsx"
TARGET = ROOT / "frontend/src/data/suppliedVisualizerLyrics.json"
XML_NS = "http://schemas.openxmlformats.org/spreadsheetml/2006/main"


def cell_value(cell, shared_strings):
    kind = cell.attrib.get("t")
    value = cell.find(f"{{{XML_NS}}}v")
    if kind == "inlineStr":
        return "".join(node.text or "" for node in cell.iter(f"{{{XML_NS}}}t"))
    if value is None:
        return ""
    if kind == "s":
        return shared_strings[int(value.text)]
    return value.text or ""


with zipfile.ZipFile(SOURCE) as workbook:
    shared = []
    if "xl/sharedStrings.xml" in workbook.namelist():
        strings_root = ET.fromstring(workbook.read("xl/sharedStrings.xml"))
        shared = [
            "".join(node.text or "" for node in item.iter(f"{{{XML_NS}}}t"))
            for item in strings_root.findall(f"{{{XML_NS}}}si")
        ]

    sheet = ET.fromstring(workbook.read("xl/worksheets/sheet1.xml"))
    records = []
    for row in sheet.findall(f".//{{{XML_NS}}}row"):
        values = {}
        for cell in row.findall(f"{{{XML_NS}}}c"):
            column = re.match(r"[A-Z]+", cell.attrib["r"]).group()
            values[column] = cell_value(cell, shared)
        if values.get("B") and values.get("N") and values.get("A") != "Track #":
            records.append({"title": values["B"].strip(), "lyrics": values["N"].strip()})

TARGET.parent.mkdir(parents=True, exist_ok=True)
TARGET.write_text(json.dumps(records, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"Extracted {len(records)} supplied lyric records to {TARGET.relative_to(ROOT)}")
sys.exit(0 if records else 1)
