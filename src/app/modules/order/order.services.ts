import mongoose from 'mongoose';
import { JwtPayload } from 'jsonwebtoken';
import { OrderInterface } from './order.interface';
import { User } from '../user/user.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { Product } from '../product/product.model';
import { uploadToCloudinary } from '../../utils/handelFile';
import { Readable } from 'stream';
import OrderUtils from './order.utils';
import { Order } from './order.model';
import { Payment } from '../payment/payment.model';

interface FileInterface {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
  stream: Readable;
  destination: string;
  filename: string;
  path: string;
}

interface OrderItem {
  product_id: string;
  quantity: number;
}

const CreateOrder = async (
  payload: Partial<OrderInterface>,
  file: FileInterface | undefined,
  user: JwtPayload,
) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const {
      products,
      customer_name,
      customer_email,
      customer_phone,
      address,
      city,
      postal_code,
      notes,
      payment_method,
    } = payload;

    // Parse order items from the products JSON string.
    const orderItems: OrderItem[] = JSON.parse(products as string);

    // Find and validate the user within the transaction session.
    const requestedUser = await User.findOne({
      email: user.email,
      status: 'ACTIVE',
      is_deleted: false,
    }).session(session);
    if (!requestedUser) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'User not found');
    }

    // Get product IDs from order items.
    const productIds = orderItems.map((item) => item.product_id);

    // Retrieve the products in session.
    const requestedProducts = await Product.find({
      _id: { $in: productIds },
      is_deleted: false,
    }).session(session);
    if (requestedProducts.length !== productIds.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Product not found');
    }

    // Generate order ID up front so it can be reused.
    const order_id = OrderUtils.generateOrderId();

    // Check if any product requires a prescription.
    const isPrescriptionRequired = requestedProducts.some(
      (product) => product.requires_prescription,
    );
    let prescription: string | undefined;
    if (isPrescriptionRequired) {
      if (!file) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Prescription required');
      }
      const { secure_url } = (await uploadToCloudinary(file, {
        public_id: order_id,
        folder: 'medimart/prescriptions',
      })) as { secure_url: string };
      prescription = secure_url;
    }

    let subtotal = 0;
    // Prepare order products and the corresponding stock updates in one loop.
    const stockUpdates: { productId: string; newStock: number }[] = [];
    const orderProducts = requestedProducts.map((product) => {
      const orderItem = orderItems.find(
        (item) => item.product_id === product._id.toString(),
      );
      if (!orderItem || product.stock < orderItem.quantity) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Product out of stock');
      }
      const finalPrice = OrderUtils.calculateDiscountedPrice(
        product.price,
        product.discount,
        product.discount_type,
      );
      subtotal += finalPrice * orderItem.quantity;
      stockUpdates.push({
        productId: product._id.toString(),
        newStock: product.stock - orderItem.quantity,
      });
      return {
        product_id: product._id,
        name: product.name,
        price: product.price,
        dosage: product.dosage,
        discount: product.discount,
        discount_type: product.discount_type,
        quantity: orderItem.quantity,
        requires_prescription: product.requires_prescription,
      };
    });

    // Compute delivery charge and grand total.
    const delivery_charge = subtotal > 1000 ? 0 : 50;
    const grand_total = subtotal + delivery_charge;
    const transaction_id = OrderUtils.generateTransactionId();

    // Create the order within the session.
    const orderDocs = await Order.create(
      [
        {
          order_id,
          customer_id: requestedUser._id,
          products: orderProducts,
          customer_name,
          customer_email,
          customer_phone,
          address,
          city,
          postal_code,
          notes,
          payment_method,
          prescription,
          subtotal,
          delivery_charge,
          grand_total,
          transaction_id,
        },
      ],
      { session },
    );
    const order = orderDocs[0];

    // Update product stock concurrently using the session.
    await Promise.all(
      stockUpdates.map(({ productId, newStock }) =>
        Product.updateOne(
          { _id: productId },
          {
            stock: newStock,
            in_stock: newStock > 0,
          },
          { session },
        ),
      ),
    );

    // Create the payment record within the session.
    await Payment.create(
      [
        {
          order_id: order._id,
          amount: grand_total,
          transaction_id,
        },
      ],
      { session },
    );

    await session.commitTransaction();
    session.endSession();
    return order;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const OrderService = { CreateOrder };

export default OrderService;
