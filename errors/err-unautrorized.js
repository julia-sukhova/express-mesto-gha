class ErrUnauthorized extends Error {
  constructor(message, err) {
    super(message);
    this.statusCode = 401;
    this.origErr = err;
  }
}

module.exports = ErrUnauthorized;
