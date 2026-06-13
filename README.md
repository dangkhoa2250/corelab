# Corelab - Website & Blog

Chào mừng bạn đến với repo mã nguồn của **Corelab**! Đây là website cá nhân/blog cá nhân được xây dựng bằng **Quarto** và được lưu trữ trên **GitHub Pages**.

- **Link website**: [https://dangkhoa2250.github.io/corelab/](https://dangkhoa2250.github.io/corelab/)
- **Link Github**: [https://github.com/dangkhoa2250/corelab](https://github.com/dangkhoa2250/corelab)

---

## 🚀 Cài đặt môi trường

Để chạy và phát triển dự án này trên máy của bạn, hãy đảm bảo đã cài đặt:
1. **Quarto CLI**: Tải và cài đặt tại [quarto.org](https://quarto.org/docs/get-started/)
2. **Git**: Dùng để quản lý mã nguồn và xuất bản trang web.

---

## 💻 Xem thử trên máy (Local Preview)

Để khởi chạy một máy chủ xem thử cục bộ (máy chủ sẽ tự động tải lại trang khi bạn lưu thay đổi trong file code hoặc bài viết):

```bash
quarto preview
```

Sau khi chạy lệnh trên, trình duyệt sẽ tự động mở trang web ở địa chỉ mặc định `http://localhost:4344/`.

---

## ✍️ Hướng dẫn viết bài mới

Để tạo nhanh một bài viết mới theo đúng cấu trúc thư mục tiêu chuẩn của dự án, bạn hãy dùng script helper được viết sẵn:

### Bước 1: Chạy script tạo bài viết mới
Mở terminal tại thư mục gốc của dự án và chạy:

```bash
bash scripts/new_post.sh YYYY-MM-DD ten-bai-viet-viet-lien-khong-dau
```

**Ví dụ:**
```bash
bash scripts/new_post.sh 2026-06-13 fourier-transform
```

Script này sẽ tự động tạo ra:
- Thư mục bài viết: `posts/2026-06-13-fourier-transform/`
- File nội dung chính: `posts/2026-06-13-fourier-transform/index.qmd`
- File tài liệu tham khảo: `posts/2026-06-13-fourier-transform/refs.bib`
- Thư mục chứa ảnh riêng của bài viết: `assets/images/posts/fourier-transform/`
- Thư mục chứa code animation Manim riêng: `src/manim/posts/fourier-transform/`

### Bước 2: Soạn thảo nội dung
Mở file `index.qmd` vừa tạo trong thư mục bài viết. Bạn sẽ thấy phần đầu trang (frontmatter) dạng như sau:

```yaml
---
title: "fourier-transform"
date: 2026-06-13
categories: [Math, Physics]  # Điền các category của bài viết tại đây
description: "Mô tả ngắn gọn về bài viết hiển thị ở trang danh sách."
image: "../../assets/images/posts/fourier-transform/cover.svg" # Ảnh cover bài viết (nếu có)
---

Nội dung bài viết bằng Markdown bắt đầu từ đây...
```

*Bạn có thể thoải mái viết nội dung bằng cú pháp Markdown tiêu chuẩn, chèn ảnh, viết công thức Toán bằng LaTeX, codeblock, v.v.*

---

## 🌐 Hướng dẫn Publish (Xuất bản lên mạng)

Khi bạn đã hoàn thành việc chỉnh sửa hoặc viết bài mới và muốn đưa lên trang web chính thức, hãy thực hiện các bước sau:

### Bước 1: Lưu thay đổi và đẩy code lên nhánh `main`
```bash
git add .
git commit -m "Thêm bài viết mới: fourier-transform"
git push
```

### Bước 2: Xuất bản lên GitHub Pages
Chạy lệnh duy nhất sau để Quarto tự động build trang web và deploy lên nhánh `gh-pages`:

```bash
quarto publish gh-pages
```

Sau khi lệnh chạy hoàn tất và báo `[✓] Published to ...`, trang web của bạn sẽ được cập nhật trực tuyến sau 1 - 2 phút!

---

## 📁 Cấu trúc thư mục chính của dự án

- `posts/`: Chứa tất cả các bài viết của blog. Mỗi bài viết nằm trong một thư mục riêng biệt.
- `pages/`: Chứa các trang tĩnh của website (ví dụ: `blog.qmd`).
- `assets/`: Chứa tài nguyên tĩnh như hình ảnh (`images/`), animations (`animations/`).
- `scripts/`: Chứa các script tiện ích phát triển (tạo bài viết mới, render animation Manim, v.v.).
- `styles.css`: File CSS tùy chỉnh giao diện (toàn bộ style của navbar mờ kính, các nút bấm, v.v.).
- `_quarto.yml`: File cấu hình chung của website Quarto (menu điều hướng, favicon, giao diện sáng/tối, v.v.).
