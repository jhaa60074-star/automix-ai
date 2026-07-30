import { Message } from './provider-interface';

/**
 * MemoryManager is responsible for managing the conversation context.
 * It handles adding new messages, truncating history if it exceeds token limits,
 * and formatting the history for the provider.
 */
export class MemoryManager {
  private history: Message[] = [];
  private maxHistoryContext: number;

  constructor(maxHistoryContext: number = 20) {
    this.maxHistoryContext = maxHistoryContext;
  }

  /**
   * Adds a new message to the conversation history.
   */
  public addMessage(message: Message) {
    this.history.push(message);
    this.enforceContextWindow();
  }

  /**
   * Retrieves the current conversation context.
   */
  public getContext(): Message[] {
    return [...this.history];
  }

  /**
   * Clears the current conversation history.
   */
  public clearHistory() {
    this.history = [];
  }

  /**
   * Loads a previous conversation history.
   */
  public loadHistory(messages: Message[]) {
    this.history = [...messages];
    this.enforceContextWindow();
  }

  /**
   * Ensures the context window does not exceed the maximum allowed messages.
   * Note: In a real implementation, this would likely be based on token count rather than message count.
   */
  private enforceContextWindow() {
    if (this.history.length > this.maxHistoryContext) {
      // Keep the system prompt if it exists (usually the first message)
      const systemPrompt = this.history.length > 0 && this.history[0].role === 'system' ? this.history[0] : null;
      
      const newHistory = this.history.slice(this.history.length - this.maxHistoryContext);
      
      if (systemPrompt && newHistory[0].role !== 'system') {
        newHistory.unshift(systemPrompt);
      }
      
      this.history = newHistory;
    }
  }
}
