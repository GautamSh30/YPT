import express from 'express';
import type { Request, Response } from 'express';
import { getActiveSession, pauseSession, startSession, stopSession } from '../models/session.model.js';

type StartBody = { start_time?: string };
type PauseBody = { session_id?: number; pause_time?: string };
type StopBody = { session_id?: number; end_time?: string };

interface AuthenticatedRequest<P = {}, ResBody = unknown, ReqBody = unknown, ReqQuery = unknown>
  extends Request<P, ResBody, ReqBody, ReqQuery> {
  user: { id: number; email: string };
}

export const start = async (req: AuthenticatedRequest<{}, unknown, StartBody>, res: Response) => {
  const userId = req.user.id;
  const { start_time } = req.body ?? {};
  if (typeof start_time !== 'string' || start_time.trim().length === 0) {
    return res.status(400).json({ error: 'start_time is required' });
  }
  const activeRows = await getActiveSession(userId);
  const active = activeRows?.[0];
  if (active) {
    return res.json({ session_id: active.id, active: true, alreadyActive: true });
  }
  const startedRows = await startSession(userId, start_time);
  const session = startedRows?.[0];
  return res
    .status(201)
    .json({ session_id: session.id, start_time: session.start_time, active: true });
};

export const pause = async (req: Request<{}, unknown, PauseBody>, res: Response) => {
  const { session_id, pause_time } = req.body ?? {};
  if (typeof session_id !== 'number' || !Number.isFinite(session_id)) {
    return res.status(400).json({ error: 'session_id must be a number' });
  }
  if (typeof pause_time !== 'string' || pause_time.trim().length === 0) {
    return res.status(400).json({ error: 'pause_time is required' });
  }
  const updatedRows = await pauseSession(session_id, pause_time);
  const updated = updatedRows?.[0];
  if (!updated) return res.status(400).json({ error: 'No active session or already paused' });
  return res.json({ active: false, paused_at: updated.end_time });
};

export const resume = async (_req: Request, res: Response) => {
  return res.json({ active: true });
};

export const stop = async (req: Request<{}, unknown, StopBody>, res: Response) => {
  const { session_id, end_time } = req.body ?? {};
  if (typeof session_id !== 'number' || !Number.isFinite(session_id)) {
    return res.status(400).json({ error: 'session_id must be a number' });
  }
  if (typeof end_time !== 'string' || end_time.trim().length === 0) {
    return res.status(400).json({ error: 'end_time is required' });
  }
  const updatedRows = await stopSession(session_id, end_time);
  const updated = updatedRows?.[0];
  if (!updated) return res.status(400).json({ error: 'Session not found' });
  return res.json({ session_id: updated.id, total_duration: updated.duration_seconds });
};

export const sessionsRouter = express.Router();
sessionsRouter.post('/sessions/start', start as any);
sessionsRouter.post('/sessions/pause', pause);
sessionsRouter.post('/sessions/resume', resume);
sessionsRouter.post('/sessions/stop', stop);
