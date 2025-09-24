import Header from "@/components/Header";
import BannerSlider from "@/components/BannerSlider";
import PromoSlider from "@/components/PromoSlider";
import MovieCard from "@/components/MovieCard";
import Footer from "@/components/Footer";

export default function HomePage() {
  const movies = [1, 2, 3, 4, 5, 6].map((n) => ({
    img: `/assets/image/phim${n}.png`,
    title: `Movie Title ${n}`,
  }));

  return (
    <div className="app">
      <Header />

      <main className="container">
        <BannerSlider />

        <h2 className="section-title-Now-Showing">PHIM ĐANG CHIẾU</h2>
        <div className="movies-grid">
          {movies.map((m) => (
            <MovieCard key={m.title} img={m.img} title={m.title} />
          ))}
        </div>

        <h2 className="section-title">KHUYỄN MÃI</h2>
        <PromoSlider />
      </main>

      <Footer />
    </div>
  );
}
