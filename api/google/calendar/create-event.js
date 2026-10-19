import { createGoogleCalendarEvent } from '../../utils/calendar.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const booking = req.body;

    if (!booking || !booking.id || !booking.date || !booking.time || !booking.userEmail) {
      return res.status(400).json({
        error: 'Missing required booking parameters (id, date, time, userEmail)',
      });
    }

    const calendarResult = await createGoogleCalendarEvent(booking);

    return res.status(200).json({
      success: true,
      googleEventId: calendarResult.googleEventId,
      meetingLink: calendarResult.meetingLink,
      htmlLink: calendarResult.htmlLink,
      accountEmail: calendarResult.accountEmail,
    });
  } catch (err) {
    console.error('Error in create-event handler:', err.message || err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Failed to create Google Calendar event',
    });
  }
}
