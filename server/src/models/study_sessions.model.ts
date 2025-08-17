import { query } from '../config/db.js';

export const startSession = async (userId: number, startTime: string) => {
  const { rows } = await query(
    'INSERT INTO study_sessions (user_id, start_time) VALUES ($1, $2) RETURNING id',
    [userId, startTime]
  );
  return rows[0];
};

export const stopSession = async (
  sessionId: number,
  endTime: string,
  durationSeconds: number
) => {
  await query(
    'UPDATE study_sessions SET end_time = $1, duration_seconds = $2 WHERE id = $3',
    [endTime, durationSeconds, sessionId]
  );
};

export const getUserSessions = async (userId: number) => {
  const { rows } = await query(
    'SELECT * FROM study_sessions WHERE user_id = $1 ORDER BY start_time DESC',
    [userId]
  );
  return rows;
};
