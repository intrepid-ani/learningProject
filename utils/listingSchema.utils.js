const Joi = require("joi");

const listingSchema = Joi.object({
  listing: Joi.object(),

  title: Joi.string().required().min(5).max(100),

  description: Joi.string().required().min(5).max(1000),

  images: Joi.string().allow("", null),

  price: Joi.number().min(0).required(),

  location: Joi.string().required(),

  country: Joi.string().required(),
});

module.exports = listingSchema;
