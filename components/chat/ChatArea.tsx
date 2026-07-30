'use client';

import React, { useState, useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import { Message } from '../../utils/ai/provider-interface';
import FileUpload from './FileUpload';
import ExportMenu from './ExportMenu';

interface ChatAreaProps {
  initialMessages?: Message[];
}

export default function ChatArea({ initialMessages = [] }: ChatAreaProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Prevent background scrolling while chat is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleSend = async () => {
    if (!input.trim() && !showUpload) return;
    
    const userMessage: Message = {
      role: 'user',
      content: input,
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setShowUpload(false); // Hide upload after sending if open

    try {
      // Mock API call to our streaming endpoint
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] })
      });

      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      
      let aiMessageContent = '';
      
      // Add empty assistant message that will be updated
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        aiMessageContent += chunk;
        
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].content = aiMessageContent;
          return newMessages;
        });
      }
    } catch (error) {
      console.error('Failed to get AI response:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again later.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleExportPDF = () => {
    alert('Export to PDF functionality will be implemented here.');
  };

  const handleExportMarkdown = () => {
    let md = '';
    messages.forEach(m => {
      md += `### ${m.role === 'user' ? 'You' : 'AI'}\n${m.content}\n\n`;
    });
    
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'conversation.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleNewChat = () => {
    setMessages(initialMessages);
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  return (
    <div className="chat-main" data-theme="light" style={{ backgroundColor: '#ffffff', color: '#111827', height: 'calc(100vh - 64px)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '1rem', display: 'flex', justifyContent: 'flex-end', borderBottom: '1px solid #e5e7eb' }}>
        <ExportMenu 
          onExportPDF={handleExportPDF} 
          onExportMarkdown={handleExportMarkdown}
          onNewChat={handleNewChat}
          onClearChat={handleClearChat}
        />
      </div>

      <div className="chat-messages-container">
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '4rem', color: '#94a3b8' }}>
            <h2>How can I help you today?</h2>
            <p>Start a conversation or upload a file.</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <MessageBubble key={index} message={msg} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        {showUpload && (
          <div style={{ maxWidth: '800px', margin: '0 auto 1rem' }}>
            <FileUpload onFilesSelected={(files) => console.log('Files selected:', files)} />
          </div>
        )}
        
        <div className="chat-input-wrapper">
          <button 
            className="icon-btn" 
            onClick={() => setShowUpload(!showUpload)}
            title="Attach file"
          >
            📎
          </button>
          <textarea 
            className="chat-textarea"
            placeholder="Type your message here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            rows={1}
          />
          <button 
            className={`icon-btn ${input.trim() ? 'primary' : ''}`}
            onClick={handleSend}
            disabled={isLoading || (!input.trim() && !showUpload)}
          >
            {isLoading ? '...' : '➤'}
          </button>
        </div>
      </div>
    </div>
  );
}
