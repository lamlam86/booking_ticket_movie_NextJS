export default function Header() {
  return (
    <header className="header">
      <div className="header__container">
        <nav className="header__navbar">
          <div className="header__logo">
            <img src="/assets/image/logo.png" alt="Logo" />
          </div>

          <div className="header__right">
            <form className="header__search" action="/search">
              <input
                name="q"
                placeholder="Tìm phim . . ."
                className="header__search-input"
              />
              <img
                src="/assets/image/search_icon.svg"
                alt="Search"
                className="header__search-icon"
              />
            </form>

            <ul className="header__navbar-list">
              <li className="header__navbar-item">
                <a className="header__navbar-item-link btn-login-nav" href="/login">
                  Login
                </a>
              </li>
              <li className="header__navbar-item">
                <a className="header__navbar-item-link" href="/signup">
                  Register
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
}
