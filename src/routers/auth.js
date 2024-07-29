import express from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  loginUser,
  logOutUser,
  refreshUser,
  registerUser,
} from '../controllers/auth.js';
import {
  loginValidationSchema,
  registerValidationSchema,
} from '../validations/auth.js';

const router = express.Router();
const jsonParser = express.json();

router.post(
  '/register',
  jsonParser,
  validateBody(registerValidationSchema),
  ctrlWrapper(registerUser),
);

router.post(
  '/login',
  jsonParser,
  validateBody(loginValidationSchema),
  ctrlWrapper(loginUser),
);

router.post('/logout', jsonParser, ctrlWrapper(logOutUser));

router.post('/refresh', jsonParser, ctrlWrapper(refreshUser));

export default router;
