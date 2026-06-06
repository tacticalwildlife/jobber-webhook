import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const payload = JSON.stringify(req.body);
      await sql`INSERT INTO webhook_events (payload, created_at) VALUES (${payload}, NOW())`;
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: 'Database error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
