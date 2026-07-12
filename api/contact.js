// Vercel serverless function: verifies Cloudflare Turnstile before relaying to FormSubmit.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { name, email, message, honey, turnstileToken } = req.body || {};

  if (honey) {
    // Honeypot tripped — silently report success without sending anything.
    res.status(200).json({ ok: true });
    return;
  }

  if (!name || !email || !message || !turnstileToken) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  const secret = process.env.TURNSTILE_SECRET_KEY;
  const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      secret,
      response: turnstileToken,
      remoteip: req.headers['x-forwarded-for'] || '',
    }),
  });
  const verifyData = await verifyRes.json();

  if (!verifyData.success) {
    res.status(400).json({ error: 'Verification failed' });
    return;
  }

  const formData = new FormData();
  formData.append('name', name);
  formData.append('email', email);
  formData.append('message', message);
  formData.append('_subject', 'New message from Renvo landing page');

  const submitRes = await fetch('https://formsubmit.co/ajax/RenvoAI@outlook.com', {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: formData,
  });

  if (!submitRes.ok) {
    res.status(502).json({ error: 'Failed to send message' });
    return;
  }

  res.status(200).json({ ok: true });
}
