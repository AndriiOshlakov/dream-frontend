import axios from 'axios';

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
  const response = await axios.get<ApiFeedback[]>(
    'https://dream-backend-a69s.onrender.com/api/feedbacks'
  );

  const feedbacks = response.data;

  return feedbacks.map((feedback) => ({
    name: feedback.author,
    rating: feedback.rate,
    comment: feedback.description,
    category: feedback.category,
  }));
}
