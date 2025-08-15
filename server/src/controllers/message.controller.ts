import express from 'express';
import type { Request, Response } from 'express';
import { createMessage, listMessages } from '../models/message.model.js';

type GroupParams = { id: string };
type ListQuery = { since?: string };
type SendBody = { message: string };

interface AuthenticatedRequest<
  P = {},
  ResBody = unknown,
  ReqBody = unknown,
  ReqQuery = unknown
> extends Request<P, ResBody, ReqBody, ReqQuery> {
  user: { id: number; email: string };
}

export const listForGroup = async (
  req: Request<GroupParams, unknown, unknown, ListQuery>,
  res: Response
) => {
  const groupId = Number.parseInt(req.params.id, 10);
  if (Number.isNaN(groupId)) {
    return res.status(400).json({ error: 'Invalid group id' });
  }

  const since = req.query.since; 
  const rows = await listMessages(groupId, since);
  return res.json(rows);
};

export const sendToGroup = async (
  req: AuthenticatedRequest<GroupParams, unknown, SendBody>,
  res: Response
) => {
  const groupId = Number.parseInt(req.params.id, 10);
  if (Number.isNaN(groupId)) {
    return res.status(400).json({ error: 'Invalid group id' });
  }

  const senderId = req.user.id;

  const { message } = req.body ?? {};
  if (typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const { id } = await createMessage(groupId, senderId, message);
  return res.status(201).json({ message_id: id });
};

export const messagesRouter = express.Router();

messagesRouter.get('/groups/:id/messages', (req, res) =>
  listForGroup(req as Request<GroupParams, unknown, unknown, ListQuery>, res)
);

messagesRouter.post('/groups/:id/messages', (req, res) =>
  sendToGroup(req as AuthenticatedRequest<GroupParams, unknown, SendBody>, res)
);
