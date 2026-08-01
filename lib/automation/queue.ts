import { createClient } from '../../utils/supabase/server';

export interface AutomationTask {
  id?: string;
  user_id: string;
  workflow_id: string;
  integration: string;
  payload: any;
  status?: 'queued' | 'running' | 'completed' | 'failed' | 'retry';
  retry_count?: number;
  created_at?: string;
}

export class AutomationQueue {
  /**
   * Enqueue a new automation task
   */
  static async enqueue(task: AutomationTask): Promise<string | null> {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('automation_queue')
      .insert([{
        user_id: task.user_id,
        workflow_id: task.workflow_id,
        integration: task.integration,
        payload: task.payload,
        status: 'queued',
        retry_count: 0
      }])
      .select('id')
      .single();

    if (error) {
      console.error('[AutomationQueue] Failed to enqueue task:', error);
      return null;
    }
    
    return data.id;
  }

  /**
   * Update task status
   */
  static async updateStatus(taskId: string, status: 'running' | 'completed' | 'failed' | 'retry', errorMsg?: string) {
    const supabase = createClient();
    const updateData: any = { status };
    if (errorMsg) updateData.error_message = errorMsg;
    
    await supabase.from('automation_queue').update(updateData).eq('id', taskId);
  }
}
