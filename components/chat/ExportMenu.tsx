import React from 'react';

interface ExportMenuProps {
  onExportPDF: () => void;
  onExportMarkdown: () => void;
  onNewChat?: () => void;
  onClearChat?: () => void;
}

export default function ExportMenu({ onExportPDF, onExportMarkdown, onNewChat, onClearChat }: ExportMenuProps) {
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button 
        style={{
          background: 'rgba(255,255,255,0.1)',
          border: '1px solid rgba(255,255,255,0.2)',
          color: 'white',
          padding: '0.5rem 1rem',
          borderRadius: '6px',
          cursor: 'pointer'
        }}
        onClick={(e) => {
          const menu = e.currentTarget.nextElementSibling as HTMLElement;
          if (menu) {
            menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
          }
        }}
      >
        Options
      </button>
      
      <div 
        id="export-menu-dropdown"
        style={{
          display: 'none',
          position: 'absolute',
          top: '100%',
          right: 0,
          marginTop: '0.5rem',
          background: '#1e293b',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '8px',
          padding: '0.5rem',
          minWidth: '150px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
          zIndex: 50
        }}
      >
        {onNewChat && (
          <button 
            onClick={() => {
              onNewChat();
              const menu = document.getElementById('export-menu-dropdown');
              if (menu) menu.style.display = 'none';
            }}
            style={{
              display: 'block', width: '100%', textAlign: 'left', padding: '0.5rem',
              background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', borderRadius: '4px'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            New Chat
          </button>
        )}
        {onClearChat && (
          <button 
            onClick={() => {
              onClearChat();
              const menu = document.getElementById('export-menu-dropdown');
              if (menu) menu.style.display = 'none';
            }}
            style={{
              display: 'block', width: '100%', textAlign: 'left', padding: '0.5rem',
              background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', borderRadius: '4px'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            Clear Chat
          </button>
        )}
        <button 
          onClick={() => {
            onExportPDF();
            // Close menu
          }}
          style={{
            display: 'block',
            width: '100%',
            textAlign: 'left',
            padding: '0.5rem',
            background: 'transparent',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            borderRadius: '4px'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          Export to PDF
        </button>
        <button 
          onClick={() => {
            onExportMarkdown();
            // Close menu
          }}
          style={{
            display: 'block',
            width: '100%',
            textAlign: 'left',
            padding: '0.5rem',
            background: 'transparent',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            borderRadius: '4px'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          Export to Markdown
        </button>
      </div>
    </div>
  );
}
