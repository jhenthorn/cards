#!/usr/bin/env bash
# Renders a "front page, back page, front page, back page, ..." card PDF into
# paired WebP images at assets/cards/card-NN-front.webp / card-NN-back.webp.
#
# Usage: scripts/extract-cards.sh /path/to/cards.pdf
set -euo pipefail

if [ $# -ne 1 ]; then
  echo "Usage: $0 /path/to/cards.pdf" >&2
  exit 1
fi

PDF="$1"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT_DIR="$ROOT/assets/cards"
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

for cmd in pdfinfo pdftoppm cwebp; do
  if ! command -v "$cmd" >/dev/null 2>&1; then
    echo "Missing required tool: $cmd (install poppler + webp, e.g. 'brew install poppler webp')" >&2
    exit 1
  fi
done

PAGE_COUNT="$(pdfinfo "$PDF" | awk '/^Pages:/ {print $2}')"
if [ -z "$PAGE_COUNT" ] || [ "$((PAGE_COUNT % 2))" -ne 0 ]; then
  echo "Expected an even number of pages (front/back pairs), got: $PAGE_COUNT" >&2
  exit 1
fi

echo "Rendering $PAGE_COUNT pages at 300dpi..."
pdftoppm -r 300 -png "$PDF" "$TMP_DIR/page"

mkdir -p "$OUT_DIR"
card_count=$((PAGE_COUNT / 2))

for ((card=1; card<=card_count; card++)); do
  front_page=$((card * 2 - 1))
  back_page=$((card * 2))
  card_num="$(printf '%02d' "$card")"

  # pdftoppm zero-pads page numbers to the width of the total page count.
  front_src="$(printf '%s/page-%0*d.png' "$TMP_DIR" ${#PAGE_COUNT} "$front_page")"
  back_src="$(printf '%s/page-%0*d.png' "$TMP_DIR" ${#PAGE_COUNT} "$back_page")"

  cwebp -quiet -q 85 -resize 700 0 "$front_src" -o "$OUT_DIR/card-$card_num-front.webp"
  cwebp -quiet -q 85 -resize 700 0 "$back_src" -o "$OUT_DIR/card-$card_num-back.webp"
  echo "card $card_num done"
done

echo "Wrote $card_count cards to $OUT_DIR"
