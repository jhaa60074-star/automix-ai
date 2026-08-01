import { AIService } from '../ai/service';

export class WebsiteIntegration {
  static async execute(payload: any) {
    console.log('[Website] Executing workflow with payload:', payload);
  }
}
