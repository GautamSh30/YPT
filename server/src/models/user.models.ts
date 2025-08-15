import { query } from '../config/db.js';
import { toDbColumns } from '../utils/sql.js';

export type User = {
  id: number;
  name: string;
  email: string;
  password_hash?: string | null;
  oauth_provider?: string | null;
  oauth_id?: string | null;
  created_at: string;
};

export const findByEmail = async (email: string) => {
  const { rows } = await query(
    'SELECT * FROM users WHERE email = $1 LIMIT 1',
    [email]
  );
  return rows[0] as User | undefined;
};

export const createUser = async (data: {
  name: string;
  email: string;
  password_hash?: string | null;
  oauth_provider?: string | null;
  oauth_id?: string | null;
}) => {
  const { cols, params, values } = toDbColumns(data);
  const { rows } = await query(
    `INSERT INTO users (${cols}) VALUES (${params}) RETURNING *`,
    values
  );
  return rows[0] as User;
};

export const findById = async (id: number) => {
  const { rows } = await query(
    'SELECT * FROM users WHERE id = $1 LIMIT 1',
    [id]
  );
  return rows[0] as User | undefined;
};
