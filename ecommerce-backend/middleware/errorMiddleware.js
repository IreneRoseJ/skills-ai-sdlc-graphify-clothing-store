const notFound = (req, res, next) => {
  const err = new Error(`Not found — ${req.originalUrl}`);
  res.status(404);
  next(err);
};

const errorHandler = (err, req, res, _next) => {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};

export { notFound, errorHandler };
