#!/usr/bin/env python3
"""Stelt de demo samen uit src/demo.html.

Het versienummer staat in het bestand VERSION, de datum is de dag van samenstellen
(of het tweede argument, als JJJJ-MM-DD). Uitvoer:
  index.html                          zelfstandig bestand, ook voor GitHub Pages
  MIRA - v<N>.html     hetzelfde bestand onder een versienaam
Met --fragment <pad> wordt ook de variant zonder documentskelet geschreven.
"""
import datetime, pathlib, sys

root = pathlib.Path(__file__).parent
args = [a for a in sys.argv[1:] if not a.startswith("--")]
version = (root / "VERSION").read_text(encoding="utf8").strip()
day = datetime.date.fromisoformat(args[0]) if args else datetime.date.today()
date = day.strftime("%d-%m-%Y")

src = (root / "src" / "demo.html").read_text(encoding="utf8")
for mark in ("@VERSION@", "@DATE@"):
    if src.count(mark) != 1:
        sys.exit(f"{mark} moet precies een keer in src/demo.html staan")
body = src.replace("@VERSION@", version).replace("@DATE@", date)

# Vertalingen: i18n/<taal>.json, sleutel is de Nederlandse tekst. Ze komen als window.I18N voor het hoofdscript.
import json
langs = {}
for f in sorted((root / "i18n").glob("??.json")):
    langs[f.stem] = json.loads(f.read_text(encoding="utf8"))
i18n = "<script>window.I18N=" + json.dumps(langs, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/") + ";</script>\n"
marker = "<script>\n(function(){"
if body.count(marker) != 1:
    sys.exit("hoofdscript niet gevonden in src/demo.html")
body = body.replace(marker, i18n + marker)

title_end = body.index("</title>") + len("</title>")
title, rest = body[:title_end].strip(), body[title_end:]
page = (
    '<!doctype html>\n<html lang="nl">\n<head>\n<meta charset="utf-8">\n'
    '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
    f'<meta name="generator" content="MIRA (De Office Assistent), demo versie {version}, {date}">\n'
    f"{title}\n"
    "<style>body{margin:0;font:14px system-ui,sans-serif}img{max-width:100%}[hidden]{display:none!important}</style>\n"
    f"</head>\n<body>{rest}</body>\n</html>\n"
)
(root / "index.html").write_text(page, encoding="utf8")
(root / f"MIRA - v{version}.html").write_text(page, encoding="utf8")
if "--fragment" in sys.argv:
    pathlib.Path(sys.argv[sys.argv.index("--fragment") + 1]).write_text(body, encoding="utf8")
print(f"versie {version}, {date}: {len(page)} bytes, talen: nl " + " ".join(langs))
