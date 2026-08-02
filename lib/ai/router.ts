import { BaseProvider } from '@/lib/providers/base';
import { OpenRouterProvider } from '@/lib/providers/openrouter';
import { OllamaProvider } from '@/lib/providers/ollama';
import { OpenAIProvider } from '@/lib/providers/openai';
import { GeminiProvider } from '@/lib/providers/gemini';
import { AnthropicProvider } from '@/lib/providers/anthropic';

export class AIRouter {
  static getProvider(modelName: string): BaseProvider {
    const lowerModel = (modelName || '').toLowerCase();
    
    if (lowerModel.includes('ollama')) {
      return new OllamaProvider();
    }
    
    if (lowerModel.includes('gpt') || lowerModel.includes('openai')) {
      return new OpenAIProvider();
    }
    
    if (lowerModel.includes('gemini')) {
      return new GeminiProvider();
    }
    
    if (lowerModel.includes('claude') || lowerModel.includes('anthropic')) {
      return new AnthropicProvider();
    }
    
    // Default provider for Auto, OpenClaw (mocked via OpenRouter)
    return new OpenRouterProvider();
  }
}
