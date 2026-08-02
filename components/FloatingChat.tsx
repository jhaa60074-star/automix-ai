'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Message } from '@/utils/ai/provider-interface';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import Button from '@/components/Button';

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
}

const SLASH_COMMANDS = [
  { cmd: '/summarize', desc: 'Summarize text or document', prompt: 'Summarize the following:\n' },
  { cmd: '/analyze', desc: 'Analyze data or text', prompt: 'Please analyze this and provide insights:\n' },
  { cmd: '/report', desc: 'Generate a detailed report', prompt: 'Generate a detailed report based on:\n' },
  { cmd: '/workflow', desc: 'Create an automation workflow', prompt: 'Create an automation workflow for:\n' },
  { cmd: '/automation', desc: 'Automate a process', prompt: 'I want to automate:\n' },
  { cmd: '/pdf', desc: 'Extract key points from PDF', prompt: 'Extract key points from this PDF:\n' },
  { cmd: '/excel', desc: 'Analyze Excel data', prompt: 'Analyze this Excel data:\n' },
  { cmd: '/compare', desc: 'Compare documents or text', prompt: 'Compare the following:\n' },
  { cmd: '/translate', desc: 'Translate text', prompt: 'Translate this text to English:\n' },
  { cmd: '/research', desc: 'Conduct research', prompt: 'Conduct research on:\n' },
  { cmd: '/image', desc: 'Describe an image', prompt: 'Describe this image in detail:\n' },
  { cmd: '/ocr', desc: 'Extract text from image', prompt: 'Extract all text from this image:\n' },
  { cmd: '/export', desc: 'Format results for export', prompt: 'Format the results for export:\n' },
  { cmd: '/help', desc: 'Show help', prompt: 'How can you help me?\n' },
];

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  // Chat state
  const [isClient, setIsClient] = useState(false);
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  
  // File attachments & Menu state
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [uploadedUrls, setUploadedUrls] = useState<{ [key: string]: string }>({});
  
  // Slash command state
  const [showCommandMenu, setShowCommandMenu] = useState(false);
  const [commandQuery, setCommandQuery] = useState('');
  
  // UX and Voice state
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  const recognitionRef = useRef<any>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const attachmentMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const welcomeMessage: Message = {
    role: 'assistant',
    content: "Hi 👋\n\nWelcome to AUTRIXGPT AI.\n\nI'm your intelligent automation assistant.\n\nI can help you with:\n• AI Research\n• File Analysis\n• Business Automation\n• Gmail Automation\n• Instagram Automation\n• WhatsApp Automation\n• Website Automation\n• Workflow Creation"
  };

  useEffect(() => {
    setIsClient(true);
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    const saved = localStorage.getItem('automik_chats');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) {
          setChats(parsed);
          setActiveChatId(parsed[0].id);
          setMessages(parsed[0].messages);
        } else {
          createNewChat();
        }
      } catch (e) {
        createNewChat();
      }
    } else {
      createNewChat();
    }

    // Click outside handler for attachment menu
    const handleClickOutside = (e: MouseEvent) => {
      if (attachmentMenuRef.current && !attachmentMenuRef.current.contains(e.target as Node)) {
        setShowAttachmentMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    // Initialize Speech Recognition
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        
        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(prev => prev + (prev ? ' ' : '') + transcript);
        };
        
        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          setIsRecording(false);
        };
        
        recognitionRef.current.onend = () => {
          setIsRecording(false);
        };
      }
    }

    return () => {
      subscription.unsubscribe();
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Sync messages to local storage
  useEffect(() => {
    if (!isClient || !activeChatId || messages.length === 0) return;
    setChats(prev => {
      const updated = prev.map(c => 
        c.id === activeChatId ? { ...c, messages } : c
      );
      localStorage.setItem('automik_chats', JSON.stringify(updated));
      return updated;
    });
  }, [messages, activeChatId, isClient]);

  const createNewChat = () => {
    const newId = Date.now().toString();
    const newChat = { id: newId, title: 'New Conversation', messages: [welcomeMessage] };
    setChats(prev => {
      const updated = [newChat, ...prev];
      localStorage.setItem('automik_chats', JSON.stringify(updated));
      return updated;
    });
    setActiveChatId(newId);
    setMessages([welcomeMessage]);
  };

  useEffect(() => {
    if (pathname === '/chat' || searchParams.get('openChat') === 'true') {
      setIsOpen(true);
      if (searchParams.get('openChat') === 'true') {
        const url = new URL(window.location.href);
        url.searchParams.delete('openChat');
        window.history.replaceState({}, '', url);
      }
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '0px'; // Reset to calculate exact scrollHeight
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(Math.max(scrollHeight, 44), 140)}px`;
    }
  }, [input]);

  const toggleVoiceRecognition = () => {
    if (!recognitionRef.current) {
      alert('Voice input is not supported in this browser. Please try Chrome or Edge.');
      return;
    }
    
    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error('Error starting speech recognition:', err);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInput(val);
    
    // Slash command detection
    if (val.startsWith('/')) {
      setCommandQuery(val.substring(1).toLowerCase());
      setShowCommandMenu(true);
    } else {
      setShowCommandMenu(false);
    }
  };

  const selectCommand = (prompt: string) => {
    setInput(prompt);
    setShowCommandMenu(false);
    textareaRef.current?.focus();
  };

  const filteredCommands = SLASH_COMMANDS.filter(c => 
    c.cmd.toLowerCase().includes(commandQuery) || 
    c.desc.toLowerCase().includes(commandQuery)
  );

  const handleSend = async (textToSend = input) => {
    if ((!textToSend.trim() && attachments.length === 0) || isLoading) return;
    
    let content = textToSend.trim();
    const successfulUploads = Object.keys(uploadedUrls);
    if (successfulUploads.length > 0) {
      content += `\n\n[Attached Files: ${successfulUploads.join(', ')}]`;
    }

    const userMessage: Message = { role: 'user', content };
    setMessages(prev => [...prev, userMessage]);
    
    // Auto-rename chat if it's "New Conversation"
    if (messages.length === 1 && activeChatId) {
      const title = content.length > 25 ? content.substring(0, 25) + '...' : content;
      setChats(prev => prev.map(c => c.id === activeChatId ? { ...c, title } : c));
    }

    setInput('');
    setShowCommandMenu(false);
    setAttachments([]);
    setUploadProgress({});
    setUploadedUrls({});
    setIsLoading(true);
    
    if (textareaRef.current) {
      textareaRef.current.style.height = '44px';
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] })
      });

      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      
      let aiMessageContent = '';
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        aiMessageContent += decoder.decode(value, { stream: true });
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].content = aiMessageContent;
          return newMessages;
        });
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again later.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      if (showCommandMenu && filteredCommands.length > 0) {
        e.preventDefault();
        selectCommand(filteredCommands[0].prompt);
      } else {
        e.preventDefault();
        handleSend();
      }
    }
  };

  const switchChat = (id: string) => {
    const chat = chats.find(c => c.id === id);
    if (chat) {
      setActiveChatId(id);
      setMessages(chat.messages);
    }
  };

  const handleDeleteChat = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setChats(prev => {
      const updated = prev.filter(c => c.id !== id);
      localStorage.setItem('automik_chats', JSON.stringify(updated));
      if (activeChatId === id) {
        if (updated.length > 0) {
          setActiveChatId(updated[0].id);
          setMessages(updated[0].messages);
        } else {
          setTimeout(createNewChat, 0);
        }
      }
      return updated;
    });
  };

  const handleRenameSubmit = (id: string, e: React.FormEvent) => {
    e.preventDefault();
    setChats(prev => {
      const updated = prev.map(c => c.id === id ? { ...c, title: editingTitle || 'Untitled' } : c);
      localStorage.setItem('automik_chats', JSON.stringify(updated));
      return updated;
    });
    setEditingChatId(null);
  };

  const handleExportChat = () => {
    let md = '';
    messages.forEach(m => {
      md += `### ${m.role === 'user' ? 'You' : 'AUTRIXGPT AI'}\n${m.content}\n\n`;
    });
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'autrixgpt-chat.md';
    a.click();
    URL.revokeObjectURL(url);
    setShowMenu(false);
  };

  const handleFileAttach = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(Array.from(e.target.files));
    }
    setShowAttachmentMenu(false);
  };

  const triggerFileInput = (acceptStr: string) => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = acceptStr;
      fileInputRef.current.click();
    }
  };

  const processFiles = (files: File[]) => {
    const validExtensions = ['.pdf', '.docx', '.xlsx', '.csv', '.txt', '.png', '.jpg', '.jpeg', '.webp'];
    const validFiles = files.filter(f => validExtensions.some(ext => f.name.toLowerCase().endsWith(ext)) || f.type.startsWith('image/'));
    setAttachments(prev => [...prev, ...validFiles]);
    validFiles.forEach(file => uploadFile(file));
  };

  const uploadFile = async (file: File) => {
    setUploadProgress(prev => ({ ...prev, [file.name]: 10 }));
    const formData = new FormData();
    formData.append('file', file);
    if (activeChatId) formData.append('chatId', activeChatId);
    
    try {
      const interval = setInterval(() => {
        setUploadProgress(prev => ({ 
          ...prev, 
          [file.name]: Math.min((prev[file.name] || 10) + 20, 90) 
        }));
      }, 300);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(interval);
      if (!response.ok) throw new Error('Upload failed');
      const data = await response.json();
      
      setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));
      setUploadedUrls(prev => ({ ...prev, [file.name]: data.file.path }));
      
      // Inject attachment message into chat
      const attachmentMsg: Message = {
        role: 'assistant',
        content: ``,
        attachment: {
          name: file.name,
          type: file.type,
          size: file.size,
          url: data.file.path,
          timestamp: Date.now()
        }
      };
      setMessages(prev => [...prev, attachmentMsg]);
      
    } catch (error) {
      setUploadProgress(prev => ({ ...prev, [file.name]: -1 }));
    }
  };

  const removeAttachment = (fileName: string) => {
    setAttachments(prev => prev.filter(f => f.name !== fileName));
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[fileName];
      return newProgress;
    });
    setUploadedUrls(prev => {
      const newUrls = { ...prev };
      delete newUrls[fileName];
      return newUrls;
    });
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('word') || type.includes('docx')) return '📝';
    if (type.includes('excel') || type.includes('spreadsheet') || type.includes('csv')) return '📊';
    if (type.includes('text')) return '📃';
    if (type.includes('image')) return '🖼️';
    return '📁';
  };

  const getQuickActions = (type: string) => {
    if (type.includes('pdf') || type.includes('word') || type.includes('text')) {
      return ['Summarize', 'Analyze', 'Extract Key Points', 'Create Report', 'Translate', 'Compare'];
    }
    if (type.includes('excel') || type.includes('spreadsheet') || type.includes('csv')) {
      return ['Analyze Data', 'Generate Charts', 'Create Dashboard', 'Detect Trends', 'Export Report'];
    }
    if (type.includes('image')) {
      return ['Describe Image', 'Extract Text (OCR)', 'Analyze Screenshot', 'Generate Caption'];
    }
    return ['Analyze File'];
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024, dm = 2, sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  if (!isClient) return null;

  return (
    <div className="fc-widget">
      <button 
        className="fc-trigger"
        onClick={() => setIsOpen(!isOpen)}
        style={{ display: isOpen && window.innerWidth <= 640 ? 'none' : 'flex' }}
      >
        <span className="fc-trigger-icon">{isOpen ? '✕' : '🤖'}</span>
        {!isOpen && <span className="fc-trigger-label">Start Chat</span>}
      </button>

      <div className={`fc-window ${isOpen ? 'fc-open' : ''} ${isZoomed ? 'fc-zoomed' : ''}`}>
        <div style={{ display: 'flex', height: '100%', width: '100%' }}>
          
          {/* Sidebar */}
          {user && (
            <div className="fc-sidebar">
              <div className="fc-sidebar-header">
                <button 
                  onClick={createNewChat}
                  style={{ width: '100%', padding: '0.5rem', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}
                >
                  + New Chat
                </button>
              </div>
              <div style={{ flex: 1, overflowY: 'auto' }}>
                {chats.map(chat => (
                  <div 
                    key={chat.id} 
                    className={`fc-chat-item ${activeChatId === chat.id ? 'active' : ''}`}
                    onClick={() => switchChat(chat.id)}
                  >
                    {editingChatId === chat.id ? (
                      <form onSubmit={(e) => handleRenameSubmit(chat.id, e)} style={{ display: 'flex', width: '100%' }}>
                        <input 
                          type="text" 
                          value={editingTitle} 
                          onChange={(e) => setEditingTitle(e.target.value)} 
                          autoFocus
                          onBlur={(e) => handleRenameSubmit(chat.id, e)}
                          style={{ width: '100%', padding: '2px 4px', border: 'none', borderRadius: '4px', color: 'black' }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </form>
                    ) : (
                      <>
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '150px' }}>
                          {chat.title}
                        </div>
                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                          <button 
                            title="Rename"
                            onClick={(e) => { e.stopPropagation(); setEditingChatId(chat.id); setEditingTitle(chat.title); }}
                            style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', opacity: 0.7 }}
                          >
                            ✎
                          </button>
                          <button 
                            title="Delete"
                            onClick={(e) => handleDeleteChat(chat.id, e)}
                            style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', opacity: 0.7 }}
                          >
                            ✕
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Main Chat Area */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', width: user ? 'calc(100% - 250px)' : '100%' }}>
            <div className="fc-header">
              <div className="fc-brand">
                <div className="fc-avatar">🤖</div>
                <div>
                  <div className="fc-title">AUTRIXGPT AI Assistant</div>
                  <div className="fc-subtitle">AI Automation Platform</div>
                </div>
              </div>
              <div className="fc-actions" style={{ position: 'relative' }}>
                <button className="fc-btn-text" onClick={handleExportChat}>Export</button>
                <button className="fc-btn-icon" onClick={() => setIsZoomed(!isZoomed)} title={isZoomed ? "Shrink" : "Expand"}>
                  {isZoomed ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>
                  )}
                </button>
                <button className="fc-btn-icon" onClick={() => { setIsOpen(false); setIsZoomed(false); }} title="Minimize">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </button>
              </div>
            </div>

            {!user ? (
              <div className="fc-auth-overlay">
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤖</div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Welcome to AUTRIXGPT</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.9rem' }}>
                  Please log in or create an account to start chatting with your AI assistant.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
                  <Button href="/login" style={{ width: '100%' }}>Login</Button>
                  <Button href="/signup" variant="secondary" style={{ width: '100%' }}>Create Account</Button>
                </div>
              </div>
            ) : (
              <>
                <div 
                  className="fc-body"
                  onDragEnter={(e) => { 
                    e.preventDefault(); 
                    setDragCounter(prev => prev + 1);
                    setIsDragging(true); 
                  }}
                  onDragOver={(e) => { e.preventDefault(); }}
                  onDragLeave={(e) => { 
                    e.preventDefault(); 
                    setDragCounter(prev => {
                      const newCount = prev - 1;
                      if (newCount === 0) setIsDragging(false);
                      return newCount;
                    });
                  }}
                  onDrop={(e) => { 
                    e.preventDefault(); 
                    setDragCounter(0);
                    setIsDragging(false); 
                    if (e.dataTransfer.files) processFiles(Array.from(e.dataTransfer.files)); 
                  }}
                >
                  {isDragging && (
                    <div style={{
                      position: 'absolute', top: '70px', left: 0, right: 0, bottom: '80px',
                      background: 'rgba(37, 99, 235, 0.1)', backdropFilter: 'blur(2px)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      zIndex: 20, border: '2px dashed var(--primary-color)', borderRadius: '12px', margin: '1rem'
                    }}>
                      <div style={{ background: 'var(--background-color)', padding: '1rem 2rem', borderRadius: '8px', fontWeight: 600, color: 'var(--primary-color)' }}>
                        Drop files here
                      </div>
                    </div>
                  )}

                  {messages.map((msg, idx) => (
                    <div key={idx} className={`fc-msg ${msg.role === 'user' ? 'fc-msg-user' : 'fc-msg-ai'}`}>
                      {msg.attachment && (
                        <>
                          <div className="fc-msg-time" style={{ marginBottom: '4px', textAlign: 'left' }}>System: File Uploaded</div>
                          <div className="fc-file-card">
                            <div className="fc-file-icon">
                              {getFileIcon(msg.attachment.type)}
                            </div>
                            <div className="fc-file-details">
                              <span className="fc-file-name">{msg.attachment.name}</span>
                              <span className="fc-file-meta">
                                {formatBytes(msg.attachment.size)} • {new Date(msg.attachment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                          <div className="fc-quick-actions">
                            {getQuickActions(msg.attachment.type).map(action => (
                              <button key={action} className="fc-action-chip" onClick={() => handleSend(`${action} ${msg.attachment?.name}`)}>
                                {action}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                      
                      {msg.content && msg.role === 'assistant' && !msg.content && isLoading && idx === messages.length - 1 ? (
                        <div className="fc-typing"><div className="fc-dot"/><div className="fc-dot"/><div className="fc-dot"/></div>
                      ) : msg.content ? (
                        <MarkdownRenderer content={msg.content} />
                      ) : null}
                      {msg.content && <span className="fc-msg-time">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <div className="fc-footer" style={{ position: 'relative' }}>
                  {showCommandMenu && filteredCommands.length > 0 && (
                    <div className="fc-command-menu">
                      {filteredCommands.map((c, idx) => (
                        <div key={idx} className="fc-command-item" onClick={() => selectCommand(c.prompt)}>
                          <span className="fc-cmd-name">{c.cmd}</span>
                          <span className="fc-cmd-desc">{c.desc}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {showAttachmentMenu && (
                    <div className="fc-attachment-menu" ref={attachmentMenuRef}>
                      <div className="fc-menu-section">
                        <div className="fc-menu-title">Upload Files</div>
                        <div className="fc-menu-grid">
                          <button className="fc-menu-item" onClick={() => triggerFileInput('.pdf')}>
                            <span>📄</span> PDF Document
                          </button>
                          <button className="fc-menu-item" onClick={() => triggerFileInput('.docx,.doc')}>
                            <span>📝</span> Word Document
                          </button>
                          <button className="fc-menu-item" onClick={() => triggerFileInput('.xlsx,.xls,.csv')}>
                            <span>📊</span> Excel / CSV
                          </button>
                          <button className="fc-menu-item" onClick={() => triggerFileInput('.txt')}>
                            <span>📃</span> Text File
                          </button>
                          <button className="fc-menu-item" onClick={() => triggerFileInput('image/*')}>
                            <span>🖼️</span> Image
                          </button>
                        </div>
                      </div>
                      <div className="fc-menu-section">
                        <div className="fc-menu-title">Connect Sources</div>
                        <div className="fc-menu-grid">
                          <button className="fc-menu-item" onClick={() => alert('Google Drive integration coming soon!')}>
                            <span>📁</span> Google Drive
                          </button>
                          <button className="fc-menu-item" onClick={() => alert('Google Sheets integration coming soon!')}>
                            <span>📉</span> Google Sheets
                          </button>
                          <button className="fc-menu-item" onClick={() => alert('Gmail integration coming soon!')}>
                            <span>📧</span> Gmail
                          </button>
                          <button className="fc-menu-item" onClick={() => alert('OneDrive integration coming soon!')}>
                            <span>☁️</span> OneDrive
                          </button>
                          <button className="fc-menu-item" onClick={() => alert('Dropbox integration coming soon!')}>
                            <span>📦</span> Dropbox
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {attachments.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      {attachments.map((file, idx) => {
                        const progress = uploadProgress[file.name] || 0;
                        return (
                          <div key={idx} className="fc-upload-preview">
                            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '120px' }}>{file.name}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '0.5rem' }}>
                              {progress === -1 ? <span style={{ color: '#ef4444', fontSize: '0.7rem' }}>Failed</span> : progress < 100 ? (
                                <div style={{ width: '20px', height: '4px', background: 'rgba(0,0,0,0.1)', borderRadius: '2px' }}><div style={{ width: `${progress}%`, height: '100%', background: 'var(--primary-color)' }}></div></div>
                              ) : <span style={{ color: '#10b981', fontSize: '0.7rem' }}>✓</span>}
                              <button onClick={() => removeAttachment(file.name)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>×</button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  
                  <div className="fc-input-wrapper">
                    <input type="file" ref={fileInputRef} style={{ display: 'none' }} multiple onChange={handleFileAttach} aria-label="Upload files" />
                    <button 
                      className={`fc-btn-icon ${showAttachmentMenu ? 'active' : ''}`} 
                      style={{ flexShrink: 0 }} 
                      onClick={(e) => { e.stopPropagation(); setShowAttachmentMenu(!showAttachmentMenu); }} 
                      title="Attach file"
                      aria-label="Attach file"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
                    </button>
                    <textarea 
                      ref={textareaRef}
                      className="fc-textarea"
                      placeholder="Ask anything..."
                      value={input}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      onFocus={() => setIsInputFocused(true)}
                      onBlur={() => setIsInputFocused(false)}
                      aria-label="Chat input"
                      onPaste={(e) => {
                        const items = e.clipboardData?.items;
                        if (!items) return;
                        const files = [];
                        for (let i = 0; i < items.length; i++) {
                          if (items[i].kind === 'file') {
                            const file = items[i].getAsFile();
                            if (file) files.push(file);
                          }
                        }
                        if (files.length > 0) {
                          e.preventDefault();
                          processFiles(files);
                        }
                      }}
                      disabled={isLoading}
                      rows={1}
                    />
                    <button 
                      className={`fc-btn-icon ${isRecording ? 'fc-mic-recording' : ''}`} 
                      style={{ flexShrink: 0 }} 
                      title={isRecording ? "Stop recording" : "Voice input"}
                      aria-label="Voice input"
                      onClick={toggleVoiceRecognition}
                    >
                       <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
                    </button>
                    <button 
                      className={`fc-send-btn ${(input.trim() || attachments.length > 0) ? 'active' : ''}`}
                      style={{ flexShrink: 0 }}
                      onClick={() => handleSend()}
                      disabled={isLoading || (!input.trim() && attachments.length === 0)}
                      title="Send message"
                      aria-label="Send message"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                    </button>
                  </div>
                  {isInputFocused && (
                    <div className="fc-input-helper">Type '/' for commands</div>
                  )}
                  <div className="fc-watermark">Powered by AUTRIXGPT AI</div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
