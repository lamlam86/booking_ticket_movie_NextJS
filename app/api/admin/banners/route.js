import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = 'force-dynamic';

// GET - Lấy danh sách banner
export async function GET() {
  try {
    const user = await getCurrentUser();
    const isAdminOrStaff = user?.roles?.includes("admin") || user?.roles?.includes("staff");
    if (!user || !isAdminOrStaff) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const banners = await prisma.banners.findMany({
      orderBy: { position: "asc" }
    });

    return NextResponse.json({
      data: banners.map(b => ({
        id: b.id,
        title: b.title,
        imageUrl: b.image_url,
        linkUrl: b.link_url,
        description: b.description,
        position: b.position,
        isActive: b.is_active,
        createdAt: b.created_at
      }))
    });
  } catch (error) {
    console.error("GET /api/admin/banners error:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}

// POST - Tạo banner mới
export async function POST(request) {
  try {
    const user = await getCurrentUser();
    const isAdmin = user?.roles?.includes("admin");
    if (!user || !isAdmin) {
      return NextResponse.json({ error: "Chỉ admin mới có quyền" }, { status: 403 });
    }

    const body = await request.json();
    const { title, image_url, link_url, description, position, is_active } = body;

    if (!title || !image_url) {
      return NextResponse.json({ error: "Thiếu tiêu đề hoặc hình ảnh" }, { status: 400 });
    }

    // Get max position if not provided
    let finalPosition = position;
    if (finalPosition === undefined || finalPosition === null) {
      const maxBanner = await prisma.banners.findFirst({
        orderBy: { position: "desc" }
      });
      finalPosition = (maxBanner?.position || 0) + 1;
    }

    const banner = await prisma.banners.create({
      data: {
        title,
        image_url,
        link_url: link_url || null,
        description: description || null,
        position: finalPosition,
        is_active: is_active !== false
      }
    });

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
    }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/banners error:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
