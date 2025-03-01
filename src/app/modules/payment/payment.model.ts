import mongoose from 'mongoose';
import { PaymentInterface } from './payment.interface';
import PaymentConstants from './payment.constant';

const PaymentSchema = new mongoose.Schema<PaymentInterface>(
  {
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    transaction_id: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: PaymentConstants.Status,
      default: 'PENDING',
    },
    payment_gateway_data: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
    },
  },
);

export const Payment = mongoose.model<PaymentInterface>(
  'Payment',
  PaymentSchema,
);
