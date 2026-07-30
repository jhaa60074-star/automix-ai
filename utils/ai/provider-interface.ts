export type Role = 'system' | 'user' | 'assistant';

export interface Message {
  id?: string;
  role: Role;
  content: string;
  createdAt?: Date;
  attachment?: {
    name: string;
    type: string;
    size: number;
    url: string;
    timestamp: number;
  };
}

export interface ChatConfig {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export interface AIProvider {
  /**
   * Send a list of messages to the AI provider and get a string response.
   */
  generateResponse(messages: Message[], config?: ChatConfig): Promise<string>;

  /**
   * Send a list of messages and receive a stream (e.g., using Server-Sent Events or async generators).
   */
  generateStream(messages: Message[], config?: ChatConfig): Promise<ReadableStream>;
}

// Prepare enum/types for the supported providers
export type ProviderName = 
  | 'openclaw' 
  | 'ollama' 
  | 'openai' 
  | 'claude' 
  | 'gemini' 
  | 'deepseek' 
  | 'qwen';
