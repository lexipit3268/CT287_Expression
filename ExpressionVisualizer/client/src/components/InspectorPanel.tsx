import React from 'react';
import { Terminal, Layers, Info } from 'lucide-react';
import type { TraceStep } from '../types';

interface InspectorPanelProps {
  expression: string;
  step?: TraceStep;
}

export const InspectorPanel: React.FC<InspectorPanelProps> = ({ expression, step }) => {
  if (!step) {
    return (
      <aside
        aria-label="Bảng theo dõi trạng thái phân giải"
        style={{
          padding: '24px',
          backgroundColor: '#ffffff',
          borderLeft: '2px solid #000000',
          width: '360px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#000000',
          fontSize: '14px',
          fontWeight: 600,
          textAlign: 'center'
        }}
      >
        Chưa có dữ liệu phân tích. Hãy nhập biểu thức và bấm "PHÂN TÍCH".
      </aside>
    );
  }

  // Lexipit Action Badge Color Map
  const getActionBadge = (action: string) => {
    switch (action) {
      case 'CALL':
        return { label: 'GỌI HÀM ĐỆ QUY', bg: '#4da2ff', text: '#000000' }; // Electric Blue
      case 'TOKEN':
        return { label: 'KHỚP KÝ HIỆU', bg: '#ffd731', text: '#000000' }; // Sunburst
      case 'READ':
        return { label: 'ĐỌC SỐ HẠNG', bg: '#55db9c', text: '#000000' }; // Mint Pop
      case 'COMPUTE':
        return { label: 'TÍNH TOÁN', bg: '#e9ccff', text: '#000000' }; // Lavender
      case 'RETURN':
        return { label: 'TRẢ KẾT QUẢ', bg: '#5c4ade', text: '#ffffff' }; // Voltage Violet
      case 'COMPLETE':
        return { label: 'HOÀN THÀNH', bg: '#55db9c', text: '#000000' }; // Mint Pop
      case 'ERROR':
        return { label: 'LỖI CÚ PHÁP', bg: '#fb4903', text: '#ffffff' }; // Ember
      default:
        return { label: action, bg: '#e9e9e9', text: '#000000' };
    }
  };

  const actionBadge = getActionBadge(step.actionType);

  return (
    <aside
      aria-label="Bảng theo dõi trạng thái phân giải"
      style={{
        width: '370px',
        backgroundColor: '#ffffff',
        borderLeft: '2px solid #000000',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        gap: '14px',
        padding: '16px'
      }}
    >
      {/* 1. Expression Position Viewer Card */}
      <section
        style={{
          backgroundColor: '#dceeff', // Sky Wash pastel ground
          border: '1.5px solid #000000',
          borderRadius: '20px',
          padding: '14px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', color: '#000000', fontWeight: 800, fontSize: '13px', textTransform: 'uppercase' }}>
          <Terminal size={16} color="#000000" />
          <span>CON TRỎ DUYỆT CHUỖI (POS = {step.currentPos})</span>
        </div>

        <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#000000', fontWeight: 500 }}>
          Ký tự ô vàng là vị trí con trỏ đang đọc:
        </p>

        {/* Character Sticker Boxes */}
        <div
          role="region"
          aria-label="Băng hiển thị chuỗi ký tự"
          style={{
            display: 'flex',
            gap: '5px',
            overflowX: 'auto',
            padding: '4px 2px 8px 2px',
            fontFamily: 'monospace',
            fontSize: '15px'
          }}
        >
          {expression.split('').map((char, index) => {
            const isCurrent = index === step.currentPos;
            const isPassed = index < step.currentPos;
            return (
              <div
                key={index}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minWidth: '26px'
                }}
              >
                <div
                  aria-current={isCurrent ? 'true' : undefined}
                  style={{
                    width: '28px',
                    height: '34px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '8px',
                    fontWeight: 900,
                    backgroundColor: isCurrent ? '#ffd731' : isPassed ? '#e9e9e9' : '#ffffff', // Sunburst vs Soft Mist vs Paper
                    border: isCurrent ? '2px solid #000000' : '1.5px solid #000000',
                    color: '#000000',
                    transform: isCurrent ? 'scale(1.08)' : 'scale(1)',
                    transition: 'transform 0.15s ease'
                  }}
                >
                  {char === ' ' ? '␣' : char}
                </div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#000000', marginTop: '2px' }}>
                  {index}
                </span>
              </div>
            );
          })}
          {step.currentPos >= expression.length && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              minWidth: '40px'
            }}>
              <div
                aria-current="true"
                style={{
                  padding: '2px 8px',
                  height: '34px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '8px',
                  fontWeight: 900,
                  backgroundColor: '#55db9c', // Mint Pop
                  border: '2px solid #000000',
                  color: '#000000',
                  fontSize: '11px',
                  letterSpacing: '0.02em',
                  textTransform: 'uppercase'
                }}
              >
                EOF
              </div>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#000000', marginTop: '2px' }}>{expression.length}</span>
            </div>
          )}
        </div>
      </section>

      {/* 2. Step Description & Action Badge Card */}
      <section
        style={{
          backgroundColor: '#ffffff',
          border: '1.5px solid #000000',
          borderRadius: '20px',
          padding: '14px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', color: '#000000', letterSpacing: '0.03em' }}>
            HÀNH ĐỘNG GIẢI THUẬT
          </span>

          {/* Lexipit Action Sticker Pill */}
          <span
            style={{
              fontSize: '11px',
              fontWeight: 800,
              padding: '3px 10px',
              borderRadius: '1600px',
              border: '1.5px solid #000000',
              backgroundColor: actionBadge.bg,
              color: actionBadge.text,
              letterSpacing: '0.032em',
              textTransform: 'uppercase'
            }}
          >
            {actionBadge.label}
          </span>
        </div>

        <div
          role="status"
          aria-live="polite"
          style={{
            backgroundColor: '#e9e9e9', // Soft Mist
            border: '1px solid #000000',
            borderRadius: '12px',
            padding: '10px 12px',
            fontSize: '13px',
            fontWeight: 600,
            lineHeight: '1.5',
            color: '#000000'
          }}
        >
          {step.description}
        </div>
      </section>

      {/* 3. Call Stack Visualizer Card */}
      <section
        style={{
          backgroundColor: '#ffffff',
          border: '1.5px solid #000000',
          borderRadius: '20px',
          padding: '14px',
          flex: '1'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', color: '#000000', fontWeight: 800, fontSize: '13px', textTransform: 'uppercase' }}>
          <Layers size={16} color="#000000" />
          <span>NGĂN XẾP ĐỆ QUY (CALL STACK)</span>
        </div>

        {step.callStack.length === 0 ? (
          <div style={{ fontSize: '13px', color: '#000000', fontStyle: 'italic', padding: '10px', backgroundColor: '#e9e9e9', borderRadius: '12px', border: '1px dashed #000000' }}>
            Ngăn xếp rỗng
          </div>
        ) : (
          <div
            role="list"
            aria-label="Danh sách hàm trong ngăn xếp"
            style={{ display: 'flex', flexDirection: 'column-reverse', gap: '6px' }}
          >
            {step.callStack.map((fn, idx) => {
              const isTop = idx === step.callStack.length - 1;
              return (
                <div
                  key={idx}
                  role="listitem"
                  style={{
                    padding: '8px 12px',
                    borderRadius: '1600px', // Lexipit pill
                    fontFamily: 'monospace',
                    fontSize: '13px',
                    fontWeight: isTop ? 800 : 600,
                    backgroundColor: isTop ? '#5c4ade' : '#ffffff', // Voltage Violet for top
                    border: '1.5px solid #000000',
                    color: isTop ? '#ffffff' : '#000000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span>{fn}</span>
                  {isTop && (
                    <span style={{
                      fontSize: '10px',
                      backgroundColor: '#ffd731', // Sunburst badge
                      color: '#000000',
                      padding: '2px 8px',
                      borderRadius: '1600px',
                      border: '1px solid #000000',
                      fontWeight: 900
                    }}>
                      TOP
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. Lexipit Sticker Legend Card */}
      <section
        style={{
          backgroundColor: '#e9ccff', // Lavender pastel surface
          border: '1.5px solid #000000',
          borderRadius: '20px',
          padding: '12px 14px',
          fontSize: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', color: '#000000', fontWeight: 900, textTransform: 'uppercase' }}>
          <Info size={15} color="#000000" />
          <span>CHÚ GIẢI KÝ HIỆU CÂY:</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', color: '#000000', fontWeight: 700 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '1600px', backgroundColor: '#4da2ff', border: '1px solid #000000' }}></span>
            <span>E: Biểu thức</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '1600px', backgroundColor: '#5c4ade', border: '1px solid #000000' }}></span>
            <span>T: Số hạng</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '1600px', backgroundColor: '#ffd731', border: '1px solid #000000' }}></span>
            <span>F: Thừa số</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '1600px', backgroundColor: '#55db9c', border: '1px solid #000000' }}></span>
            <span>ID: Giá trị số</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '1600px', backgroundColor: '#fb4903', border: '1px solid #000000' }}></span>
            <span>OP: Toán tử</span>
          </div>
        </div>
      </section>
    </aside>
  );
};
