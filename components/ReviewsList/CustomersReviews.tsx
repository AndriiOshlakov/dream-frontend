export interface ApiFeedback {
  _id: string;
  author: string;
  description: string;
  rate: number;
  category: string;
  productId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Review {
  name: string;
  rating: number;
  comment: string;
  category: string;
}

export async function fetchReviews(): Promise<Review[]> {
  const response = await fetch('https://dream-backend-a69s.onrender.com/api/feedbacks');

  if (!response.ok) {
    throw new Error(`Failed to fetch reviews: ${response.status}`);
  }

  const data: { feedbacks?: ApiFeedback[] } | ApiFeedback[] = await response.json();
  const feedbacks: ApiFeedback[] = Array.isArray(data) ? data : (data.feedbacks ?? []);

  return feedbacks.map((feedback) => ({
    name: feedback.author,
    rating: feedback.rate,
    comment: feedback.description,
    category: feedback.category,
  }));
}
