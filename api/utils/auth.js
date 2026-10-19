import crypto from 'crypto';

/**
 * Gets the configured admin signing secret.
 * Returns null if not configured (fails securely without hardcoded fallbacks).
 */
function getAdminSecret() {
  const secret = process.env.ADMIN_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret || typeof secret !== 'string' || secret.trim().length < 16) {
    return null;
  }
  return secret.trim();
}

/**
 * Perform constant-time string comparison to prevent timing attacks
 */
function safeCompareStrings(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Creates a signed HMAC SHA256 JWT-style token
 */
export function generateAdminToken(email = 'admin@mbglobal.com', expiresInHours = 24) {
  const secret = getAdminSecret();
  if (!secret) {
    throw new Error('ADMIN_SECRET environment variable is not securely configured.');
  }

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
    .createHmac('sha256', secret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64url');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

/**
 * Verifies a signed HMAC SHA256 token with strict claims and constant-time signature comparison
 */
export function verifyAdminToken(token) {
  const secret = getAdminSecret();
  if (!secret || !token || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [encodedHeader, encodedPayload, signature] = parts;

  // Validate algorithm in header
  try {
    const header = JSON.parse(Buffer.from(encodedHeader, 'base64url').toString('utf8'));
    if (!header || header.alg !== 'HS256' || header.typ !== 'JWT') {
      return null;
    }
  } catch (e) {
    return null;
  }

  // Constant-time signature comparison
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64url');

  if (!safeCompareStrings(signature, expectedSignature)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'));

    // Validate required claims and role
    if (!payload || payload.role !== 'admin' || !payload.sub) {
      return null;
    }

    // Validate expiration
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired
    }

    return payload;
  } catch (err) {
    return null;
  }
}

/**
 * Parse cookies from Cookie header string
 */
export function parseCookies(cookieHeader) {
  const list = {};
  if (!cookieHeader) return list;

  cookieHeader.split(';').forEach((cookie) => {
    let [name, ...rest] = cookie.split('=');
    name = name?.trim();
    if (!name) return;
    const value = rest.join('=').trim();
    if (!value) return;
    list[name] = decodeURIComponent(value);
  });

  return list;
}

/**
 * Helper middleware function to extract and verify admin credentials.
 * SECURITY: Never accepts tokens via URL query parameters.
 */
export function authenticateAdminRequest(req) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  let token = null;

  if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else {
    const cookies = parseCookies(req.headers.cookie);
    token = cookies.admin_token;
  }

  return verifyAdminToken(token);
}

/**
 * Generate cryptographically signed state parameter bound to admin session
 */
export function generateOAuthState(adminEmail) {
  const secret = getAdminSecret();
  if (!secret) {
    throw new Error('ADMIN_SECRET environment variable is missing.');
  }

  const payload = {
    adminEmail,
    timestamp: Date.now(),
    nonce: crypto.randomBytes(16).toString('hex'),
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', secret)
    .update(encoded)
    .digest('base64url');

  return `${encoded}.${signature}`;
}

/**
 * Verify state parameter signature and binding in constant-time
 */
export function verifyOAuthState(state) {
  const secret = getAdminSecret();
  if (!secret || !state || typeof state !== 'string') return null;

  const parts = state.split('.');
  if (parts.length !== 2) return null;

  const [encoded, signature] = parts;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(encoded)
    .digest('base64url');

  if (!safeCompareStrings(signature, expectedSignature)) {
    return null;
  }

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
