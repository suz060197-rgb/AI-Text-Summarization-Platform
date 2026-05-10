import { getUserById, verifyAuthToken } from '../services/auth.service.js';
import { createHttpError } from './errorHandler.js';

export function requireAuth(req, _res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
    const payload = verifyAuthToken(token);
    const user = getUserById(payload.sub);

    if (!user) {
      throw createHttpError(401, 'User account no longer exists.');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}
