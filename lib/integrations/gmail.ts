import { AIService } from '@/lib/ai/service';

export class GmailIntegration {
  static async execute(payload: any) {
    console.log('[Gmail] Executing workflow with payload:', payload);
  }
}
