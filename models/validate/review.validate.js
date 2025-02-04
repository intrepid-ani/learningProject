const Joi = require("joi");
const CustomError = require("../../utils/customError.utils");

const reviewSchema = Joi.object({
  rating: Joi.number().required().min(1).max(5).default(1),
  comment: Joi.string().required().min(5).max(1000),
});

function reviewValidate(req, res, next) {
  if (!req.body || typeof req.body !== "object") {
    return next(new CustomError(400, "Bad request: Invalid request body"));
  }

  const { error } = reviewSchema.validate(req.body);
  if (error) {
    return next(new CustomError(400, error.details[0].message));
  }

  return next();
}

module.exports = reviewValidate;
