import mongoose from 'mongoose';

type OrderStatus =
  | 'PLACED'
  | 'CONFIRMED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED';

type ShippingCity = 'INSIDE_DHAKA' | 'OUTSIDE_DHAKA';

export interface OrderInterface {
  order_id: string;
  user_id: mongoose.Types.ObjectId;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  shipping_city: ShippingCity;
  order_status: OrderStatus;
  payment_status: PaymentStatus;
  transaction_id?: string;
  subtotal: number;
  delivery_charge: number;
  grand_total: number;
}
