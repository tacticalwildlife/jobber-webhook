export default function handler(req, res) {
  if (req.method === 'POST') {
    console.log('Webhook received:', JSON.stringify(req.body));
    res.status(200).json({ success: true });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
