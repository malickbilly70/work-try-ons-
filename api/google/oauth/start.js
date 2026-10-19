import { google } from 'googleapis';
import { authenticateAdminRequest, generateOAuthState } from '../../utils/auth.js';

export default async function handler(req, res) {
  // Step 1: Enforce server-side admin authentication
  const adminClaims = authenticateAdminRequest(req);

  if (!adminClaims) {
    return res.status(401).json({
      error: 'Unauthorized: Admin authentication required to initiate Google OAuth flow',
    });
  }

  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUri = process.env.VITE_GOOGLE_REDIRECT_URI || 'https://work-try-ons.vercel.app/api/google/oauth/callback';

    const oauth2Client = new google.auth.OAuth2(
      clientId,
      process.env.GOOGLE_CLIENT_SECRET,
      redirectUri
    );

    // Generate cryptographically signed state parameter bound to admin email
    const state = generateOAuthState(adminClaims.sub || 'admin@mbglobal.com');

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      state,
      scope: [
        'openid',
        'email',
        'profile',
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.events',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
      ],
    });

    return res.redirect(302, authUrl);
  } catch (error) {
    console.error('Error generating Google OAuth URL:', error.message || error);
    return res.status(500).json({ error: 'Failed to initiate Google OAuth flow' });
  }
}
