const crypto = require('crypto');

export default function handler(req, res) {
  if (req.method === 'POST') {
    const signature = req.headers['x-jobber-signature'];
    const payload = JSON.stringify(req.body);
    const secret = process.env.JOBBER_WEBHOOK_SECRET;
    
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');
    
    if (signature !== expectedSignature) {
      return res.status(401).json({ error: 'Invalid signature' });
    }
    
    console.log('Webhook received:', req.body);
    res.status(200).json({ success: true });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
