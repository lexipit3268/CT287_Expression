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
        <div
          role="radiogroup"
          aria-label="Chọn giải thuật phân giải cú pháp"
          style={{
            display: 'flex',
            backgroundColor: '#f1f5f9',
            borderRadius: '8px',
            padding: '3px',
            border: '1px solid #cbd5e1'
          }}
        >
          <button
            type="button"
            role="radio"
            aria-checked={algorithm === 'v1'}
            onClick={() => setAlgorithm('v1')}
            title="Văn phạm Session 5: E -> T + E | T, T -> F * T | F (kết hợp phải)"
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
            type="button"
            role="radio"
            aria-checked={algorithm === 'v2'}
            onClick={() => setAlgorithm('v2')}
            title="Giải thuật nâng cao: Hỗ trợ +, -, *, / theo quy tắc kết hợp trái chuẩn toán học"
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

        {/* Expression Input with Accessible Label */}
        <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <label htmlFor="expression-input" style={{
            position: 'absolute',
            width: '1px',
            height: '1px',
            padding: 0,
            margin: '-1px',
            overflow: 'hidden',
            clip: 'rect(0, 0, 0, 0)',
            whiteSpace: 'nowrap',
            border: 0
          }}>
            Biểu thức số học cần phân giải
          </label>
          <input
            id="expression-input"
            type="text"
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onParse();
            }}
            aria-label="Nhập biểu thức số học"
            aria-invalid={!!error}
            aria-describedby={error ? "expression-error-msg" : "expression-hint"}
            placeholder="Ví dụ: 2 * 3 + 6 hoặc (2 + 3) * 4"
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
          <span id="expression-hint" style={{
            position: 'absolute',
            width: '1px',
            height: '1px',
            padding: 0,
            margin: '-1px',
            overflow: 'hidden',
            clip: 'rect(0, 0, 0, 0)',
            whiteSpace: 'nowrap',
            border: 0
          }}>
            Nhấn Enter hoặc nút Phân tích để bắt đầu chạy giải thuật
          </span>
        </div>

        {/* Submit Action Button */}
        <button
          type="button"
          onClick={onParse}
          disabled={loading || !expression.trim()}
          aria-label={loading ? "Đang xử lý phân giải cú pháp..." : "Bắt đầu phân tích cú pháp biểu thức"}
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
          {loading ? 'Đang phân tích...' : 'Phân tích cú pháp'}
        </button>

        {/* Result Badge */}
        {result !== undefined && result !== null && !error && (
          <div
            role="status"
            aria-live="polite"
            style={{
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
            }}
          >
            <span>Giá trị biểu thức:</span>
            <span style={{ fontSize: '18px', color: '#047857' }}>{result}</span>
          </div>
        )}
      </div>

      {/* Examples Chips with Clear Context */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '13px', color: '#475569', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Sparkles size={14} color="#d97706" /> Thử nhanh với biểu thức mẫu:
        </span>
        {examples.map((ex, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectExample(ex)}
            title={`${ex.title}: ${ex.description}`}
            aria-label={`Chọn biểu thức mẫu: ${ex.expression}`}
            style={{
              padding: '5px 12px',
              fontSize: '13px',
              fontFamily: 'monospace',
              backgroundColor: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              cursor: 'pointer',
              color: '#1e293b',
              transition: 'all 0.15s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#e0f2fe';
              e.currentTarget.style.borderColor = '#38bdf8';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f8fafc';
              e.currentTarget.style.borderColor = '#cbd5e1';
            }}
          >
            {ex.expression}
          </button>
        ))}
      </div>

      {/* Actionable Error Alert */}
      {error && (
        <div
          id="expression-error-msg"
          role="alert"
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            padding: '12px 16px',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            color: '#991b1b',
            fontSize: '14px',
            lineHeight: '1.4'
          }}
        >
          <AlertCircle size={20} style={{ flexShrink: 0, marginTop: '1px' }} />
          <div>
            <strong>Phát hiện lỗi cú pháp:</strong> {error}
            <div style={{ fontSize: '12px', color: '#b91c1c', marginTop: '4px' }}>
              Gợi ý khắc phục: Hãy kiểm tra các cặp ngoặc tròn ( ), tránh viết hai toán tử liền nhau hoặc nhập ký tự lạ.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
