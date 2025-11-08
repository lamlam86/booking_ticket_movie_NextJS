import Link from "next/link";
import MobileMenu from "./MobileMenu";

export default function Header() {
  return (
    <header className="header" role="banner">
      <div className="header__container">
        <nav className="header__navbar" aria-label="Primary">
          {/* Logo: click về home */}
          <Link href="/" className="header__logo" aria-label="Trang chủ">
            <img src="/assets/images/logo.png" alt="Cinemas" />
          </Link>

          {/* CTA: giữ chất xanh, icon đồng bộ */}
          <div className="header__cta" role="group" aria-label="Đặt nhanh">
            <Link href="/movie" className="btn-cta btn-cta--solid">
              <img src="/assets/images/ic-ticket.svg" alt="" className="icon icon-20" aria-hidden="true" />
              <span>ĐẶT VÉ NGAY</span>
            </Link>

            <Link href="/popcorn-drink" className="btn-cta btn-cta--solid">
              <img src="/assets/images/ic-cor.svg" alt="" className="icon icon-20" aria-hidden="true" />
              <span>ĐẶT BẮP NƯỚC</span>
            </Link>
          </div>

          {/* Cụm bên phải: menu mobile + search + auth */}
          <div className="header__right">
            <MobileMenu />

            {/* Search: GET /search?q=... */}
            <form className="header__search" action="/search" method="GET" role="search">
              <input
                type="search"
                name="q"
                placeholder="Tìm phim, rạp"
                className="header__search-input"
                aria-label="Tìm phim, rạp"
                autoComplete="off"
              />
              <button className="header__search-btn" type="submit" aria-label="Tìm kiếm">
                <img src="/assets/images/search_icon.svg" alt="" className="icon icon-18" aria-hidden="true" />
              </button>
            </form>

            {/* Auth */}
            <ul className="header__navbar-list" role="menubar" aria-label="Tài khoản">
              <li className="header__navbar-item" role="none">
                <Link className="btn-cta btn-cta--solid" href="/login" role="menuitem">
                  Đăng nhập
                </Link>
              </li>
              <li className="header__navbar-item" role="none">
                <Link className="btn-cta btn-cta--solid" href="/signup" role="menuitem">
                  Đăng ký
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      {/* ===== Sub-nav: dải mục xanh đồng bộ ngay dưới header ===== */}
      <div className="header__subnav" role="navigation" aria-label="Danh mục phụ">
        <div className="header__container header__subnav-inner">
          <ul className="header__subnav-list">
            <li><Link href="/he-thong-rap" className="header__subnav-link">Chọn rạp</Link></li>
            <li><Link href="/lich-chieu" className="header__subnav-link">Lịch chiếu</Link></li>
            <li><Link href="/chuong-trinh-khuyen-mai" className="header__subnav-link">Khuyến mãi</Link></li>
            <li><Link href="/to-chuc-su-kien" className="header__subnav-link">Tổ chức sự kiện</Link></li>
            <li><Link href="/dich-vu-giai-tri" className="header__subnav-link">Dịch vụ giải trí khác</Link></li>
            <li><Link href="/gioi-thieu" className="header__subnav-link">Giới thiệu</Link></li>
          </ul>
        </div>
      </div>
    </header>
  );
}
