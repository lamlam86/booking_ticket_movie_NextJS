import Header from "@/components/Header";
import BannerSlider from "@/components/BannerSlider";
import PromoSlider from "@/components/PromoSlider";
import MovieCard from "@/components/MovieCard";
import Footer from "@/components/Footer";

export default function HomePage() {
  // Mock UI chỉ để dựng giao diện
  const ASSETS = "/assets/images";

  const nowShowing = Array.from({ length: 6 }, (_, i) => {
    const n = i + 1;
    return {
      id: `n-${n}`,                          // ✅ có id để /movie/[id]/book hoạt động
      img: `${ASSETS}/phim${((n - 1) % 6) + 1}.png`,
      title: `Movie Title ${n}`,
      age: n % 2 ? "13+" : "16+",
    };
  });

  const comingSoon = Array.from({ length: 6 }, (_, i) => {
    const n = i + 1;
    return {
      id: `c-${n}`,                          // ✅ id khác nhóm nowShowing
      img: `${ASSETS}/phim${((n - 1) % 6) + 1}.png`,
      title: `Coming Title ${n}`,
    };
  });

  const branches = Array.from({ length: 6 }, (_, i) => ({
    id: `b-${i + 1}`,
    name: `Cinestar #${i + 1}`,
    logo: `${ASSETS}/logo.png`,
  }));

  return (
    <div className="app">
      <Header />

      <main className="container">
        {/* Banner luôn đứng trước theo flow Cinestar */}
        <BannerSlider />

        {/* PHIM ĐANG CHIẾU */}
        <section className="section">
          <h2 className="section-heading">PHIM ĐANG CHIẾU</h2>
          <div className="movies-grid">
            {nowShowing.map(m => (
              <MovieCard key={m.id} id={m.id} img={m.img} title={m.title} age={m.age} />
            ))}
          </div>
        </section>

        {/* KHUYỄN MÃI ở giữa để kích cầu */}
        <section className="section">
          <h2 className="section-heading">KHUYỄN MÃI</h2>
          <PromoSlider />
        </section>

        {/* SẮP CHIẾU */}
        <section className="section">
          <h2 className="section-heading">SẮP CHIẾU</h2>
          <div className="movies-grid">
            {comingSoon.map(m => (
              <MovieCard key={m.id} id={m.id} img={m.img} title={m.title} />
            ))}
          </div>
        </section>

        {/* HỆ THỐNG RẠP – tạm thời dùng logo để giữ layout */}
        <section className="section">
          <h2 className="section-heading">HỆ THỐNG RẠP CINESTAR</h2>
          <div className="movies-grid">
            {branches.map(b => (
              <div key={b.id} className="movie-card">
                <div className="movie-card__poster">
                  <img src={b.logo} alt={b.name} />
                </div>
                <h3 className="movie-card__title">{b.name}</h3>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
