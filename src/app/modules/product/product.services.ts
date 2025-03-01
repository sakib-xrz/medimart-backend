import QueryBuilder from '../../builder/QueryBuilder';
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

const GetAllProducts = async (query: Record<string, unknown>) => {
  const queryBuilder = new QueryBuilder(Product.find(), query);

  const productsQuery = queryBuilder
    .search(['name', 'description', 'category'])
    .filter()
    .sort()
    .fields()
    .paginate();

  const [data, total] = await Promise.all([
    productsQuery.modelQuery.exec(),
    queryBuilder.getCountQuery(),
  ]);

  return {
    meta: {
      total,
      ...queryBuilder.getPaginationInfo(),
    },
    data,
  };
};

const ProductService = { CreateMultipleProduct, CreateProduct, GetAllProducts };

export default ProductService;
