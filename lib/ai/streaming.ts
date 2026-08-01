/**
 * Utility functions for handling streaming responses from AI providers.
 * Converts readable streams into Server-Sent Events (SSE) or parses incoming SSE streams.
 */

export class StreamHandler {
  /**
   * Mock implementation of a streaming response.
   * In the future, this will consume the stream from the AIProvider and yield text chunks.
   */
  public static async *mockStreamGenerator(text: string): AsyncGenerator<string, void, unknown> {
    const chunks = text.split(' ');
    for (const chunk of chunks) {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 30));
      yield chunk + ' ';
    }
  }

  /**
   * Helper to convert an async generator into a Web ReadableStream.
   * Useful for Next.js App Router API Routes sending streaming responses.
   */
  public static createReadableStream(generator: AsyncGenerator<string, void, unknown>): ReadableStream {
    const encoder = new TextEncoder();
    return new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of generator) {
            controller.enqueue(encoder.encode(chunk));
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });
  }
}
