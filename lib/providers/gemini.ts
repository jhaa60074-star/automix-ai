import { BaseProvider, AIProviderContext, AIProviderResponse } from './base';
import { StreamHandler } from '../ai/streaming';

export class GeminiProvider extends BaseProvider {
  async generate(context: AIProviderContext): Promise<AIProviderResponse> {
    return { text: "Mock response from Gemini provider." };
  }
  async generateStream(context: AIProviderContext): Promise<ReadableStream> {
    return StreamHandler.createReadableStream(StreamHandler.mockStreamGenerator("Mock streaming response from Gemini provider."));
  }
}
