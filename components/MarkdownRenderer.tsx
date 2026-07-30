import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // Very basic regex-based markdown parser to support bold, italics, code blocks, and links
  const renderContent = (text: string) => {
    if (!text) return null;

    // Split by code blocks first to avoid messing up content inside them
    const parts = text.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
      // Is code block?
      if (part.startsWith('```') && part.endsWith('```')) {
        const codeContent = part.substring(3, part.length - 3).trim();
        // Extract language if present
        const firstLineEnd = codeContent.indexOf('\n');
        let language = '';
        let code = codeContent;
        
        if (firstLineEnd !== -1 && !codeContent.substring(0, firstLineEnd).includes(' ')) {
          language = codeContent.substring(0, firstLineEnd);
          code = codeContent.substring(firstLineEnd + 1);
        }

        return (
          <div key={index} style={{ margin: '0.5rem 0', borderRadius: '8px', overflow: 'hidden', background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)' }}>
            {language && (
              <div style={{ background: '#0f172a', color: '#94a3b8', padding: '0.25rem 0.75rem', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                {language}
              </div>
            )}
            <pre style={{ margin: 0, padding: '0.75rem', overflowX: 'auto' }}>
              <code style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#e2e8f0' }}>{code}</code>
            </pre>
          </div>
        );
      }

      // Process normal text (bold, italic, links, lists)
      const lines = part.split('\n');
      return (
        <span key={index}>
          {lines.map((line, lineIndex) => {
            if (!line) return (lineIndex < lines.length - 1 ? <br key={lineIndex} /> : null);
            
            // Handle unordered lists
            if (line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
              return <li key={lineIndex} style={{ marginLeft: '1rem', marginBottom: '0.25rem' }}>{formatInline(line.substring(2))}</li>;
            }

            return (
              <span key={lineIndex}>
                {formatInline(line)}
                {lineIndex < lines.length - 1 && <br />}
              </span>
            );
          })}
        </span>
      );
    });
  };

  const formatInline = (text: string) => {
    // Basic inline formatting: **bold**, *italic*, [link](url), `code`
    let formatted = text;
    
    // Bold
    const boldParts = formatted.split(/(\*\*.*?\*\*)/g);
    
    return boldParts.map((bPart, bIdx) => {
      if (bPart.startsWith('**') && bPart.endsWith('**')) {
        return <strong key={bIdx}>{bPart.substring(2, bPart.length - 2)}</strong>;
      }
      
      // Inline Code
      const codeParts = bPart.split(/(`.*?`)/g);
      return codeParts.map((cPart, cIdx) => {
        if (cPart.startsWith('`') && cPart.endsWith('`')) {
          return <code key={`${bIdx}-${cIdx}`} style={{ background: 'rgba(0,0,0,0.1)', padding: '0.1rem 0.3rem', borderRadius: '4px', fontFamily: 'monospace', fontSize: '0.85em' }}>{cPart.substring(1, cPart.length - 1)}</code>;
        }
        
        // Basic links (very naive)
        const linkParts = cPart.split(/(\[.*?\]\(.*?\))/g);
        return linkParts.map((lPart, lIdx) => {
          if (lPart.startsWith('[') && lPart.endsWith(')')) {
            const closingBracket = lPart.indexOf(']');
            const text = lPart.substring(1, closingBracket);
            const url = lPart.substring(closingBracket + 2, lPart.length - 1);
            return <a key={`${bIdx}-${cIdx}-${lIdx}`} href={url} target="_blank" rel="noreferrer" style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>{text}</a>;
          }
          return lPart;
        });
      });
    });
  };

  return <div style={{ wordBreak: 'break-word' }}>{renderContent(content)}</div>;
}
