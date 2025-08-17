import { query } from '../config/db.js';

export const createInvite = async (groupId: number, invitedEmail: string) => {
  const { rows } = await query(
    'INSERT INTO group_invites (group_id, invited_email) VALUES ($1, $2) RETURNING id',
    [groupId, invitedEmail]
  );
  return rows[0];
};

export const getInviteByEmail = async (groupId: number, email: string) => {
  const { rows } = await query(
    'SELECT * FROM group_invites WHERE group_id = $1 AND invited_email = $2',
    [groupId, email]
  );
  return rows[0];
};

export const updateInviteStatus = async (inviteId: number, status: string) => {
  await query(
    'UPDATE group_invites SET status = $1 WHERE id = $2',
    [status, inviteId]
  );
};
