import { NextRequest } from 'next/server';
import { StreamHandler } from '../../../utils/ai/stream-handler';

export const runtime = 'edge'; // Optional: Use Edge runtime for better streaming performance

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    
    // In the future, this will extract the last message and send it to the AIProvider
    // const responseStream = await aiProvider.generateStream(messages);
    
    // For now, we mock the stream
    const mockResponseText = "This is a mock response from the AI architecture. The real provider is not connected yet, but the streaming architecture is fully functional!";
    const generator = StreamHandler.mockStreamGenerator(mockResponseText);
    const stream = StreamHandler.createReadableStream(generator);

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
