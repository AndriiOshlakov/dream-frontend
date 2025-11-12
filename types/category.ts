// тип з бекенда
export interface CategoryApiItem {
  _id: {
    $oid: string;
  };
  name: string;
}

// тип з яким працюють компоненти
export interface Category {
  _id: string;
  name: string;
}
export interface CategoriesResponse {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  categories: Category[];
}
