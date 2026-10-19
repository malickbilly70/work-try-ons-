import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed. Use POST or DELETE.' });
  }

  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ error: 'Supabase credentials not configured on server' });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { error } = await supabase.from('admin_tokens').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    if (error) {
      console.error('Error deleting admin tokens from database:', error.message || error);
      return res.status(500).json({ error: 'Failed to remove Google OAuth tokens from database' });
    }

    return res.status(200).json({
      connected: false,
      message: 'Google Calendar OAuth tokens disconnected successfully',
    });
  } catch (err) {
    console.error('Error disconnecting Google OAuth:', err.message || err);
    return res.status(500).json({ error: 'Failed to execute disconnect operation' });
  }
}
