import React from 'react';
import { Play, Sparkles, AlertCircle } from 'lucide-react';
import type { ExampleExpression } from '../types';

interface ControlBarProps {
  expression: string;
  setExpression: (val: string) => void;
  algorithm: 'v1' | 'v2';
  setAlgorithm: (val: 'v1' | 'v2') => void;
  onParse: () => void;
  loading: boolean;
  examples: ExampleExpression[];
  onSelectExample: (ex: ExampleExpression) => void;
  error?: string | null;
  result?: number | null;
}

export const ControlBar: React.FC<ControlBarProps> = ({
  expression,
  setExpression,
  algorithm,
  setAlgorithm,
  onParse,
  loading,
  examples,
  onSelectExample,
  error,
  result
}) => {
  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      padding: '16px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '14px'
    }}>
      {/* Top Input Row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        {/* Algorithm Selector */}
        <div style={{
          display: 'flex',
          backgroundColor: '#f1f5f9',
          borderRadius: '8px',
          padding: '3px',
          border: '1px solid #cbd5e1'
        }}>
          <button
            onClick={() => setAlgorithm('v1')}
            style={{
              padding: '8px 14px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '13px',
              transition: 'all 0.2s',
              backgroundColor: algorithm === 'v1' ? '#2563eb' : 'transparent',
              color: algorithm === 'v1' ? '#ffffff' : '#475569'
            }}
          >
            Giải thuật I (Slide: +, *)
          </button>
          <button
            onClick={() => setAlgorithm('v2')}
            style={{
              padding: '8px 14px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '13px',
              transition: 'all 0.2s',
              backgroundColor: algorithm === 'v2' ? '#2563eb' : 'transparent',
              color: algorithm === 'v2' ? '#ffffff' : '#475569'
            }}
          >
            Giải thuật II (Đầy đủ: +, -, *, /)
          </button>
        </div>

        {/* Expression Input */}
        <div style={{ flex: '1 1 300px', display: 'flex', position: 'relative' }}>
          <input
            type="text"
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onParse();
            }}
            placeholder="Nhập biểu thức số học (ví dụ: 2 * 3 + 6)..."
            style={{
              width: '100%',
              padding: '10px 14px',
              fontSize: '15px',
              fontFamily: 'monospace',
              borderRadius: '8px',
              border: error ? '2px solid #ef4444' : '1px solid #cbd5e1',
              outline: 'none',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
            }}
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={onParse}
          disabled={loading || !expression.trim()}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            backgroundColor: loading ? '#94a3b8' : '#2563eb',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '14px',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s',
            boxShadow: '0 2px 6px rgba(37, 99, 235, 0.3)'
          }}
        >
          <Play size={16} />
          {loading ? 'Đang phân tích...' : 'Phân tích (Parse)'}
        </button>

        {/* Result Badge */}
        {result !== undefined && result !== null && !error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            backgroundColor: '#ecfdf5',
            border: '1px solid #6ee7b7',
            borderRadius: '8px',
            color: '#065f46',
            fontWeight: 700,
            fontSize: '15px'
          }}>
            <span>Kết quả:</span>
            <span style={{ fontSize: '18px', color: '#047857' }}>{result}</span>
          </div>
        )}
      </div>

      {/* Examples Chips */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Sparkles size={14} color="#f59e0b" /> Ví dụ mẫu:
        </span>
        {examples.map((ex, idx) => (
          <button
            key={idx}
            onClick={() => onSelectExample(ex)}
            style={{
              padding: '4px 10px',
              fontSize: '12px',
              fontFamily: 'monospace',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              cursor: 'pointer',
              color: '#334155',
              transition: 'all 0.15s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#e0f2fe';
              e.currentTarget.style.borderColor = '#7dd3fc';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f8fafc';
              e.currentTarget.style.borderColor = '#e2e8f0';
            }}
          >
            {ex.expression}
          </button>
        ))}
      </div>

      {/* Error alert if any */}
      {error && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 14px',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          color: '#b91c1c',
          fontSize: '14px'
        }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
