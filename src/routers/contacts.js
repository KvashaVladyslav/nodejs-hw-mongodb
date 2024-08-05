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

const router = express.Router();
const jsonParser = express.json();

router.use(authenticate);

router.get('/', ctrlWrapper(getContacts));

router.get('/:contactsId', isValidId, ctrlWrapper(getContactById));

router.post(
  '/',
  jsonParser,
  validateBody(postContactsValidationSchema),
  ctrlWrapper(createContact),
);

router.delete('/:contactsId', isValidId, ctrlWrapper(deleteContact));

router.patch(
  '/:contactsId',
  isValidId,
  jsonParser,
  validateBody(patchContactsValidationSchema),
  ctrlWrapper(updateContact),
);

export default router;
