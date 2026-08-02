import { BaseProvider, AIProviderContext, AIProviderResponse } from '@/lib/providers/base';
import { StreamHandler } from '@/lib/ai/streaming';

export class OpenAIProvider extends BaseProvider {
  async generate(context: AIProviderContext): Promise<AIProviderResponse> {
    return { text: "Mock response from OpenAI provider." };
  }
  async generateStream(context: AIProviderContext): Promise<ReadableStream> {
    return StreamHandler.createReadableStream(StreamHandler.mockStreamGenerator("Mock streaming response from OpenAI provider."));
  }
}
