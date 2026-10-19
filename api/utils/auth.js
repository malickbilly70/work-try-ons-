import crypto from 'crypto';

const DEFAULT_ADMIN_SECRET = process.env.ADMIN_SECRET || process.env.GOOGLE_CLIENT_SECRET || 'mb-global-secure-admin-secret-key-32chars';

/**
 * Creates a signed HMAC SHA256 JWT-style token
 */
export function generateAdminToken(email = 'admin@mbglobal.com', expiresInHours = 24) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = {
    sub: email,
    role: 'admin',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + expiresInHours * 3600,
  };

  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', DEFAULT_ADMIN_SECRET)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64url');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

/**
 * Verifies a signed HMAC SHA256 token
 */
export function verifyAdminToken(token) {
  if (!token || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [encodedHeader, encodedPayload, signature] = parts;

  const expectedSignature = crypto
    .createHmac('sha256', DEFAULT_ADMIN_SECRET)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64url');

  if (signature !== expectedSignature) return null;

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired
    }
    return payload;
  } catch (err) {
    return null;
  }
}

/**
 * Helper middleware function to extract and verify admin credentials from Request headers or cookies
 */
export function authenticateAdminRequest(req) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  let token = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies && req.cookies.admin_token) {
    token = req.cookies.admin_token;
  } else if (req.query && req.query.admin_token) {
    token = req.query.admin_token;
  }

  return verifyAdminToken(token);
}

/**
 * Generate cryptographically signed state parameter bound to admin session
 */
export function generateOAuthState(adminEmail) {
  const payload = {
    adminEmail,
    timestamp: Date.now(),
    nonce: crypto.randomBytes(16).toString('hex'),
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', DEFAULT_ADMIN_SECRET)
    .update(encoded)
    .digest('base64url');

  return `${encoded}.${signature}`;
}

/**
 * Verify state parameter signature and binding
 */
export function verifyOAuthState(state) {
  if (!state || typeof state !== 'string') return null;

  const parts = state.split('.');
  if (parts.length !== 2) return null;

  const [encoded, signature] = parts;
  const expectedSignature = crypto
    .createHmac('sha256', DEFAULT_ADMIN_SECRET)
    .update(encoded)
    .digest('base64url');

  if (signature !== expectedSignature) return null;

  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
    // State expires after 15 minutes
    if (Date.now() - payload.timestamp > 15 * 60 * 1000) {
      return null;
    }
    return payload;
  } catch (err) {
    return null;
  }
}
