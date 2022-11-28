class ErrBadRequest extends Error {
  constructor(message, err) {
    super(message);
    this.statusCode = 400;
    this.origErr = err;
  }
}

module.exports = ErrBadRequest;
