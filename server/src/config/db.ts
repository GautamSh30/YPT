import pkg from 'pg';
const { Pool } = pkg;
import { env } from './env.js';

export const pool = new Pool({ connectionString: env.dbUrl });
pool.on('error', (err) => {
    console.error('Unexpected PG error', err);
    process.exit(1);
});

export const query = (text: string, params?: any[]) => pool.query(text, params);