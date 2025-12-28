import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Lấy danh sách giá vé (public API)
export async function GET() {
  try {
    const ticketPrices = await prisma.ticket_prices.findMany({
      where: { is_active: true },
      orderBy: { display_order: "asc" }
    });

    return NextResponse.json({
      data: ticketPrices.map(tp => ({
        id: tp.code,
        name: tp.name,
        type: tp.ticket_type === "couple" ? "ĐÔI" : "ĐƠN",
        priceMultiplier: Number(tp.price_multiplier),
        description: tp.description
      }))
    });
  } catch (error) {
    console.error("GET /api/ticket-prices error:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
