import QueryBuilder from '../../builder/QueryBuilder';
import { ProductImage } from '../product-image/product-image.model';
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
    fields: '-is_deleted,-createdAt,-updatedAt,-__v',
  };
  const queryBuilder = new QueryBuilder(Product.find(), query);

  const productsQuery = queryBuilder
    .search(['name', 'description', 'category'])
    .filter()
    .sort()
    .fields()
    .paginate();

  const [data, total] = await Promise.all([
    productsQuery.modelQuery.lean().exec(),
    queryBuilder.getCountQuery(),
  ]);

  const productIds = data.map((product) => product._id);
  const images = await ProductImage.find({
    product_id: { $in: productIds },
  })
    .select('-createdAt -updatedAt -__v')
    .lean();

  const productMap = new Map();
  data.forEach((product) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    productMap.set(product._id.toString(), { ...product, images: [] });
  });

  images.forEach((image) => {
    const productId = image.product_id.toString();
    if (productMap.has(productId)) {
      productMap.get(productId).images.push(image);
    }
  });

  return {
    meta: {
      total,
      ...queryBuilder.getPaginationInfo(),
    },
    data: Array.from(productMap.values()),
  };
};

const ProductService = { CreateMultipleProduct, CreateProduct, GetAllProducts };

export default ProductService;
