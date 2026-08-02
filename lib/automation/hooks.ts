/**
 * Internal automation hooks that can trigger workflows (e.g. n8n).
 */
import { AutomationQueue } from '@/lib/automation/queue';
import { AutomationEngine } from '@/lib/automation/engine';

export class AutomationHooks {
  /**
   * Triggers an automation workflow asynchronously.
   */
  static async triggerWorkflow(workflowId: string, integration: string, payload: any, userId: string = 'system'): Promise<void> {
    try {
      console.log(`[Automation] Triggering workflow ${workflowId} for ${integration} with payload:`, payload);
      
      const taskId = await AutomationQueue.enqueue({
        user_id: userId,
        workflow_id: workflowId,
        integration,
        payload
      });

      // For Phase 4A, we process immediately as a stub
      if (taskId) {
        await AutomationEngine.processImmediately({
          id: taskId,
          user_id: userId,
          workflow_id: workflowId,
          integration,
          payload
        });
      }
    } catch (error) {
      console.error('Automation Hook Error:', error);
    }
  }

  static async onFileUploaded(userId: string, fileId: string) {
    await this.triggerWorkflow('file-uploaded-trigger', 'system', { fileId }, userId);
  }

  static async onMessageReceived(userId: string, message: string) {
    await this.triggerWorkflow('message-received-trigger', 'system', { message }, userId);
  }
}
