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

  const queryBuilder = new QueryBuilder(Product.find(), query);

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
  const product = await Product.findOne({ _id: id, is_deleted: false })
    .select('-createdAt -updatedAt -is_deleted -__v')
    .lean();

  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
  }

  return product;
};

const UpdateProduct = async (
  productId: string,
  updates: Partial<ProductInterface>,
) => {
  const isProductExists = await Product.findById(productId);

  if (!isProductExists || isProductExists.is_deleted) {
    throw new AppError(404, 'Product not found');
  }

  const updatedProduct = await Product.findByIdAndUpdate(productId, updates, {
    new: true,
    runValidators: true,
  });

  return updatedProduct;
};

const DeleteProduct = async (productId: string) => {
  const result = await Product.findByIdAndUpdate(productId, {
    is_deleted: true,
  });

  if (!result) {
    throw new AppError(404, 'Product not found');
  }

  return result;
};

const ProductService = {
  CreateMultipleProduct,
  CreateProduct,
  GetAllProducts,
  GetProductById,
  UpdateProduct,
  DeleteProduct,
};

export default ProductService;
