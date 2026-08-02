import { BaseProvider, AIProviderContext, AIProviderResponse } from '@/lib/providers/base';
import { StreamHandler } from '@/lib/ai/streaming';

export class OpenRouterProvider extends BaseProvider {
  async generate(context: AIProviderContext): Promise<AIProviderResponse> {
    return {
      text: "This is a mock response from the OpenRouter provider architecture. The real provider is not connected yet.",
    };
  }

  async generateStream(context: AIProviderContext): Promise<ReadableStream> {
    const mockResponseText = "This is a mock streaming response from the OpenRouter provider architecture. The real provider is not connected yet, but the streaming architecture is fully functional and ready for your API key!";
    const generator = StreamHandler.mockStreamGenerator(mockResponseText);
    return StreamHandler.createReadableStream(generator);
  }
}
