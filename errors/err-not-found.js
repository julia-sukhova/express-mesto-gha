class ErrNotFound extends Error {
  constructor(message, err) {
    super(message);
    this.statusCode = 404;
    this.origErr = err;
  }
}

module.exports = ErrNotFound;
