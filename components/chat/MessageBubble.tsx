import React from 'react';
import { Message } from '@/utils/ai/provider-interface';

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  
  return (
    <div className={`message-wrapper ${isUser ? 'user' : 'assistant'}`}>
      <div className="message-avatar">
        {isUser ? 'U' : 'AI'}
      </div>
      <div className="message-content">
        {/* In the future, we will use a markdown parser here */}
        {message.content}
      </div>
    </div>
  );
}
