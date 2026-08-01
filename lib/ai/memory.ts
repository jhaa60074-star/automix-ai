import { createClient } from '../../utils/supabase/server';

export interface ChatMessage {
  id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at?: string;
}

export class MemoryService {
  /**
   * Loads conversation history for a given chat ID.
   */
  static async loadHistory(chatId: string, limit: number = 50): Promise<ChatMessage[]> {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error loading memory:', error);
      return [];
    }
    
    // Reverse to get chronological order
    return data.reverse() as ChatMessage[];
  }

  /**
   * Saves a message to the database.
   */
  static async saveMessage(chatId: string, role: string, content: string): Promise<void> {
    const supabase = createClient();
    
    const { error } = await supabase
      .from('messages')
      .insert([{ chat_id: chatId, role, content }]);

    if (error) {
      console.error('Error saving message:', error);
    }
  }

  /**
   * Logs AI usage for analytics.
   */
  static async logUsage(userId: string, tokens: number, actionType: string = 'chat'): Promise<void> {
    const supabase = createClient();
    
    const { error } = await supabase
      .from('ai_usage')
      .insert([{ user_id: userId, tokens_used: tokens, action_type: actionType }]);

    if (error) {
      console.error('Error logging AI usage:', error);
    }
  }
}
