#!/usr/bin/env bash
set -euo pipefail

# Render manim source from src/manim/posts/<slug>/ and copy the output video
# into assets/images/posts/<slug>/ automatically.
#
# Usage:
#   bash scripts/render_manim.sh <slug> <scene_class> [flags]
#
# Examples:
#   bash scripts/render_manim.sh fourier-series WaveScene -qm
#   bash scripts/render_manim.sh transformers-intuition AttentionScene -qh

slug="${1:?Usage: render_manim.sh <slug> <scene_class> [flags]}"
scene="${2:?Usage: render_manim.sh <slug> <scene_class> [flags]}"
flags="${3:--qm}"

asset_dir="assets/images/posts/${slug}"
mkdir -p "${asset_dir}"

uv run manim "src/manim/posts/${slug}/scene.py" "${scene}" "${flags}"

# Map quality flag to Manim's output directory name
#   -ql → 480p15   -qm → 720p30   -qh → 1080p30
#   -qk → 2160p60  -qp → 1080p60
if echo "${flags}" | grep -q "ql"; then
  quality="480p15"
elif echo "${flags}" | grep -q "qm"; then
  quality="720p30"
elif echo "${flags}" | grep -q "qh"; then
  quality="1080p30"
elif echo "${flags}" | grep -q "qk"; then
  quality="2160p60"
elif echo "${flags}" | grep -q "qp"; then
  quality="1080p60"
else
  quality="720p30"
fi

output_file="media/videos/scene/${quality}/${scene}.mp4"

if [ -f "${output_file}" ]; then
  cp "${output_file}" "${asset_dir}/"
  echo ""
  echo "✅ Video → ${asset_dir}/${scene}.mp4"
fi
