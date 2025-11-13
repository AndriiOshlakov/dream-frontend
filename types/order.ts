export interface OrderGoodsItem {
  productId: string;
  title: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Order {
  _id: string;
  userId: string;
  goods: OrderGoodsItem[];
  status: string;
  createdAt: string;
  updatedAt: string;
}
