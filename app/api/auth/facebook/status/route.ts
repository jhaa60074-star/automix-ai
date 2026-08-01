import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../../utils/supabase/server';

export async function GET(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ connected: false }, { status: 401 });
  }

  // Check if they have an active Instagram account mapped
  const { data: account, error } = await supabase
    .from('instagram_accounts')
    .select('username, profile_picture_url, updated_at')
    .eq('user_id', user.id)
    .single();

  if (error || !account) {
    return NextResponse.json({ connected: false });
  }

  return NextResponse.json({
    connected: true,
    account: {
      username: account.username,
      profile_picture_url: account.profile_picture_url,
      last_sync: account.updated_at
    }
  });
}
