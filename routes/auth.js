const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { URL_VALIDATE_REGEX } = require('../utils/consts');

const { signIn, signUp, signOut } = require('../controllers/auth');

router.post('/signin', celebrate({
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), signIn);

router.post('/signup', celebrate({
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30).optional(),
    about: Joi.string().min(2).max(30).optional(),
    avatar: Joi.string().regex(URL_VALIDATE_REGEX).optional(),
  }),
}), signUp);

router.post('/signout', signOut);

module.exports = router;
