import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = 'force-dynamic';

// GET - Lấy chi tiết banner
export async function GET(request, { params }) {
  try {
    const user = await getCurrentUser();
    const isAdminOrStaff = user?.roles?.includes("admin") || user?.roles?.includes("staff");
    if (!user || !isAdminOrStaff) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const banner = await prisma.banners.findUnique({
      where: { id: Number(id) }
    });

    if (!banner) {
      return NextResponse.json({ error: "Banner không tồn tại" }, { status: 404 });
    }

    return NextResponse.json({
      data: {
        id: banner.id,
        title: banner.title,
        imageUrl: banner.image_url,
        linkUrl: banner.link_url,
        description: banner.description,
        position: banner.position,
        isActive: banner.is_active
      }
    });
  } catch (error) {
    console.error("GET /api/admin/banners/[id] error:", error);
    return NextResponse.json({ error: error.message || "Lỗi server" }, { status: 500 });
  }
}

// PATCH - Cập nhật banner
export async function PATCH(request, { params }) {
  try {
    const user = await getCurrentUser();
    const isAdminOrStaff = user?.roles?.includes("admin") || user?.roles?.includes("staff");
    if (!user || !isAdminOrStaff) {
      return NextResponse.json({ error: "Không có quyền truy cập" }, { status: 403 });
    }

    const { id } = await params;
    const bannerId = Number(id);
    
    if (isNaN(bannerId)) {
      return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });
    }

    const body = await request.json();
    const { title, image_url, link_url, description, position, is_active } = body;

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (image_url !== undefined) updateData.image_url = image_url;
    if (link_url !== undefined) updateData.link_url = link_url;
    if (description !== undefined) updateData.description = description;
    if (position !== undefined) updateData.position = Number(position);
    if (is_active !== undefined) updateData.is_active = is_active;

    // Check if banner exists first
    const existing = await prisma.banners.findUnique({
      where: { id: bannerId }
    });

    if (!existing) {
      return NextResponse.json({ error: "Banner không tồn tại" }, { status: 404 });
    }

    const banner = await prisma.banners.update({
      where: { id: bannerId },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      data: {
        id: banner.id,
        title: banner.title,
        imageUrl: banner.image_url,
        linkUrl: banner.link_url,
        description: banner.description,
        position: banner.position,
        isActive: banner.is_active
      }
    });
  } catch (error) {
    console.error("PATCH /api/admin/banners/[id] error:", error);
    return NextResponse.json({ error: error.message || "Lỗi cập nhật banner" }, { status: 500 });
  }
}

// DELETE - Xóa banner
export async function DELETE(request, { params }) {
  try {
    const user = await getCurrentUser();
    const isAdminOrStaff = user?.roles?.includes("admin") || user?.roles?.includes("staff");
    if (!user || !isAdminOrStaff) {
      return NextResponse.json({ error: "Không có quyền xóa" }, { status: 403 });
    }

    const { id } = await params;
    const bannerId = Number(id);

    if (isNaN(bannerId)) {
      return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });
    }

    // Check if banner exists
    const existing = await prisma.banners.findUnique({
      where: { id: bannerId }
    });

    if (!existing) {
      return NextResponse.json({ success: true, message: "Banner đã được xóa" });
    }

    await prisma.banners.delete({
      where: { id: bannerId }
    });

    return NextResponse.json({ success: true, message: "Xóa banner thành công" });
  } catch (error) {
    console.error("DELETE /api/admin/banners/[id] error:", error);
    return NextResponse.json({ error: error.message || "Lỗi xóa banner" }, { status: 500 });
  }
}
