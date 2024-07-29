import express from 'express';
import {
  getContactById,
  getContacts,
  createContact,
  deleteContact,
  updateContact,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  patchContactsValidationSchema,
  postContactsValidationSchema,
} from '../validations/contacts.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';
import { checkRoles } from '../middlewares/checkRoles.js';
import { ROLES } from '../constants/constants.js';

const router = express.Router();
const jsonParser = express.json();

router.use(authenticate);

router.get('/', checkRoles(ROLES.USER), ctrlWrapper(getContacts));

router.get(
  '/:contactsId',
  checkRoles(ROLES.USER, ROLES.CONTACT),
  isValidId,
  ctrlWrapper(getContactById),
);

router.post(
  '/',
  checkRoles(ROLES.USER),
  jsonParser,
  validateBody(postContactsValidationSchema),
  ctrlWrapper(createContact),
);

router.delete(
  '/:contactsId',
  checkRoles(ROLES.USER),
  isValidId,
  ctrlWrapper(deleteContact),
);

router.patch(
  '/:contactsId',
  checkRoles(ROLES.USER, ROLES.CONTACT),
  isValidId,
  jsonParser,
  validateBody(patchContactsValidationSchema),
  ctrlWrapper(updateContact),
);

export default router;
