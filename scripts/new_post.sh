#!/usr/bin/env bash
set -euo pipefail

usage() {
  echo "Usage: scripts/new_post.sh [options] [YYYY-MM-DD] slug"
  echo ""
  echo "Options:"
  echo "  -c <course>    Create course series post (e.g. linear-algebra)"
  echo "  -n <number>    Chapter number (for course post)"
  echo "  -h             Show this help"
  echo ""
  echo "If date is omitted, today's date is used."
  exit 1
}

course=""
chapter=""

while getopts "c:n:h" opt; do
  case "$opt" in
    c) course="$OPTARG" ;;
    n) chapter="$OPTARG" ;;
    h) usage ;;
    *) usage ;;
  esac
done
shift $((OPTIND-1))

if [ "$#" -eq 1 ]; then
  post_date="$(date +%Y-%m-%d)"
  slug="$1"
elif [ "$#" -eq 2 ]; then
  post_date="$1"
  slug="$2"
else
  usage
fi

if [ -n "$course" ]; then
  # Course series post — create Vietnamese variant only
  post_dir="posts/${post_date}-${slug}-vi"
  image_dir="assets/images/posts/${slug}"
  manim_dir="src/manim/posts/${slug}"

  mkdir -p "$post_dir" "$image_dir" "$manim_dir"

  if [ -n "$chapter" ]; then
    chapter_line="chapter: ${chapter}"
  else
    chapter_line=""
  fi

  cat <<EOF > "${post_dir}/index.qmd"
---
title: "${slug}"
date: ${post_date}
categories: [${course}]
description: ""
image: ../../assets/images/posts/${slug}/cover.svg
lang: vi
${chapter_line}
---

Write here.
EOF

  touch "${post_dir}/refs.bib"
  echo "Created ${post_dir}"
else
  # Regular single-language post
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
lang: vi
---

Write here.
EOF

  touch "${post_dir}/refs.bib"
  echo "Created ${post_dir}"
fi
