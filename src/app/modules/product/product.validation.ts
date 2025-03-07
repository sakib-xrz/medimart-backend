import { z } from 'zod';
import ProductConstants from './product.constant';

const CreateProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Product name is required'),
    description: z.string().min(1, 'Product description is required'),
    category: z.enum([...ProductConstants.Category] as [string, ...string[]], {
      errorMap: () => ({ message: 'Invalid category' }),
    }),
    price: z.number().positive('Price must be a positive number'),
    discount: z.number().min(0, 'Discount cannot be negative').default(0),
    discount_type: z.enum(['PERCENTAGE', 'FLAT']).default('PERCENTAGE'),
    stock: z.number().int().min(0, 'Stock cannot be negative').default(0),
    requires_prescription: z.boolean().default(false),
    manufacturer: z.string().min(1, 'Manufacturer is required'),
    expiry_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Expiry date must be in YYYY-MM-DD format'),
    is_deleted: z.boolean().default(false),
    form: z.string().optional(),
    dosage: z.string().optional(),
    pack_size: z.string().optional(),
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
