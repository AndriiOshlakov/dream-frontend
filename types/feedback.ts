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
