import { query } from '../config/db.js';

export const listMessages = async (groupId: number, since?: string) => {
  const args: any[] = [groupId];
  let where = 'WHERE group_id=$1';
  if (since) {
    args.push(since);
    where += ` AND created_at > $${args.length}`;
  }
  const { rows } = await query(
    `SELECT id, sender_id, content, created_at FROM messages ${where} ORDER BY created_at ASC LIMIT 200`,
    args
  );
  return rows;
};

export const createMessage = async (groupId: number, senderId: number, content: string) => {
  const { rows } = await query(
    `INSERT INTO messages (group_id, sender_id, content) VALUES ($1, $2, $3) RETURNING id`,
    [groupId, senderId, content]
  );
  return rows;
};