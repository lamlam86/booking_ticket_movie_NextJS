import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

// GET - Lấy danh sách banner đang hoạt động (cho người dùng)
export async function GET() {
  try {
    const banners = await prisma.banners.findMany({
      where: { is_active: true },
      orderBy: { position: "asc" }
    });

    return NextResponse.json({
      banners: banners.map(b => ({
        id: b.id,
        title: b.title,
        imageUrl: b.image_url,
        linkUrl: b.link_url,
        description: b.description
      }))
    });
  } catch (error) {
    console.error("GET /api/banners error:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
