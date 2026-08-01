/**
 * External Webhook payload definitions and parsers.
 * Prepares the architecture to receive data from Shopify, Instagram, WhatsApp, etc.
 */

export class WebhookParser {
  static parseInstagramPayload(payload: any) {
    // Parse Meta webhook payload
    return {
      senderId: payload.entry?.[0]?.messaging?.[0]?.sender?.id,
      message: payload.entry?.[0]?.messaging?.[0]?.message?.text,
    };
  }

  static parseShopifyPayload(payload: any) {
    // Parse Shopify order webhook
    return {
      orderId: payload.id,
      customerEmail: payload.email,
      totalPrice: payload.total_price
    };
  }
}
