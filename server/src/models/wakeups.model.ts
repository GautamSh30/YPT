import { query } from '../config/db.js';

export const createWakeup = async (fromUserId: number, toUserId: number) => {
  const { rows } = await query(
    'INSERT INTO wakeups (from_user_id, to_user_id) VALUES ($1, $2) RETURNING id',
    [fromUserId, toUserId]
  );
  return rows[0];
};

export const getWakeupsForUser = async (userId: number) => {
  const { rows } = await query(
    'SELECT * FROM wakeups WHERE to_user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  return rows;
};
