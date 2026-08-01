import { createClient } from '../../utils/supabase/server';

export interface LogEntry {
  user_id: string;
  workflow_id: string;
  automation_type: string;
  status: 'success' | 'failed' | 'warning';
  payload?: any;
  response?: any;
  error?: string;
  duration_ms?: number;
}

export class AutomationLogs {
  /**
   * Log an automation execution
   */
  static async record(entry: LogEntry): Promise<void> {
    const supabase = createClient();
    
    const { error } = await supabase
      .from('automation_logs')
      .insert([{
        user_id: entry.user_id,
        workflow_id: entry.workflow_id,
        automation_type: entry.automation_type,
        status: entry.status,
        payload: entry.payload,
        response: entry.response,
        error_message: entry.error,
        duration_ms: entry.duration_ms
      }]);

    if (error) {
      console.error('[AutomationLogs] Failed to record log:', error);
    }
  }
}
