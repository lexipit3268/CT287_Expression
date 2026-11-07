import React from 'react';
import { BookOpen, Layers } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header style={{
      background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
      color: '#ffffff',
      padding: '16px 24px',
      borderBottom: '1px solid #334155',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '12px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          backgroundColor: '#3b82f6',
          borderRadius: '10px',
          padding: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)'
        }}>
          <Layers size={24} color="#ffffff" />
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 800, letterSpacing: '-0.02em', color: '#f8fafc' }}>
            Biểu Thức Số Học - Expression Parse Tree Visualizer
          </h1>
          <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>
            Môn Kiểm Chứng Mô Hình • Session 5: Recursive Descent Parsing (Đệ quy xuống)
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '13px' }}>
        <span style={{
          backgroundColor: '#1e293b',
          border: '1px solid #334155',
          borderRadius: '20px',
          padding: '6px 14px',
          color: '#cbd5e1',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <BookOpen size={14} color="#60a5fa" />
          C# .NET Backend + React Flow
        </span>
      </div>
    </header>
  );
};
