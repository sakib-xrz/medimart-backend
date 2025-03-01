import { z } from 'zod';
import ProductConstants from './product.constant';

const CreateProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Product name is required'),
    description: z.string().optional(),
    category: z.enum([...ProductConstants.Category] as [string, ...string[]], {
      errorMap: () => ({ message: 'Invalid category' }),
    }),
    price: z.number().positive('Price must be a positive number'),
    discount: z.number().min(0, 'Discount cannot be negative').default(0),
    discount_type: z.enum(['PERCENTAGE', 'FLAT']).default('PERCENTAGE'),
    stock: z.number().int().min(0, 'Stock cannot be negative').default(0),
    requires_prescription: z.boolean().default(false),
    manufacturer_details: z
      .string()
      .min(1, 'Manufacturer details are required'),
    expiry_date: z.string().min(1, 'Expiry date is required'),
    is_deleted: z.boolean().default(false),
  }),
});

const CreateMultipleProductSchema = z.object({
  body: z.array(CreateProductSchema.shape.body),
});

const UpdateProductSchema = z.object({
  body: CreateProductSchema.shape.body.partial(),
});

const ProductValidation = {
  CreateProductSchema,
  CreateMultipleProductSchema,
  UpdateProductSchema,
};

export default ProductValidation;
