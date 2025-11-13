import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ message: 'Некоректний email' }, { status: 400 });
    }

    console.log('Новий підписник:', email);

    return NextResponse.json({ message: 'Підписка успішна' }, { status: 201 });
  } catch (error) {
    console.error('Помилка при обробці підписки:', error);
    return NextResponse.json({ message: 'Помилка підписки' }, { status: 500 });
  }
}
