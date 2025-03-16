import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { Product } from '../product/product.model';
import { CartInterface } from './cart.interface';
import CartUtils from './cart.utils';

const GetCartProducts = async (payload: CartInterface) => {
  const getCartProducts = await Promise.all(
    payload?.cart_items?.map(async (item) => {
      const product = await Product.findById(item.id)
        .select(
          'name slug price category dosage form description requires_prescription discount discount_type quantity in_stock expiry_date',
        )
        .lean()
        .exec();

      if (!product) {
        throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
      }

      return {
        ...product,
        quantity: item.quantity,
      };
    }),
  );

  let subtotal = 0;
  let prescription_required = false;

  getCartProducts.forEach((product) => {
    const finalPrice = CartUtils.calculateDiscountedPrice(
      product.price,
      product.discount,
      product.discount_type,
    );
    subtotal += finalPrice * product.quantity;

    if (product.requires_prescription) {
      prescription_required = true;
    }
  });

  const shipping_charge = subtotal > 1000 ? 0 : 50;
  const grand_total = subtotal + shipping_charge;

  return {
    products: getCartProducts,
    subtotal,
    shipping_charge,
    grand_total,
    prescription_required,
  };
};

const CartService = { GetCartProducts };

export default CartService;
