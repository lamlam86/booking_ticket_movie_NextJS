# Product Context: Cinemas - Movie Ticket Booking System

*Version: 1.0*
*Updated: 2025-12-28*

## Problem Statement

Việc đặt vé xem phim truyền thống đòi hỏi người dùng phải đến rạp hoặc gọi điện, gây mất thời gian và không thuận tiện. Người dùng cần một giải pháp số hóa cho phép:

- Xem lịch chiếu và chọn suất phim mọi lúc mọi nơi
- Chọn ghế yêu thích trước khi đến rạp
- Đặt thêm bắp nước để tiết kiệm thời gian xếp hàng
- Quản lý vé điện tử trên điện thoại

## User Personas

### Persona 1: Thanh niên thành thị (18-30 tuổi)
- **Demographics**: Sinh viên/Nhân viên văn phòng, quen thuộc công nghệ
- **Goals**: 
  - Đặt vé nhanh chóng qua điện thoại
  - Chọn ghế VIP hoặc vị trí tốt
  - Chia sẻ kế hoạch với bạn bè
- **Pain Points**: 
  - Hết vé khi đến rạp
  - Phải xếp hàng mua bắp nước
  - Khó tìm suất chiếu phù hợp lịch trình

### Persona 2: Gia đình (30-45 tuổi)
- **Demographics**: Có con nhỏ, đi xem phim cuối tuần
- **Goals**: 
  - Đặt nhiều vé cùng lúc cho gia đình
  - Chọn ghế cạnh nhau
  - Biết trước phim phù hợp độ tuổi con
- **Pain Points**: 
  - Phim không phù hợp độ tuổi
  - Khó đặt ghế liền kề cho nhóm lớn
  - Thời gian chờ đợi ảnh hưởng đến trẻ em

## User Experience Goals

- **Đơn giản**: Hoàn thành đặt vé trong 5 bước rõ ràng
- **Trực quan**: Sơ đồ ghế dễ hiểu với màu sắc phân biệt
- **Nhanh chóng**: Load page < 3 giây, animation mượt mà
- **Tin cậy**: Hiển thị thông tin chính xác về suất chiếu và ghế trống
- **Responsive**: Trải nghiệm tốt trên mọi kích thước màn hình

## Key Features

### 1. Movie Discovery
- Banner slider tự động với phim hot
- Grid phim đang chiếu/sắp chiếu
- Badge độ tuổi (13+, 16+, 18+)
- Nút "Đặt vé" trực tiếp từ card

### 2. Booking Wizard
- 5 bước: Ngày → Rạp → Giờ → Ghế → Bắp nước
- Filter thông minh (rạp có suất → giờ khả dụng)
- Summary tổng tiền real-time
- Nút "Làm lại" để reset

### 3. Seat Selection
- Sơ đồ ghế 8x8 (64 ghế)
- 3 trạng thái: Trống (gray), Đang chọn (green), Đã đặt (red)
- Giới hạn tối đa 8 ghế/lần đặt
- Label hàng (A-H) và số ghế (1-8)

### 4. Concession Ordering
- 4 loại: Combo, Bắp, Nước, Snack
- Stepper +/- để chọn số lượng
- Badge màu theo loại sản phẩm
- Tính tổng tự động

### 5. Authentication
- Form đăng ký với validation đầy đủ
- Phone input với mã quốc gia
- Password strength requirements
- Form đăng nhập đơn giản

## Success Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Booking completion rate | > 70% | N/A (Mock) |
| Page load time | < 3s | ~1.5s |
| Mobile usability score | > 90 | N/A |
| Form validation accuracy | 100% | ✅ |

---

*This document explains why the project exists and what problems it solves.*
