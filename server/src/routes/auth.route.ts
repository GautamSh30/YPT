import { Router } from 'express';
import { login, me, register } from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validate.js';
import { registerSchema, loginSchema } from '../schemas/auth.schema.js';
import { requireAuth } from '../middlewares/auth.js';

const r = Router();

r.post('/register', validate(registerSchema), register);
r.post('/login', validate(loginSchema), login);
r.get('/me', requireAuth, me);

export default r;