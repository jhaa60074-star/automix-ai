const FACEBOOK_GRAPH_URL = `https://graph.facebook.com/v19.0`;
import { createClient } from '../../../utils/supabase/server';

export class InstagramAccounts {
  static async getBusinessAccountFromPage(pageId: string, pageAccessToken: string) {
    // Queries the Facebook Page to find the linked Instagram Business Account
    const response = await fetch(`${FACEBOOK_GRAPH_URL}/${pageId}?fields=instagram_business_account&access_token=${pageAccessToken}`);
    
    if (!response.ok) return null;
    
    const data = await response.json();
    return data.instagram_business_account?.id || null;
  }

  static async getAccountDetails(igAccountId: string, accessToken: string) {
    // Fetch Instagram username and profile picture
    const response = await fetch(`${FACEBOOK_GRAPH_URL}/${igAccountId}?fields=username,profile_picture_url,name&access_token=${accessToken}`);
    
    if (!response.ok) return null;
    return await response.json();
  }

  static async saveAccount(userId: string, accountDetails: any) {
    const supabase = createClient();
    
    await supabase.from('instagram_accounts').upsert({
      user_id: userId,
      facebook_page_id: accountDetails.facebook_page_id,
      instagram_business_id: accountDetails.instagram_business_id,
      username: accountDetails.username,
      profile_picture_url: accountDetails.profile_picture_url,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id,instagram_business_id' });

    // Also mark the general automation connection as connected
    await supabase.from('automation_connections').upsert({
      user_id: userId,
      integration: 'instagram',
      status: 'connected',
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id,integration' });
  }
}
