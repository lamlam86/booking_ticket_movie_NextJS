import BookingWizard from "@/components/BookingWizard";

type Props = { params: { id: string } };

export const metadata = {
    title: "Đặt vé | Cinemas",
    description: "Chọn ngày, rạp và giờ chiếu.",
};

export default function BookPage({ params }: Props) {
    const { id } = params;

    // Mock movie info (UI sườn). Sau này thay dữ liệu thật.
    const movie = {
        id,
        title: `Phim ${id}`,
        poster: "/assets/images/phim1.png",
        rating: "C13",
        duration: "122 phút",
        genre: "Hành động",
    };

    return (
        <main className="container" style={{ paddingTop: 120 }}>
            {/* Header phim */}
            <section className="bk-hero">
                <img className="bk-poster" src={movie.poster} alt={movie.title} />
                <div className="bk-info">
                    <h1 className="bk-title">{movie.title}</h1>
                    <div className="bk-pills">
                        <span className="bk-pill">Thời lượng: {movie.duration}</span>
                        <span className="bk-pill">Thể loại: {movie.genre}</span>
                        <span className="bk-pill">Giới hạn: {movie.rating}</span>
                    </div>
                    <p className="bk-sub">Chọn ngày — rạp — giờ chiếu để đặt vé.</p>
                </div>
            </section>

            {/* Wizard chọn ngày/rạp/giờ (client component) */}
            <BookingWizard />
        </main>
    );
}
