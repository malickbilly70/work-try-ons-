import crypto from 'crypto';
import { generateAdminToken } from '../utils/auth.js';

function safeCompareStrings(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const { password } = req.body || {};

    // Require ADMIN_PASSWORD_HASH or ADMIN_PASSWORD (fail securely if unconfigured)
    const expectedPassword = process.env.ADMIN_PASSWORD;
    const expectedHash = process.env.ADMIN_PASSWORD_HASH;

    if (!expectedPassword && !expectedHash) {
      console.error('ADMIN_PASSWORD or ADMIN_PASSWORD_HASH environment variable is not configured on server.');
      return res.status(500).json({
        error: 'Administrator authentication is not configured on server.',
      });
    }

    let isValid = false;

    if (expectedHash && password) {
      const inputHash = crypto.createHash('sha256').update(password).digest('hex');
      isValid = safeCompareStrings(inputHash, expectedHash);
    } else if (expectedPassword && password) {
      isValid = safeCompareStrings(password, expectedPassword);
    }

    if (!isValid) {
      return res.status(401).json({
        authenticated: false,
        error: 'Invalid administrator credentials',
      });
    }

    const email = 'admin@mbglobal.com';
    const token = generateAdminToken(email, 24);

    // Set secure HTTP-only cookie with same-site security
    res.setHeader(
      'Set-Cookie',
      `admin_token=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=86400`
    );

    // SECURITY: Do not expose raw session token in JSON payload
    return res.status(200).json({
      authenticated: true,
      email,
      expiresIn: '24h',
    });
  } catch (err) {
    console.error('Error in admin login handler:', err.message || err);
    return res.status(500).json({ error: 'Internal server error during login' });
  }
}
