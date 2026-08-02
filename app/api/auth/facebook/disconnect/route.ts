import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { TokenService } from '@/lib/integrations/meta/tokens';

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 1. Delete OAuth token
    await TokenService.revokeToken(user.id);

    // 2. Remove Instagram Account Mapping
    await supabase.from('instagram_accounts').delete().eq('user_id', user.id);

    // 3. Update automation_connections status
    await supabase.from('automation_connections').update({
      status: 'disconnected',
      updated_at: new Date().toISOString()
    }).eq('user_id', user.id).eq('integration', 'instagram');

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Disconnect Error:', error);
    return NextResponse.json({ error: 'Failed to disconnect' }, { status: 500 });
  }
}
