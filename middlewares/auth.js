const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/consts');
const ErrUnauthorized = require('../errors/err-unautrorized');

const authHeaderPrefix = 'Bearer ';

module.exports = (req, res, next) => {
  let token = req.cookies.access_token;
  if (!token) {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith(authHeaderPrefix)) {
      throw new ErrUnauthorized('Ошибка авторизации.', `Headers: ${JSON.stringify(req.headers)}.`);
    }
    token = authorization.replace(authHeaderPrefix, '');
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
  } catch (e) {
    throw new ErrUnauthorized('Необходимо авторизоваться.', e);
  }

  next();
};
