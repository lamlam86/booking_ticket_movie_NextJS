-- =============================================
-- RESET DATABASE HOÀN TOÀN
-- Chạy file này để tạo lại toàn bộ database
-- =============================================

SET FOREIGN_KEY_CHECKS = 0;

-- Xóa tất cả bảng
DROP TABLE IF EXISTS `audit_logs`;
DROP TABLE IF EXISTS `movie_promotions`;
DROP TABLE IF EXISTS `booking_concessions`;
DROP TABLE IF EXISTS `booking_items`;
DROP TABLE IF EXISTS `payments`;
DROP TABLE IF EXISTS `bookings`;
DROP TABLE IF EXISTS `showtimes`;
DROP TABLE IF EXISTS `seats`;
DROP TABLE IF EXISTS `screens`;
DROP TABLE IF EXISTS `branches`;
DROP TABLE IF EXISTS `concessions`;
DROP TABLE IF EXISTS `promotions`;
DROP TABLE IF EXISTS `movies`;
DROP TABLE IF EXISTS `user_roles`;
DROP TABLE IF EXISTS `roles`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `ticket_prices`;

SET FOREIGN_KEY_CHECKS = 1;

-- =============================================
-- 1. TẠO BẢNG ROLES
-- =============================================
CREATE TABLE `roles` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(191) NOT NULL,
  `description` VARCHAR(191) NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `roles_name_key`(`name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- =============================================
-- 2. TẠO BẢNG USERS
-- =============================================
CREATE TABLE `users` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `full_name` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `password_hash` VARCHAR(191) NOT NULL,
  `phone` VARCHAR(191) NULL,
  `date_of_birth` DATETIME(3) NULL,
  `avatar_url` VARCHAR(191) NULL,
  `points` INT NOT NULL DEFAULT 0,
  `status` ENUM('active', 'blocked', 'pending') NOT NULL DEFAULT 'active',
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `users_email_key`(`email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- =============================================
-- 3. TẠO BẢNG USER_ROLES
-- =============================================
CREATE TABLE `user_roles` (
  `user_id` BIGINT NOT NULL,
  `role_id` INT NOT NULL,
  PRIMARY KEY (`user_id`, `role_id`),
  CONSTRAINT `user_roles_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  CONSTRAINT `user_roles_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- =============================================
-- 4. TẠO BẢNG MOVIES
-- =============================================
CREATE TABLE `movies` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(191) NOT NULL,
  `slug` VARCHAR(191) NULL,
  `synopsis` TEXT NULL,
  `genres` VARCHAR(191) NULL,
  `duration_minutes` INT NULL,
  `rating` VARCHAR(191) NULL,
  `language` VARCHAR(191) NULL,
  `country` VARCHAR(191) NULL,
  `director` VARCHAR(191) NULL,
  `cast` TEXT NULL,
  `poster_url` VARCHAR(191) NULL,
  `backdrop_url` VARCHAR(191) NULL,
  `trailer_url` VARCHAR(191) NULL,
  `status` ENUM('now_showing', 'coming_soon', 'draft', 'archived') NOT NULL DEFAULT 'draft',
  `release_date` DATETIME(3) NULL,
  `is_featured` BOOLEAN NOT NULL DEFAULT false,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `movies_slug_key`(`slug`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- =============================================
-- 5. TẠO BẢNG BRANCHES (RẠP)
-- =============================================
CREATE TABLE `branches` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(191) NOT NULL,
  `address` VARCHAR(191) NULL,
  `city` VARCHAR(191) NULL,
  `hotline` VARCHAR(191) NULL,
  `latitude` DECIMAL(10,8) NULL,
  `longitude` DECIMAL(11,8) NULL,
  `status` ENUM('active', 'maintenance', 'inactive') NOT NULL DEFAULT 'active',
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- =============================================
-- 6. TẠO BẢNG SCREENS (PHÒNG CHIẾU)
-- =============================================
CREATE TABLE `screens` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `branch_id` INT NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `seat_rows` INT NOT NULL,
  `seat_cols` INT NOT NULL,
  `type` ENUM('standard') NOT NULL DEFAULT 'standard',
  `status` ENUM('active', 'maintenance', 'inactive') NOT NULL DEFAULT 'active',
  PRIMARY KEY (`id`),
  CONSTRAINT `screens_branch_id_fkey` FOREIGN KEY (`branch_id`) REFERENCES `branches`(`id`) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- =============================================
-- 7. TẠO BẢNG SEATS (GHẾ)
-- =============================================
CREATE TABLE `seats` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `screen_id` INT NOT NULL,
  `seat_code` VARCHAR(191) NOT NULL,
  `seat_row` VARCHAR(191) NOT NULL,
  `seat_number` INT NOT NULL,
  `seat_type` ENUM('standard', 'vip') NOT NULL DEFAULT 'standard',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `seats_screen_id_seat_code_key`(`screen_id`, `seat_code`),
  CONSTRAINT `seats_screen_id_fkey` FOREIGN KEY (`screen_id`) REFERENCES `screens`(`id`) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- =============================================
-- 8. TẠO BẢNG TICKET_PRICES (GIÁ VÉ)
-- =============================================
CREATE TABLE `ticket_prices` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `screen_type` ENUM('standard') NOT NULL,
  `seat_type` ENUM('standard', 'vip') NOT NULL,
  `day_type` ENUM('weekday', 'weekend', 'holiday') NOT NULL DEFAULT 'weekday',
  `price` DECIMAL(65,30) NOT NULL,
  `is_active` BOOLEAN NOT NULL DEFAULT true,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `ticket_prices_screen_type_seat_type_day_type_key`(`screen_type`, `seat_type`, `day_type`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- =============================================
-- 9. TẠO BẢNG SHOWTIMES (SUẤT CHIẾU)
-- =============================================
CREATE TABLE `showtimes` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `movie_id` BIGINT NOT NULL,
  `screen_id` INT NOT NULL,
  `start_time` DATETIME(3) NOT NULL,
  `end_time` DATETIME(3) NOT NULL,
  `language` VARCHAR(191) NULL,
  `subtitle` VARCHAR(191) NULL,
  `status` ENUM('scheduled', 'selling', 'closed', 'cancelled') NOT NULL DEFAULT 'scheduled',
  PRIMARY KEY (`id`),
  CONSTRAINT `showtimes_movie_id_fkey` FOREIGN KEY (`movie_id`) REFERENCES `movies`(`id`) ON DELETE CASCADE,
  CONSTRAINT `showtimes_screen_id_fkey` FOREIGN KEY (`screen_id`) REFERENCES `screens`(`id`) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- =============================================
-- 10. TẠO BẢNG BOOKINGS (ĐẶT VÉ)
-- =============================================
CREATE TABLE `bookings` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT NULL,
  `showtime_id` BIGINT NOT NULL,
  `booking_code` VARCHAR(191) NOT NULL,
  `subtotal` DECIMAL(65,30) NOT NULL,
  `discount` DECIMAL(65,30) NULL DEFAULT 0,
  `total_amount` DECIMAL(65,30) NOT NULL,
  `payment_method` ENUM('cash', 'momo', 'vnpay', 'credit', 'wallet', 'bank_transfer') NOT NULL DEFAULT 'momo',
  `payment_status` ENUM('pending', 'paid', 'refunded', 'failed') NOT NULL DEFAULT 'pending',
  `status` ENUM('reserved', 'confirmed', 'cancelled') NOT NULL DEFAULT 'reserved',
  `transaction_id` VARCHAR(191) NULL,
  `qr_code` TEXT NULL,
  `qr_expires_at` DATETIME(3) NULL,
  `ticket_qr_code` TEXT NULL,
  `email_sent` BOOLEAN NOT NULL DEFAULT false,
  `email_sent_at` DATETIME(3) NULL,
  `paid_at` DATETIME(3) NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `bookings_booking_code_key`(`booking_code`),
  UNIQUE INDEX `bookings_transaction_id_key`(`transaction_id`),
  CONSTRAINT `bookings_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  CONSTRAINT `bookings_showtime_id_fkey` FOREIGN KEY (`showtime_id`) REFERENCES `showtimes`(`id`) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- =============================================
-- 11. TẠO BẢNG BOOKING_ITEMS (CHI TIẾT VÉ)
-- =============================================
CREATE TABLE `booking_items` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `booking_id` BIGINT NOT NULL,
  `seat_id` INT NOT NULL,
  `seat_price` DECIMAL(65,30) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `booking_items_booking_id_seat_id_key`(`booking_id`, `seat_id`),
  CONSTRAINT `booking_items_booking_id_fkey` FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`id`) ON DELETE CASCADE,
  CONSTRAINT `booking_items_seat_id_fkey` FOREIGN KEY (`seat_id`) REFERENCES `seats`(`id`) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- =============================================
-- 12. TẠO BẢNG CONCESSIONS (BẮP NƯỚC)
-- =============================================
CREATE TABLE `concessions` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(191) NOT NULL,
  `description` VARCHAR(191) NULL,
  `price` DECIMAL(65,30) NOT NULL,
  `type` ENUM('combo', 'popcorn', 'drink', 'snack') NOT NULL DEFAULT 'combo',
  `image_url` VARCHAR(191) NULL,
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- =============================================
-- 13. TẠO BẢNG BOOKING_CONCESSIONS
-- =============================================
CREATE TABLE `booking_concessions` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `booking_id` BIGINT NOT NULL,
  `concession_id` INT NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `unit_price` DECIMAL(65,30) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `booking_concessions_booking_id_fkey` FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`id`) ON DELETE CASCADE,
  CONSTRAINT `booking_concessions_concession_id_fkey` FOREIGN KEY (`concession_id`) REFERENCES `concessions`(`id`) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- =============================================
-- 14. TẠO BẢNG PROMOTIONS (KHUYẾN MÃI)
-- =============================================
CREATE TABLE `promotions` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(191) NOT NULL,
  `code` VARCHAR(191) NULL,
  `description` VARCHAR(191) NULL,
  `discount_type` ENUM('percent', 'fixed') NOT NULL,
  `discount_value` DECIMAL(65,30) NOT NULL,
  `max_usage` INT NULL,
  `usage_count` INT NOT NULL DEFAULT 0,
  `min_order_value` DECIMAL(65,30) NULL,
  `start_date` DATETIME(3) NULL,
  `end_date` DATETIME(3) NULL,
  `status` ENUM('draft', 'active', 'expired', 'disabled') NOT NULL DEFAULT 'draft',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `promotions_code_key`(`code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- =============================================
-- 15. TẠO BẢNG MOVIE_PROMOTIONS
-- =============================================
CREATE TABLE `movie_promotions` (
  `movie_id` BIGINT NOT NULL,
  `promotion_id` INT NOT NULL,
  PRIMARY KEY (`movie_id`, `promotion_id`),
  CONSTRAINT `movie_promotions_movie_id_fkey` FOREIGN KEY (`movie_id`) REFERENCES `movies`(`id`) ON DELETE CASCADE,
  CONSTRAINT `movie_promotions_promotion_id_fkey` FOREIGN KEY (`promotion_id`) REFERENCES `promotions`(`id`) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- =============================================
-- 16. TẠO BẢNG PAYMENTS
-- =============================================
CREATE TABLE `payments` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `booking_id` BIGINT NOT NULL,
  `transaction_id` VARCHAR(191) NOT NULL,
  `amount` DECIMAL(65,30) NOT NULL,
  `bank_account` VARCHAR(191) NULL,
  `bank_name` VARCHAR(191) NULL,
  `qr_code` TEXT NULL,
  `qr_data` TEXT NULL,
  `payment_method` ENUM('cash', 'momo', 'vnpay', 'credit', 'wallet', 'bank_transfer') NOT NULL DEFAULT 'vnpay',
  `status` ENUM('pending', 'paid', 'refunded', 'failed') NOT NULL DEFAULT 'pending',
  `bank_response` JSON NULL,
  `expires_at` DATETIME(3) NULL,
  `paid_at` DATETIME(3) NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `payments_transaction_id_key`(`transaction_id`),
  INDEX `payments_transaction_id_idx`(`transaction_id`),
  INDEX `payments_booking_id_idx`(`booking_id`),
  INDEX `payments_status_idx`(`status`),
  CONSTRAINT `payments_booking_id_fkey` FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`id`) ON DELETE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- =============================================
-- 17. TẠO BẢNG AUDIT_LOGS
-- =============================================
CREATE TABLE `audit_logs` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT NULL,
  `action` VARCHAR(191) NOT NULL,
  `payload` JSON NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  CONSTRAINT `audit_logs_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- =============================================
-- SEED DATA
-- =============================================

-- Roles
INSERT INTO `roles` (`id`, `name`, `description`) VALUES
(1, 'admin', 'Quản trị viên'),
(2, 'staff', 'Nhân viên'),
(3, 'customer', 'Khách hàng');

-- Admin user (password: admin123)
INSERT INTO `users` (`id`, `full_name`, `email`, `password_hash`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Admin', 'admin@lmkcinema.vn', '$2a$10$rQnM1rGPvM8rGjPvM8rGPeKQnM1rGPvM8rGjPvM8rGPeKQnM1rGP', 'active', NOW(), NOW());

INSERT INTO `user_roles` (`user_id`, `role_id`) VALUES (1, 1);

-- Branches (Rạp)
INSERT INTO `branches` (`id`, `name`, `address`, `city`, `hotline`, `status`) VALUES
(1, 'LMK Cinema Quận 1', '123 Nguyễn Huệ, Quận 1', 'TP. Hồ Chí Minh', '1900 1234', 'active'),
(2, 'LMK Cinema Quận 7', '456 Nguyễn Thị Thập, Quận 7', 'TP. Hồ Chí Minh', '1900 1234', 'active');

-- Screens (Phòng chiếu) - 10 hàng x 12 cột = 120 ghế
INSERT INTO `screens` (`id`, `branch_id`, `name`, `seat_rows`, `seat_cols`, `type`, `status`) VALUES
(1, 1, 'Rạp 01', 10, 12, 'standard', 'active'),
(2, 1, 'Rạp 02', 10, 12, 'standard', 'active'),
(3, 2, 'Rạp 01', 10, 12, 'standard', 'active'),
(4, 2, 'Rạp 02', 10, 12, 'standard', 'active');

-- Seats (Ghế) - Tạo cho tất cả phòng
INSERT INTO `seats` (`screen_id`, `seat_code`, `seat_row`, `seat_number`, `seat_type`)
SELECT 
  s.id,
  CONCAT(CHAR(64 + r.n), LPAD(c.n, 2, '0')),
  CHAR(64 + r.n),
  c.n,
  CASE WHEN r.n >= 9 THEN 'vip' ELSE 'standard' END
FROM screens s
CROSS JOIN (SELECT 1 as n UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10) r
CROSS JOIN (SELECT 1 as n UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10 UNION SELECT 11 UNION SELECT 12) c;

-- Ticket Prices (Giá vé)
INSERT INTO `ticket_prices` (`screen_type`, `seat_type`, `day_type`, `price`, `is_active`, `created_at`, `updated_at`) VALUES
('standard', 'standard', 'weekday', 65000, true, NOW(), NOW()),
('standard', 'vip', 'weekday', 85000, true, NOW(), NOW());

-- Movies (Phim mẫu)
INSERT INTO `movies` (`id`, `title`, `slug`, `synopsis`, `genres`, `duration_minutes`, `rating`, `language`, `country`, `director`, `status`, `release_date`, `created_at`, `updated_at`) VALUES
(1, 'Avengers: Endgame', 'avengers-endgame', 'Sau sự kiện tàn khốc của Infinity War, các siêu anh hùng còn lại phải tập hợp lại một lần nữa để đảo ngược hành động của Thanos và khôi phục lại vũ trụ.', 'Hành động, Phiêu lưu, Khoa học viễn tưởng', 181, 'T13', 'Tiếng Anh', 'Mỹ', 'Anthony Russo, Joe Russo', 'now_showing', NOW(), NOW(), NOW()),
(2, 'Spider-Man: No Way Home', 'spider-man-no-way-home', 'Peter Parker tìm đến Doctor Strange để xóa ký ức mọi người về việc anh là Spider-Man, nhưng phép thuật đi sai hướng và mở ra đa vũ trụ.', 'Hành động, Phiêu lưu', 148, 'T13', 'Tiếng Anh', 'Mỹ', 'Jon Watts', 'now_showing', NOW(), NOW(), NOW()),
(3, 'The Batman', 'the-batman', 'Batman khám phá ra sự tham nhũng ở Gotham City kết nối với gia đình của chính anh ta trong khi đối mặt với một kẻ giết người hàng loạt được gọi là Riddler.', 'Hành động, Tội phạm', 176, 'T16', 'Tiếng Anh', 'Mỹ', 'Matt Reeves', 'now_showing', NOW(), NOW(), NOW());

-- Showtimes (Suất chiếu mẫu)
INSERT INTO `showtimes` (`movie_id`, `screen_id`, `start_time`, `end_time`, `language`, `subtitle`, `status`) VALUES
(1, 1, DATE_ADD(CURDATE(), INTERVAL 10 HOUR), DATE_ADD(CURDATE(), INTERVAL 13 HOUR), 'Tiếng Anh', 'Phụ đề Việt', 'selling'),
(1, 1, DATE_ADD(CURDATE(), INTERVAL 14 HOUR), DATE_ADD(CURDATE(), INTERVAL 17 HOUR), 'Tiếng Anh', 'Phụ đề Việt', 'selling'),
(1, 1, DATE_ADD(CURDATE(), INTERVAL 19 HOUR), DATE_ADD(CURDATE(), INTERVAL 22 HOUR), 'Tiếng Anh', 'Phụ đề Việt', 'selling'),
(2, 2, DATE_ADD(CURDATE(), INTERVAL 9 HOUR), DATE_ADD(CURDATE(), INTERVAL 12 HOUR), 'Tiếng Anh', 'Phụ đề Việt', 'selling'),
(2, 2, DATE_ADD(CURDATE(), INTERVAL 15 HOUR), DATE_ADD(CURDATE(), INTERVAL 18 HOUR), 'Tiếng Anh', 'Phụ đề Việt', 'selling'),
(3, 3, DATE_ADD(CURDATE(), INTERVAL 11 HOUR), DATE_ADD(CURDATE(), INTERVAL 14 HOUR), 'Tiếng Anh', 'Phụ đề Việt', 'selling'),
(3, 3, DATE_ADD(CURDATE(), INTERVAL 20 HOUR), DATE_ADD(CURDATE(), INTERVAL 23 HOUR), 'Tiếng Anh', 'Phụ đề Việt', 'selling'),
-- Ngày mai
(1, 1, DATE_ADD(DATE_ADD(CURDATE(), INTERVAL 1 DAY), INTERVAL 10 HOUR), DATE_ADD(DATE_ADD(CURDATE(), INTERVAL 1 DAY), INTERVAL 13 HOUR), 'Tiếng Anh', 'Phụ đề Việt', 'selling'),
(2, 2, DATE_ADD(DATE_ADD(CURDATE(), INTERVAL 1 DAY), INTERVAL 14 HOUR), DATE_ADD(DATE_ADD(CURDATE(), INTERVAL 1 DAY), INTERVAL 17 HOUR), 'Tiếng Anh', 'Phụ đề Việt', 'selling'),
(3, 3, DATE_ADD(DATE_ADD(CURDATE(), INTERVAL 1 DAY), INTERVAL 19 HOUR), DATE_ADD(DATE_ADD(CURDATE(), INTERVAL 1 DAY), INTERVAL 22 HOUR), 'Tiếng Anh', 'Phụ đề Việt', 'selling');

-- Concessions (Bắp nước)
INSERT INTO `concessions` (`name`, `description`, `price`, `type`) VALUES
('Combo 1', 'Bắp lớn + 2 nước lớn', 89000, 'combo'),
('Combo 2', 'Bắp vừa + 1 nước lớn', 69000, 'combo'),
('Bắp rang bơ lớn', 'Bắp rang bơ size lớn', 45000, 'popcorn'),
('Bắp rang bơ vừa', 'Bắp rang bơ size vừa', 35000, 'popcorn'),
('Coca Cola lớn', 'Coca Cola size lớn', 25000, 'drink'),
('Pepsi lớn', 'Pepsi size lớn', 25000, 'drink');

-- Kiểm tra
SELECT 'Database reset thành công!' as Status;
SELECT 'Roles' as `Table`, COUNT(*) as `Count` FROM roles
UNION ALL SELECT 'Users', COUNT(*) FROM users
UNION ALL SELECT 'Branches', COUNT(*) FROM branches
UNION ALL SELECT 'Screens', COUNT(*) FROM screens
UNION ALL SELECT 'Seats', COUNT(*) FROM seats
UNION ALL SELECT 'Movies', COUNT(*) FROM movies
UNION ALL SELECT 'Showtimes', COUNT(*) FROM showtimes
UNION ALL SELECT 'Ticket Prices', COUNT(*) FROM ticket_prices
UNION ALL SELECT 'Concessions', COUNT(*) FROM concessions;
