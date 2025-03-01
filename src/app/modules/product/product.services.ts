import { ProductInterface } from './product.interface';
import { Product } from './product.model';

const CreateMultipleProduct = async (productsData: ProductInterface[]) => {
  const products = await Product.insertMany(productsData);
  return products;
};

const CreateProduct = async (productData: ProductInterface) => {
  const product = new Product(productData);
  await product.save();
  return product.toObject();
};

const ProductService = { CreateMultipleProduct, CreateProduct };

export default ProductService;
