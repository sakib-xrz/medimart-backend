/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { Order } from '../order/order.model';
import config from '../../config';
import { Payment } from './payment.model';
import SSLCommerzPayment from 'sslcommerz-lts';
import PaymentUtils from './payment.utils';

const store_id = config.ssl.store_id;
const store_passwd = config.ssl.store_pass;
const is_live = false;

const CreatePaymentIntent = async (order_id: string) => {
  const order = await Order.findById(order_id);
  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, 'Order not found');
  }

  const payment = await Payment.findOne({
    order_id,
  });

  if (!payment) {
    throw new Error('Payment info not found');
  }

  if (payment.status === 'SUCCESS') {
    throw new AppError(httpStatus.BAD_REQUEST, 'Payment already completed');
  }

  const data = {
    total_amount: payment.amount,
    currency: 'BDT',
    tran_id: payment.transaction_id,
    success_url: `${config.backend_base_url}/payment/ipn_listener`,
    fail_url: `${config.backend_base_url}/payment/ipn_listener`,
    cancel_url: `${config.backend_base_url}/payment/ipn_listener`,
    ipn_url: `${config.backend_base_url}/payment/ipn_listener`,
    shipping_method: 'N/A',
    product_name: 'Medimart Order Payment',
    product_category: 'N/A',
    product_profile: 'N/A',
    cus_name: order.customer_name,
    cus_email: order.customer_email,
    cus_add1: order.address,
    cus_add2: 'N/A',
    cus_city: order.city,
    cus_state: 'N/A',
    cus_postcode: order.postal_code,
    cus_country: 'Bangladesh',
    cus_phone: order.customer_phone,
    cus_fax: 'N/A',
    ship_name: order.customer_name,
    ship_add1: order.address,
    ship_add2: 'N/A',
    ship_city: order.city,
    ship_state: 'N/A',
    ship_postcode: order.postal_code,
    ship_country: 'Bangladesh',
  };

  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
  const sslResponse = await sslcz.init(data);

  return sslResponse.GatewayPageURL;
};

const VerifyPayment = async (payload) => {
  const order = await Order.findOne({
    transaction_id: payload.tran_id,
  });

  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, 'Order not found');
  }

  if (!payload.val_id || payload.status !== 'VALID') {
    if (payload.status === 'FAILED') {
      await PaymentUtils.updatePaymentAndOrderStatus(payload.tran_id, 'FAILED');
      return `${config.frontend_base_url}/${config.payment.fail_url}?order_id=${order._id}`;
    }

    if (payload.status === 'CANCELLED') {
      await PaymentUtils.updatePaymentAndOrderStatus(
        payload.tran_id,
        'CANCELLED',
      );
      return `${config.frontend_base_url}/${config.payment.cancel_url}?order_id=${order._id}`;
    }

    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid IPN request');
  }

  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);

  const response = await sslcz.validate({
    val_id: payload.val_id,
  });

  if (response.status !== 'VALID' && response.status !== 'VALIDATED') {
    await PaymentUtils.updatePaymentAndOrderStatus(
      response.tran_id,
      'FAILED',
      'FAILED',
    );
    return `${config.frontend_base_url}/${config.payment.fail_url}?order_id=${order._id}`;
  }

  await PaymentUtils.updatePaymentAndOrderStatus(
    response.tran_id,
    'PAID',
    response,
  );

  return `${config.frontend_base_url}/${config.payment.success_url}`;
};

const PaymentService = { CreatePaymentIntent, VerifyPayment };

export default PaymentService;
