#!/usr/bin/env python3
"""Attach the Signal boot loader to every generated page."""
from pathlib import Path

root = Path(__file__).resolve().parents[1] / "public"
tag = '<script src="/assets/js/signal-loader.js"></script>'
for page in root.rglob("*.html"):
    text = page.read_text(encoding="utf-8")
    if "signal-loader.js" not in text:
        page.write_text(text.replace("</head>", tag + "</head>", 1), encoding="utf-8")
print("Attached Signal loader to all static pages.")
