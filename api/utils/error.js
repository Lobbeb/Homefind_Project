export const errorHandler = (statusCode, message) => {
  // Error handler
  const error = new Error();
  error.statusCode = statusCode;
  error.message = message;
  return error;
};
