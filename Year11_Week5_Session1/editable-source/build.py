"""Rebuild ../index.html from this folder. Python 3 standard library only."""
from pathlib import Path

HERE = Path(__file__).resolve().parent
TARGET = HERE.parent / "index.html"

def build() -> None:
    text = (HERE / "index.html").read_text(encoding="utf-8")
    for token, filename in (
        ("STYLE", "styles.css"), ("VENDOR", "jspdf.js"),
        ("ASSETS", "assets.js"), ("LESSON", "lesson.js"), ("APP", "app.js"),
    ):
        content = (HERE / filename).read_text(encoding="utf-8")
        if token != "STYLE":
            content = content.replace("</script", "<\\/script")
        marker = "/*" + token + "*/"
        if marker not in text:
            raise ValueError(f"Template marker missing: {marker}")
        text = text.replace(marker, content)
    TARGET.write_text(text, encoding="utf-8")
    print(f"Built {TARGET} ({TARGET.stat().st_size:,} bytes)")

if __name__ == "__main__":
    build()
