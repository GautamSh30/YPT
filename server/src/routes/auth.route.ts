import { Router } from 'express';
import { login, me, register } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate';
import { registerSchema, loginSchema } from '../schemas/auth.schema';
import { requireAuth } from '../middlewares/auth';

const r = Router();
r.post('/register', validate(registerSchema), register);
r.post('/login', validate(loginSchema), login);
r.get('/me', requireAuth, me);
export default r;