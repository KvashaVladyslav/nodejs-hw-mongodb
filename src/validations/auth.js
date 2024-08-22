import Joi from 'joi';

export const registerValidationSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'any.required': 'name is required',
    'string.base': 'name should be a string',
  }),
  email: Joi.string().email().messages({
    'string.email': 'email is not valid',
  }),
  password: Joi.string().required(),
});

export const loginValidationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const sendResetEmailSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const resetPasswordSchema = Joi.object({
  password: Joi.string().required(),
  token: Joi.string().required(),
});

export const loginWithGoogleSchema = Joi.object({
  code: Joi.string().required(),
});
