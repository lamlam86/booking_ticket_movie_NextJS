import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type MovieStatus = 'now_showing' | 'coming_soon' | 'draft';

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
        select: {
          showtimes: true,
        },
      },
    },
  });

async function mapMovie(movie: Awaited<ReturnType<typeof fetchMovieRecord>>) {
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
    status: movie.status as MovieStatus,
    releaseDate: toISODate(movie.release_date),
    duration: movie.duration_minutes ?? 0,
    rating: movie.rating ?? '',
    isFeatured: movie.is_featured,
    totalShows: movie._count?.showtimes ?? 0,
    soldTickets,
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');
  const status = searchParams.get('status');

  const movies = await prisma.movies.findMany({
    where: {
      ...(q
        ? {
            title: {
              contains: q,
              mode: 'insensitive',
            },
          }
        : {}),
      ...(status && status !== 'all'
        ? {
            status: status as MovieStatus,
          }
        : {}),
    },
    orderBy: {
      created_at: 'desc',
    },
    include: {
      _count: {
        select: { showtimes: true },
      },
    },
  });

  const data = await Promise.all(movies.map(mapMovie));

  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  try {
    const body: MoviePayload = await request.json();

    if (!body.title || !body.status) {
      return NextResponse.json({ error: 'Thiếu tiêu đề hoặc trạng thái.' }, { status: 400 });
    }

    const movie = await prisma.movies.create({
      data: {
        title: body.title,
        status: body.status,
        poster_url: body.poster ?? null,
        release_date: body.releaseDate ? new Date(body.releaseDate) : null,
        duration_minutes: body.duration ?? null,
        rating: body.rating ?? null,
        is_featured: body.isFeatured ?? false,
      },
      include: {
        _count: {
          select: { showtimes: true },
        },
      },
    });

    const data = await mapMovie(movie);
    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error('POST /api/movies failed', error);
    return NextResponse.json({ error: 'Không thể tạo phim mới.' }, { status: 500 });
  }
}
