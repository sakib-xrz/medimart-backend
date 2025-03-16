import { Product } from '../product/product.model';
import { CartInterface } from './cart.interface';

const GetCartProducts = async (payload: CartInterface) => {
  // example payload
  //   [
  //     { id: '67cafd143c440dc4900edfc7', quantity: 1 },
  //     { id: '67cafd143c440dc4900edfc2', quantity: 1 },
  //     { id: '67cafd143c440dc4900edfc4', quantity: 3 },
  //   ];

  const getCartProducts = await Promise.all(
    payload?.products?.map(async (item) => {
      const product = await Product.findById(item.id)
        .select('name price')
        .lean()
        .exec();

      return {
        ...product,
        quantity: item.quantity,
      };
    }),
  );

  console.log(getCartProducts);
};

const CartService = { GetCartProducts };

export default CartService;
