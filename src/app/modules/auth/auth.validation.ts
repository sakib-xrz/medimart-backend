import { z } from 'zod';

const LoginSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required',
        invalid_type_error: 'Email must be a string',
      })
      .email('Invalid email format'),
    password: z.string({
      required_error: 'Password is required',
      invalid_type_error: 'Password must be a string',
    }),
  }),
});

const RegisterSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Name is required',
        invalid_type_error: 'Name must be a string',
      })
      .min(3, 'Name must be at least 3 characters')
      .max(255, 'Name must be at most 255 characters'),
    email: z
      .string({
        required_error: 'Email is required',
        invalid_type_error: 'Email must be a string',
      })
      .email('Email must be a valid email'),
    password: z
      .string({
        required_error: 'Password is required',
        invalid_type_error: 'Password must be a string',
      })
      .min(6, 'Password must be at least 6 characters'),
  }),
});

const ChangePasswordSchema = z.object({
  body: z.object({
    oldPassword: z.string({
      required_error: 'Old password is required',
      invalid_type_error: 'Old password must be a string',
    }),
    newPassword: z.string({
      required_error: 'New password is required',
      invalid_type_error: 'New password must be a string',
    }),
  }),
});

const AuthValidation = { LoginSchema, RegisterSchema, ChangePasswordSchema };

export default AuthValidation;
