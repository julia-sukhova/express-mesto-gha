// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  const { statusCode = 500, message = 'Ошибка сервера' } = err;

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
};
