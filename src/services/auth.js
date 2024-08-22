import { randomBytes } from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import handlebars from 'handlebars';
import { userModel } from '../models/user.js';
import createHttpError from 'http-errors';
import {
  FIFTEEN_MINUTES,
  THIRTY_DAYS,
  SMTP,
  TEMPLATE_DIR,
} from '../constants/constants.js';
import { sessionModel } from '../models/session.js';
import { sendMail } from '../utils/sendMail.js';
import path from 'path';
import fs from 'node:fs/promises';
import { validateCode } from '../utils/googleOAuth2.js';

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

export async function resetEmail(email) {
  const user = await userModel.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const jwtToken = jwt.sign(
    {
      sub: user._id,
      email: email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '5m',
    },
  );

  const templateFile = path.join(TEMPLATE_DIR, 'resetPasswordEmail.html');

  const templateSource = await fs.readFile(templateFile, { encoding: 'utf-8' });

  const template = handlebars.compile(templateSource);

  const html = template({
    name: user.name,
    link: `${process.env.APP_DOMAIN}/reset-password?token=${jwtToken}`,
  });

  await sendMail({
    from: SMTP.FROM,
    to: email,
    subject: 'Reset your password',
    html: html,
  });
}

export async function resetPassword(password, token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);

    const user = await userModel.findOne({
      _id: decoded.sub,
      email: decoded.email,
    });

    if (!user) {
      createHttpError(404, 'User not found');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await userModel.findByIdAndUpdate(user._id, { password: hashedPassword });
  } catch (error) {
    if (
      error.name === 'TokenExpiredError' ||
      error.name === 'JsonWebTokenError'
    ) {
      throw createHttpError(401, 'Token is expired or invalid.');
    }
    throw error;
  }
}

export async function loginOrRegisterWithGoogle(code) {
  const ticket = await validateCode(code);
  const payload = ticket.getPayload();

  if (typeof payload === 'undefined') {
    throw createHttpError(401, 'Unauthorized');
  }

  const user = await userModel.findOne({ email: payload.email });
  if (user === null) {
    const password = await bcrypt.hash(randomBytes(30).toString('base64'), 10);
    const createUser = await userModel.create({
      email: payload.email,
      name: payload.name,
      password,
    });

    return sessionModel.create({
      userId: createUser._id,
      accessToken: randomBytes(30).toString('base64'),
      refreshToken: randomBytes(30).toString('base64'),
      accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
      refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
    });
  }

  await sessionModel.deleteOne({ userId: user._id });

  return sessionModel.create({
    userId: user._id,
    accessToken: randomBytes(30).toString('base64'),
    refreshToken: randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  });
}
