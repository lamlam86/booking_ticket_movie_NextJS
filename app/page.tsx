import Header from "@/components/Header";
import BannerSlider from "@/components/BannerSlider";
import PromoSlider from "@/components/PromoSlider";
import MovieCard from "@/components/MovieCard";
import Footer from "@/components/Footer";
import BenefitsStrip from "@/components/BenefitsStrip";

export default function HomePage() {
  const movies = [1, 2, 3, 4, 5, 6].map(n => ({
    img: `/assets/images/phim${n}.png`,
    title: `Movie Title ${n}`,
    age: n % 2 ? "13+" : "16+",
  }));

  return (
    <div className="app">
      <Header />

      <main className="container">
        <BannerSlider />
        <BenefitsStrip />   {/* NEW */}

        <section className="section">
          <h2 className="section-heading">PHIM ĐANG CHIẾU</h2>
          <div className="movies-grid">
            {movies.map(m => (
              <MovieCard key={m.title} img={m.img} title={m.title} age={m.age} id={""} />
            ))}
          </div>
        </section>

        <section className="section">
          <h2 className="section-heading">KHUYỄN MÃI</h2>
          <PromoSlider />
        </section>

        <section className="section">
          <h2 className="section-heading">SẮP CHIẾU</h2>
          <div className="movies-grid">
            {movies.map(m => (
              <MovieCard key={`${m.title}-coming`} img={m.img} title={m.title} id={""} />
            ))}
          </div>
        </section>

        <section className="section">
          <h2 className="section-heading">HỆ THỐNG RẠP CINESTAR</h2>
          <div className="movies-grid">
            {[1, 2, 3, 4, 5, 6].map(n => (
              <div key={n} className="movie-card">
                <div className="movie-card__poster">
                  <img src="/assets/images/logo.png" alt="Rạp" />
                </div>
                <h3 className="movie-card__title">Cinestar #{n}</h3>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
