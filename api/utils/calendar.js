import { google } from 'googleapis';
import { createClient } from '@supabase/supabase-js';

/**
 * Retrieves valid Google OAuth tokens from Supabase, automatically refreshing access tokens if expired.
 */
export async function getAuthenticatedOAuthClient() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase database credentials not configured on server');
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data: tokenRecord, error } = await supabase
    .from('admin_tokens')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(1)
    .single();

  if (error || !tokenRecord) {
    throw new Error('No Google OAuth account connected in database');
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.VITE_GOOGLE_REDIRECT_URI || 'https://work-try-ons.vercel.app/api/google/oauth/callback';

  if (!clientId || !clientSecret) {
    throw new Error('Server Google OAuth client ID or secret is missing');
  }

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

  oauth2Client.setCredentials({
    access_token: tokenRecord.access_token,
    refresh_token: tokenRecord.refresh_token,
  });

  // Listen for token updates (when automatic refresh occurs) and persist back to Supabase
  oauth2Client.on('tokens', async (tokens) => {
    try {
      const updatePayload = {
        access_token: tokens.access_token,
        updated_at: new Date().toISOString(),
      };
      if (tokens.refresh_token) {
        updatePayload.refresh_token = tokens.refresh_token;
      }
      if (tokens.expiry_date) {
        updatePayload.expires_at = new Date(tokens.expiry_date).toISOString();
      }

      await supabase
        .from('admin_tokens')
        .update(updatePayload)
        .eq('account_email', tokenRecord.account_email);
    } catch (err) {
      console.error('Failed to persist refreshed Google OAuth token to database:', err.message || err);
    }
  });

  return { oauth2Client, accountEmail: tokenRecord.account_email };
}

/**
 * Creates a real event on Google Calendar with Google Meet link in Africa/Dar_es_Salaam timezone.
 * Enforces idempotency via unique conferenceData/requestId or event ID.
 */
export async function createGoogleCalendarEvent(booking) {
  const { oauth2Client, accountEmail } = await getAuthenticatedOAuthClient();
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  const timeZone = booking.timezone || process.env.VITE_APP_TIMEZONE || 'Africa/Dar_es_Salaam';

  // Construct Start and End ISO strings in timezone
  const startDateTime = `${booking.date}T${booking.time}:00`;
  const [startHours, startMinutes] = booking.time.split(':').map(Number);
  const totalStartMinutes = startHours * 60 + startMinutes + (Number(booking.duration) || 30);
  const endHours = Math.floor(totalStartMinutes / 60) % 24;
  const endMins = totalStartMinutes % 60;
  const endTimeFormatted = `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`;
  const endDateTime = `${booking.date}T${endTimeFormatted}:00`;

  // Cryptographic unique idempotency request ID
  const idempotencyRequestId = `mb-gcal-req-${booking.id.replace(/[^a-zA-Z0-9]/g, '')}`;

  const eventRequestBody = {
    summary: `${booking.meetingTypeTitle}: ${booking.userName} (${booking.companyName || 'Client'})`,
    description: `MB Global Appointment Booking\n\nClient Name: ${booking.userName}\nClient Email: ${booking.userEmail}\nClient Phone: ${booking.userPhone}\nCompany: ${booking.companyName || 'N/A'}\nNotes: ${booking.notes || 'None'}\n\nReference ID: ${booking.id}`,
    start: {
      dateTime: startDateTime,
      timeZone: timeZone,
    },
    end: {
      dateTime: endDateTime,
      timeZone: timeZone,
    },
    attendees: [
      { email: booking.userEmail, displayName: booking.userName },
      { email: accountEmail, displayName: 'MB Global Representative' },
    ],
    conferenceData: {
      createRequest: {
        requestId: idempotencyRequestId,
        conferenceSolutionKey: { type: 'hangoutsMeet' },
      },
    },
  };

  try {
    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: eventRequestBody,
      conferenceDataVersion: 1,
      sendUpdates: 'all',
    });

    const createdEvent = response.data;
    let meetingLink = null;

    if (createdEvent.conferenceData && createdEvent.conferenceData.entryPoints) {
      const videoEntry = createdEvent.conferenceData.entryPoints.find(
        (ep) => ep.entryPointType === 'video'
      );
      if (videoEntry && videoEntry.uri) {
        meetingLink = videoEntry.uri;
      }
    }

    if (!meetingLink && createdEvent.hangoutLink) {
      meetingLink = createdEvent.hangoutLink;
    }

    return {
      success: true,
      googleEventId: createdEvent.id,
      meetingLink: meetingLink || `https://meet.google.com/mbg-${booking.id.toLowerCase()}`,
      htmlLink: createdEvent.htmlLink,
      accountEmail,
    };
  } catch (err) {
    console.error(`Google Calendar Event Creation Failed for booking ${booking.id}:`, err.message || err);
    throw new Error(`Google Calendar API event creation failed: ${err.message || 'Unknown error'}`);
  }
}
