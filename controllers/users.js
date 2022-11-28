const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require('../utils/consts');

const ErrNotFound = require('../errors/err-not-found');
const ErrBadRequest = require('../errors/err-bad-request');
const ErrConflict = require('../errors/err-conflict');

const User = require('../models/user');
const ErrUnauthorized = require('../errors/err-unautrorized');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch((err) => next(err));
};

module.exports.getIdUser = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new ErrNotFound('Пользователь с заданным _id не найден.', err));
      } else if (err.name === 'CastError') {
        next(new ErrBadRequest('Переданы некорректные данные для получения пользователя.', err));
      } else {
        next(err);
      }
    });
};

module.exports.getUser = (req, res, next) => {
  req.params.userId = req.user._id;
  this.getIdUser(req, res, next);
};

module.exports.updateUser = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, req.body, { runValidators: true, new: true })
    .orFail()
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new ErrNotFound('Пользователь с заданным _id не найден.', err));
      } else if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new ErrBadRequest('Переданы некорректные данные при обновлении данных о пользователе.', err));
      } else {
        next(err);
      }
    });
};

module.exports.updateAvatar = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, req.body, { runValidators: true, new: true })
    .orFail()
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new ErrNotFound('Пользователь с заданным _id не найден.', err));
      } else if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new ErrBadRequest('Переданы некорректные данные при обновлении аватара пользователя.', err));
      } else {
        next(err);
      }
    });
};

module.exports.postUser = (req, res, next) => {
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

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select('+password')
    .orFail()
    .then((user) => bcrypt.compare(password, user.password)
      .then((matched) => ({ user, matched })))
    .then(({ user, matched }) => {
      if (!matched) {
        throw new ErrBadRequest(
          'Неравильный пароль пользователя.',
          `Неравильный пароль пользователя ${user}`,
        );
      }
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.cookie('access_token', token, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: true });
      res.send({ _id: user._id });
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new ErrUnauthorized('Пользователь с заданным email не существует.', err));
      } else if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new ErrBadRequest('Переданы некорректные данные для входа пользователя.', err));
      } else {
        next(err);
      }
    });
};
