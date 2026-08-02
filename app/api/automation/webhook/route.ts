import { NextRequest, NextResponse } from 'next/server';
import { WebhookParser } from '@/lib/automation/webhooks';

export async function POST(req: NextRequest) {
  try {
    // Determine source from headers or query params
    const source = req.nextUrl.searchParams.get('source') || 'unknown';
    const payload = await req.json();
    
    console.log(`[Webhook] Received from ${source}:`, payload);
    
    // Parse based on source
    let parsedData = null;
    switch(source) {
      case 'instagram':
        parsedData = WebhookParser.parseInstagramPayload(payload);
        break;
      case 'shopify':
        parsedData = WebhookParser.parseShopifyPayload(payload);
        break;
      default:
        parsedData = payload;
    }
    
    // In Phase 4, trigger corresponding internal logic or workflows based on parsedData
    
    return NextResponse.json({ success: true, received: true });
  } catch (error: any) {
    console.error('Webhook API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
