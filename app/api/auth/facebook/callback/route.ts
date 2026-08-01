import { NextRequest, NextResponse } from 'next/server';
import { MetaOAuth } from '../../../../../lib/integrations/meta/oauth';
import { TokenService } from '../../../../../lib/integrations/meta/tokens';
import { MetaPages } from '../../../../../lib/integrations/meta/pages';
import { InstagramAccounts } from '../../../../../lib/integrations/meta/instagram';
import { createClient } from '../../../../../utils/supabase/server';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const errorParam = url.searchParams.get('error');

  if (errorParam) {
    return NextResponse.redirect(new URL('/dashboard/automations/instagram?error=auth_denied', req.url));
  }

  if (!code || !state) {
    return NextResponse.redirect(new URL('/dashboard/automations/instagram?error=missing_params', req.url));
  }

  try {
    // Decode state
    const statePayload = JSON.parse(Buffer.from(state, 'base64').toString('utf-8'));
    const userId = statePayload.userId;

    if (!userId) throw new Error('Invalid state payload');

    // 1. Exchange short-lived token
    const tokenData = await MetaOAuth.exchangeCodeForToken(code);
    
    // 2. Exchange for long-lived token
    const longLivedData = await MetaOAuth.getLongLivedToken(tokenData.access_token);
    const finalToken = longLivedData.access_token;
    const expiresIn = longLivedData.expires_in;

    // 3. Store Token Securely
    await TokenService.storeToken(userId, finalToken, expiresIn);

    // 4. Fetch Facebook Pages
    const pages = await MetaPages.getConnectedPages(finalToken);
    
    // 5. Detect Instagram Business Accounts
    let foundIg = false;
    for (const page of pages) {
      const igId = await InstagramAccounts.getBusinessAccountFromPage(page.id, page.access_token || finalToken);
      if (igId) {
        const igDetails = await InstagramAccounts.getAccountDetails(igId, finalToken);
        if (igDetails) {
          await InstagramAccounts.saveAccount(userId, {
            facebook_page_id: page.id,
            instagram_business_id: igId,
            username: igDetails.username,
            profile_picture_url: igDetails.profile_picture_url
          });
          foundIg = true;
          break; // Usually, we connect the first one for Phase 4B
        }
      }
    }

    if (!foundIg) {
      return NextResponse.redirect(new URL('/dashboard/automations/instagram?error=no_ig_business_found', req.url));
    }

    return NextResponse.redirect(new URL('/dashboard/automations/instagram?success=1', req.url));

  } catch (error: any) {
    console.error('OAuth Callback Error:', error);
    return NextResponse.redirect(new URL('/dashboard/automations/instagram?error=internal_error', req.url));
  }
}
