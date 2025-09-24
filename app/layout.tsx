import "./globals.css";

export const metadata = {
  title: "Cinema Ticketing",
  description: "Website đặt vé xem phim",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
