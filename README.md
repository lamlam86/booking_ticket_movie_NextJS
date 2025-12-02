# Cinestar Booking UI (Next.js 15)

Giao diện demo đặt vé xem phim được dựng bằng Next.js 15 và React 19 để mô phỏng trải nghiệm người dùng trên hệ thống Cinestar: duyệt phim, xem khuyến mãi, đặt vé từng bước, đăng nhập/đăng ký với xác thực cơ bản. Mục tiêu chính là trình diễn UI/UX hiện đại, dễ mở rộng cho back-end thật trong tương lai.

## Tính năng chính
- Trang chủ cinematic gồm banner slider, danh sách phim đang chiếu/sắp chiếu, block khuyến mãi và hệ thống rạp (mock data).
- Booking wizard 5 bước với chọn ngày → rạp → suất chiếu → ghế → combo bắp nước, kèm tính tổng theo thời gian thực.
- Seat picker hỗ trợ trạng thái ghế đã bán, chọn tối đa 8 ghế, cập nhật giá tức thì.
- Concession picker có phân nhóm combo/bắp/nước/snack, cho phép mua nhiều số lượng.
- Form đăng nhập/đăng ký có kiểm tra ràng buộc phía client (regex, độ tuổi, CCCD, mật khẩu mạnh, đồng ý chính sách) và tích hợp `intl-tel-input` để chuẩn hóa số điện thoại quốc tế.
- Layout responsive với header, footer, menu mobile và các component tái sử dụng (`BannerSlider`, `PromoSlider`, `MovieCard`, …).

## Công nghệ sử dụng
- **Framework:** Next.js 15.5.3 (App Router) + React 19.1, chạy bằng Turbopack.
- **Ngôn ngữ & style:** TypeScript, Tailwind CSS 4 (thông qua `@tailwindcss/postcss`), PostCSS.
- **UI helpers:** `swiper` cho slider, `intl-tel-input` cho trường điện thoại, `lucide-react` cho icon.
- **Tooling:** pnpm/npm, Node.js ≥ 18, cấu hình `tsconfig.json` chuẩn Next.

## Cấu trúc thư mục rút gọn
```
app/
  page.tsx                # Trang chủ
  login/page.tsx          # Form đăng nhập
  signup/page.tsx         # Form đăng ký với intl-tel-input
  movie/page.tsx          # Danh sách phim đang/sắp chiếu
  movie/[id]/book/page.tsx# Booking wizard theo phim
components/
  Header.tsx, Footer.tsx, MobileMenu.tsx
  BannerSlider.tsx, PromoSlider.tsx
  BookingWizard.tsx, SeatPicker.tsx, ConcessionPicker.tsx
globals.css               # Style global + utility bổ sung
public/assets/images/     # Ảnh banner, poster, logo
```

## Hướng dẫn chạy cục bộ
1. **Cài đặt phụ thuộc**
   ```bash
   npm install
   ```
2. **Chạy môi trường dev (Turbopack)**
   ```bash
   npm run dev
   ```
   Ứng dụng mặc định tại `http://localhost:3000`.
3. **Build production**
   ```bash
   npm run build
   npm start
   ```

> Lưu ý: `intl-tel-input` đang tải `utils.js` qua CDN để đơn giản hóa setup. Nếu cần chạy offline hãy tải file về `public` và cập nhật URL trong `app/signup/page.tsx`.

## Các tuyến đường nổi bật
- `/` – Trang chủ marketing.
- `/movie` – Danh sách phim đang/sắp chiếu.
- `/movie/[id]/book` – Quy trình đặt vé + chọn ghế + bắp nước cho từng phim.
- `/login` – Đăng nhập với xác thực email/mật khẩu cơ bản.
- `/signup` – Đăng ký tài khoản với nhiều trường và kiểm tra tính hợp lệ nội địa.

## Định hướng phát triển tiếp
- Kết nối API thật cho phim, suất chiếu, booking và auth.
- Bổ sung state management/global query (React Query, Zustand) cho dữ liệu động.
- Viết test e2e (Playwright/Cypress) cho luồng chọn ghế và đăng ký.
- Thêm i18n và dark mode để nâng trải nghiệm người dùng.

README này tập trung giúp bạn hiểu nhanh kiến trúc, stack và cách chạy dự án để dễ dàng tiếp tục phát triển hoặc tích hợp vào hệ thống hiện hữu.