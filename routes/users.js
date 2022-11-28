const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { URL_VALIDATE_REGEX } = require('../utils/consts');
const {
  getUsers, getIdUser, getUser, updateUser, updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUser);
router.patch('/me', celebrate({
  body: Joi.object({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), updateUser);
router.patch('/me/avatar', celebrate({
  body: Joi.object({
    avatar: Joi.string().regex(URL_VALIDATE_REGEX).required(),
  }),
}), updateAvatar);
router.get('/:userId', celebrate({
  params: Joi.object({
    userId: Joi.string().length(24).hex().required(),
  }),
}), getIdUser);

module.exports = router;
