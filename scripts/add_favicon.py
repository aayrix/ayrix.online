#!/usr/bin/env python3
"""Ensure every prebuilt page uses the local AYRIX SVG favicon."""
from pathlib import Path
import re

root = Path(__file__).resolve().parents[1] / "public"
favicon = '<link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="shortcut icon" href="/favicon.svg">'
icon_tag = re.compile(r'<link\s+rel=(?:"icon"|icon)\b[^>]*>', re.IGNORECASE)

for page in root.rglob("*.html"):
    html = page.read_text(encoding="utf-8")
    html = icon_tag.sub("", html)
    html = html.replace("</head>", favicon + "</head>", 1)
    page.write_text(html, encoding="utf-8")

print("Applied the local SVG favicon to every static page.")
