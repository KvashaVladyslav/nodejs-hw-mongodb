import express from 'express';
import {
  getContactById,
  getContacts,
  createContact,
  deleteContact,
  updateContact,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = express.Router();
const jsonParser = express.json();

router.get('/contacts', ctrlWrapper(getContacts));

router.get('/contacts/:contactsId', ctrlWrapper(getContactById));

router.post('/contacts', jsonParser, ctrlWrapper(createContact));

router.delete('/contacts/:contactsId', ctrlWrapper(deleteContact));

router.patch('/contacts/:contactsId', jsonParser, ctrlWrapper(updateContact));

export default router;
