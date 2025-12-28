-- =============================================
-- THÊM BẢNG BANNERS VÀ DỮ LIỆU MẪU
-- =============================================

-- Tạo bảng banners nếu chưa tồn tại
CREATE TABLE IF NOT EXISTS `banners` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(191) NOT NULL,
  `image_url` VARCHAR(500) NOT NULL,
  `link_url` VARCHAR(500) NULL,
  `description` VARCHAR(500) NULL,
  `position` INT NOT NULL DEFAULT 0,
  `is_active` BOOLEAN NOT NULL DEFAULT true,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Xóa dữ liệu cũ (nếu có)
DELETE FROM `banners`;

-- Thêm dữ liệu mẫu
INSERT INTO `banners` (`title`, `image_url`, `link_url`, `description`, `position`, `is_active`) VALUES
('Khuyến mãi U22', 'https://www.cgv.vn/media/banner/cache/1/b58515f018eb873dafa430b6f9ae0c1e/9/8/980x448_u22_1_.jpg', '/chuong-trinh-khuyen-mai', 'Ưu đãi đặc biệt dành cho sinh viên U22', 1, true),
('Combo Bắp Nước', 'https://www.cgv.vn/media/banner/cache/1/b58515f018eb873dafa430b6f9ae0c1e/c/o/combo_2nguoi_980x448.jpg', '/popcorn-drink', 'Combo tiết kiệm cho 2 người', 2, true),
('Phim Hot', 'https://www.cgv.vn/media/banner/cache/1/b58515f018eb873dafa430b6f9ae0c1e/h/o/home_-_main_banner_-_980wx448h_28_.jpg', '/movie', 'Xem ngay các phim hot nhất', 3, true);

-- Kiểm tra
SELECT '✅ Thêm bảng banners thành công!' as Status;
SELECT * FROM banners ORDER BY position;
