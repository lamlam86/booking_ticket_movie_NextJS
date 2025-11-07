import Link from "next/link";
import MobileMenu from "./MobileMenu";

export default function Header() {
  return (
    <header className="header">
      <div className="header__container">
        <nav className="header__navbar">
          {/* Logo */}
          <Link href="/" className="header__logo" aria-label="Trang chủ">
            <img src="/assets/images/logo.png" alt="Cinemas" />
          </Link>

          {/* CTA: Giữ chất xanh team bạn + icon ảnh */}
          <div className="header__cta">
            <Link href="/movie" className="btn-cta btn-cta--solid">
              <img
                src="/assets/images/ic-ticket.svg"
                alt=""
                className="icon-20 icon-on-solid"
              />
              <span>ĐẶT VÉ NGAY</span>
            </Link>

            <Link href="/popcorn-drink" className="btn-cta btn-cta--ghost">
              <img
                src="/assets/images/ic-popcorn.svg"  /* nếu chưa có, tạm dùng /assets/images/ct-2.svg */
                alt=""
                className="icon-20 icon-on-ghost"
              />
              <span>ĐẶT BẮP NƯỚC</span>
            </Link>
          </div>

          {/* Right cluster: Mobile menu + Search + Auth */}
          <div className="header__right">
            {/* Đặt menu ngoài form để khỏi đè lên input */}
            <MobileMenu />

            {/* Search pill */}
            <form className="header__search" action="/search">
              <input
                name="q"
                placeholder="Tìm phim, rạp"
                className="header__search-input"
                aria-label="Tìm phim, rạp"
              />
              <button className="header__search-btn" type="submit" aria-label="Tìm kiếm">
                <img
                  src="/assets/images/search_icon.svg"
                  alt=""
                  className="icon-18 icon-dark"
                />
              </button>
            </form>

            {/* Auth */}
            <ul className="header__navbar-list">
              <li className="header__navbar-item">
                <a className="header__navbar-item-link btn-login-nav" href="/login">Login</a>
              </li>
              <li className="header__navbar-item">
                <a className="header__navbar-item-link" href="/signup">Register</a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
}
