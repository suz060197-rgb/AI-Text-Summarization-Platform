import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHttpError } from '../utils/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const USERS_FILE = process.env.USER_STORE_PATH || path.resolve(__dirname, '../data/users.json');
const TOKEN_SECRET = process.env.AUTH_SECRET || 'dev-auth-secret-change-me';
const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

let users = loadUsers();

export function registerUser({ name, email, password }) {
  const normalizedEmail = normalizeEmail(email);
  const displayName = String(name || '').trim();

  if (!displayName) {
    throw createHttpError(400, 'Name is required.');
  }

  validateCredentials(normalizedEmail, password);

  if (users.some((user) => user.email === normalizedEmail)) {
    throw createHttpError(409, 'An account with this email already exists.');
  }

  const user = {
    id: crypto.randomUUID(),
    name: displayName,
    email: normalizedEmail,
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString()
  };

  users.push(user);
  saveUsers();

  return createAuthResponse(user);
}

export function loginUser({ email, password }) {
  const normalizedEmail = normalizeEmail(email);
  validateCredentials(normalizedEmail, password);

  const user = users.find((candidate) => candidate.email === normalizedEmail);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    throw createHttpError(401, 'Invalid email or password.');
  }

  return createAuthResponse(user);
}

export function getUserById(id) {
  const user = users.find((candidate) => candidate.id === id);
  return user ? sanitizeUser(user) : null;
}

export function verifyAuthToken(token) {
  if (!token) {
    throw createHttpError(401, 'Authentication token is required.');
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    throw createHttpError(401, 'Invalid authentication token.');
  }

  const [header, payload, signature] = parts;
  const expectedSignature = sign(`${header}.${payload}`);

  if (!timingSafeEqual(signature, expectedSignature)) {
    throw createHttpError(401, 'Invalid authentication token.');
  }

  let data;
  try {
    data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
  } catch {
    throw createHttpError(401, 'Invalid authentication token.');
  }
  if (Date.now() > data.exp) {
    throw createHttpError(401, 'Authentication token expired.');
  }

  return data;
}

function createAuthResponse(user) {
  return {
    token: createToken(user),
    user: sanitizeUser(user)
  };
}

function createToken(user) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(
    JSON.stringify({
      sub: user.id,
      email: user.email,
      name: user.name,
      exp: Date.now() + TOKEN_TTL_MS
    })
  ).toString('base64url');

  return `${header}.${payload}.${sign(`${header}.${payload}`)}`;
}

function sign(value) {
  return crypto.createHmac('sha256', TOKEN_SECRET).update(value).digest('base64url');
}

function timingSafeEqual(left, right) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, storedHash) {
  const [salt, hash] = storedHash.split(':');
  const attemptedHash = crypto.scryptSync(password, salt, 64).toString('hex');
  return timingSafeEqual(hash, attemptedHash);
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function validateCredentials(email, password) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw createHttpError(400, 'A valid email address is required.');
  }

  if (!password || String(password).length < 6) {
    throw createHttpError(400, 'Password must be at least 6 characters.');
  }
}

function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt
  };
}

function loadUsers() {
  try {
    if (!fs.existsSync(USERS_FILE)) {
      return [];
    }

    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
  } catch (error) {
    console.warn(`Unable to load users: ${error.message}`);
    return [];
  }
}

function saveUsers() {
  fs.mkdirSync(path.dirname(USERS_FILE), { recursive: true });
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}
