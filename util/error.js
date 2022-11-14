const { StatusCodes } = require('http-status-codes');

const reportError = (operation, res, err, msgMap) => {
  console.log(`${operation}: ${err}`);
  let httpCode = StatusCodes.INTERNAL_SERVER_ERROR;
  if (err.name === 'CastError' || err.name === 'ValidationError') {
    httpCode = StatusCodes.BAD_REQUEST;
  } else if (err.name === 'NotFound') {
    httpCode = StatusCodes.NOT_FOUND;
  }
  let httpMsg = msgMap[httpCode];
  if (!httpMsg) {
    httpMsg = 'Ошибка по умолчанию';
  }
  res.status(httpCode).send({ message: httpMsg });
};

const newNotFoundError = (message) => {
  const err = new Error();
  err.name = 'NotFound';
  err.message = message;
  return err;
};

module.exports = {
  reportError,
  newNotFoundError,
};
