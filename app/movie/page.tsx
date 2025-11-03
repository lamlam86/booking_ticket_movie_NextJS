import Header from "@/components/Header";
import MovieCard from "@/components/MovieCard";
import Footer from "@/components/Footer";

export default function HomePage() {
    const movies = [1, 2, 3, 4, 5, 6].map(n => ({
        id: String(n), // <-- BẮT BUỘC có id
        title: `Movie Title ${n}`,
        img: `/assets/images/phim${(n % 6) || 6}.png`,
        age: n % 2 ? "13+" : "16+",
    }));

    return (
        <div className="app">
            <Header />

            <main className="container">
                <section className="section">
                    <h2 className="section-heading">PHIM ĐANG CHIẾU</h2>
                    <div className="movies-grid">
                        {movies.map(m => (
                            <MovieCard key={m.title} img={m.img} title={m.title} age={m.age} id={""} />
                        ))}
                    </div>
                </section>

                <section className="section">
                    <h2 className="section-heading">SẮP CHIẾU</h2>
                    <div className="movies-grid">
                        {movies.map(m => (
                            <MovieCard key={`${m.title}-coming`} img={m.img} title={m.title} id={""} />
                        ))}
                    </div>
                </section>

            </main>
            <Footer />
        </div>
    );
}
