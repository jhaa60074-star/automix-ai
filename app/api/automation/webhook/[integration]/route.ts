import { NextRequest, NextResponse } from 'next/server';
import { WebhookParser } from '../../../../../lib/automation/webhooks';
import { AutomationEngine } from '../../../../../lib/automation/engine';
import { AutomationQueue } from '../../../../../lib/automation/queue';

export async function POST(req: NextRequest, { params }: { params: { integration: string } }) {
  try {
    const integration = params.integration;
    const payload = await req.json();
    
    console.log(`[Webhook] Received from ${integration}:`, payload);
    
    // Parse based on integration
    let parsedData = null;
    switch(integration) {
      case 'instagram':
        parsedData = WebhookParser.parseInstagramPayload(payload);
        break;
      case 'shopify':
        parsedData = WebhookParser.parseShopifyPayload(payload);
        break;
      default:
        parsedData = payload;
    }
    
    // Enqueue task for processing
    const taskId = await AutomationQueue.enqueue({
      user_id: 'system', // In a real app, resolve user from payload/webhook secret
      workflow_id: 'incoming_webhook',
      integration,
      payload: parsedData
    });

    if (taskId) {
      // Stub: process immediately
      await AutomationEngine.processImmediately({
        id: taskId,
        user_id: 'system',
        workflow_id: 'incoming_webhook',
        integration,
        payload: parsedData
      });
    }
    
    return NextResponse.json({ success: true, received: true });
  } catch (error: any) {
    console.error(`Webhook API Error [${params.integration}]:`, error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
