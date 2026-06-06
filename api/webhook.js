import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const sql = neon(process.env.DATABASE_URL);
      const payload = JSON.stringify(req.body);
      await sql`INSERT INTO webhook_events (payload) VALUES (${payload})`;
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
