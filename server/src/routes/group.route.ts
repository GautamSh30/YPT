import { Router } from 'express';
import { requireAuth } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { createGroupSchema, groupIdParam } from '../schemas/groups.schema';
import * as ctrl from '../controllers/groups.controller';

const r = Router();

r.get('/', requireAuth, ctrl.list);
r.post('/', requireAuth, validate(createGroupSchema), ctrl.create);
r.get('/:id', requireAuth, validate(groupIdParam), ctrl.get);
r.post('/:id/join', requireAuth, validate(groupIdParam), ctrl.join);
r.delete('/:id/leave', requireAuth, validate(groupIdParam), ctrl.leave);

export default r;