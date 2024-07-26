import Joi from 'joi';

export const postContactsValidationSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'any.required': 'name is required',
    'string.base': 'name should be a string',
    'string.min': 'name should be at least {#limit}',
    'string.max': 'name should be at most {#limit}',
  }),
  phoneNumber: Joi.string()
    .min(3)
    .max(20)
    .pattern(/^[+][0-9]+$/)
    .required()
    .messages({
      'any.required': 'phoneNumber is required',
      'string.pattern.base':
        'phoneNumber must includes only numbers and starts with "+"',
      'string.min': 'phoneNumber should be at least {#limit}',
      'string.max': 'phoneNumber should be at most {#limit}',
    }),
  email: Joi.string().min(3).max(20).email().messages({
    'string.email': 'Email is not valid',
  }),
  isFavourite: Joi.boolean().messages({
    'boolean.base': 'isFavourite should be one of [ true, false ]',
  }),
  contactType: Joi.string()
    .min(3)
    .max(20)
    .valid('personal', 'work', 'home')
    .required()
    .messages({
      'any.required': 'contactType is required',
      'any.only': 'contactType must be on of [ personal, work, home ]',
    }),
});

export const patchContactsValidationSchema = Joi.object({
  name: Joi.string().min(3).max(20).messages({
    'string.base': 'name should be a string',
    'string.min': 'name should be at least {#limit}',
    'string.max': 'name should be at most {#limit}',
  }),
  phoneNumber: Joi.string()
    .min(3)
    .max(20)
    .pattern(/^[+][0-9]+$/)
    .messages({
      'string.pattern.base':
        'phoneNumber must includes only numbers and starts with "+"',
      'string.min': 'phoneNumber should be at least {#limit}',
      'string.max': 'phoneNumber should be at most {#limit}',
    }),
  email: Joi.string().min(3).max(20).email().messages({
    'string.email': 'email is not valid',
  }),
  isFavourite: Joi.boolean().messages({
    'boolean.base': 'isFavourite should be one of [ true, false ]',
  }),
  contactType: Joi.string()
    .min(3)
    .max(20)
    .valid('personal', 'work', 'home')
    .messages({
      'any.only': 'contactType must be on of [ personal, work, home ]',
    }),
});
