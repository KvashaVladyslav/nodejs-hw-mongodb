import createHttpError from 'http-errors';
import { THIRTY_DAYS } from '../constants/constants.js';
import {
  refreshUserSession,
  registerNewUser,
  resetEmail,
  resetPassword,
  userLogin,
  userLogOut,
} from '../services/auth.js';

export async function registerUser(req, res, next) {
  const user = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };

  const newUser = await registerNewUser(user);
  console.log(newUser);
  res.status(201).send({
    status: 201,
    message: 'Successfully registered a user!',
    data: newUser,
  });
}

export async function loginUser(req, res, next) {
  const session = await userLogin(req.body);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });

  res.status(200).send({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
}

export async function logOutUser(req, res, next) {
  if (req.cookies.sessionId) {
    await userLogOut(req.cookies.sessionId);
  }
  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
}

function setupSession(res, session) {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });
}

export async function refreshUser(req, res, next) {
  const session = await refreshUserSession({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });
  setupSession(res, session);
  res.status(200).send({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: { accessToken: session.accessToken },
  });
}

export async function sendResetEmail(req, res, next) {
  await resetEmail(req.body.email);
  res.send({
    status: 200,
    message: 'Reset password email has been successfully sent',
    data: {},
  });
  next(
    createHttpError({
      status: 500,
      message: 'Failed to send the email please try again later.',
    }),
  );
}

export async function sendPassword(req, res, next) {
  const { password, token } = req.body;

  await resetPassword(password, token);

  res.send({
    status: 200,
    message: 'Password has been successfully reset.',
    data: {},
  });
}
