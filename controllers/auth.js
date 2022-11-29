const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { JWT_SECRET, TOKEN_COOKIE } = require('../utils/consts');

const ErrBadRequest = require('../errors/err-bad-request');
const ErrConflict = require('../errors/err-conflict');

const User = require('../models/user');
const ErrUnauthorized = require('../errors/err-unautrorized');

module.exports.signUp = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => {
      const userObj = user.toObject();
      delete userObj.password;
      // eslint-disable-next-line no-underscore-dangle
      delete userObj.__v;
      res.send({ data: userObj });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ErrConflict('Пользователь с заданным email уже существует.', err));
      } else if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new ErrBadRequest('Переданы некорректные данные при создании пользователя.', err));
      } else {
        next(err);
      }
    });
};

module.exports.signIn = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select('+password')
    .orFail()
    .then((user) => bcrypt.compare(password, user.password)
      .then((matched) => ({ user, matched })))
    .then(({ user, matched }) => {
      if (!matched) {
        throw new ErrUnauthorized(
          'Неравильный пароль пользователя.',
          `Неравильный пароль пользователя ${user}`,
        );
      }
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.cookie(
        TOKEN_COOKIE,
        token,
        {
          maxAge: 7 * 24 * 60 * 60 * 1000,
          httpOnly: true,
          sameSite: true,
        },
      );
      res.send({ _id: user._id });
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new ErrUnauthorized('Пользователь с заданным email не существует.', err));
      } else {
        next(err);
      }
    });
};

module.exports.signOut = (req, res) => {
  if (!req.cookies[TOKEN_COOKIE]) {
    throw new ErrUnauthorized('Вы не авторизованы');
  }
  res.clearCookie(TOKEN_COOKIE).send({ message: 'Выход' });
};
