class ErrForbidden extends Error {
  constructor(message, err) {
    super(message);
    this.statusCode = 403;
    this.origErr = err;
  }
}

module.exports = ErrForbidden;
