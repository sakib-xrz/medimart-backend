import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
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
    fields: '-createdAt -updatedAt -is_deleted -__v',
    is_deleted: false,
  };

  const queryBuilder = new QueryBuilder(
    Product.find().populate({
      path: 'images',
      select: 'image_url type -_id',
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

const GetProductById = async (id: string) => {
  const product = await Product.findById(id)
    .populate({
      path: 'images',
      select: 'image_url type -_id',
    })
    .select('-createdAt -updatedAt -is_deleted -__v')
    .lean();

  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
  }

  return product;
};

const ProductService = {
  CreateMultipleProduct,
  CreateProduct,
  GetAllProducts,
  GetProductById,
};

export default ProductService;
