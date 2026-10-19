import { google } from 'googleapis';

export default async function handler(req, res) {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUri = process.env.VITE_GOOGLE_REDIRECT_URI || 'https://work-try-ons.vercel.app/api/google/oauth/callback';

    const oauth2Client = new google.auth.OAuth2(
      clientId,
      process.env.GOOGLE_CLIENT_SECRET,
      redirectUri
    );

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
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
