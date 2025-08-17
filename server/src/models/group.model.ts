import { query } from '../config/db.js';

export const listGroups = async () => {
  const { rows } = await query(
    `SELECT g.id, g.name, g.is_private, COUNT(m.user_id)::int AS member_count 
     FROM groups g 
     LEFT JOIN group_members m ON m.group_id = g.id 
     GROUP BY g.id 
     ORDER BY g.is_private ASC, g.created_at DESC`
  );
  return rows;
};

export const createGroup = async (data: { name: string; description?: string | null; is_private?: boolean; created_by: number; }) => {
  const { rows } = await query(
    `INSERT INTO groups (name, description, is_private, created_by) 
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [data.name, data.description ?? null, data.is_private ?? false, data.created_by]
  );
  return rows;
};

export const getGroupWithMembers = async (groupId: number) => {
  const groupRes = await query('SELECT * FROM groups WHERE id=$1', [groupId]);
  const group = groupRes.rows[0];
  if (!group) return null;
  const membersRes = await query(
    `SELECT u.id, u.name, u.email, gm.role 
     FROM group_members gm 
     JOIN users u ON u.id = gm.user_id 
     WHERE gm.group_id=$1`,
    [groupId]
  );
  return { group, members: membersRes.rows };
};

export const joinPublicGroup = async (userId: number, groupId: number) => {
  await query(
    `INSERT INTO group_members (user_id, group_id) 
     VALUES ($1, $2) 
     ON CONFLICT (user_id, group_id) DO NOTHING`,
    [userId, groupId]
  );
};

export const leaveGroup = async (userId: number, groupId: number) => {
  await query('DELETE FROM group_members WHERE user_id=$1 AND group_id=$2', [userId, groupId]);
};

export const isGroupPrivate = async (groupId: number) => {
  const { rows } = await query('SELECT is_private FROM groups WHERE id=$1', [groupId]);
  return rows[0]?.is_private as boolean | undefined;
};

export const isMember = async (userId: number, groupId: number) => {
  const { rows } = await query('SELECT 1 FROM group_members WHERE user_id=$1 AND group_id=$2', [userId, groupId]);
  return !!rows;
};