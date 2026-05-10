export function createHttpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

export function errorHandler(error, _req, res, _next) {
  const status = error.status || 500;
  const message = status === 500 ? 'Unexpected server error.' : error.message;

  if (status === 500) {
    console.error(error);
  }

  res.status(status).json({
    error: {
      message,
      status
    }
  });
}
