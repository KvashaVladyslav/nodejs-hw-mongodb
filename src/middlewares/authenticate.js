import createHttpError from 'http-errors';
import { sessionModel } from '../models/session.js';
import { userModel } from '../models/user.js';

export async function authenticate(req, res, next) {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    next(createHttpError(401, 'Please provide Authorization header'));
    return;
  }
  const bearer = authHeader.split(' ')[0];
  const token = authHeader.split(' ')[1];

  if (bearer !== 'Bearer' || !token) {
    next(createHttpError(401, 'Auth header should be of type Bearer'));
    return;
  }

  const session = await sessionModel.findOne({ accessToken: token });
  console.log(session);
  if (!session) {
    next(createHttpError(401, 'Session not found'));
    return;
  }

  const isAccessTokenExpired =
    new Date() > new Date(session.accessTokenValidUntil);

  if (isAccessTokenExpired) {
    next(createHttpError(401, 'Access token expired'));
    return;
  }

  const user = await userModel.findById(session.userId);
  if (!user) {
    next(createHttpError(401));
    return;
  }

  req.user = user;

  next();
}
