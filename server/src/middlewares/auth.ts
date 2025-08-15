import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../config/jwt.js';

export interface AuthRequest extends Request {
  user?: { id: number; email: string };
}

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = header.split(' ')[1]; 

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const payload = verifyJwt<{ id: number; email: string }>(token);
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
