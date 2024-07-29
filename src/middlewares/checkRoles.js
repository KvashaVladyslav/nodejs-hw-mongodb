import createHttpError from 'http-errors';
import { ROLES } from '../constants/constants.js';
import { contactModel } from '../models/contact.js';

export function checkRoles(...roles) {
  return async (req, res, next) => {
    const { user } = req;
    if (!user) {
      next(createHttpError(401));
      return;
    }

    const { role } = user;
    if (roles.includes(ROLES.CONTACT) && role === ROLES.CONTACT) {
      next();
      return;
    }
    if (roles.includes(ROLES.USER) && role === ROLES.USER) {
      const { contactsId } = req.params;
      if (!contactsId) {
        next(createHttpError(403));
        return;
      }
      const contact = await contactModel.findOne({
        _id: contactsId,
        userId: user._id,
      });

      if (contact) {
        next();
        return;
      }
    }
    next(createHttpError(403));
  };
}
