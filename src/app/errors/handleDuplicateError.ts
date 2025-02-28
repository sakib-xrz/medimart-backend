import { ErrorSourcesType } from './../interface/error';
import { GenericErrorResponseType } from '../interface/error';
import httpStatus from 'http-status';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleDuplicateError = (err: any): GenericErrorResponseType => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/);
  const message = `Duplicate value: ${value[0]} for "${
    Object.keys(err.keyValue)[0]
  }" field`;

  const errorSources: ErrorSourcesType = [
    {
      message,
      path: Object.keys(err.keyValue)[0],
    },
  ];

  return {
    statusCode: httpStatus.CONFLICT,
    message: 'Duplicate Field Value',
    errorSources,
  };
};

export default handleDuplicateError;
