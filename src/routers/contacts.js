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

const router = express.Router();
const jsonParser = express.json();

router.get('/contacts', ctrlWrapper(getContacts));

router.get('/contacts/:contactsId', isValidId, ctrlWrapper(getContactById));

router.post(
  '/contacts',
  jsonParser,
  validateBody(postContactsValidationSchema),
  ctrlWrapper(createContact),
);

router.delete('/contacts/:contactsId', isValidId, ctrlWrapper(deleteContact));

router.patch(
  '/contacts/:contactsId',
  isValidId,
  jsonParser,
  validateBody(patchContactsValidationSchema),
  ctrlWrapper(updateContact),
);

export default router;
