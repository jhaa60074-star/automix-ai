/**
 * Activepieces Connections
 * Manages OAuth connections and synchronization with Supabase.
 */

import { createClient } from '@/utils/supabase/server';
import { ActivepiecesClient } from './client';

export class ActivepiecesConnections {
  
  static async getAppConnectionStatus(userId: string, appName: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('activepieces_connections')
      .select('*')
      .eq('user_id', userId)
      .eq('service', appName)
      .single();

    if (error || !data) {
      return { connected: false };
    }

    return { connected: true, details: data };
  }

  static async initiateOAuth(appName: string, redirectUrl: string) {
    // In production, this would request an OAuth URL from Activepieces for the specific app
    console.log(`[ActivepiecesConnections] Initiating OAuth for ${appName}`);
    return `/api/auth/callback/activepieces?app=${appName}`; 
  }
}
