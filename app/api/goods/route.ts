import { NextRequest, NextResponse } from 'next/server';
import { isAxiosError } from 'axios';
import { api } from '../api';

export async function GET(request: NextRequest) {
  try {
    const category = request.nextUrl.searchParams.get('category') ?? undefined;
    const priceMin = Number(request.nextUrl.searchParams.get('priceMin') ?? 1);
    const priceMax = Number(request.nextUrl.searchParams.get('priceMax') ?? 3000);
    const page = Number(request.nextUrl.searchParams.get('page') ?? 1);
    const perPage = Number(request.nextUrl.searchParams.get('perPage') ?? 6);
    const gender = request.nextUrl.searchParams.get('gender') ?? undefined;
    const size = request.nextUrl.searchParams.get('size') ?? undefined;
    const response = await api.get('/goods', {
      params: { category, priceMin, priceMax, page, perPage, gender, size },
    });
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    if (isAxiosError(error)) {
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status: error.status }
      );
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
