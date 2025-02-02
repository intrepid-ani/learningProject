const Joi = require("joi");
const CustomError = require("../../utils/customError.utils.js");

const listingSchema = Joi.object({
  listing: Joi.object(),

  title: Joi.string().required().min(5).max(100),

  description: Joi.string().required().min(5).max(1000),

  images: Joi.string().allow("", null),

  price: Joi.number().min(0).required(),

  location: Joi.string().required(),

  country: Joi.string().required(),
});

function validateListing(req, res, next) {
  if (!req.body) {
    throw new CustomError(400, "Bad request");
  }
  let { error } = listingSchema.validate(req.body);
  if (error) {
    return next(new customError(400, error));
  }
  console.log(listingSchema.validate(req.body));
  return next();
}

module.exports = validateListing;
