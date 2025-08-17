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
  // Build dynamic column/value lists safely
  const entries = Object.entries(data).filter(([, v]) => v !== undefined);
  if (entries.length === 0) {
    throw new Error('No fields provided for insert');
  }

  const cols = entries.map(([k]) => k).join(', ');
  const params = entries.map(([, _], i) => `$${i + 1}`).join(', ');
  const values = entries.map(([, v]) => v);

  const text = `INSERT INTO users (${cols}) VALUES (${params}) RETURNING *`;

  const { rows } = await query(text, values);
  return rows[0] as User;
};


export const findById = async (id: number) => {
  const { rows } = await query(
    'SELECT * FROM users WHERE id = $1 LIMIT 1',
    [id]
  );
  return rows[0] as User | undefined;
};
