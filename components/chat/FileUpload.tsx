import React, { useState, useRef } from 'react';

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
}

interface FileState {
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  errorMessage?: string;
}

export default function FileUpload({ onFilesSelected }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileStates, setFileStates] = useState<FileState[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validExtensions = ['.pdf', '.docx', '.xlsx', '.csv', '.txt', '.png', '.jpg', '.jpeg', '.webp'];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter(file => {
      const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      return validExtensions.includes(ext);
    });

    const newStates: FileState[] = validFiles.map(file => ({
      file,
      progress: 0,
      status: 'uploading'
    }));

    setFileStates(prev => [...prev, ...newStates]);
    onFilesSelected(validFiles);

    // Trigger upload for each valid file
    validFiles.forEach(file => uploadFile(file));
  };

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setFileStates(prev => prev.map(fs => {
          if (fs.file.name === file.name && fs.status === 'uploading') {
            return { ...fs, progress: Math.min(fs.progress + 10, 90) };
          }
          return fs;
        }));
      }, 200);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      setFileStates(prev => prev.map(fs => 
        fs.file.name === file.name ? { ...fs, progress: 100, status: 'success' } : fs
      ));
    } catch (error: any) {
      setFileStates(prev => prev.map(fs => 
        fs.file.name === file.name ? { ...fs, status: 'error', errorMessage: error.message } : fs
      ));
    }
  };

  const removeFile = (fileName: string) => {
    setFileStates(prev => prev.filter(fs => fs.file.name !== fileName));
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div>
      <div 
        className={`file-upload-zone ${isDragging ? 'drag-active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <p>Drag & drop your files here, or click to select files</p>
        <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.5rem' }}>
          Supported: PDF, DOCX, XLSX, CSV, TXT, PNG, JPG, WEBP
        </p>
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          multiple 
          accept=".pdf,.docx,.xlsx,.csv,.txt,.png,.jpg,.jpeg,.webp"
          onChange={handleChange}
        />
      </div>
      
      {fileStates.length > 0 && (
        <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {fileStates.map((fs, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
              background: 'rgba(30, 41, 59, 0.8)', padding: '0.75rem', borderRadius: '8px',
              border: `1px solid ${fs.status === 'error' ? 'rgba(239, 68, 68, 0.5)' : fs.status === 'success' ? 'rgba(16, 185, 129, 0.5)' : 'rgba(255,255,255,0.1)'}`
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <span style={{ fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{fs.file.name}</span>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  {formatSize(fs.file.size)} • {fs.status === 'uploading' ? `${fs.progress}%` : fs.status === 'error' ? 'Failed' : 'Uploaded'}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {fs.status === 'uploading' && (
                  <div style={{ width: '50px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: `${fs.progress}%`, height: '100%', background: '#3b82f6', transition: 'width 0.2s' }}></div>
                  </div>
                )}
                <button 
                  onClick={(e) => { e.stopPropagation(); removeFile(fs.file.name); }}
                  style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1.2rem' }}
                  title="Remove file"
                >
                  &times;
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
