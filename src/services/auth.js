import { randomBytes } from 'crypto';
import bcrypt from 'bcrypt';
import { userModel } from '../models/user.js';
import createHttpError from 'http-errors';
import { FIFTEEN_MINUTES, THIRTY_DAYS } from '../constants/constants.js';
import { sessionModel } from '../models/session.js';

export async function registerNewUser(payload) {
  const user = await userModel.findOne({ email: payload.email });
  if (user) {
    throw createHttpError(409, 'Email in use');
  }
  const encryptedPassword = await bcrypt.hash(payload.password, 10);
  return await userModel.create({ ...payload, password: encryptedPassword });
}

export async function userLogin(payload) {
  const user = await userModel.findOne({ email: payload.email });
  console.log(user);
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const isPasswordEqual = await bcrypt.compare(payload.password, user.password);
  if (!isPasswordEqual) {
    throw createHttpError(401, 'Unauthorized');
  }

  await sessionModel.deleteOne({ userId: user._id });

  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return await sessionModel.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  });
}

export async function userLogOut(sessionId) {
  await sessionModel.deleteOne({ _id: sessionId });
}

function createSession() {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  };
}

export async function refreshUserSession({ sessionId, refreshToken }) {
  const session = await sessionModel.findOne({
    _id: sessionId,
    refreshToken,
  });
  console.log(session);
  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);
  if (isSessionTokenExpired) {
    throw createHttpError(401, 'Session token expired');
  }

  const newSession = createSession();
  await sessionModel.deleteOne({ _id: sessionId, refreshToken });
  console.log(newSession);
  return await sessionModel.create({
    userId: session.userId,
    ...newSession,
  });
}
