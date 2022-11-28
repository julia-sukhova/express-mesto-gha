const ErrNotFound = require('../errors/err-not-found');

module.exports = (req, res, next) => {
  next(new ErrNotFound('Задан некорректный путь', ''));
};
