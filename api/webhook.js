import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const signature = req.headers['x-jobber-signature'];
    const secret = process.env.JOBBER_WEBHOOK_SECRET;
    
    if (!signature || !secret) {
      return res.status(400).json({ error: 'Missing signature or secret' });
    }
    
    const rawBody = await getRawBody(req);
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');
    
    if (signature !== expectedSignature) {
      return res.status(401).json({ error: 'Invalid signature' });
    }
    
    console.log('Webhook received:', JSON.parse(rawBody.toString()));
    res.status(200).json({ success: true });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => { data += chunk; });
    req.on('end', () => resolve(Buffer.from(data)));
    req.on('error', reject);
  });
}
