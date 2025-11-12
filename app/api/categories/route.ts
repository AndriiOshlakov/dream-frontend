import { NextRequest, NextResponse } from 'next/server';
import { api, ApiError } from '../api';

export async function GET(request: NextRequest) {
  try {
    const page = Number(request.nextUrl.searchParams.get('page') ?? 1);
    const res = await api.get('/categories', { params: { page } });
    return NextResponse.json(res.data);
  } catch (err) {
    const error = err as ApiError;
    return NextResponse.json(
      { error: error.response?.data.error || error.message },
      { status: error.status }
    );
  }
}
