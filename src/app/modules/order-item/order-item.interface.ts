import mongoose from 'mongoose';

export interface OrderItemInterface {
  order_id: mongoose.Types.ObjectId;
  product_id: mongoose.Types.ObjectId;
  product_name: string;
  product_price: number;
  quantity: number;
  discount: number;
  discount_type: 'PERCENTAGE' | 'FLAT';
}
