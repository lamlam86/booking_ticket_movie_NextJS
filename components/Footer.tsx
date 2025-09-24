export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-info">
          <h3>Cinema Ticketing</h3>
          <p>Trụ sở: 123 Đường ABC, Quận 1, TP. Hồ Chí Minh</p>
          <p>Email: support@cinematicketing.com</p>
          <p>Hotline: 0123 456 789</p>
        </div>

        <div className="footer-links">
          <h4>Liên kết nhanh</h4>
          <a href="#">Về chúng tôi</a>
          <a href="#">Liên hệ</a>
          <a href="#">Chính sách bảo mật</a>
          <a href="#">Điều khoản sử dụng</a>
        </div>

        <div className="footer-social">
          <h4>Kết nối</h4>
          <a href="#">Facebook</a>
          <a href="#">Instagram</a>
          <a href="#">Twitter</a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 Cinema Ticketing. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
