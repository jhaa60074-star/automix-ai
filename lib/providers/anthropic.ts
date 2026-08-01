import { BaseProvider, AIProviderContext, AIProviderResponse } from './base';
import { StreamHandler } from '../ai/streaming';

export class AnthropicProvider extends BaseProvider {
  async generate(context: AIProviderContext): Promise<AIProviderResponse> {
    return { text: "Mock response from Anthropic provider." };
  }
  async generateStream(context: AIProviderContext): Promise<ReadableStream> {
    return StreamHandler.createReadableStream(StreamHandler.mockStreamGenerator("Mock streaming response from Anthropic provider."));
  }
}
