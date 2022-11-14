const { reportError, newNotFoundError } = require('../util/error');

const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch((err) => reportError('getUsers', res, err, {}));
};

module.exports.getIdUser = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        throw newNotFoundError(`user with id=${req.params.id} doesn't exist`);
      }
      res.send({ data: user });
    })
    .catch((err) => reportError('getIdUser', res, err, {
      404: 'Пользователь по указанному _id не найден.',
    }));
};

module.exports.postUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => reportError('postUser', res, err, {
      400: 'Переданы некорректные данные при создании пользователя.',
    }));
};

module.exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(req.user._id)
    .then((user) => {
      if (!user) {
        throw newNotFoundError(`user with id=${req.user._id} doesn't exist`);
      }
      res.send({ data: user });
    })
    .catch((err) => reportError('updateUser', res, err, {
      400: 'Переданы некорректные данные при обновлении профиля.',
      404: 'Пользователь с указанным _id не найден.',
    }));
};

module.exports.updateAvatar = (req, res) => {
  User.findByIdAndUpdate(req.user._id)
    .then((user) => {
      if (!user) {
        throw newNotFoundError(`user with id=${req.user._id} doesn't exist`);
      }
      res.send({ data: user });
    })
    .catch((err) => reportError('updateAvatar', res, err, {
      400: 'Переданы некорректные данные при обновлении аватара.',
      404: 'Пользователь с указанным _id не найден.',
    }));
};
