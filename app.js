const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');
const { login, postUser } = require('./controllers/users');
const authMiddleware = require('./middlewares/auth');
const { URL_VALIDATE_REGEX } = require('./utils/consts');

mongoose.connect('mongodb://localhost:27017/mestodb');

const { PORT = 3000 } = process.env;
const app = express();

app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signin', celebrate({
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    name: Joi.string().min(2).max(30).optional(),
    about: Joi.string().min(2).max(30).optional(),
    avatar: Joi.string().regex(URL_VALIDATE_REGEX).optional(),
  }),
}), postUser);

app.use('/users', authMiddleware, require('./routes/users'));
app.use('/cards', authMiddleware, require('./routes/cards'));

app.use(errors());
app.use(require('./middlewares/path-trap'));
app.use(require('./middlewares/error'));

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
