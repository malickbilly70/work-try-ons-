import { google } from 'googleapis';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    let accessToken = process.env.GOOGLE_ACCESS_TOKEN;
    let refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
    let accountEmail = 'admin@mbglobal.com';

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data, error } = await supabase.from('admin_tokens').select('*').limit(1).single();
      if (data && !error) {
        accessToken = data.access_token;
        refreshToken = data.refresh_token;
        accountEmail = data.account_email;
      }
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.VITE_GOOGLE_REDIRECT_URI || 'https://work-try-ons.vercel.app/api/google/oauth/callback'
    );

    if (accessToken) {
      oauth2Client.setCredentials({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
    }

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    const primaryCalendar = await calendar.calendars.get({ calendarId: 'primary' });

    return res.status(200).json({
      connected: true,
      accountEmail: accountEmail,
      calendarSummary: primaryCalendar.data.summary,
      timeZone: primaryCalendar.data.timeZone || 'Africa/Dar_es_Salaam',
      status: 'synced',
      lastSyncedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Google Calendar API test error:', error.message || error);
    return res.status(500).json({
      connected: false,
      error: error.message || 'Failed to connect to Google Calendar API',
    });
  }
}
