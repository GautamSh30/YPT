import { Router } from 'express';
import authRoutes from './auth.route.js';
import groupsRoutes from './group.route.js';
import messagesRoutes from './message.route.js';
import sessionsRoutes from './session.route.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/groups', groupsRoutes);
router.use('/groups', messagesRoutes); // nested under /groups/:id/messages
router.use('/sessions', sessionsRoutes);

export default router;

