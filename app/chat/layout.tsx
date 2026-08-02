'use client';

import React, { useState } from 'react';
import ChatSidebar from '@/components/chat/ChatSidebar';
import { usePathname } from 'next/navigation';

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  
  // Extract active ID if on a specific chat page
  const activeId = pathname.split('/').pop();
  
  // Mock conversations for now
  const mockConversations = [
    { id: '1', title: 'Data Analysis for Q3', updated_at: '2026-07-28' },
    { id: '2', title: 'Marketing Copy Generation', updated_at: '2026-07-27' },
    { id: '3', title: 'Code Refactoring Help', updated_at: '2026-07-26' },
  ];

  return (
    <div className="chat-layout">
      {/* Mobile toggle button */}
      <div className="mobile-toggle" style={{ position: 'absolute', zIndex: 50, padding: '1rem', display: 'none' /* Will use media queries in real impl */ }}>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>☰</button>
      </div>

      <ChatSidebar 
        conversations={mockConversations} 
        activeId={activeId} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      {children}
    </div>
  );
}
