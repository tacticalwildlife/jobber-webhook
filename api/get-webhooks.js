import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  try {
    const sql = neon(process.env.DATABASE_URL);
    const result = await sql`SELECT * FROM webhook_events ORDER BY created_at DESC LIMIT 10`;
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
