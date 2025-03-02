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
  query = {
    ...query,
    is_deleted: false,
  };

  const queryBuilder = new QueryBuilder(
    Product.find().populate({
      path: 'images',
      select: 'image_url type public_id',
    }),
    query,
  );

  const productsQuery = queryBuilder
    .search(['name', 'description', 'category'])
    .filter()
    .sort()
    .fields()
    .paginate();

  const total = await queryBuilder.getCountQuery();
  const products = await productsQuery.modelQuery;

  return {
    meta: {
      total,
      ...queryBuilder.getPaginationInfo(),
    },
    data: products,
  };
};

const ProductService = { CreateMultipleProduct, CreateProduct, GetAllProducts };

export default ProductService;
