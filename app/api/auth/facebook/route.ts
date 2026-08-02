import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { MetaOAuth } from '@/lib/integrations/meta/oauth';
import crypto from 'crypto';

export async function GET(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Generate a CSRF state token
  const state = crypto.randomBytes(16).toString('hex');
  
  // In a real production app, store this state in an httpOnly cookie to verify in the callback
  // For this implementation, we will pass the user.id inside the state (encrypted/encoded) or just use standard state
  const statePayload = Buffer.from(JSON.stringify({ userId: user.id, nonce: state })).toString('base64');

  const authUrl = MetaOAuth.getAuthUrl(statePayload);

  return NextResponse.redirect(authUrl);
}
