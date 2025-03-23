import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { ProductInterface } from './product.interface';
import { Product } from './product.model';
import ProductUtils from './product.utils';
import slugify from 'slugify';

const CreateMultipleProduct = async (productsData: ProductInterface[]) => {
  const modifiedProductsData = productsData.map((product) => {
    return {
      ...product,
      slug: ProductUtils.GenerateRandomProductSlug(),
      in_stock: product.stock > 0,
      category_slug: slugify(product.category, {
        lower: true,
        trim: true,
        remove: /[*+~.()'"!:@]/g,
      }),
    };
  });

  const products = await Product.insertMany(modifiedProductsData);
  return products;
};

const CreateProduct = async (productData: ProductInterface) => {
  productData.slug = ProductUtils.GenerateRandomProductSlug();
  productData.in_stock = productData.stock > 0;
  productData.category_slug = slugify(productData.category, {
    lower: true,
    trim: true,
    remove: /[*+~.()'"!:@]/g,
  });

  const product = new Product(productData);
  await product.save();
  return product.toObject();
};

const GetFeatureProducts = async () => {
  const products = await Product.find({ is_deleted: false, in_stock: true })
    .select('-pack_size -manufacturer -createdAt -updatedAt -is_deleted -__v')
    .limit(4)
    .sort({ createdAt: -1 })
    .lean();

  return products;
};

const GetProductByCategory = async (
  category_slug: string,
  query: Record<string, unknown>,
) => {
  query = {
    ...query,
    fields: '-pack_size -manufacturer -createdAt -updatedAt -is_deleted -__v',
    is_deleted: false,
    category_slug,
  };

  const queryBuilder = new QueryBuilder(Product.find(), query);

  const productsQuery = queryBuilder
    .search(['name', 'category'])
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

const GetAllProducts = async (query: Record<string, unknown>) => {
  query = {
    ...query,
    fields: '-pack_size -manufacturer -createdAt -updatedAt -is_deleted -__v',
    is_deleted: false,
  };

  const queryBuilder = new QueryBuilder(Product.find(), query);

  const productsQuery = queryBuilder
    .search(['name', 'category', 'slug'])
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

const GetProductBySlug = async (slug: string) => {
  const product = await Product.findOne({ slug, is_deleted: false })
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
  GetFeatureProducts,
  GetProductByCategory,
  GetAllProducts,
  GetProductBySlug,
  UpdateProduct,
  DeleteProduct,
};

export default ProductService;
