type Props = {
  img: string;
  title: string;
};

export default function MovieCard({ img, title }: Props) {
  return (
    <div className="movie-card">
      <img src={img} alt={title} />
      <h3>{title}</h3>
    </div>
  );
}
