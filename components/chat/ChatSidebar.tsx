import React from 'react';
import Link from 'next/link';

interface Conversation {
  id: string;
  title: string;
  updated_at: string;
}

interface ChatSidebarProps {
  conversations: Conversation[];
  activeId?: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatSidebar({ conversations, activeId, isOpen, onClose }: ChatSidebarProps) {
  return (
    <aside className={`chat-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="chat-sidebar-header">
        <button className="new-chat-btn">
          <span>+</span> New Chat
        </button>
        {/* Mobile close button could go here */}
      </div>
      
      <div className="chat-history-list">
        {conversations.length === 0 ? (
          <div style={{ color: '#64748b', textAlign: 'center', marginTop: '2rem' }}>
            No recent chats
          </div>
        ) : (
          conversations.map((chat) => (
            <Link 
              key={chat.id} 
              href={`/chat/${chat.id}`}
              style={{ textDecoration: 'none' }}
            >
              <div className={`chat-history-item ${activeId === chat.id ? 'active' : ''}`}>
                {chat.title}
              </div>
            </Link>
          ))
        )}
      </div>
    </aside>
  );
}
