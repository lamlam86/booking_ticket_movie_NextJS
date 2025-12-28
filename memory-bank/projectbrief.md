# Project Brief: Cinemas - Movie Ticket Booking System

*Version: 1.0*
*Created: 2025-12-28*

## Project Overview

**Cinemas** là hệ thống đặt vé xem phim trực tuyến được xây dựng với Next.js 15 và React 19. Dự án cung cấp trải nghiệm người dùng mượt mà cho việc đặt vé xem phim, chọn ghế, và đặt bắp nước tại các rạp chiếu phim.

### Mục tiêu chính:
- Cung cấp giao diện đặt vé trực quan, dễ sử dụng
- Hỗ trợ responsive trên mọi thiết bị
- Tối ưu hiệu năng với Next.js App Router và Turbopack

## Core Requirements

### Functional Requirements
- [RS:5] Hiển thị danh sách phim đang chiếu và sắp chiếu
- [RS:5] Wizard đặt vé 5 bước: Ngày → Rạp → Giờ → Ghế → Bắp nước
- [RS:5] Hệ thống xác thực (Đăng nhập/Đăng ký)
- [RS:4] Sơ đồ chọn ghế trực quan với trạng thái real-time
- [RS:4] Tính năng đặt bắp nước kèm vé
- [RS:3] Tìm kiếm phim và rạp
- [RS:3] Slider banner và khuyến mãi

### Non-Functional Requirements
- [RS:5] Responsive design (mobile-first)
- [RS:4] Load time < 3s on 3G
- [RS:4] Accessibility (ARIA labels)
- [RS:3] SEO friendly với metadata

## Success Criteria

- Người dùng hoàn thành flow đặt vé trong < 2 phút
- Giao diện hiển thị đúng trên các thiết bị phổ biến
- Không có lỗi critical trên production
- Validation form hoạt động chính xác

## Scope

### In Scope
- Trang chủ với banner slider, danh sách phim
- Trang danh sách phim (/movie)
- Trang đặt vé (/movie/[id]/book)
- Trang đăng nhập (/login)
- Trang đăng ký (/signup)
- Header với navigation và search
- Footer với thông tin liên hệ
- Mobile responsive menu
- Mock data cho demo

### Out of Scope (Phase 2)
- Backend API integration
- Payment gateway
- Email notifications
- User profile management
- Admin dashboard
- Booking history
- Reviews và ratings

## Timeline (Planned)

- **Phase 1** (Completed): UI/UX Frontend với mock data
- **Phase 2** (Future): Backend API integration
- **Phase 3** (Future): Payment và notifications

## Stakeholders

- **Product Owner**: Chịu trách nhiệm requirements
- **Frontend Developer**: Xây dựng UI components
- **UI/UX Designer**: Thiết kế giao diện

---

*This document serves as the foundation for the project and informs all other memory files.*
