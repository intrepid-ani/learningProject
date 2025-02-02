module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

// OR

// const asyncHandler = (func) => (req, res, next) => {
//   Promise.resolve(func(req, res, next)).catch((err) => next(err));

//   // next() passes control to the next middleware. If an error is passed, it goes to error-handling middleware.
// };
