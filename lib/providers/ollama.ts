import { BaseProvider, AIProviderContext, AIProviderResponse } from './base';
import { StreamHandler } from '../ai/streaming';

export class OllamaProvider extends BaseProvider {
  async generate(context: AIProviderContext): Promise<AIProviderResponse> {
    return {
      text: "This is a mock response from the local Ollama provider.",
    };
  }

  async generateStream(context: AIProviderContext): Promise<ReadableStream> {
    const mockResponseText = "This is a mock streaming response from the local Ollama provider. Local endpoint architecture is prepared!";
    const generator = StreamHandler.mockStreamGenerator(mockResponseText);
    return StreamHandler.createReadableStream(generator);
  }
}
