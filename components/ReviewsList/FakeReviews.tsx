export interface Review {
  name: string;
  rating: number;
  comment: string;
  category: string;
}

const categories = [
  'Худі з капюшоном',
  'Базова футболка',
  'Джинсові шорти',
  'Спортивні штани',
  'Куртка',
];

interface PlaceholderComment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

export async function fetchFakeReviews(): Promise<Review[]> {
  const res = await fetch('https://jsonplaceholder.typicode.com/comments?_limit=30');
  if (!res.ok) throw new Error('Failed to fetch fake reviews');

  const data: PlaceholderComment[] = await res.json();

  return data.map((comment) => ({
    name: comment.name,
    rating: Math.floor(Math.random() * 5) + 1,
    comment: comment.body,
    category: categories[Math.floor(Math.random() * categories.length)],
  }));
}
