#!/usr/bin/env python3
"""Create a conservative Item # -> uploaded yellow-label product photo map.

A mapping is accepted only when OCR prints exactly one current public Item #, or
when the stored OCR matcher produces one clearly dominant product-name candidate.
One canonical photo is retained for each Item #. This avoids assigning a warehouse
label photo to a similar but different product.
"""
from __future__ import annotations

import json
import re
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PRODUCTS_PATH = ROOT / "src/data/products.json"
CANDIDATES_PATH = ROOT / "data/uploaded-image-ocr-candidates.json"
OUTPUT_TS = ROOT / "src/data/yellowLabelProductImages.ts"
REPORT_PATH = ROOT / "data/yellow-label-product-image-report.json"
ITEM_ID_RE = re.compile(r"(?<!\d)(\d{5})(?!\d)")


def choose_matches(products: dict[str, dict], rows: list[dict]) -> list[dict]:
    image_candidates: list[dict] = []
    for row in rows:
        ocr = row.get("ocr", "")
        exact_ids = [item for item in dict.fromkeys(ITEM_ID_RE.findall(ocr)) if item in products]
        if len(exact_ids) == 1:
            image_candidates.append({
                "id": exact_ids[0], "image": row["image"], "label": row["label"],
                "method": "printed-item-number", "score": 100.0,
            })
            continue

        ranked = [candidate for candidate in row.get("candidates", []) if candidate.get("id") in products]
        ranked.sort(key=lambda candidate: candidate.get("score", 0), reverse=True)
        if not ranked:
            continue
        top = ranked[0]
        runner_up = ranked[1].get("score", 0) if len(ranked) > 1 else 0
        # A name-only match is included only if it is both strong and unambiguous.
        if top.get("score", 0) >= 4.0 and top.get("score", 0) - runner_up >= 1.2:
            image_candidates.append({
                "id": top["id"], "image": row["image"], "label": row["label"],
                "method": "unique-name-match", "score": float(top["score"]),
            })

    method_weight = {"printed-item-number": 1000.0, "unique-name-match": 0.0}
    canonical: dict[str, dict] = {}
    for match in image_candidates:
        rank = method_weight[match["method"]] + match["score"]
        prior = canonical.get(match["id"])
        prior_rank = method_weight[prior["method"]] + prior["score"] if prior else -1
        if rank > prior_rank or (rank == prior_rank and match["image"] < prior["image"]):
            canonical[match["id"]] = match
    return [canonical[item_id] for item_id in sorted(canonical, key=lambda value: int(value))]


def main() -> None:
    products = {product["id"]: product for product in json.loads(PRODUCTS_PATH.read_text())}
    rows = json.loads(CANDIDATES_PATH.read_text())
    matches = choose_matches(products, rows)

    lines = [
        "/**",
        " * Real warehouse photos supplied by Van Harvest, matched conservatively to public Item # values.",
        " * Regenerate with scripts/build_yellow_label_image_map.py after adding new OCR-reviewed photos.",
        " */",
        "export const yellowLabelProductImages: Record<string, string> = {",
    ]
    for match in matches:
        lines.append(f"  '{match['id']}': '{match['image']}',")
    lines.extend(["};", "", "export const hasYellowLabelProductImage = (itemId: string) => Boolean(yellowLabelProductImages[itemId]);", ""])
    OUTPUT_TS.write_text("\n".join(lines))

    report = {
        "matchPolicy": {
            "printedItemNumber": "OCR includes exactly one current five-digit Item #.",
            "nameOnly": "Top stored name match has score >= 4.0 and a margin >= 1.2 over the next candidate.",
            "onePhotoPerItem": True,
        },
        "total": len(matches),
        "byCategory": dict(sorted(Counter(products[match["id"]]["category"] for match in matches).items())),
        "matches": [{**match, "category": products[match["id"]]["category"], "name": products[match["id"]]["name"], "nameZh": products[match["id"]].get("nameZh", "")} for match in matches],
    }
    REPORT_PATH.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
    print(f"Wrote {len(matches)} conservative product-photo mappings")
    print("By category:", report["byCategory"])


if __name__ == "__main__":
    main()
