import { query } from '../config/db.js';

export const getActiveSession = async (userId: number) => {
  const { rows } = await query(
    `SELECT * FROM study_sessions
     WHERE user_id = $1 AND end_time IS NULL
     ORDER BY start_time DESC
     LIMIT 1`,
    [userId]
  );
  return rows;
};

export const startSession = async (userId: number, start_time: string) => {
  const { rows } = await query(
    `INSERT INTO study_sessions (user_id, start_time)
     VALUES ($1, $2)
     RETURNING *`,
    [userId, start_time]
  );
  return rows;
};

export const pauseSession = async (sessionId: number, pauseTime: string) => {
  const { rows } = await query(
    `UPDATE study_sessions
     SET end_time = $2
     WHERE id = $1 AND end_time IS NULL
     RETURNING *`,
    [sessionId, pauseTime]
  );
  return rows;
};

export const resumeSession = async (_sessionId: number) => {
  return { ok: true };
};

export const stopSession = async (sessionId: number, end_time: string) => {
  const { rows } = await query(
    `UPDATE study_sessions
     SET end_time = $2,
         duration_seconds = EXTRACT(EPOCH FROM ($2::timestamp - start_time))
     WHERE id = $1
     RETURNING *`,
    [sessionId, end_time]
  );
  return rows;
};
