export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-col">
          <img src="/assets/images/logo.png" alt="Cinemas" style={{ height: 40 }} />
          <p>Đặt vé nhanh chóng – trải nghiệm điện ảnh tuyệt vời.</p>
        </div>

        <div className="footer-col">
          <h4>Về chúng tôi</h4>
          <a href="#">Giới thiệu</a>
          <a href="#">Tuyển dụng</a>
          <a href="#">Liên hệ</a>
        </div>

        <div className="footer-col">
          <h4>Hỗ trợ</h4>
          <a href="#">Câu hỏi thường gặp</a>
          <a href="#">Hướng dẫn đặt vé</a>
          <a href="#">Liên hệ chăm sóc khách hàng</a>
        </div>

        <div className="footer-col">
          <h4>Kết nối</h4>
          <div className="footer-social">
            <a href="#">Facebook</a>
            <a href="#">YouTube</a>
            <a href="#">TikTok</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Cinemas. All rights reserved.
      </div>
    </footer>
  );
}
