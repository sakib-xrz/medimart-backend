import mongoose from 'mongoose';
import { UserInterface, UserModel } from './user.interface';
import config from '../../config';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema<UserInterface, UserModel>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      required: true,
      enum: ['ADMIN', 'CUSTOMER'],
      default: 'CUSTOMER',
    },
    is_blocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
    },
  },
);

UserSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this; // doc
  const salt_round = Number(config.bcrypt_salt_rounds);
  user.password = await bcrypt.hash(user.password, salt_round);
  next();
});

UserSchema.statics.isUserExists = async function (email: string) {
  return await User.findOne({ email }).select('+password');
};

UserSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

export const User = mongoose.model<UserInterface, UserModel>(
  'Users',
  UserSchema,
);
