"""Rebuild the local worker bundle after editing the classroom adapter.
Run with Python 3. No third-party packages or network access are needed.
This is a maintenance utility; teachers and students use index.html directly.
"""
from pathlib import Path
import json


def main() -> None:
    root = Path(__file__).resolve().parent.parent
    sources = [root / "vendor/skulpt/skulpt.min.js", root / "vendor/skulpt/skulpt-stdlib.js"]
    required = sources + [root / "ide/turtle.py", root / "ide/python-runner.js"]
    missing = [str(path) for path in required if not path.is_file()]
    if missing:
        raise SystemExit("Missing source files: " + ", ".join(missing))
    worker = "\n".join(path.read_text(encoding="utf-8") for path in sources)
    worker += "\nself.TURTLE_MODULE=" + json.dumps((root / "ide/turtle.py").read_text(encoding="utf-8")) + ";\n"
    worker += (root / "ide/python-runner.js").read_text(encoding="utf-8")
    target = root / "ide/python-bundle.js"
    target.write_text("/* Bundled Skulpt runtime and classroom Turtle adapter. See THIRD_PARTY_NOTICES.txt. */\nwindow.TurtlePythonBundle=" + json.dumps(worker) + ";\n", encoding="utf-8")
    print("Rebuilt", target)


if __name__ == "__main__":
    main()
