import { NextRequest } from 'next/server';
import { AIService } from '@/lib/ai/service';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const { messages, chatId, model = 'auto' } = await req.json();
    
    // Auth check
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || 'anonymous';
    
    // Generate stream using the new AI Service architecture
    const stream = await AIService.generateChatStream(chatId || 'default-chat', messages, model, userId);

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
