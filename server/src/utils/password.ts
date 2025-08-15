import bcrypt from 'bcrypt';
import { env } from '../config/env.js';

export const hashPassword = (plain: string) => bcrypt.hash(plain, env.bcryptRounds);

export const comparePassword = (plain: string, hash: string) => bcrypt.compare(plain, hash);
