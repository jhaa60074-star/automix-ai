import { NextRequest, NextResponse } from 'next/server';
import { AIService } from '@/lib/ai/service';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const { prompt, model = 'auto' } = await req.json();
    
    // Auth check
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || 'anonymous';
    
    // Generate text (for slash commands like /summarize, /analyze)
    const responseText = await AIService.generateText(prompt, model, userId);

    return NextResponse.json({ success: true, text: responseText });
  } catch (error: any) {
    console.error('Generate API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
