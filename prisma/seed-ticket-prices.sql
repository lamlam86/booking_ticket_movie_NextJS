-- Insert default ticket prices
INSERT IGNORE INTO `ticket_prices` (`screen_type`, `seat_type`, `day_type`, `price`, `is_active`, `updated_at`) VALUES
-- Standard screen
('standard', 'standard', 'weekday', 65000, true, NOW()),
('standard', 'standard', 'weekend', 75000, true, NOW()),
('standard', 'vip', 'weekday', 85000, true, NOW()),
('standard', 'vip', 'weekend', 95000, true, NOW()),
('standard', 'couple', 'weekday', 150000, true, NOW()),
('standard', 'couple', 'weekend', 170000, true, NOW()),

-- VIP screen
('vip', 'standard', 'weekday', 85000, true, NOW()),
('vip', 'standard', 'weekend', 95000, true, NOW()),
('vip', 'vip', 'weekday', 105000, true, NOW()),
('vip', 'vip', 'weekend', 120000, true, NOW()),
('vip', 'couple', 'weekday', 190000, true, NOW()),
('vip', 'couple', 'weekend', 220000, true, NOW()),

-- IMAX screen
('imax', 'standard', 'weekday', 120000, true, NOW()),
('imax', 'standard', 'weekend', 140000, true, NOW()),
('imax', 'vip', 'weekday', 150000, true, NOW()),
('imax', 'vip', 'weekend', 170000, true, NOW()),
('imax', 'couple', 'weekday', 280000, true, NOW()),
('imax', 'couple', 'weekend', 320000, true, NOW()),

-- 4DX screen
('4dx', 'standard', 'weekday', 150000, true, NOW()),
('4dx', 'standard', 'weekend', 180000, true, NOW()),
('4dx', 'vip', 'weekday', 180000, true, NOW()),
('4dx', 'vip', 'weekend', 210000, true, NOW()),
('4dx', 'couple', 'weekday', 280000, true, NOW()),
('4dx', 'couple', 'weekend', 340000, true, NOW()),

-- Premium screen
('premium', 'standard', 'weekday', 100000, true, NOW()),
('premium', 'standard', 'weekend', 120000, true, NOW()),
('premium', 'vip', 'weekday', 130000, true, NOW()),
('premium', 'vip', 'weekend', 150000, true, NOW()),
('premium', 'couple', 'weekday', 230000, true, NOW()),
('premium', 'couple', 'weekend', 270000, true, NOW());
