const Joi = require("joi");
const CustomError = require("../../utils/customError.utils");

const reviewSchema = Joi.object({
  review: Joi.object().required(),

  rating: number().required().min(1).max(5),

  comment: string().required().min(5).max(1000),
});

function reviewValidate(req, res, next) {
  if (!req.body) {
    throw new CustomError(400, "Bad request");
  }
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    return next(new CustomError(400, error));
  }
  console.log(reviewSchema.validate(req.body));
  return next();
}

module.exports = reviewValidate;
