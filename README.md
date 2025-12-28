# 🎬 Cinemas - Movie Ticket Booking System

> **Hệ thống đặt vé xem phim trực tuyến** được xây dựng với Next.js 15, React 19 và Tailwind CSS 4.

[![Next.js](https://img.shields.io/badge/Next.js-15.5.3-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)

---

## 📋 Mục Lục

- [Tổng Quan](#-tổng-quan)
- [Tính Năng](#-tính-năng)
- [Công Nghệ](#-công-nghệ)
- [Cấu Trúc Dự Án](#-cấu-trúc-dự-án)
- [Cài Đặt](#-cài-đặt)
- [Chạy Ứng Dụng](#-chạy-ứng-dụng)
- [Hướng Dẫn Sử Dụng](#-hướng-dẫn-sử-dụng)
- [Chi Tiết Các Components](#-chi-tiết-các-components)
- [API Routes](#-api-routes)
- [Đóng Góp](#-đóng-góp)

---

## 🎯 Tổng Quan

**Cinemas** là một ứng dụng web đặt vé xem phim hoàn chỉnh với giao diện người dùng hiện đại, responsive. Hệ thống cho phép người dùng:

- Duyệt phim đang chiếu và sắp chiếu
- Đặt vé theo ngày, rạp và suất chiếu
- Chọn ghế ngồi trực quan
- Đặt thêm bắp nước
- Đăng ký/đăng nhập tài khoản

---

## ✨ Tính Năng

### 🎞️ Quản Lý Phim
- Hiển thị danh sách phim đang chiếu với poster, thông tin độ tuổi
- Danh sách phim sắp chiếu
- Trang chi tiết phim với thông tin thời lượng, thể loại

### 🎫 Đặt Vé (Booking Wizard)
- **Chọn ngày**: 7 ngày kế tiếp
- **Chọn rạp**: Lọc rạp theo ngày có suất chiếu
- **Chọn giờ**: Hiển thị các suất chiếu khả dụng
- **Chọn ghế**: Sơ đồ ghế trực quan với trạng thái trống/đã đặt/đang chọn
- **Đặt bắp nước**: Combo, bắp, nước, snack

### 👤 Xác Thực Người Dùng
- **Đăng nhập**: Email + mật khẩu
- **Đăng ký**: Form đầy đủ với validation
  - Họ tên, tên đăng nhập, ngày sinh, CCCD
  - Email, số điện thoại (với intl-tel-input)
  - Mật khẩu với yêu cầu bảo mật cao

### 🎨 Giao Diện
- Thiết kế tông màu xanh lá (green theme)
- Responsive trên mobile/tablet/desktop
- Slider banner và khuyến mãi (Swiper.js)
- Mobile menu dạng slide-in

---

## 🛠 Công Nghệ

| Công nghệ | Version | Mô tả |
|-----------|---------|-------|
| **Next.js** | 15.5.3 | React framework với App Router |
| **React** | 19.1.0 | UI library |
| **TypeScript** | 5.x | Type-safe JavaScript |
| **Tailwind CSS** | 4.x | Utility-first CSS |
| **Swiper** | 12.0.2 | Touch slider cho banner/promo |
| **Lucide React** | 0.552.0 | Icon library |
| **intl-tel-input** | 25.12.4 | International phone input |

---

## 📁 Cấu Trúc Dự Án

```
/workspace
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Trang chủ
│   ├── globals.css              # Global styles
│   ├── login/
│   │   └── page.tsx             # Trang đăng nhập
│   ├── signup/
│   │   └── page.tsx             # Trang đăng ký
│   └── movie/
│       ├── page.tsx             # Danh sách phim
│       └── [id]/
│           └── book/
│               └── page.tsx     # Trang đặt vé cho phim cụ thể
│
├── components/                   # React Components
│   ├── Header.tsx               # Header với logo, CTA, search, auth
│   ├── Footer.tsx               # Footer 4 cột
│   ├── BannerSlider.tsx         # Banner chính (Swiper)
│   ├── PromoSlider.tsx          # Slider khuyến mãi
│   ├── MovieCard.tsx            # Card hiển thị phim
│   ├── MobileMenu.tsx           # Menu mobile slide-in
│   ├── BookingWizard.tsx        # Wizard đặt vé 5 bước
│   ├── SeatPicker.tsx           # Component chọn ghế
│   └── ConcessionPicker.tsx     # Component chọn bắp nước
│
├── public/                       # Static assets
│   └── assets/
│       └── images/              # Hình ảnh (logo, banner, poster...)
│
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript config
├── next.config.ts               # Next.js config
├── postcss.config.mjs           # PostCSS config
└── tailwind.config.ts           # Tailwind config (nếu có)
```

---

## 🚀 Cài Đặt

### Yêu Cầu Hệ Thống
- Node.js >= 18.x
- npm >= 9.x hoặc yarn >= 1.22

### Các Bước Cài Đặt

```bash
# 1. Clone repository
git clone <repository-url>
cd workspace

# 2. Cài đặt dependencies
npm install

# 3. Chạy development server
npm run dev
```

---

## ▶️ Chạy Ứng Dụng

```bash
# Development (với Turbopack)
npm run dev

# Build production
npm run build

# Start production server
npm start
```

Ứng dụng sẽ chạy tại: `http://localhost:3000`

---

## 📖 Hướng Dẫn Sử Dụng

### 1. Trang Chủ (`/`)
- Banner slider tự động chuyển
- Phim đang chiếu với nút "Đặt vé"
- Khuyến mãi hot
- Phim sắp chiếu
- Danh sách rạp

### 2. Đặt Vé (`/movie/[id]/book`)
1. **Bước 1**: Chọn ngày (7 ngày tới)
2. **Bước 2**: Chọn rạp có suất chiếu
3. **Bước 3**: Chọn giờ chiếu
4. **Bước 4**: Chọn ghế (tối đa 8 ghế)
5. **Bước 5**: Thêm bắp nước (tùy chọn)
6. **Xác nhận**: Xem tổng tiền và đặt vé

### 3. Đăng Ký (`/signup`)
- Điền đầy đủ thông tin cá nhân
- Số điện thoại hỗ trợ chọn mã quốc gia
- Mật khẩu yêu cầu: ≥8 ký tự, có hoa/thường/số/ký tự đặc biệt
- Tick đồng ý chính sách

### 4. Đăng Nhập (`/login`)
- Email + mật khẩu
- Validate email format và độ dài mật khẩu

---

## 🧩 Chi Tiết Các Components

### `Header.tsx`
**Chức năng**: Navigation chính của ứng dụng

```typescript
// Các thành phần chính:
- Logo (link về trang chủ)
- CTA buttons: "Đặt vé ngay", "Đặt bắp nước"
- Search bar với form GET
- Auth buttons: Đăng nhập, Đăng ký
- Sub-nav: Chọn rạp, Lịch chiếu, Khuyến mãi, v.v.
- MobileMenu (responsive)
```

### `BookingWizard.tsx`
**Chức năng**: Wizard đặt vé 5 bước

```typescript
type State = {
  date: string | null;      // Ngày chọn
  theater: string | null;   // Rạp chọn
  time: string | null;      // Giờ chiếu
  seats: string[];          // Danh sách ghế chọn
  concessions: Record<string, number>; // Bắp nước {id: số lượng}
};

// Tính năng:
- Lọc rạp theo ngày có suất chiếu
- Lọc giờ theo rạp đã chọn
- Tính tổng tiền vé + bắp nước
- Mock data cho demo
```

### `SeatPicker.tsx`
**Chức năng**: Sơ đồ chọn ghế trực quan

```typescript
type SeatPickerProps = {
  rows: string[];          // Hàng ghế: ['A','B',...]
  seatsPerRow: number;     // Số ghế/hàng
  reserved: string[];      // Ghế đã đặt
  value: string[];         // Ghế đang chọn
  onChange: (next: string[]) => void;
  maxSelect?: number;      // Giới hạn ghế (default: 8)
};

// Trạng thái ghế:
- Trống: Click để chọn
- Đang chọn (xanh): Click để bỏ chọn
- Đã đặt (đỏ): Không click được
```

### `ConcessionPicker.tsx`
**Chức năng**: Chọn bắp nước với số lượng

```typescript
type ConItem = {
  id: string;
  name: string;
  price: number;           // VND
  type: "popcorn" | "drink" | "combo" | "snack";
};

// Tính năng:
- Hiển thị danh sách item theo grid
- Badge màu theo loại (combo/bắp/nước/snack)
- Stepper +/- để chọn số lượng
- Tính tổng tiền tự động
```

### `MovieCard.tsx`
**Chức năng**: Card hiển thị phim

```typescript
type Props = {
  id: string | number;     // ID phim
  title: string;           // Tên phim
  img: string;             // URL poster
  age?: string;            // Badge độ tuổi (13+, 16+, v.v.)
};

// Link đến: /movie/[id]/book
```

### `BannerSlider.tsx` & `PromoSlider.tsx`
**Chức năng**: Slider dùng Swiper.js

```typescript
// Tính năng:
- Autoplay với delay
- Navigation buttons
- Pagination dots
- Responsive breakpoints
- Loop infinite
```

### `MobileMenu.tsx`
**Chức năng**: Menu responsive cho mobile

```typescript
// Các link:
- Đặt vé ngay
- Đặt bắp nước
- Đang chiếu
- Sắp chiếu
- Login / Register
```

---

## 🔌 API Routes

> **Lưu ý**: Hiện tại ứng dụng sử dụng mock data. Các API endpoint dưới đây là gợi ý cho backend integration.

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `POST` | `/api/auth/login` | Đăng nhập |
| `POST` | `/api/auth/register` | Đăng ký |
| `GET` | `/api/movies` | Danh sách phim |
| `GET` | `/api/movies/[id]` | Chi tiết phim |
| `GET` | `/api/theaters` | Danh sách rạp |
| `GET` | `/api/showtimes?date=&theater=` | Suất chiếu |
| `GET` | `/api/seats?showtime=` | Trạng thái ghế |
| `POST` | `/api/bookings` | Đặt vé |

---

## 🎨 Design System

### Color Palette

```css
:root {
  --green: #17C769;          /* Primary green */
  --green-border: #00ff66;   /* Border accent */
  --green-2: #12b45c;        /* Hover state */
  --brand-green: #17c769;    /* Brand color */
  --nav-dark: #0b1a12;       /* Navigation background */
  --pill-dark: #0f1a14;      /* Dark pill background */
  --text: #fff;              /* Text color */
  --black: #111;             /* Background black */
}
```

### Typography
- Font family: Inter (Google Fonts)
- Weights: 400 (regular), 600 (semibold), 700 (bold)

### Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

---

## 🤝 Đóng Góp

1. Fork repository
2. Tạo branch mới: `git checkout -b feature/ten-tinh-nang`
3. Commit changes: `git commit -m "Add: mô tả"`
4. Push branch: `git push origin feature/ten-tinh-nang`
5. Tạo Pull Request

---

## 📝 License

© 2025 Cinemas. All rights reserved.

---

## 📞 Liên Hệ

- **Email**: support@cinemas.vn
- **Website**: https://cinemas.vn
- **Facebook**: /cinemas.vn
