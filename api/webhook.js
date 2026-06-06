import { sql } from '@neondatabase/serverless';

const queryClient = sql(process.env.DATABASE_URL);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const payload = JSON.stringify(req.body);
      await queryClient('INSERT INTO webhook_events (payload) VALUES ($1)', [payload]);
      res.status(200).json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to store webhook' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}...
