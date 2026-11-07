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
          borderLeft: '1px solid #e2e8f0',
          width: '360px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#64748b',
          fontSize: '14px',
          textAlign: 'center'
        }}
      >
        Chưa có dữ liệu phân tích. Hãy nhập biểu thức và bấm "Phân tích cú pháp".
      </aside>
    );
  }

  const getActionFriendlyName = (action: string) => {
    switch (action) {
      case 'CALL':
        return 'Gọi hàm đệ quy';
      case 'TOKEN':
        return 'Khớp ký hiệu';
      case 'READ':
        return 'Đọc số hạng';
      case 'COMPUTE':
        return 'Thực hiện phép tính';
      case 'RETURN':
        return 'Trả về kết quả';
      case 'COMPLETE':
        return 'Hoàn tất thành công';
      case 'ERROR':
        return 'Lỗi cú pháp';
      default:
        return action;
    }
  };

  return (
    <aside
      aria-label="Bảng theo dõi trạng thái phân giải"
      style={{
        width: '360px',
        backgroundColor: '#f8fafc',
        borderLeft: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto'
      }}
    >
      {/* 1. Expression Position Viewer */}
      <section
        aria-labelledby="section-pointer-title"
        style={{ padding: '16px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div id="section-pointer-title" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1e293b', fontWeight: 700, fontSize: '13px' }}>
            <Terminal size={16} color="#2563eb" />
            <span>Vị trí con trỏ đọc chuỗi (currentPos = {step.currentPos})</span>
          </div>
        </div>

        <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#64748b', lineHeight: '1.4' }}>
          Ký tự được đóng khung vàng là vị trí con trỏ đang trỏ tới trong chuỗi nguồn:
        </p>

        <div
          role="region"
          aria-label="Băng hiển thị chuỗi ký tự"
          style={{
            display: 'flex',
            gap: '4px',
            overflowX: 'auto',
            padding: '8px 4px 10px 4px',
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
                  minWidth: '24px'
                }}
              >
                <div
                  aria-current={isCurrent ? 'true' : undefined}
                  style={{
                    width: '26px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '6px',
                    fontWeight: isCurrent ? 800 : 500,
                    backgroundColor: isCurrent ? '#fef08a' : isPassed ? '#f1f5f9' : '#ffffff',
                    border: isCurrent ? '2px solid #ca8a04' : '1px solid #cbd5e1',
                    color: isCurrent ? '#854d0e' : '#1e293b',
                    boxShadow: isCurrent ? '0 0 8px rgba(202, 138, 4, 0.4)' : 'none'
                  }}
                >
                  {char === ' ' ? '␣' : char}
                </div>
                <span style={{ fontSize: '11px', fontWeight: 600, color: isCurrent ? '#a16207' : '#64748b', marginTop: '2px' }}>
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
              minWidth: '36px'
            }}>
              <div
                aria-current="true"
                style={{
                  padding: '2px 6px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '6px',
                  fontWeight: 800,
                  backgroundColor: '#dcfce7',
                  border: '2px solid #16a34a',
                  color: '#15803d',
                  fontSize: '11px'
                }}
              >
                Hết chuỗi
              </div>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#16a34a', marginTop: '2px' }}>{expression.length}</span>
            </div>
          )}
        </div>
      </section>

      {/* 2. Step Description & Action Badge */}
      <section
        aria-labelledby="section-action-title"
        style={{ padding: '16px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span id="section-action-title" style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#475569', letterSpacing: '0.04em' }}>
            Hành động giải thuật
          </span>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              padding: '3px 9px',
              borderRadius: '12px',
              backgroundColor:
                step.actionType === 'CALL' ? '#dbeafe' :
                step.actionType === 'TOKEN' ? '#fef3c7' :
                step.actionType === 'READ' ? '#d1fae5' :
                step.actionType === 'COMPUTE' ? '#dcfce7' :
                step.actionType === 'RETURN' ? '#ede9fe' :
                step.actionType === 'ERROR' ? '#fee2e2' : '#f1f5f9',
              color:
                step.actionType === 'CALL' ? '#1d4ed8' :
                step.actionType === 'TOKEN' ? '#b45309' :
                step.actionType === 'READ' ? '#065f46' :
                step.actionType === 'COMPUTE' ? '#15803d' :
                step.actionType === 'RETURN' ? '#5b21b6' :
                step.actionType === 'ERROR' ? '#b91c1c' : '#334155'
            }}
          >
            {getActionFriendlyName(step.actionType)}
          </span>
        </div>
        <div
          role="status"
          aria-live="polite"
          style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '12px 14px',
            fontSize: '13px',
            lineHeight: '1.55',
            color: '#0f172a'
          }}
        >
          {step.description}
        </div>
      </section>

      {/* 3. Call Stack Visualizer */}
      <section
        aria-labelledby="section-stack-title"
        style={{ padding: '16px', borderBottom: '1px solid #e2e8f0', flex: '1' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', color: '#1e293b', fontWeight: 700, fontSize: '13px' }}>
          <Layers size={16} color="#7c3aed" />
          <span id="section-stack-title">Ngăn xếp đệ quy (Call Stack)</span>
        </div>
        <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#64748b', lineHeight: '1.4' }}>
          Hiển thị các hàm đệ quy đang lồng nhau. Hàm trên đỉnh (TOP) là hàm đang nắm quyền xử lý:
        </p>

        {step.callStack.length === 0 ? (
          <div style={{ fontSize: '13px', color: '#64748b', fontStyle: 'italic', padding: '10px', backgroundColor: '#ffffff', borderRadius: '6px', border: '1px dashed #cbd5e1' }}>
            Ngăn xếp rỗng (đã hoàn thành hoặc chưa bắt đầu)
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
                    borderRadius: '6px',
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    fontWeight: isTop ? 700 : 500,
                    backgroundColor: isTop ? '#ede9fe' : '#ffffff',
                    border: isTop ? '1px solid #8b5cf6' : '1px solid #cbd5e1',
                    color: isTop ? '#5b21b6' : '#334155',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: isTop ? '0 1px 4px rgba(139, 92, 246, 0.2)' : 'none'
                  }}
                >
                  <span>{fn}</span>
                  {isTop && (
                    <span style={{ fontSize: '10px', backgroundColor: '#7c3aed', color: '#ffffff', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                      ĐANG XỬ LÝ
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. Symbol Legend without Emojis (Semantic badges) */}
      <section
        aria-labelledby="section-legend-title"
        style={{ padding: '14px 16px', backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0', fontSize: '12px' }}
      >
        <div id="section-legend-title" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px', color: '#334155', fontWeight: 700 }}>
          <Info size={15} color="#2563eb" />
          <span>Ý nghĩa các ký hiệu cú pháp trên cây:</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', color: '#334155' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#3b82f6' }}></span>
            <span><strong>E</strong>: Biểu thức (Cộng/Trừ)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#8b5cf6' }}></span>
            <span><strong>T</strong>: Số hạng (Nhân/Chia)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#f59e0b' }}></span>
            <span><strong>F</strong>: Thừa số (Ngoặc / id)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#10b981' }}></span>
            <span><strong>id</strong>: Giá trị số cụ thể</span>
          </div>
        </div>
      </section>
    </aside>
  );
};
