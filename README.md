# Corelab - Website & Blog

Welcome to the **Corelab** repository! This is a personal website and blog built using **Quarto** and hosted on **GitHub Pages**.

- **Live Site**: [https://dangkhoa2250.github.io/corelab/](https://dangkhoa2250.github.io/corelab/)
- **GitHub Repository**: [https://github.com/dangkhoa2250/corelab](https://github.com/dangkhoa2250/corelab)

---

## 📋 Table of Contents

- [🚀 Environment Setup](#environment-setup)
- [💻 Local Preview](#local-preview)
- [✍️ How to Write a New Post](#how-to-write-a-new-post)
- [📊 How to Add Plots & Manim Animations](#how-to-add-plots-manim-animations)
- [🌐 How to Publish (Deploy Online)](#how-to-publish-deploy-online)
- [📁 Key Project Structure](#key-project-structure)

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
lang: vi # Language code: 'vi' (Vietnamese), 'en' (English), or 'ja' (Japanese)
---

Your markdown post content goes here...
```

*   **Multilingual Support (`lang` field)**: 
    *   Set `lang: vi` (default) if the post is in Vietnamese. It will appear under the **Tiếng Việt** tab on the blog page.
    *   Set `lang: en` if the post is in English. It will appear under the **English** tab on the blog page.
    *   Set `lang: ja` if the post is in Japanese. It will appear under the **日本語** tab on the blog page.
*   You can write standard markdown content, embed images, write math formulas with LaTeX, insert codeblocks, etc.

---

## 📊 How to Add Plots & Manim Animations

This project supports adding visual assets such as static plots (using Matplotlib, Seaborn, etc.) and Manim animations.

### 📈 Drawing & Embedding Plots
1. **Source Code**: Place your plotting scripts under `src/plots/posts/<your-post-slug>/` (e.g., `src/plots/posts/fourier-transform/plot.py`).
2. **Export Asset**: Configure your script to save/export the resulting image (PNG or SVG) into the post's asset folder:
   `assets/images/posts/<your-post-slug>/your_plot.png`
   *(Refer to [scripts/export_plots.sh](file:///Users/jason/project/corelab/scripts/export_plots.sh) for examples)*
3. **Embed in Post**: Open `posts/YYYY-MM-DD-<your-post-slug>/index.qmd` and embed the image using standard Markdown syntax:
   ```markdown
   ![](../../assets/images/posts/<your-post-slug>/your_plot.png)
   ```

### 🎬 Rendering & Embedding Manim Animations
1. **Source Code**: Place your Manim Python files under `src/manim/posts/<your-post-slug>/` (e.g., `src/manim/posts/fourier-transform/scene.py`).
2. **Render**: Use the `manim` CLI (or [scripts/render_manim.sh](file:///Users/jason/project/corelab/scripts/render_manim.sh)) to render the scene and output it directly to the rendered animations directory:
   ```bash
   manim src/manim/posts/<your-post-slug>/scene.py <SceneClassName> -qm -o ../../../../assets/animations/rendered/mp4/<filename>.mp4
   ```
   *(For high quality, use `-qh` instead of `-qm`)*
3. **Embed in Post**: You can embed the rendered MP4 file into your `index.qmd` using one of two methods:
   - **Using Quarto's Native Video Tag**:
     ```markdown
     {{< video ../../assets/animations/rendered/mp4/<filename>.mp4 >}}
     ```
   - **Using HTML5 Video Tag** (highly recommended for short, loopable animations like a GIF but with much smaller file size):
     ```html
     <video autoplay loop muted playsinline src="../../assets/animations/rendered/mp4/<filename>.mp4" width="100%"></video>
     ```

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
