export interface Category {
  _id: string;
  name: string;
  img?: string;
}
export interface CategoriesResponse {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  categories: Category[];
}
