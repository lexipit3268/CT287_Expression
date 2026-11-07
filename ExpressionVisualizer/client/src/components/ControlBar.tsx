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
      borderBottom: '2px solid #000000',
      padding: '14px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    }}>
      {/* Top Input Row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        {/* Lexipit Pill Algorithm Switcher */}
        <div
          role="radiogroup"
          aria-label="Chọn giải thuật phân giải cú pháp"
          style={{
            display: 'flex',
            backgroundColor: '#e9e9e9', // Soft Mist
            borderRadius: '1600px',
            padding: '3px',
            border: '1.5px solid #000000'
          }}
        >
          <button
            type="button"
            role="radio"
            aria-checked={algorithm === 'v1'}
            onClick={() => setAlgorithm('v1')}
            title="Văn phạm Session 5: E -> T + E | T, T -> F * T | F (kết hợp phải)"
            style={{
              padding: '7px 16px',
              borderRadius: '1600px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '12px',
              letterSpacing: '0.030em',
              transition: 'all 0.15s ease',
              backgroundColor: algorithm === 'v1' ? '#000000' : 'transparent',
              color: algorithm === 'v1' ? '#ffffff' : '#000000'
            }}
          >
            GIẢI THUẬT I (SLIDE: +, *)
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={algorithm === 'v2'}
            onClick={() => setAlgorithm('v2')}
            title="Giải thuật nâng cao: Hỗ trợ +, -, *, / theo quy tắc kết hợp trái chuẩn toán học"
            style={{
              padding: '7px 16px',
              borderRadius: '1600px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '12px',
              letterSpacing: '0.030em',
              transition: 'all 0.15s ease',
              backgroundColor: algorithm === 'v2' ? '#000000' : 'transparent',
              color: algorithm === 'v2' ? '#ffffff' : '#000000'
            }}
          >
            GIẢI THUẬT II (+, -, *, /)
          </button>
        </div>

        {/* Lexipit Outlined Input Field */}
        <div style={{ flex: '1 1 280px', display: 'flex', position: 'relative' }}>
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
            placeholder="Ví dụ: 2 * 3 + 6 hoặc (2 + 3) * 4"
            style={{
              width: '100%',
              padding: '9px 18px',
              fontSize: '15px',
              fontWeight: 700,
              fontFamily: 'monospace',
              borderRadius: '1600px',
              border: error ? '2px solid #fb4903' : '1.5px solid #000000',
              outline: 'none',
              backgroundColor: '#ffffff',
              color: '#000000'
            }}
          />
        </div>

        {/* Lexipit Filled CTA Button */}
        <button
          type="button"
          onClick={onParse}
          disabled={loading || !expression.trim()}
          aria-label={loading ? "Đang xử lý phân giải..." : "Phân tích cú pháp biểu thức"}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 22px',
            backgroundColor: loading ? '#cccccc' : '#000000',
            color: '#ffffff',
            border: '1.5px solid #000000',
            borderRadius: '1600px',
            fontWeight: 800,
            fontSize: '13px',
            letterSpacing: '0.032em',
            textTransform: 'uppercase',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'transform 0.1s ease',
            boxShadow: 'none'
          }}
          onMouseDown={(e) => {
            if (!loading) e.currentTarget.style.transform = 'scale(0.97)';
          }}
          onMouseUp={(e) => {
            if (!loading) e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <Play size={15} fill="#ffffff" />
          {loading ? 'ĐANG XỬ LÝ...' : 'PHÂN TÍCH'}
        </button>

        {/* Lexipit Sticker Result Badge */}
        {result !== undefined && result !== null && !error && (
          <div
            role="status"
            aria-live="polite"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 18px',
              backgroundColor: '#55db9c', // Mint Pop sticker
              border: '2px solid #000000',
              borderRadius: '1600px',
              color: '#000000',
              fontWeight: 800,
              fontSize: '14px',
              letterSpacing: '0.01em'
            }}
          >
            <span>KẾT QUẢ:</span>
            <span style={{ fontSize: '18px', fontWeight: 900 }}>{result}</span>
          </div>
        )}
      </div>

      {/* Example Chips - Outlined Ghost Pill Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <span style={{
          fontSize: '12px',
          color: '#000000',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.03em',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <Sparkles size={14} color="#000000" /> Ví dụ mẫu:
        </span>
        {examples.map((ex, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectExample(ex)}
            title={`${ex.title}: ${ex.description}`}
            style={{
              padding: '4px 14px',
              fontSize: '13px',
              fontFamily: 'monospace',
              fontWeight: 700,
              backgroundColor: '#ffffff',
              border: '1.5px solid #000000',
              borderRadius: '1600px',
              cursor: 'pointer',
              color: '#000000',
              transition: 'background-color 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#dceeff'; // Sky Wash hover
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
            }}
          >
            {ex.expression}
          </button>
        ))}
      </div>

      {/* Lexipit Ember Error Sticker Alert */}
      {error && (
        <div
          role="alert"
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            padding: '12px 18px',
            backgroundColor: '#fb4903', // Ember
            border: '2px solid #000000',
            borderRadius: '20px',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: 600,
            lineHeight: '1.4'
          }}
        >
          <AlertCircle size={20} color="#ffffff" style={{ flexShrink: 0, marginTop: '1px' }} />
          <div>
            <strong style={{ textTransform: 'uppercase', letterSpacing: '0.02em' }}>Phát hiện lỗi cú pháp:</strong> {error}
            <div style={{ fontSize: '12px', opacity: 0.95, marginTop: '3px' }}>
              Gợi ý: Kiểm tra các cặp ngoặc ( ), không viết 2 toán tử liền kề hoặc nhập ký tự lạ.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
