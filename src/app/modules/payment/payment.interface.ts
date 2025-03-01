import mongoose from 'mongoose';

type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED';

export interface PaymentInterface {
  order_id: mongoose.Types.ObjectId;
  transaction_id?: string;
  amount: number;
  status: PaymentStatus;
  payment_gateway_data?: Record<string, unknown>;
}
