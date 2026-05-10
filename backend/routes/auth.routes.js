import express from 'express';
import { loginUser, registerUser } from '../services/auth.service.js';
import { requireAuth } from '../utils/authMiddleware.js';

const router = express.Router();

router.post('/register', (req, res, next) => {
  try {
    res.status(201).json(registerUser(req.body));
  } catch (error) {
    next(error);
  }
});

router.post('/login', (req, res, next) => {
  try {
    res.json(loginUser(req.body));
  } catch (error) {
    next(error);
  }
});

router.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

export default router;
