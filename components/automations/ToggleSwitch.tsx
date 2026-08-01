'use client';
import React from 'react';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

export default function ToggleSwitch({ checked, onChange, label }: ToggleSwitchProps) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '0.75rem' }}>
      <div style={{ position: 'relative' }}>
        <input 
          type="checkbox" 
          checked={checked} 
          onChange={(e) => onChange(e.target.checked)} 
          style={{ srOnly: true, opacity: 0, position: 'absolute', width: 0, height: 0 } as any} 
        />
        <div style={{
          width: '44px',
          height: '24px',
          backgroundColor: checked ? 'var(--primary-color)' : 'var(--border-color)',
          borderRadius: '9999px',
          transition: 'background-color 0.2s',
          display: 'flex',
          alignItems: 'center',
          padding: '2px'
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            backgroundColor: '#ffffff',
            borderRadius: '50%',
            transition: 'transform 0.2s',
            transform: checked ? 'translateX(20px)' : 'translateX(0)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }} />
        </div>
      </div>
      {label && <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>{label}</span>}
    </label>
  );
}
