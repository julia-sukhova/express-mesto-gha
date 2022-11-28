const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { URL_VALIDATE_REGEX } = require('../utils/consts');

const {
  getCards, createCard, deleteIdCards, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', celebrate({
  body: Joi.object({
    name: Joi.string().min(2).max(30).required(true),
    link: Joi.string().regex(URL_VALIDATE_REGEX).required(true),
  }),
}), createCard);
router.delete('/:cardId', celebrate({
  params: Joi.object({
    cardId: Joi.string().length(24).hex().required(),
  }),
}), deleteIdCards);
router.put('/:cardId/likes', celebrate({
  params: Joi.object({
    cardId: Joi.string().length(24).hex().required(),
  }),
}), likeCard);
router.delete('/:cardId/likes', celebrate({
  params: Joi.object({
    cardId: Joi.string().length(24).hex().required(),
  }),
}), dislikeCard);

module.exports = router;
