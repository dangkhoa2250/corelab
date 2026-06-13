#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -ne 2 ]; then
  echo "Usage: scripts/new_post.sh YYYY-MM-DD slug"
  exit 1
fi

post_date="$1"
slug="$2"
post_dir="posts/${post_date}-${slug}"
image_dir="assets/images/posts/${slug}"
manim_dir="src/manim/posts/${slug}"

mkdir -p "$post_dir" "$image_dir" "$manim_dir"

cat <<EOF > "${post_dir}/index.qmd"
---
title: "${slug}"
date: ${post_date}
categories: []
description: ""
---

Write here.
EOF

touch "${post_dir}/refs.bib"
echo "Created ${post_dir}"
