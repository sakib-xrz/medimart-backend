import mongoose from 'mongoose';

type OrderStatus =
  | 'PLACED'
  | 'CONFIRMED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED';

type PaymentMethod = 'sslcommerz' | 'cash_on_delivery';

type OrderItems = {
  product_id: mongoose.Types.ObjectId;
  name: string;
  dosage?: string;
  quantity: number;
  price: number;
  discount: number;
  discount_type: 'PERCENTAGE' | 'FLAT';
  requires_prescription: boolean;
};

export interface OrderInterface {
  order_id: string;
  customer_id: mongoose.Types.ObjectId;
  products: OrderItems[] | string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  address: string;
  city: string;
  postal_code: string;
  notes?: string;
  payment_method: PaymentMethod;
  prescription?: string;
  order_status: OrderStatus;
  payment_status: PaymentStatus;
  transaction_id?: string;
  subtotal: number;
  delivery_charge: number;
  grand_total: number;
}
