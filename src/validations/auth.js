import Joi from 'joi';

export const registerValidationSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'any.required': 'name is required',
    'string.base': 'name should be a string',
    'string.min': 'name should be at least {#limit}',
    'string.max': 'name should be at most {#limit}',
  }),
  email: Joi.string().min(3).max(20).email().messages({
    'string.email': 'email is not valid',
    'string.min': 'email should be at least {#limit}',
    'string.max': 'email should be at most {#limit}',
  }),
  password: Joi.string().required(),
  role: Joi.string().required(),
});

export const loginValidationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
