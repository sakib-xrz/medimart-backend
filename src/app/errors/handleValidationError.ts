import mongoose from 'mongoose';
import { ErrorSourcesType, GenericErrorResponseType } from '../interface/error';
import httpStatus from 'http-status';

const handelValidationError = (
  err: mongoose.Error.ValidationError,
): GenericErrorResponseType => {
  const errorValues = Object.values(err.errors);

  const errorSources: ErrorSourcesType = errorValues.map(
    (error: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        message: error.message,
        path: error.path,
      };
    },
  );

  return {
    statusCode: httpStatus.BAD_REQUEST,
    message: 'Validation Error!',
    errorSources,
  };
};

export default handelValidationError;
