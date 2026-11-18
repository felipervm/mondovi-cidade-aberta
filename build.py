from pathlib import Path

root = Path(__file__).resolve().parent
src = root / "src"
html = (src / "city.html").read_text(encoding="utf-8")
for marker, file in {
    "MAP_DATA": "city-data.json",
    "GAME_CONTENT": "city-dialogues.js",
    "GAME_CODE": "city.js",
    "GAME_SYSTEMS": "city-systems.js",
    "IMMERSION": "city-immersion.js",
}.items():
    content = (src / file).read_text(encoding="utf-8")
    if marker == "MAP_DATA":
        content = "const city=" + content.strip() + ";"
    html = html.replace("/* " + marker + " */", content)
(root / "index.html").write_text(html, encoding="utf-8")
