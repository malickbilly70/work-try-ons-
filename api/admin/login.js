import { generateAdminToken } from '../utils/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const { password } = req.body || {};
    const expectedPassword = process.env.ADMIN_PASSWORD || 'mbglobal2026';

    if (!password || password !== expectedPassword) {
      return res.status(401).json({
        authenticated: false,
        error: 'Invalid administrator credentials',
      });
    }

    const email = 'admin@mbglobal.com';
    const token = generateAdminToken(email, 24);

    // Set secure HTTP-only cookie
    res.setHeader(
      'Set-Cookie',
      `admin_token=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=86400`
    );

    return res.status(200).json({
      authenticated: true,
      token,
      email,
      expiresIn: '24h',
    });
  } catch (err) {
    console.error('Error in admin login handler:', err.message || err);
    return res.status(500).json({ error: 'Internal server error during login' });
  }
}
