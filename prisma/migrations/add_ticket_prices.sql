-- Migration: Add ticket_prices table
-- Run this SQL manually if automatic migration fails

-- Create TicketType enum
-- Note: MySQL doesn't need explicit CREATE TYPE, it's handled in the column definition

-- Create ticket_prices table
CREATE TABLE IF NOT EXISTS `ticket_prices` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(191) NOT NULL,
  `code` VARCHAR(191) NOT NULL,
  `description` VARCHAR(191) NULL,
  `ticket_type` ENUM('single', 'couple') NOT NULL DEFAULT 'single',
  `price_multiplier` DECIMAL(10, 2) NOT NULL DEFAULT 1,
  `is_active` BOOLEAN NOT NULL DEFAULT true,
  `display_order` INT NOT NULL DEFAULT 0,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `ticket_prices_code_key`(`code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Insert default ticket prices
INSERT INTO `ticket_prices` (`name`, `code`, `description`, `ticket_type`, `price_multiplier`, `is_active`, `display_order`, `updated_at`) VALUES
('NGƯỜI LỚN', 'adult', 'Vé người lớn tiêu chuẩn', 'single', 1.00, true, 1, NOW()),
('HSSV-U22-GV', 'student', 'Học sinh, sinh viên, người dưới 22 tuổi, giáo viên (có thẻ)', 'single', 0.90, true, 2, NOW()),
('NGƯỜI CAO TUỔI', 'senior', 'Người từ 60 tuổi trở lên', 'single', 0.80, true, 3, NOW()),
('TRẺ EM', 'child', 'Trẻ em từ 4-12 tuổi', 'single', 0.75, true, 4, NOW()),
('GHẾ ĐÔI - NGƯỜI LỚN', 'couple', 'Ghế đôi cho 2 người lớn', 'couple', 1.80, true, 5, NOW());
