import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// GET - Lấy thông tin giá vé theo ID
export async function GET(request, { params }) {
  try {
    const user = await getCurrentUser();
    const isAdminOrStaff = user?.roles?.includes("admin") || user?.roles?.includes("staff");
    if (!user || !isAdminOrStaff) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const ticketPrice = await prisma.ticket_prices.findUnique({
      where: { id: parseInt(id) }
    });

    if (!ticketPrice) {
      return NextResponse.json({ error: "Không tìm thấy giá vé" }, { status: 404 });
    }

    return NextResponse.json({
      data: {
        ...ticketPrice,
        price_multiplier: Number(ticketPrice.price_multiplier)
      }
    });
  } catch (error) {
    console.error("GET /api/admin/ticket-prices/[id] error:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}

// PATCH - Cập nhật giá vé
export async function PATCH(request, { params }) {
  try {
    const user = await getCurrentUser();
    const isAdminOrStaff = user?.roles?.includes("admin") || user?.roles?.includes("staff");
    if (!user || !isAdminOrStaff) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, code, description, ticket_type, price_multiplier, is_active, display_order } = body;

    // Check if code already exists for different record
    if (code) {
      const existing = await prisma.ticket_prices.findFirst({
        where: { code, NOT: { id: parseInt(id) } }
      });
      if (existing) {
        return NextResponse.json({ error: "Mã giá vé đã tồn tại" }, { status: 400 });
      }
    }

    const ticketPrice = await prisma.ticket_prices.update({
      where: { id: parseInt(id) },
      data: {
        ...(name && { name }),
        ...(code && { code }),
        ...(description !== undefined && { description }),
        ...(ticket_type && { ticket_type }),
        ...(price_multiplier !== undefined && { price_multiplier }),
        ...(is_active !== undefined && { is_active }),
        ...(display_order !== undefined && { display_order })
      }
    });

    return NextResponse.json({ data: ticketPrice });
  } catch (error) {
    console.error("PATCH /api/admin/ticket-prices/[id] error:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}

// DELETE - Xóa giá vé
export async function DELETE(request, { params }) {
  try {
    const user = await getCurrentUser();
    const isAdmin = user?.roles?.includes("admin");
    if (!user || !isAdmin) {
      return NextResponse.json({ error: "Chỉ admin mới có quyền xóa" }, { status: 403 });
    }

    const { id } = await params;
    await prisma.ticket_prices.delete({ where: { id: parseInt(id) } });

    return NextResponse.json({ message: "Đã xóa giá vé" });
  } catch (error) {
    console.error("DELETE /api/admin/ticket-prices/[id] error:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
