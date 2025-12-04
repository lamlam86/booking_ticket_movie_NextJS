import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { MovieStatus } from '@prisma/client';

type MoviePayload = {
  title?: string;
  status?: MovieStatus;
  poster?: string | null;
  releaseDate?: string | null;
  duration?: number | null;
  rating?: string | null;
  isFeatured?: boolean;
};

const toISODate = (value: Date | null) => (value ? value.toISOString().split('T')[0] : '');

const fetchMovieRecord = async (id: number) =>
  prisma.movies.findUniqueOrThrow({
    where: { id },
    include: {
      _count: {
        select: { showtimes: true },
      },
    },
  });

const mapMovie = async (movie: Awaited<ReturnType<typeof fetchMovieRecord>>) => {
  const soldTickets = await prisma.booking_items.count({
    where: {
      booking: {
        showtime: {
          movie_id: movie.id,
        },
      },
    },
  });

  return {
    id: movie.id,
    title: movie.title,
    poster: movie.poster_url,
    status: movie.status,
    releaseDate: toISODate(movie.release_date),
    duration: movie.duration_minutes ?? 0,
    rating: movie.rating ?? '',
    isFeatured: movie.is_featured,
    totalShows: movie._count?.showtimes ?? 0,
    soldTickets,
  };
};

export async function PATCH(_: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    if (Number.isNaN(id)) {
      return NextResponse.json({ error: 'ID không hợp lệ.' }, { status: 400 });
    }

    const body: MoviePayload = await _.json();

    const movie = await prisma.movies.update({
      where: { id },
      data: {
        ...(body.title ? { title: body.title } : {}),
        ...(body.status ? { status: body.status } : {}),
        ...(body.poster !== undefined ? { poster_url: body.poster } : {}),
        ...(body.releaseDate !== undefined ? { release_date: body.releaseDate ? new Date(body.releaseDate) : null } : {}),
        ...(body.duration !== undefined ? { duration_minutes: body.duration } : {}),
        ...(body.rating !== undefined ? { rating: body.rating } : {}),
        ...(body.isFeatured !== undefined ? { is_featured: body.isFeatured } : {}),
      },
      include: {
        _count: {
          select: { showtimes: true },
        },
      },
    });

    const data = await mapMovie(movie);
    return NextResponse.json({ data });
  } catch (error) {
    console.error('PATCH /api/movies/[id] failed', error);
    return NextResponse.json({ error: 'Không thể cập nhật phim.' }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    if (Number.isNaN(id)) {
      return NextResponse.json({ error: 'ID không hợp lệ.' }, { status: 400 });
    }

    await prisma.movies.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/movies/[id] failed', error);
    return NextResponse.json({ error: 'Không thể xóa phim.' }, { status: 500 });
  }
}
