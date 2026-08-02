import { createClient } from '@/utils/supabase/server';

export class AutomationAnalytics {
  /**
   * Increment a specific metric for an automation workflow
   */
  static async trackEvent(userId: string, integration: string, eventType: string, count: number = 1): Promise<void> {
    const supabase = createClient();
    
    // In a real production scenario, we might use an RPC call to increment efficiently, 
    // or upsert based on date/user/integration for time-series analytics.
    // For Phase 4A, we insert raw events for maximum flexibility.
    
    const { error } = await supabase
      .from('automation_analytics')
      .insert([{
        user_id: userId,
        integration: integration,
        event_type: eventType,
        count: count
      }]);

    if (error) {
      console.error('[AutomationAnalytics] Failed to track event:', error);
    }
  }

  /**
   * Helper for tracking message sent
   */
  static async trackMessageSent(userId: string, integration: string) {
    return this.trackEvent(userId, integration, 'message_sent');
  }

  /**
   * Helper for tracking lead captured
   */
  static async trackLeadCaptured(userId: string, integration: string) {
    return this.trackEvent(userId, integration, 'lead_captured');
  }
}
