# DATABASE SCHEMA - LMK CINEMA

## Tổng quan
- **Database:** MySQL
- **Số bảng:** 17 tables
- **Số enum:** 13 enums

---

## DANH SÁCH CÁC BẢNG (ENTITIES)

### 1. roles (Vai trò)
| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---------|--------------|-----------|-------|
| id | INT | PK, AUTO_INCREMENT | Mã vai trò |
| name | VARCHAR | UNIQUE, NOT NULL | Tên vai trò |
| description | VARCHAR | NULLABLE | Mô tả |

---

### 2. users (Người dùng)
| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---------|--------------|-----------|-------|
| id | BIGINT | PK, AUTO_INCREMENT | Mã người dùng |
| full_name | VARCHAR | NOT NULL | Họ tên |
| email | VARCHAR | UNIQUE, NOT NULL | Email |
| password_hash | VARCHAR | NOT NULL | Mật khẩu đã hash |
| phone | VARCHAR | NULLABLE | Số điện thoại |
| date_of_birth | DATETIME | NULLABLE | Ngày sinh |
| avatar_url | VARCHAR | NULLABLE | URL ảnh đại diện |
| points | INT | DEFAULT 0 | Điểm tích lũy |
| status | ENUM(Status) | DEFAULT 'active' | Trạng thái |
| created_at | DATETIME | DEFAULT NOW() | Ngày tạo |
| updated_at | DATETIME | AUTO UPDATE | Ngày cập nhật |

---

### 3. user_roles (Bảng trung gian User-Role)
| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---------|--------------|-----------|-------|
| user_id | BIGINT | PK, FK → users.id | Mã người dùng |
| role_id | INT | PK, FK → roles.id | Mã vai trò |

**Composite PK:** (user_id, role_id)

---

### 4. movies (Phim)
| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---------|--------------|-----------|-------|
| id | BIGINT | PK, AUTO_INCREMENT | Mã phim |
| title | VARCHAR | NOT NULL | Tên phim |
| slug | VARCHAR | UNIQUE, NULLABLE | Slug URL |
| synopsis | TEXT | NULLABLE | Tóm tắt nội dung |
| genres | VARCHAR | NULLABLE | Thể loại |
| duration_minutes | INT | NULLABLE | Thời lượng (phút) |
| rating | VARCHAR | NULLABLE | Phân loại tuổi |
| language | VARCHAR | NULLABLE | Ngôn ngữ |
| country | VARCHAR | NULLABLE | Quốc gia |
| director | VARCHAR | NULLABLE | Đạo diễn |
| cast | TEXT | NULLABLE | Diễn viên |
| poster_url | VARCHAR | NULLABLE | URL poster |
| backdrop_url | VARCHAR | NULLABLE | URL backdrop |
| trailer_url | VARCHAR | NULLABLE | URL trailer |
| status | ENUM(MovieStatus) | DEFAULT 'draft' | Trạng thái |
| release_date | DATETIME | NULLABLE | Ngày khởi chiếu |
| is_featured | BOOLEAN | DEFAULT false | Phim nổi bật |
| created_at | DATETIME | DEFAULT NOW() | Ngày tạo |
| updated_at | DATETIME | AUTO UPDATE | Ngày cập nhật |

---

### 5. branches (Chi nhánh rạp)
| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---------|--------------|-----------|-------|
| id | INT | PK, AUTO_INCREMENT | Mã chi nhánh |
| name | VARCHAR | NOT NULL | Tên chi nhánh |
| address | VARCHAR | NULLABLE | Địa chỉ |
| city | VARCHAR | NULLABLE | Thành phố |
| hotline | VARCHAR | NULLABLE | Số hotline |
| latitude | DECIMAL | NULLABLE | Vĩ độ |
| longitude | DECIMAL | NULLABLE | Kinh độ |
| status | ENUM(BranchStatus) | DEFAULT 'active' | Trạng thái |

---

### 6. screens (Phòng chiếu)
| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---------|--------------|-----------|-------|
| id | INT | PK, AUTO_INCREMENT | Mã phòng chiếu |
| branch_id | INT | FK → branches.id | Mã chi nhánh |
| name | VARCHAR | NOT NULL | Tên phòng |
| seat_rows | INT | NOT NULL | Số hàng ghế |
| seat_cols | INT | NOT NULL | Số cột ghế |
| type | ENUM(ScreenType) | DEFAULT 'standard' | Loại phòng |
| status | ENUM(BranchStatus) | DEFAULT 'active' | Trạng thái |

---

### 7. seats (Ghế)
| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---------|--------------|-----------|-------|
| id | INT | PK, AUTO_INCREMENT | Mã ghế |
| screen_id | INT | FK → screens.id | Mã phòng chiếu |
| seat_code | VARCHAR | NOT NULL | Mã ghế (VD: A1, B2) |
| seat_row | VARCHAR | NOT NULL | Hàng ghế |
| seat_number | INT | NOT NULL | Số ghế |
| seat_type | ENUM(SeatType) | DEFAULT 'standard' | Loại ghế |

**Unique:** (screen_id, seat_code)

---

### 8. showtimes (Suất chiếu)
| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---------|--------------|-----------|-------|
| id | BIGINT | PK, AUTO_INCREMENT | Mã suất chiếu |
| movie_id | BIGINT | FK → movies.id | Mã phim |
| screen_id | INT | FK → screens.id | Mã phòng chiếu |
| start_time | DATETIME | NOT NULL | Thời gian bắt đầu |
| end_time | DATETIME | NOT NULL | Thời gian kết thúc |
| base_price | DECIMAL | NOT NULL | Giá cơ bản |
| language | VARCHAR | NULLABLE | Ngôn ngữ |
| subtitle | VARCHAR | NULLABLE | Phụ đề |
| status | ENUM(ShowtimeStatus) | DEFAULT 'scheduled' | Trạng thái |

---

### 9. bookings (Đặt vé)
| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---------|--------------|-----------|-------|
| id | BIGINT | PK, AUTO_INCREMENT | Mã đặt vé |
| user_id | BIGINT | FK → users.id, NULLABLE | Mã người dùng |
| showtime_id | BIGINT | FK → showtimes.id | Mã suất chiếu |
| booking_code | VARCHAR | UNIQUE, NOT NULL | Mã đặt vé |
| subtotal | DECIMAL | NOT NULL | Tạm tính |
| discount | DECIMAL | DEFAULT 0 | Giảm giá |
| total_amount | DECIMAL | NOT NULL | Tổng tiền |
| payment_method | ENUM(PaymentMethod) | DEFAULT 'momo' | Phương thức thanh toán |
| payment_status | ENUM(PaymentStatus) | DEFAULT 'pending' | Trạng thái thanh toán |
| status | ENUM(BookingStatus) | DEFAULT 'reserved' | Trạng thái đặt vé |
| transaction_id | VARCHAR | UNIQUE, NULLABLE | Mã giao dịch |
| qr_code | TEXT | NULLABLE | Mã QR thanh toán |
| qr_expires_at | DATETIME | NULLABLE | Hạn QR |
| ticket_qr_code | TEXT | NULLABLE | Mã QR vé |
| email_sent | BOOLEAN | DEFAULT false | Đã gửi email |
| email_sent_at | DATETIME | NULLABLE | Thời gian gửi email |
| paid_at | DATETIME | NULLABLE | Thời gian thanh toán |
| created_at | DATETIME | DEFAULT NOW() | Ngày tạo |
| updated_at | DATETIME | AUTO UPDATE | Ngày cập nhật |

---

### 10. booking_items (Chi tiết ghế đặt)
| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---------|--------------|-----------|-------|
| id | BIGINT | PK, AUTO_INCREMENT | Mã chi tiết |
| booking_id | BIGINT | FK → bookings.id | Mã đặt vé |
| seat_id | INT | FK → seats.id | Mã ghế |
| seat_price | DECIMAL | NOT NULL | Giá ghế |

**Unique:** (booking_id, seat_id)

---

### 11. concessions (Đồ ăn/Thức uống)
| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---------|--------------|-----------|-------|
| id | INT | PK, AUTO_INCREMENT | Mã sản phẩm |
| name | VARCHAR | NOT NULL | Tên sản phẩm |
| description | VARCHAR | NULLABLE | Mô tả |
| price | DECIMAL | NOT NULL | Giá |
| type | ENUM(ConcessionType) | DEFAULT 'combo' | Loại |
| image_url | VARCHAR | NULLABLE | URL hình ảnh |

---

### 12. booking_concessions (Chi tiết combo đặt)
| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---------|--------------|-----------|-------|
| id | BIGINT | PK, AUTO_INCREMENT | Mã chi tiết |
| booking_id | BIGINT | FK → bookings.id | Mã đặt vé |
| concession_id | INT | FK → concessions.id | Mã sản phẩm |
| quantity | INT | DEFAULT 1 | Số lượng |
| unit_price | DECIMAL | NOT NULL | Đơn giá |

---

### 13. promotions (Khuyến mãi)
| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---------|--------------|-----------|-------|
| id | INT | PK, AUTO_INCREMENT | Mã khuyến mãi |
| name | VARCHAR | NOT NULL | Tên khuyến mãi |
| code | VARCHAR | UNIQUE, NULLABLE | Mã giảm giá |
| description | VARCHAR | NULLABLE | Mô tả |
| discount_type | ENUM(DiscountType) | NOT NULL | Loại giảm giá |
| discount_value | DECIMAL | NOT NULL | Giá trị giảm |
| max_usage | INT | NULLABLE | Số lần sử dụng tối đa |
| usage_count | INT | DEFAULT 0 | Số lần đã dùng |
| min_order_value | DECIMAL | NULLABLE | Giá trị đơn tối thiểu |
| start_date | DATETIME | NULLABLE | Ngày bắt đầu |
| end_date | DATETIME | NULLABLE | Ngày kết thúc |
| status | ENUM(PromotionStatus) | DEFAULT 'draft' | Trạng thái |

---

### 14. movie_promotions (Bảng trung gian Movie-Promotion)
| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---------|--------------|-----------|-------|
| movie_id | BIGINT | PK, FK → movies.id | Mã phim |
| promotion_id | INT | PK, FK → promotions.id | Mã khuyến mãi |

**Composite PK:** (movie_id, promotion_id)

---

### 15. payments (Thanh toán)
| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---------|--------------|-----------|-------|
| id | BIGINT | PK, AUTO_INCREMENT | Mã thanh toán |
| booking_id | BIGINT | FK → bookings.id | Mã đặt vé |
| transaction_id | VARCHAR | UNIQUE, NOT NULL | Mã giao dịch |
| amount | DECIMAL | NOT NULL | Số tiền |
| bank_account | VARCHAR | NULLABLE | Số tài khoản |
| bank_name | VARCHAR | NULLABLE | Tên ngân hàng |
| qr_code | TEXT | NULLABLE | Mã QR |
| qr_data | TEXT | NULLABLE | Dữ liệu QR |
| payment_method | ENUM(PaymentMethod) | DEFAULT 'vnpay' | Phương thức |
| status | ENUM(PaymentStatus) | DEFAULT 'pending' | Trạng thái |
| bank_response | JSON | NULLABLE | Response từ bank |
| expires_at | DATETIME | NULLABLE | Thời gian hết hạn |
| paid_at | DATETIME | NULLABLE | Thời gian thanh toán |
| created_at | DATETIME | DEFAULT NOW() | Ngày tạo |
| updated_at | DATETIME | AUTO UPDATE | Ngày cập nhật |

**Index:** transaction_id, booking_id, status

---

### 16. audit_logs (Nhật ký hệ thống)
| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---------|--------------|-----------|-------|
| id | BIGINT | PK, AUTO_INCREMENT | Mã log |
| user_id | BIGINT | FK → users.id, NULLABLE | Mã người dùng |
| action | VARCHAR | NOT NULL | Hành động |
| payload | JSON | NULLABLE | Dữ liệu chi tiết |
| created_at | DATETIME | DEFAULT NOW() | Thời gian |

---

### 17. ticket_prices (Bảng giá vé)
| Tên cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---------|--------------|-----------|-------|
| id | INT | PK, AUTO_INCREMENT | Mã giá vé |
| name | VARCHAR | NOT NULL | Tên loại vé |
| code | VARCHAR | UNIQUE, NOT NULL | Mã loại vé |
| description | VARCHAR | NULLABLE | Mô tả |
| ticket_type | ENUM(TicketType) | DEFAULT 'single' | Loại ghế |
| price_multiplier | DECIMAL | DEFAULT 1 | Hệ số giá |
| is_active | BOOLEAN | DEFAULT true | Đang hoạt động |
| display_order | INT | DEFAULT 0 | Thứ tự hiển thị |
| created_at | DATETIME | DEFAULT NOW() | Ngày tạo |
| updated_at | DATETIME | AUTO UPDATE | Ngày cập nhật |

---

## DANH SÁCH ENUM

### 1. Status (Trạng thái người dùng)
| Giá trị | Mô tả |
|---------|-------|
| active | Hoạt động |
| blocked | Bị khóa |
| pending | Chờ xác nhận |

### 2. MovieStatus (Trạng thái phim)
| Giá trị | Mô tả |
|---------|-------|
| now_showing | Đang chiếu |
| coming_soon | Sắp chiếu |
| draft | Nháp |
| archived | Lưu trữ |

### 3. BranchStatus (Trạng thái chi nhánh)
| Giá trị | Mô tả |
|---------|-------|
| active | Hoạt động |
| maintenance | Bảo trì |
| inactive | Ngừng hoạt động |

### 4. ScreenType (Loại phòng chiếu)
| Giá trị | Mô tả |
|---------|-------|
| standard | Tiêu chuẩn |
| vip | VIP |
| imax | IMAX |
| 4dx | 4DX |
| premium | Premium |

### 5. SeatType (Loại ghế)
| Giá trị | Mô tả |
|---------|-------|
| standard | Tiêu chuẩn |
| vip | VIP |
| couple | Ghế đôi |
| disabled | Ghế khuyết tật |

### 6. ShowtimeStatus (Trạng thái suất chiếu)
| Giá trị | Mô tả |
|---------|-------|
| scheduled | Đã lên lịch |
| selling | Đang bán |
| closed | Đã đóng |
| cancelled | Đã hủy |

### 7. PaymentMethod (Phương thức thanh toán)
| Giá trị | Mô tả |
|---------|-------|
| cash | Tiền mặt |
| momo | Ví MoMo |
| vnpay | VNPay |
| credit | Thẻ tín dụng |
| wallet | Ví điện tử |
| bank_transfer | Chuyển khoản |

### 8. PaymentStatus (Trạng thái thanh toán)
| Giá trị | Mô tả |
|---------|-------|
| pending | Chờ thanh toán |
| paid | Đã thanh toán |
| refunded | Đã hoàn tiền |
| failed | Thất bại |

### 9. BookingStatus (Trạng thái đặt vé)
| Giá trị | Mô tả |
|---------|-------|
| reserved | Đã đặt |
| confirmed | Đã xác nhận |
| cancelled | Đã hủy |

### 10. ConcessionType (Loại đồ ăn)
| Giá trị | Mô tả |
|---------|-------|
| combo | Combo |
| popcorn | Bắp rang |
| drink | Thức uống |
| snack | Snack |

### 11. DiscountType (Loại giảm giá)
| Giá trị | Mô tả |
|---------|-------|
| percent | Phần trăm |
| fixed | Số tiền cố định |

### 12. PromotionStatus (Trạng thái khuyến mãi)
| Giá trị | Mô tả |
|---------|-------|
| draft | Nháp |
| active | Hoạt động |
| expired | Hết hạn |
| disabled | Vô hiệu hóa |

### 13. TicketType (Loại vé)
| Giá trị | Mô tả |
|---------|-------|
| single | Vé đơn |
| couple | Vé đôi |

---

## QUAN HỆ GIỮA CÁC BẢNG (RELATIONSHIPS)

| Bảng gốc | Quan hệ | Bảng liên kết | Mô tả |
|----------|---------|---------------|-------|
| roles | 1:N | user_roles | Một vai trò có nhiều user_roles |
| users | 1:N | user_roles | Một user có nhiều vai trò |
| users | 1:N | bookings | Một user có nhiều đơn đặt vé |
| users | 1:N | audit_logs | Một user có nhiều log |
| branches | 1:N | screens | Một chi nhánh có nhiều phòng chiếu |
| screens | 1:N | seats | Một phòng chiếu có nhiều ghế |
| screens | 1:N | showtimes | Một phòng chiếu có nhiều suất chiếu |
| movies | 1:N | showtimes | Một phim có nhiều suất chiếu |
| movies | 1:N | movie_promotions | Một phim có nhiều khuyến mãi |
| promotions | 1:N | movie_promotions | Một khuyến mãi áp dụng cho nhiều phim |
| showtimes | 1:N | bookings | Một suất chiếu có nhiều đơn đặt |
| bookings | 1:N | booking_items | Một đơn có nhiều ghế |
| bookings | 1:N | booking_concessions | Một đơn có nhiều combo |
| bookings | 1:N | payments | Một đơn có nhiều lần thanh toán |
| seats | 1:N | booking_items | Một ghế được đặt nhiều lần |
| concessions | 1:N | booking_concessions | Một combo được đặt nhiều lần |

---

## SƠ ĐỒ ERD (TEXT)

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   roles     │       │ user_roles  │       │   users     │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ PK id       │──1:N──│ FK role_id  │       │ PK id       │
│    name     │       │ FK user_id  │──N:1──│    full_name│
│ description │       └─────────────┘       │    email    │
└─────────────┘                             │    password │
                                            │    phone    │
                                            │    status   │
                                            └──────┬──────┘
                                                   │
                              ┌────────────────────┼────────────────────┐
                              │ 1:N                │ 1:N                │ 1:N
                              ▼                    ▼                    ▼
                       ┌─────────────┐      ┌─────────────┐      ┌─────────────┐
                       │  bookings   │      │ audit_logs  │      │ticket_prices│
                       ├─────────────┤      ├─────────────┤      ├─────────────┤
                       │ PK id       │      │ PK id       │      │ PK id       │
                       │ FK user_id  │      │ FK user_id  │      │    name     │
                       │ FK showtime │      │    action   │      │    code     │
                       │ booking_code│      │    payload  │      │ ticket_type │
                       │ total_amount│      └─────────────┘      │price_multip.│
                       │    status   │                           └─────────────┘
                       └──────┬──────┘
                              │
         ┌────────────────────┼────────────────────┐
         │ 1:N                │ 1:N                │ 1:N
         ▼                    ▼                    ▼
  ┌─────────────┐      ┌─────────────┐      ┌─────────────┐
  │booking_items│      │booking_conc.│      │  payments   │
  ├─────────────┤      ├─────────────┤      ├─────────────┤
  │ PK id       │      │ PK id       │      │ PK id       │
  │ FK booking  │      │ FK booking  │      │ FK booking  │
  │ FK seat_id  │      │ FK concess. │      │ trans_id    │
  │  seat_price │      │  quantity   │      │  amount     │
  └──────┬──────┘      └──────┬──────┘      └─────────────┘
         │ N:1                │ N:1
         ▼                    ▼
  ┌─────────────┐      ┌─────────────┐
  │   seats     │      │ concessions │
  ├─────────────┤      ├─────────────┤
  │ PK id       │      │ PK id       │
  │ FK screen_id│      │    name     │
  │  seat_code  │      │    price    │
  │  seat_type  │      │    type     │
  └──────┬──────┘      └─────────────┘
         │ N:1
         ▼
  ┌─────────────┐      ┌─────────────┐      ┌─────────────┐
  │  screens    │      │  showtimes  │      │   movies    │
  ├─────────────┤      ├─────────────┤      ├─────────────┤
  │ PK id       │──1:N─│ FK screen_id│      │ PK id       │
  │ FK branch_id│      │ FK movie_id │──N:1─│    title    │
  │    name     │      │  start_time │      │    slug     │
  │    type     │      │  base_price │      │    status   │
  └──────┬──────┘      │    status   │      └──────┬──────┘
         │ N:1         └─────────────┘             │ 1:N
         ▼                                         ▼
  ┌─────────────┐                           ┌─────────────┐
  │  branches   │                           │movie_promot.│
  ├─────────────┤                           ├─────────────┤
  │ PK id       │                           │ FK movie_id │
  │    name     │                           │ FK promo_id │
  │   address   │                           └──────┬──────┘
  │    city     │                                  │ N:1
  └─────────────┘                                  ▼
                                            ┌─────────────┐
                                            │ promotions  │
                                            ├─────────────┤
                                            │ PK id       │
                                            │    name     │
                                            │    code     │
                                            │discount_type│
                                            └─────────────┘
```

---

## DBDIAGRAM.IO CODE

Dùng code này để paste vào https://dbdiagram.io:

```dbml
Table roles {
  id int [pk, increment]
  name varchar [unique, not null]
  description varchar
}

Table users {
  id bigint [pk, increment]
  full_name varchar [not null]
  email varchar [unique, not null]
  password_hash varchar [not null]
  phone varchar
  date_of_birth datetime
  avatar_url varchar
  points int [default: 0]
  status Status [default: 'active']
  created_at datetime [default: `now()`]
  updated_at datetime
}

Table user_roles {
  user_id bigint [pk, ref: > users.id]
  role_id int [pk, ref: > roles.id]
}

Table movies {
  id bigint [pk, increment]
  title varchar [not null]
  slug varchar [unique]
  synopsis text
  genres varchar
  duration_minutes int
  rating varchar
  language varchar
  country varchar
  director varchar
  cast text
  poster_url varchar
  backdrop_url varchar
  trailer_url varchar
  status MovieStatus [default: 'draft']
  release_date datetime
  is_featured boolean [default: false]
  created_at datetime [default: `now()`]
  updated_at datetime
}

Table branches {
  id int [pk, increment]
  name varchar [not null]
  address varchar
  city varchar
  hotline varchar
  latitude decimal
  longitude decimal
  status BranchStatus [default: 'active']
}

Table screens {
  id int [pk, increment]
  branch_id int [ref: > branches.id]
  name varchar [not null]
  seat_rows int [not null]
  seat_cols int [not null]
  type ScreenType [default: 'standard']
  status BranchStatus [default: 'active']
}

Table seats {
  id int [pk, increment]
  screen_id int [ref: > screens.id]
  seat_code varchar [not null]
  seat_row varchar [not null]
  seat_number int [not null]
  seat_type SeatType [default: 'standard']
  
  indexes {
    (screen_id, seat_code) [unique]
  }
}

Table showtimes {
  id bigint [pk, increment]
  movie_id bigint [ref: > movies.id]
  screen_id int [ref: > screens.id]
  start_time datetime [not null]
  end_time datetime [not null]
  base_price decimal [not null]
  language varchar
  subtitle varchar
  status ShowtimeStatus [default: 'scheduled']
}

Table bookings {
  id bigint [pk, increment]
  user_id bigint [ref: > users.id]
  showtime_id bigint [ref: > showtimes.id]
  booking_code varchar [unique, not null]
  subtotal decimal [not null]
  discount decimal [default: 0]
  total_amount decimal [not null]
  payment_method PaymentMethod [default: 'momo']
  payment_status PaymentStatus [default: 'pending']
  status BookingStatus [default: 'reserved']
  transaction_id varchar [unique]
  qr_code text
  qr_expires_at datetime
  ticket_qr_code text
  email_sent boolean [default: false]
  email_sent_at datetime
  paid_at datetime
  created_at datetime [default: `now()`]
  updated_at datetime
}

Table booking_items {
  id bigint [pk, increment]
  booking_id bigint [ref: > bookings.id]
  seat_id int [ref: > seats.id]
  seat_price decimal [not null]
  
  indexes {
    (booking_id, seat_id) [unique]
  }
}

Table concessions {
  id int [pk, increment]
  name varchar [not null]
  description varchar
  price decimal [not null]
  type ConcessionType [default: 'combo']
  image_url varchar
}

Table booking_concessions {
  id bigint [pk, increment]
  booking_id bigint [ref: > bookings.id]
  concession_id int [ref: > concessions.id]
  quantity int [default: 1]
  unit_price decimal [not null]
}

Table promotions {
  id int [pk, increment]
  name varchar [not null]
  code varchar [unique]
  description varchar
  discount_type DiscountType [not null]
  discount_value decimal [not null]
  max_usage int
  usage_count int [default: 0]
  min_order_value decimal
  start_date datetime
  end_date datetime
  status PromotionStatus [default: 'draft']
}

Table movie_promotions {
  movie_id bigint [pk, ref: > movies.id]
  promotion_id int [pk, ref: > promotions.id]
}

Table payments {
  id bigint [pk, increment]
  booking_id bigint [ref: > bookings.id]
  transaction_id varchar [unique, not null]
  amount decimal [not null]
  bank_account varchar
  bank_name varchar
  qr_code text
  qr_data text
  payment_method PaymentMethod [default: 'vnpay']
  status PaymentStatus [default: 'pending']
  bank_response json
  expires_at datetime
  paid_at datetime
  created_at datetime [default: `now()`]
  updated_at datetime
}

Table audit_logs {
  id bigint [pk, increment]
  user_id bigint [ref: > users.id]
  action varchar [not null]
  payload json
  created_at datetime [default: `now()`]
}

Table ticket_prices {
  id int [pk, increment]
  name varchar [not null]
  code varchar [unique, not null]
  description varchar
  ticket_type TicketType [default: 'single']
  price_multiplier decimal [default: 1]
  is_active boolean [default: true]
  display_order int [default: 0]
  created_at datetime [default: `now()`]
  updated_at datetime
}

Enum Status {
  active
  blocked
  pending
}

Enum MovieStatus {
  now_showing
  coming_soon
  draft
  archived
}

Enum BranchStatus {
  active
  maintenance
  inactive
}

Enum ScreenType {
  standard
  vip
  imax
  dx4
  premium
}

Enum SeatType {
  standard
  vip
  couple
  disabled
}

Enum ShowtimeStatus {
  scheduled
  selling
  closed
  cancelled
}

Enum PaymentMethod {
  cash
  momo
  vnpay
  credit
  wallet
  bank_transfer
}

Enum PaymentStatus {
  pending
  paid
  refunded
  failed
}

Enum BookingStatus {
  reserved
  confirmed
  cancelled
}

Enum ConcessionType {
  combo
  popcorn
  drink
  snack
}

Enum DiscountType {
  percent
  fixed
}

Enum PromotionStatus {
  draft
  active
  expired
  disabled
}

Enum TicketType {
  single
  couple
}
```

---

## GHI CHÚ

- **PK**: Primary Key (Khóa chính)
- **FK**: Foreign Key (Khóa ngoại)
- **UNIQUE**: Giá trị duy nhất
- **NOT NULL**: Không được để trống
- **NULLABLE**: Có thể để trống
- **DEFAULT**: Giá trị mặc định
- **AUTO_INCREMENT**: Tự động tăng
- **1:N**: Quan hệ một-nhiều
- **N:1**: Quan hệ nhiều-một
- **N:N**: Quan hệ nhiều-nhiều (thông qua bảng trung gian)
