import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const payload = JSON.stringify(req.body);
      await sql`CREATE TABLE IF NOT EXISTS webhook_events (id SERIAL PRIMARY KEY, payload TEXT, created_at TIMESTAMP DEFAULT...
