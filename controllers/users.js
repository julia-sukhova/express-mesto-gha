const User = require('../models/user');

const ErrNotFound = require('../errors/err-not-found');
const ErrBadRequest = require('../errors/err-bad-request');

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
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { runValidators: true, new: true })
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
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { runValidators: true, new: true })
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
