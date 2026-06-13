---
name: translate
description: Use when asked to translate a Quarto blog post, especially commands like /translate @file.qmd, and ensure Vietnamese, English, and Japanese post variants exist.
---

# Translate

## Overview

Translate a Quarto post into missing language variants for this repository while preserving structure, technical content, assets, citations, and natural phrasing.

## Trigger

Use this skill for requests such as:

- `/translate @posts/2026-06-13-sample-post/index.qmd`
- `translate this qmd into missing languages`
- `make sure this post has vi, en, ja versions`

Expected complete language set: `vi`, `en`, `ja`.

## Workflow

1. Resolve the referenced `.qmd` file and read it completely.
2. Identify the post directory, slug, and source language:
   - Prefer front matter `lang`.
   - If absent, infer from folder suffix `-vi`, `-en`, or `-ja`.
   - If still unclear, infer from the article text and update front matter.
3. Check sibling post folders for the same base slug ending in `-vi`, `-en`, and `-ja`.
   - If the current folder does not end with a language suffix, rename or move it to the correct suffix.
   - Preserve date prefixes, for example `posts/2026-06-13-fourier-series-vi/`.
4. For each missing language, create a sibling folder and translated `index.qmd`.
5. Copy or create matching `refs.bib` files when present.
6. Check all three folders exist after edits: `*-vi`, `*-en`, `*-ja`.
7. Run a quick repository check such as `quarto render` when practical.

## Translation Rules

- Translate naturally for the target language; do not translate word by word.
- Preserve meaning, section order, examples, equations, and code behavior.
- Translate visible prose: title, description, headings, paragraphs, captions, alt text, and list text.
- Keep front matter keys unchanged. Set `lang` to the target code.
- Keep technical tokens unchanged unless they are normal prose: code fences, inline code identifiers, file paths, URLs, citation keys, bibliography keys, HTML attributes, LaTeX, Mermaid, and image paths.
- Keep `date`, `categories`, and asset paths stable unless the existing content clearly requires a localized value.
- If a title is used as a slug or identifier, do not change the identifier unless renaming folders as part of the `-vi/-en/-ja` convention.

## Folder Naming

Normalize post directories to:

```text
posts/YYYY-MM-DD-base-slug-vi/
posts/YYYY-MM-DD-base-slug-en/
posts/YYYY-MM-DD-base-slug-ja/
```

When deriving `base-slug`, remove only a final `-vi`, `-en`, or `-ja` suffix. Do not remove language strings that appear earlier in the slug.

## Safety

Before moving or overwriting an existing translated post, read it and preserve any unique manual edits. If an existing translation is partial or stale, update only the necessary content and report what changed.
