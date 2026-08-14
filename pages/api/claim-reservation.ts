import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { reservationId, userId } = req.body || {};
  if (!reservationId || !userId) return res.status(400).json({ message: 'Missing params' });

  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );

  try {
    const { data, error } = await sb
      .from('subdomain_reservations')
      .update({ user_id: userId, updated_at: new Date().toISOString() })
      .eq('id', reservationId)
      .eq('status', 'reserved')
      .select('id')
      .limit(1);

    if (error) return res.status(500).json({ success: false, message: error.message });
    if (!data || data.length === 0) return res.status(404).json({ success: false, message: 'Reservation not found or already claimed' });

    return res.status(200).json({ success: true });
  } catch (err: any) {
    console.error('claim-reservation error', err?.message || err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}
