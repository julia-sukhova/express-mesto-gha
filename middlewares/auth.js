const jwt = require('jsonwebtoken');
const { JWT_SECRET, TOKEN_COOKIE } = require('../utils/consts');
const ErrUnauthorized = require('../errors/err-unautrorized');

module.exports = (req, res, next) => {
  const token = req.cookies[TOKEN_COOKIE];

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
  } catch (e) {
    throw new ErrUnauthorized('Необходимо авторизоваться.', e);
  }

  next();
};
