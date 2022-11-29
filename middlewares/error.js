const defaultMessage = 'На сервере произошла ошибка';

module.exports = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? defaultMessage : err.message;

  // eslint-disable-next-line no-console
  console.log(
    'handler %s: error: %s (%d): %j',
    req.originalUrl,
    message,
    statusCode,
    err.origErr || err,
  );

  res.status(statusCode)
    .send({ message });

  next();
};
