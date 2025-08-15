import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { startSessionSchema, pauseSchema, resumeSchema, stopSchema } from '../schemas/session.schema.js';
import * as ctrl from '../controllers/session.controller.js';

const r = Router();

r.post('/start', requireAuth, validate(startSessionSchema), ctrl.start);
r.post('/pause', requireAuth, validate(pauseSchema), ctrl.pause);
r.post('/resume', requireAuth, validate(resumeSchema), ctrl.resume);
r.post('/stop', requireAuth, validate(stopSchema), ctrl.stop);

export default r;