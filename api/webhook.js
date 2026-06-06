import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const payload = JSON.stringify(req.body);
      await sql`CREATE TABLE IF NOT EXISTS webhook_events (id SERIAL PRIMARY KEY, payload TEXT, created_at TIMESTAMP DEFAULT NOW())`;
      await sql`INSERT INTO webhook_events (payload) VALUES (${payload})`;
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
