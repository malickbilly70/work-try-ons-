import { google } from 'googleapis';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  const { code, error: queryError } = req.query;

  if (queryError) {
    console.error('Google OAuth Access Denied:', queryError);
    return res.status(400).json({ error: `Google OAuth Authorization Failed: ${queryError}` });
  }

  if (!code) {
    return res.status(400).json({ error: 'Missing authorization code parameter' });
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.VITE_GOOGLE_REDIRECT_URI || 'https://work-try-ons.vercel.app/api/google/oauth/callback';

  if (!clientId || !clientSecret) {
    console.error('Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET environment variables');
    return res.status(500).json({ error: 'OAuth credentials not configured on server' });
  }

  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUri
  );

  let tokens;
  // Step 1: Exchange code for tokens separately
  try {
    const tokenResponse = await oauth2Client.getToken(code);
    tokens = tokenResponse.tokens;
    oauth2Client.setCredentials(tokens);
  } catch (tokenError) {
    console.error('Google OAuth Code Exchange Error:', tokenError.message || tokenError);
    return res.status(500).json({ error: 'Failed to exchange Google OAuth authorization code' });
  }

  if (!tokens || !tokens.access_token) {
    return res.status(500).json({ error: 'Google OAuth token response missing access_token' });
  }

  // Step 2: Fetch account email via UserInfo or ID Token claims
  let accountEmail = 'admin@mbglobal.com';
  try {
    if (tokens.id_token) {
      const ticket = await oauth2Client.verifyIdToken({
        idToken: tokens.id_token,
        audience: clientId,
      });
      const payload = ticket.getPayload();
      if (payload && payload.email) {
        accountEmail = payload.email;
      }
    } else {
      const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
      const userInfo = await oauth2.userinfo.get();
      if (userInfo.data && userInfo.data.email) {
        accountEmail = userInfo.data.email;
      }
    }
  } catch (userInfoError) {
    console.error('Google UserInfo Fetch Warning (fallback used):', userInfoError.message || userInfoError);
  }

  // Step 3: Store credentials securely in Supabase admin_tokens
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { error: dbError } = await supabase.from('admin_tokens').upsert({
        account_email: accountEmail,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token || '',
        expires_at: new Date(tokens.expiry_date || Date.now() + 3600000).toISOString(),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'account_email' });

      if (dbError) {
        console.error('Database token storage error:', dbError.message || dbError);
        return res.status(500).json({ error: 'Failed to store OAuth credentials in database' });
      }
    } catch (supabaseError) {
      console.error('Supabase connection error during token storage:', supabaseError.message || supabaseError);
      return res.status(500).json({ error: 'Database service unavailable for storing OAuth tokens' });
    }
  }

  return res.redirect(302, 'https://work-try-ons.vercel.app?google_connected=true');
}
