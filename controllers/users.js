const { StatusCodes } = require('http-status-codes');

const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по умолчанию.' }));
};

module.exports.getIdUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(StatusCodes.NOT_FOUND).send({ message: 'Пользователь с заданным _id не найден.' });
      } else if (err.name === 'CastError') {
        res.status(StatusCodes.BAD_REQUEST).send({ message: 'Переданы некорректные данные для получения пользователя.' });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по умолчанию.' });
      }
    });
};

module.exports.postUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(StatusCodes.BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по умолчанию.' });
      }
    });
};

module.exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(req.user._id, req.body, { runValidators: true, new: true })
    .orFail()
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(StatusCodes.NOT_FOUND).send({ message: 'Пользователь с заданным _id не найден.' });
      } else if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(StatusCodes.BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении пользователя.' });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по умолчанию.' });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  User.findByIdAndUpdate(req.user._id, req.body, { runValidators: true, new: true })
    .orFail()
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(StatusCodes.NOT_FOUND).send({ message: 'Пользователь с заданным _id не найден.' });
      } else if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(StatusCodes.BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по умолчанию.' });
      }
    });
};
