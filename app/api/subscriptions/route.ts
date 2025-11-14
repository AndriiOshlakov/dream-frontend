import { NextRequest, NextResponse } from 'next/server';
import { isAxiosError } from 'axios';
import { api } from '../api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    const response = await api('/subscriptions', { params: { email } });
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
