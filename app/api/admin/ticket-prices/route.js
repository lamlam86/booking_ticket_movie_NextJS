import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// GET - Lấy danh sách giá vé
export async function GET() {
  try {
    const user = await getCurrentUser();
    const isAdminOrStaff = user?.roles?.includes("admin") || user?.roles?.includes("staff");
    if (!user || !isAdminOrStaff) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ticketPrices = await prisma.ticket_prices.findMany({
      orderBy: { display_order: "asc" }
    });

    return NextResponse.json({
      data: ticketPrices.map(tp => ({
        id: tp.id,
        name: tp.name,
        code: tp.code,
        description: tp.description,
        ticket_type: tp.ticket_type,
        price_multiplier: Number(tp.price_multiplier),
        is_active: tp.is_active,
        display_order: tp.display_order,
        created_at: tp.created_at,
        updated_at: tp.updated_at
      }))
    });
  } catch (error) {
    console.error("GET /api/admin/ticket-prices error:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}

// POST - Tạo giá vé mới
export async function POST(request) {
  try {
    const user = await getCurrentUser();
    const isAdminOrStaff = user?.roles?.includes("admin") || user?.roles?.includes("staff");
    if (!user || !isAdminOrStaff) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, code, description, ticket_type, price_multiplier, is_active, display_order } = body;

    if (!name || !code) {
      return NextResponse.json({ error: "Tên và mã là bắt buộc" }, { status: 400 });
    }

    // Check if code already exists
    const existing = await prisma.ticket_prices.findUnique({ where: { code } });
    if (existing) {
      return NextResponse.json({ error: "Mã giá vé đã tồn tại" }, { status: 400 });
    }

    const ticketPrice = await prisma.ticket_prices.create({
      data: {
        name,
        code,
        description: description || null,
        ticket_type: ticket_type || "single",
        price_multiplier: price_multiplier || 1,
        is_active: is_active !== undefined ? is_active : true,
        display_order: display_order || 0
      }
    });

    return NextResponse.json({ data: ticketPrice }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/ticket-prices error:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
