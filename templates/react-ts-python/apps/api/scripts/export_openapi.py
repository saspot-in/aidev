"""Write the OpenAPI schema of the API to packages/contract/openapi.json (the contract source)."""

import json
from pathlib import Path

from app.main import app

out = Path(__file__).resolve().parents[3] / "packages" / "contract" / "openapi.json"
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(json.dumps(app.openapi(), indent=2, sort_keys=True) + "\n", encoding="utf-8")
print(f"wrote {out}")
