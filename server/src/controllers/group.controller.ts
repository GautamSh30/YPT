import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import {
  createGroup,
  getGroupWithMembers,
  isGroupPrivate,
  joinPublicGroup,
  leaveGroup,
  listGroups,
  isMember,
} from '../models/group.model.js';

type IdParams = { id: string };
type CreateBody = { name?: string; description?: string | null; is_private?: boolean };

// If you've globally augmented Express.Request to include `user`, you can use Request<> directly.
// Otherwise, use this local type.
interface AuthenticatedRequest<P = {}, ResBody = unknown, ReqBody = unknown, ReqQuery = unknown>
  extends Request<P, ResBody, ReqBody, ReqQuery> {
  user: { id: number; email: string };
}

export const list = async (_req: Request, res: Response) => {
  const groups = await listGroups();
  return res.json(groups);
};

export const create = async (
  req: AuthenticatedRequest<{}, unknown, CreateBody>,
  res: Response
) => {
  const userId = req.user.id;

  const name = typeof req.body?.name === 'string' ? req.body.name : '';
  const description: string | null =
    req.body && 'description' in req.body
      ? (req.body.description === null ? null : String(req.body.description))
      : null;
  const is_private: boolean =
    typeof req.body?.is_private === 'boolean' ? req.body.is_private : false;

  if (name.trim().length === 0) {
    return res.status(400).json({ error: 'Name is required' });
  }

  const group = await createGroup({
    name,
    description,
    is_private,
    created_by: userId,
  });

  return res.status(201).json(group);
};

export const get = async (req: Request<IdParams>, res: Response) => {
  const id = Number.parseInt(req.params.id, 10);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid group id' });

  const data = await getGroupWithMembers(id);
  if (!data) return res.status(404).json({ error: 'Group not found' });
  return res.json(data);
};

export const join = async (req: AuthenticatedRequest<IdParams>, res: Response) => {
  const id = Number.parseInt(req.params.id, 10);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid group id' });

  const userId = req.user.id;

  const priv = await isGroupPrivate(id);
  if (priv === undefined) return res.status(404).json({ error: 'Group not found' });
  if (priv) return res.status(400).json({ error: 'Private group; use invite code' });

  await joinPublicGroup(userId, id);
  return res.json({ success: true });
};

export const leave = async (req: AuthenticatedRequest<IdParams>, res: Response) => {
  const id = Number.parseInt(req.params.id, 10);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid group id' });

  const userId = req.user.id;

  if (!(await isMember(userId, id))) {
    return res.status(400).json({ error: 'Not a member' });
  }

  await leaveGroup(userId, id);
  return res.json({ success: true });
};

export const groupsRouter = express.Router();
groupsRouter.get('/groups', list);
groupsRouter.post('/groups', (req: Request, res: Response, next: NextFunction) =>
  (create as any)(req, res, next)
);
groupsRouter.get('/groups/:id', get);
groupsRouter.post('/groups/:id/join', (req: Request, res: Response, next: NextFunction) =>
  (join as any)(req, res, next)
);
groupsRouter.post('/groups/:id/leave', (req: Request, res: Response, next: NextFunction) =>
  (leave as any)(req, res, next)
);
