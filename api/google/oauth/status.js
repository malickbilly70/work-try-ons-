import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return res.status(200).json({
        connected: false,
        accountEmail: null,
        error: 'Supabase credentials not configured on server',
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase
      .from('admin_tokens')
      .select('account_email, updated_at, expires_at')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !data || !data.account_email) {
      return res.status(200).json({
        connected: false,
        accountEmail: null,
      });
    }

    // Return status without revealing access or refresh tokens
    return res.status(200).json({
      connected: true,
      accountEmail: data.account_email,
      lastSyncedAt: data.updated_at || new Date().toISOString(),
      timeZone: 'Africa/Dar_es_Salaam',
    });
  } catch (err) {
    console.error('Error fetching Google OAuth status:', err.message || err);
    return res.status(500).json({
      connected: false,
      error: 'Failed to verify server-side connection status',
    });
  }
}
