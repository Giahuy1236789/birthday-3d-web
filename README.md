# Dreamy Birthday 3D

Web app chúc mừng sinh nhật phong cách 3D/dreamy, xây bằng React + Vite, React Three Fiber, Framer Motion, Canvas Confetti và Tailwind CSS.

## Chạy dự án

```bash
npm.cmd install
npm.cmd run dev
```

Sau đó mở địa chỉ Vite hiển thị trong terminal.

Nếu bạn dùng Windows/PowerShell và gặp lỗi `npm.ps1 cannot be loaded`, hãy dùng đúng hai lệnh `npm.cmd` bên trên, hoặc chạy file `start.bat` bằng Command Prompt.

> Lưu ý: React và ReactDOM đã được ghim tại `19.2.3` để tương thích với React Three Fiber. Không dùng `--force` hoặc `--legacy-peer-deps` khi cài đặt.

## Cá nhân hoá

Mọi nội dung được tập trung tại [src/data/birthdayData.js](src/data/birthdayData.js):

- `name`, `shortName`: tên người nhận
- `message`: lời chúc trong thiệp
- `music`: đường dẫn nhạc nền
- `memories`, `memoryCaptions`: ảnh và chú thích album
- `timeline`, `balloonMessages`: kỷ niệm và lời chúc từ bong bóng

Sáu ảnh SVG demo nằm trong `public/images`. Bạn có thể thay bằng ảnh thật và đổi mảng `memories`, ví dụ:

```js
memories: [
  '/images/photo1.jpg',
  '/images/photo2.jpg',
  '/images/photo3.jpg',
  '/images/photo4.jpg',
  '/images/photo5.jpg',
  '/images/photo6.jpg',
]
```

Đặt bài nhạc tại `public/music/birthday.mp3`. Khi file chưa được thêm, app tự dùng một giai điệu Web Audio rất nhẹ sau khi mở món quà.

## Các tương tác có sẵn

- Mở món quà: chuyển cảnh, confetti và bật nhạc sau thao tác người dùng.
- Kéo/giữ bánh để xoay 3D; nhấn **Thổi nến** để tắt nến, bắn pháo hoa và hiện điều ước.
- Bấm bong bóng để làm nổ và nhận một lời chúc nhỏ.
- Bấm ảnh để mở lightbox; dùng Esc, ← hoặc → để điều hướng.
- Bấm hộp quà để mở quà bí mật.
- Bấm trái tim nhỏ ở góc dưới phải 5 lần để mở Easter egg.
- Nút cuối trang phát lại trải nghiệm từ đầu.

Hiệu ứng tự giảm mật độ trên mobile/thiết bị touch và tôn trọng `prefers-reduced-motion`.
