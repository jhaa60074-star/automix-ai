export interface AIProviderContext {
  messages: any[];
  model?: string;
  stream?: boolean;
}

export interface AIProviderResponse {
  text: string;
}

export abstract class BaseProvider {
  abstract generate(context: AIProviderContext): Promise<AIProviderResponse>;
  abstract generateStream(context: AIProviderContext): Promise<ReadableStream>;
}
