const { StatusCodes } = require('http-status-codes');

const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по умолчанию' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(StatusCodes.BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки.' });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по умолчанию.' });
      }
    });
};

module.exports.deleteIdCards = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId).orFail()
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(StatusCodes.NOT_FOUND).send({ message: 'Передан несуществующий _id карточки.' });
      } else if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(StatusCodes.BAD_REQUEST).send({ message: 'Переданы некорректные данные при удалении карточки.' });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по умолчанию.' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).orFail()
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(StatusCodes.NOT_FOUND).send({ message: 'Передан несуществующий _id карточки.' });
      } else if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(StatusCodes.BAD_REQUEST).send({ message: 'Переданы некорректные данные для установка лайка на карточке' });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по умолчанию.' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).orFail()
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(StatusCodes.NOT_FOUND).send({ message: 'Передан несуществующий _id карточки.' });
      } else if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(StatusCodes.BAD_REQUEST).send({ message: 'Переданы некорректные данные для снятия лайка с карточки' });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'Ошибка по умолчанию.' });
      }
    });
};
