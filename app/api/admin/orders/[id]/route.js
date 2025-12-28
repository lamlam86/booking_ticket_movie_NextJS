import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = 'force-dynamic';

// PATCH - Cập nhật đơn hàng
export async function PATCH(request, { params }) {
  try {
    const user = await getCurrentUser();
    const isAdminOrStaff = user?.roles?.includes("admin") || user?.roles?.includes("staff");
    if (!user || !isAdminOrStaff) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { payment_status, status, payment_method, notes } = body;

    // Build update data
    const updateData = {};
    if (payment_status) updateData.payment_status = payment_status;
    if (status) updateData.status = status;
    if (payment_method) updateData.payment_method = payment_method;
    if (notes !== undefined) updateData.notes = notes;

    const booking = await prisma.bookings.update({
      where: { id: BigInt(id) },
      data: updateData
    });

    return NextResponse.json({ 
      success: true,
      data: { 
        id: Number(booking.id), 
        payment_status: booking.payment_status, 
        status: booking.status,
        payment_method: booking.payment_method
      },
      message: "Cập nhật đơn hàng thành công!"
    });
  } catch (error) {
    console.error("PATCH /api/admin/orders/[id] error:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}

// DELETE - Xóa đơn hàng (chỉ admin)
export async function DELETE(request, { params }) {
  try {
    const user = await getCurrentUser();
    if (!user?.roles?.includes("admin")) {
      return NextResponse.json({ error: "Chỉ admin mới có quyền xóa đơn hàng" }, { status: 403 });
    }

    const { id } = await params;

    // Delete related items first
    await prisma.booking_concessions.deleteMany({ where: { booking_id: BigInt(id) } });
    await prisma.booking_items.deleteMany({ where: { booking_id: BigInt(id) } });
    
    // Delete booking
    await prisma.bookings.delete({ where: { id: BigInt(id) } });

    return NextResponse.json({ success: true, message: "Đã xóa đơn hàng!" });
  } catch (error) {
    console.error("DELETE /api/admin/orders/[id] error:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}


