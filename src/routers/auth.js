import express from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  loginUser,
  logOutUser,
  refreshUser,
  registerUser,
  sendResetEmail,
  sendPassword,
  getOAuthUrl,
  loginWithGoogle,
} from '../controllers/auth.js';
import {
  loginValidationSchema,
  registerValidationSchema,
  sendResetEmailSchema,
  resetPasswordSchema,
  loginWithGoogleSchema,
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

router.post(
  '/send-reset-email',
  jsonParser,
  validateBody(sendResetEmailSchema),
  ctrlWrapper(sendResetEmail),
);

router.post(
  '/reset-pwd',
  jsonParser,
  validateBody(resetPasswordSchema),
  ctrlWrapper(sendPassword),
);

router.get('/get-oauth-url', ctrlWrapper(getOAuthUrl));

router.post(
  '/confirm-oauth',
  jsonParser,
  validateBody(loginWithGoogleSchema),
  ctrlWrapper(loginWithGoogle),
);
export default router;
