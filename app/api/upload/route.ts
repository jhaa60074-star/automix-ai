import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../utils/supabase/server';
import { FileParser } from '../../../lib/files/parser';
import { AutomationHooks } from '../../../lib/automation/hooks';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const chatId = formData.get('chatId') as string | null;

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Upload to Supabase Storage
    const fileExt = file.name.split('.').pop();
    const filePath = `${user.id}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    const buffer = await file.arrayBuffer();
    
    const { data, error } = await supabase.storage
      .from('ai_uploads')
      .upload(filePath, buffer, {
        contentType: file.type,
      });
      
    if (error) {
      throw error;
    }
    
    // Extract text using File Intelligence (Phase 3B)
    try {
      const extractedText = await FileParser.extractText(buffer, file.type, file.name);
      console.log(`[File Intelligence] Extracted ${extractedText.length} characters from ${file.name}`);
      // Future: Store extractedText in vector DB or memory table
    } catch (parseError) {
      console.warn('[File Intelligence] Skipping parse for unsupported or unreadable file:', parseError);
    }
    
    // Insert record into public.attachments table
    const { data: attachmentData, error: dbError } = await supabase
      .from('attachments')
      .insert({
        user_id: user.id,
        chat_id: chatId || null,
        storage_path: data.path,
        file_name: file.name,
        file_type: file.type,
        size: file.size
      })
      .select()
      .single();

    if (dbError) {
      console.error('Failed to insert file record into attachments:', dbError);
    } else {
      // Trigger Automation Hook
      await AutomationHooks.onFileUploaded(user.id, attachmentData.id);
    }

    return NextResponse.json({ 
      success: true, 
      file: {
        name: file.name,
        size: file.size,
        type: file.type,
        path: data.path
      }
    });
    
  } catch (error: any) {
    console.error('Upload API Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to upload file' }, { status: 500 });
  }
}
