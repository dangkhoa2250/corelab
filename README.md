# Corelab - Website & Blog

Welcome to the **Corelab** repository! This is a personal website and blog built using **Quarto** and hosted on **GitHub Pages**.

- **Live Site**: [https://dangkhoa2250.github.io/corelab/](https://dangkhoa2250.github.io/corelab/)
- **GitHub Repository**: [https://github.com/dangkhoa2250/corelab](https://github.com/dangkhoa2250/corelab)

---

## 🚀 Environment Setup

To run and develop this project locally, ensure you have the following installed:
1. **Quarto CLI**: Download and install from [quarto.org](https://quarto.org/docs/get-started/)
2. **Git**: Used for version control and publishing.

---

## 💻 Local Preview

To start a local development server (it will automatically reload the browser when you make changes to posts or files):

```bash
quarto preview
```

After running this command, your browser should automatically open `http://localhost:4344/`.

---

## ✍️ How to Write a New Post

We have provided a helper script to quickly create a new blog post conforming to the project's folder structure.

### Step 1: Run the new post script
Open your terminal in the project root directory and run:

```bash
bash scripts/new_post.sh YYYY-MM-DD your-post-slug
```

**Example:**
```bash
bash scripts/new_post.sh 2026-06-13 fourier-transform
```

This script will automatically generate:
- Post folder: `posts/2026-06-13-fourier-transform/`
- Main markdown content: `posts/2026-06-13-fourier-transform/index.qmd`
- Bibliography references: `posts/2026-06-13-fourier-transform/refs.bib`
- Asset images directory: `assets/images/posts/fourier-transform/`
- Manim source animations directory: `src/manim/posts/fourier-transform/`

### Step 2: Edit your content
Open the newly created `index.qmd` file. It will contain the frontmatter template:

```yaml
---
title: "your-post-slug"
date: 2026-06-13
categories: [Math, Physics]  # Add relevant categories here
description: "A short description of your post shown in the listing page."
image: "../../assets/images/posts/fourier-transform/cover.svg" # Cover image path (optional)
---

Your markdown post content goes here...
```

*You can write standard markdown content, embed images, write math formulas with LaTeX, insert codeblocks, etc.*

---

## 🌐 How to Publish (Deploy Online)

When you are ready to publish your edits or new articles online:

### Step 1: Commit and push changes to the `main` branch
```bash
git add .
git commit -m "Add new post: fourier-transform"
git push
```

### Step 2: Publish to GitHub Pages
Run the following Quarto command to compile your site and push the output to the `gh-pages` branch:

```bash
quarto publish gh-pages
```

Once completed and showing `[✓] Published to ...`, your online site will be updated in about 1 - 2 minutes!

---

## 📁 Key Project Structure

- `posts/`: Contains all blog posts. Each post is housed in its own subdirectory.
- `pages/`: Static pages of the website (e.g., `blog.qmd`).
- `assets/`: Static assets such as images (`images/`) and animations (`animations/`).
- `scripts/`: Development scripts (creating new posts, rendering Manim scenes, etc.).
- `styles.css`: Custom CSS styles (including the glassmorphic full-width navbar, buttons, typography).
- `_quarto.yml`: Global configuration for the Quarto website (navigation menus, dark/light themes, favicon).
