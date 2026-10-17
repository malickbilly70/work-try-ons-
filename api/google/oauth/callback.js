import { google } from 'googleapis';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'Missing authorization code' });
  }

  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.VITE_GOOGLE_REDIRECT_URI || 'https://work-try-ons.vercel.app/api/google/oauth/callback';

    const oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectUri
    );

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Get user info
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const userInfo = await oauth2.userinfo.get();
    const accountEmail = userInfo.data.email || 'admin@mbglobal.com';

    // Store securely in Supabase admin_tokens
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      await supabase.from('admin_tokens').upsert({
        account_email: accountEmail,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_at: new Date(tokens.expiry_date || Date.now() + 3600000).toISOString(),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'account_email' });
    }

    return res.redirect(302, 'https://work-try-ons.vercel.app?google_connected=true');
  } catch (error) {
    console.error('Error exchanging Google OAuth code:', error);
    return res.status(500).json({ error: 'Failed to exchange authorization code' });
  }
}
