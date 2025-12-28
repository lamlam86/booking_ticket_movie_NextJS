import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

// GET - Lấy thông tin vé theo mã (public - dùng cho QR scan)
export async function GET(request, { params }) {
  try {
    const { code } = await params;

    if (!code) {
      return NextResponse.json({ error: "Thiếu mã vé" }, { status: 400 });
    }

    const booking = await prisma.bookings.findUnique({
      where: { booking_code: code },
      include: {
        user: {
          select: { full_name: true, email: true }
        },
        booking_items: {
          include: { seat: true }
        },
        showtime: {
          include: {
            movie: true,
            screen: {
              include: { branch: true }
            }
          }
        }
      }
    });

    if (!booking) {
      return NextResponse.json({ error: "Không tìm thấy vé" }, { status: 404 });
    }

    return NextResponse.json({
      ticket: {
        booking_code: booking.booking_code,
        movie: booking.showtime.movie.title,
        poster: booking.showtime.movie.poster_url,
        rating: booking.showtime.movie.rating,
        showtime: booking.showtime.start_time,
        branch: booking.showtime.screen.branch.name,
        screen: booking.showtime.screen.name,
        seats: booking.booking_items.map(item => item.seat.seat_code).join(", "),
        total_amount: Number(booking.total_amount),
        payment_status: booking.payment_status,
        status: booking.status,
        customer_name: booking.user?.full_name || null,
        created_at: booking.created_at
      }
    });
  } catch (error) {
    console.error("GET /api/ticket/[code] error:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
