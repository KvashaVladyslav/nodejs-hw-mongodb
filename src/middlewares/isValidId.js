import createHttpError from 'http-errors';
import { isValidObjectId } from 'mongoose';

export function isValidId(req, res, next) {
  const { contactsId } = req.params;
  if (isValidObjectId(contactsId) === false) {
    next(createHttpError(400, 'Bad request: ID is not valid'));
  }
  next();
}
