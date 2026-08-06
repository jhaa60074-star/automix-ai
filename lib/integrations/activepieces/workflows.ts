/**
 * Activepieces Workflows
 * Handles creation, updating, and management of Activepieces workflows.
 */

import { ActivepiecesClient } from './client';

export class ActivepiecesWorkflows {
  private client: ActivepiecesClient;

  constructor() {
    this.client = new ActivepiecesClient();
  }

  async createWorkflow(name: string, projectId: string) {
    console.log(`[ActivepiecesWorkflows] Creating workflow: ${name}`);
    // return this.client.fetchAPI('/flows', { method: 'POST', body: JSON.stringify({ projectId, name }) });
    return { id: 'mock-workflow-id', name };
  }

  async publishWorkflow(flowId: string) {
    console.log(`[ActivepiecesWorkflows] Publishing workflow: ${flowId}`);
    // return this.client.fetchAPI(`/flows/${flowId}/publish`, { method: 'POST' });
    return { success: true };
  }
}
