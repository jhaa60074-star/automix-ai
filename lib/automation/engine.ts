import { AutomationQueue, AutomationTask } from './queue';
import { AutomationLogs } from './logs';
import { AutomationAnalytics } from './analytics';

export class AutomationEngine {
  /**
   * Processes an incoming webhook or task immediately
   */
  static async processImmediately(task: AutomationTask): Promise<void> {
    try {
      console.log(`[Engine] Processing task for ${task.integration} instantly...`);
      
      // In the future, this will dynamically call the respective Integration class
      // const integrationHandler = AutomationRouter.getHandler(task.integration);
      // await integrationHandler.execute(task.payload);

      await AutomationLogs.record({
        user_id: task.user_id,
        workflow_id: task.workflow_id,
        automation_type: task.integration,
        status: 'success',
        payload: task.payload
      });

      await AutomationAnalytics.trackEvent(task.user_id, task.integration, 'execution_success');

    } catch (error: any) {
      console.error(`[Engine] Error processing task:`, error);
      
      await AutomationLogs.record({
        user_id: task.user_id,
        workflow_id: task.workflow_id,
        automation_type: task.integration,
        status: 'failed',
        payload: task.payload,
        error: error.message
      });

      await AutomationAnalytics.trackEvent(task.user_id, task.integration, 'execution_failed');
    }
  }
}
