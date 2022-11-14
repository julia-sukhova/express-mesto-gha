const { reportError, newNotFoundError } = require('../util/error');

const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch((err) => reportError('getCards', res, err, {}));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => reportError('createCard', res, err, {
      400: 'Переданы некорректные данные при создании карточки',
    }));
};

module.exports.deleteIdCards = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw newNotFoundError(`card with id=${req.params.cardId} doesn't exist`);
      }
      res.send({ data: card });
    })
    .catch((err) => reportError('deleteIdCards', res, err, {
      404: 'Карточка с указанным _id не найдена.',
      400: 'Переданы некорректные данные при удалении карточки.',
    }));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw newNotFoundError(`card with id=${req.params.cardId} doesn't exist`);
      }
      res.send({ data: card });
    })
    .catch((err) => reportError('likeCard', res, err, {
      400: 'Переданы некорректные данные для постановки лайка.',
      404: 'Передан несуществующий _id карточки.',
    }));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw newNotFoundError(`card with id=${req.params.cardId} doesn't exist`);
      }
      res.send({ data: card });
    })
    .catch((err) => reportError('dislikeCard', res, err, {
      400: 'Переданы некорректные данные для снятия лайка.',
      404: 'Передан несуществующий _id карточки.',
    }));
};
