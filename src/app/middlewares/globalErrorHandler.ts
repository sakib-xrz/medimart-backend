/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

import { ErrorRequestHandler } from 'express';
import httpStatus from 'http-status';
import { ZodError } from 'zod';
import handelZodError from '../errors/handelZodError';
import { ErrorSourcesType } from '../interface/error';
import handelValidationError from '../errors/handleValidationError';
import handelCastError from '../errors/handelCastError';
import handleDuplicateError from '../errors/handleDuplicateError';
import AppError from '../errors/AppError';

const globalErrorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  let statusCode: number = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  let message: string = err.message || 'Something went wrong!';
  let errorSources: ErrorSourcesType = [
    {
      message: err.message || 'Something went wrong!',
      path: err?.path || '',
    },
  ];

  if (err instanceof ZodError) {
    const simplifiedError = handelZodError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } else if (err?.name === 'ValidationError') {
    const simplifiedError = handelValidationError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } else if (err?.name === 'CastError') {
    const simplifiedError = handelCastError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } else if (err?.code === 11000) {
    const simplifiedError = handleDuplicateError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } else if (err instanceof Error) {
    errorSources = [
      {
        message: err.message,
        path: '',
      },
    ];
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorSources = [
      {
        message: err.message,
        path: '',
      },
    ];
  } else if (err?.name === 'TokenExpiredError') {
    statusCode = httpStatus.UNAUTHORIZED;
    message = 'Token has expired, please login again!';
    errorSources = [
      {
        message: err.message,
        path: '',
      },
    ];
  } else if (err?.name === 'JsonWebTokenError') {
    statusCode = httpStatus.UNAUTHORIZED;
    message = 'Invalid token. Please provide a valid token.';
    errorSources = [
      {
        message: err.message,
        path: '',
      },
    ];
  }
  res.status(statusCode).json({
    success: false,
    message,
    error: errorSources,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};

export default globalErrorHandler;
