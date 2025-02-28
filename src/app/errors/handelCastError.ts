import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { ErrorSourcesType, GenericErrorResponseType } from '../interface/error';

const handelCastError = (
  err: mongoose.Error.CastError,
): GenericErrorResponseType => {
  const errorSources: ErrorSourcesType = [
    {
      message: `Invalid ${err.path}: ${err.value}.`,
      path: err.path,
    },
  ];

  return {
    statusCode: httpStatus.BAD_REQUEST,
    message: 'Invalid Requested Data',
    errorSources,
  };
};

export default handelCastError;
