import jwt from 'jsonwebtoken';
import { env } from './env.js';

export const signJwt = (payload: object, expiresIn = '7d') =>
jwt.sign(payload, env.jwtSecret, { expiresIn });

export const verifyJwt = <T>(token: string): T =>
jwt.verify(token, env.jwtSecret) as T;