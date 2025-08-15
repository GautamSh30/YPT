import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { listMessagesSchema, sendMessageSchema } from '../schemas/message.schema.js';
import * as ctrl from '../controllers/message.controller.js';

const r = Router({ mergeParams: true });

r.get('/:id/messages', requireAuth, validate(listMessagesSchema), ctrl.listForGroup);
r.post('/:id/messages', requireAuth, validate(sendMessageSchema), ctrl.sendToGroup);

export default r;