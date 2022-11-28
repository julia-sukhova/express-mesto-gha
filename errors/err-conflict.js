class ErrConflict extends Error {
  constructor(message, err) {
    super(message);
    this.statusCode = 409;
    this.origErr = err;
  }
}

module.exports = ErrConflict;
