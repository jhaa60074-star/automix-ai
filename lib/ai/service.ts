import { AIRouter } from './router';
import { MemoryService } from './memory';
import { PromptTemplates } from './prompts';

export class AIService {
  /**
   * Main entry point for chatting
   */
  static async generateChatStream(chatId: string, messages: any[], model: string, userId: string): Promise<ReadableStream> {
    // 1. Get the appropriate provider
    const provider = AIRouter.getProvider(model);
    
    // 2. Ensure system prompt is present
    const formattedMessages = this.ensureSystemPrompt(messages);
    
    // 3. Save the user's latest message to memory
    const latestMessage = formattedMessages[formattedMessages.length - 1];
    if (latestMessage && latestMessage.role === 'user') {
      await MemoryService.saveMessage(chatId, 'user', latestMessage.content);
    }
    
    // 4. Generate stream
    const stream = await provider.generateStream({ messages: formattedMessages, model, stream: true });
    
    // 5. Note: In a real implementation, we would intercept the stream chunks to save the complete assistant response 
    // to Supabase (MemoryService.saveMessage(chatId, 'assistant', fullResponse)) once the stream ends.
    // For now, this requires a transform stream or handling on the client side to save the final message.
    
    // 6. Log basic usage
    await MemoryService.logUsage(userId, 0, 'chat');
    
    return stream;
  }

  /**
   * Main entry point for one-off generations (slash commands, etc)
   */
  static async generateText(prompt: string, model: string, userId: string): Promise<string> {
    const provider = AIRouter.getProvider(model);
    
    const messages = [
      { role: 'system', content: PromptTemplates.defaultSystem },
      { role: 'user', content: prompt }
    ];
    
    const response = await provider.generate({ messages, model });
    
    await MemoryService.logUsage(userId, 0, 'generate');
    
    return response.text;
  }

  private static ensureSystemPrompt(messages: any[]): any[] {
    const hasSystem = messages.some(m => m.role === 'system');
    if (!hasSystem) {
      return [{ role: 'system', content: PromptTemplates.defaultSystem }, ...messages];
    }
    return messages;
  }
}
