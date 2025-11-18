export interface OrderGoodsItem {
  productId: string;
  title: string;
  quantity: number;
  price: number;
  total: number;
}

export type OrderStatus = "pending" | "completed" | "cancelled" | "processing" | "packing";

export interface Order {
  _id: string;
  userId: string;
  goods: OrderGoodsItem[];
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}
