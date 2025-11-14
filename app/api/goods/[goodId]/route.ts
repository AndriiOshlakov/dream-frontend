import { NextResponse } from 'next/server';
import { isAxiosError } from 'axios';
import { api } from '../../api';

interface RequestServerProps {
  params: Promise<{ goodId: string }>;
}

export async function GET({ params }: RequestServerProps) {
  try {
    const { goodId } = await params;
    const response = await api.get(`/goods/${goodId}`);
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
