const Card = require('../models/card');

const ErrNotFound = require('../errors/err-not-found');
const ErrBadRequest = require('../errors/err-bad-request');
const ErrForbidden = require('../errors/err-forbidden');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch((err) => next(err));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(ErrBadRequest('Переданы некорректные данные для создания карточки.', err));
      } else {
        next(err);
      }
    });
};

module.exports.deleteIdCards = (req, res, next) => {
  Card.findById(req.params.cardId).orFail()
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        throw new ErrForbidden(
          'Запрещено удалять карточки других пользователей.',
          `${card.owner} != ${req.user._id}`,
        );
      }
      return Card.deleteOne({ _id: req.params.cardId })
        .orFail()
        .then(() => res.send({ data: card }));
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new ErrNotFound('Передан несуществующий _id карточки.', err));
      } else if (err.name === 'CastError') {
        next(new ErrBadRequest('Переданы некорректные данные для удаления карточки.', err));
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
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
        next(new ErrNotFound('Передан несуществующий _id карточки.', err));
      } else if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new ErrBadRequest('Переданы некорректные данные для установки лайка на карточке.', err));
      } else {
        next(err);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
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
        next(new ErrNotFound('Передан несуществующий _id карточки.', err));
      } else if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new ErrBadRequest('Переданы некорректные данные для снятия лайка с карточки.', err));
      } else {
        next(err);
      }
    });
};
