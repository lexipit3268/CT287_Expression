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
      <div style={{
        padding: '20px',
        backgroundColor: '#ffffff',
        borderLeft: '1px solid #e2e8f0',
        width: '340px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#94a3b8'
      }}>
        Chưa có dữ liệu bước thực thi
      </div>
    );
  }

  return (
    <div style={{
      width: '360px',
      backgroundColor: '#f8fafc',
      borderLeft: '1px solid #e2e8f0',
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto'
    }}>
      {/* 1. Expression Position Viewer */}
      <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', color: '#334155', fontWeight: 600, fontSize: '13px' }}>
          <Terminal size={15} color="#2563eb" />
          <span>Vị trí con trỏ (currentPos = {step.currentPos})</span>
        </div>

        <div style={{
          display: 'flex',
          gap: '4px',
          overflowX: 'auto',
          padding: '8px 4px 12px 4px',
          fontFamily: 'monospace',
          fontSize: '15px'
        }}>
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
                  style={{
                    width: '26px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '6px',
                    fontWeight: isCurrent ? 800 : 500,
                    backgroundColor: isCurrent ? '#fef08a' : isPassed ? '#e2e8f0' : '#ffffff',
                    border: isCurrent ? '2px solid #eab308' : '1px solid #cbd5e1',
                    color: isCurrent ? '#854d0e' : '#1e293b',
                    boxShadow: isCurrent ? '0 0 8px rgba(234, 179, 8, 0.4)' : 'none'
                  }}
                >
                  {char === ' ' ? '␣' : char}
                </div>
                <span style={{ fontSize: '10px', color: isCurrent ? '#ca8a04' : '#94a3b8', marginTop: '2px' }}>
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
              minWidth: '34px'
            }}>
              <div style={{
                padding: '2px 6px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '6px',
                fontWeight: 700,
                backgroundColor: '#dcfce7',
                border: '2px solid #22c55e',
                color: '#15803d',
                fontSize: '11px'
              }}>
                EOF
              </div>
              <span style={{ fontSize: '10px', color: '#16a34a', marginTop: '2px' }}>{expression.length}</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Step Description & Action Badge */}
      <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b' }}>
            Hành động hiện tại
          </span>
          <span style={{
            fontSize: '11px',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: '12px',
            backgroundColor:
              step.actionType === 'CALL' ? '#dbeafe' :
              step.actionType === 'TOKEN' ? '#fef3c7' :
              step.actionType === 'COMPUTE' ? '#dcfce7' :
              step.actionType === 'RETURN' ? '#e0e7ff' :
              step.actionType === 'ERROR' ? '#fee2e2' : '#f1f5f9',
            color:
              step.actionType === 'CALL' ? '#1d4ed8' :
              step.actionType === 'TOKEN' ? '#b45309' :
              step.actionType === 'COMPUTE' ? '#15803d' :
              step.actionType === 'RETURN' ? '#4338ca' :
              step.actionType === 'ERROR' ? '#b91c1c' : '#475569'
          }}>
            {step.actionType}
          </span>
        </div>
        <div style={{
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '12px',
          fontSize: '13px',
          lineHeight: '1.5',
          color: '#1e293b'
        }}>
          {step.description}
        </div>
      </div>

      {/* 3. Call Stack Visualizer */}
      <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0', flex: '1' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px', color: '#334155', fontWeight: 600, fontSize: '13px' }}>
          <Layers size={15} color="#8b5cf6" />
          <span>Ngăn xếp gọi hàm đệ quy (Call Stack)</span>
        </div>

        {step.callStack.length === 0 ? (
          <div style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }}>
            Call stack trống
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: '6px' }}>
            {step.callStack.map((fn, idx) => {
              const isTop = idx === step.callStack.length - 1;
              return (
                <div
                  key={idx}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    fontWeight: isTop ? 700 : 500,
                    backgroundColor: isTop ? '#ede9fe' : '#ffffff',
                    border: isTop ? '1px solid #a78bfa' : '1px solid #e2e8f0',
                    color: isTop ? '#5b21b6' : '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: isTop ? '0 1px 3px rgba(139, 92, 246, 0.2)' : 'none'
                  }}
                >
                  <span>{fn}</span>
                  {isTop && (
                    <span style={{ fontSize: '10px', backgroundColor: '#7c3aed', color: '#ffffff', padding: '1px 5px', borderRadius: '4px' }}>
                      TOP
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Color Legend */}
      <div style={{ padding: '14px 16px', backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0', fontSize: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px', color: '#475569', fontWeight: 600 }}>
          <Info size={14} /> Chú giải ký hiệu:
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', color: '#475569' }}>
          <div>🔵 <strong>E</strong>: Expression (Cộng)</div>
          <div>🟣 <strong>T</strong>: Term (Nhân/Chia)</div>
          <div>🟠 <strong>F</strong>: Factor (Thừa số)</div>
          <div>🟢 <strong>id</strong>: Số nguyên/thực</div>
        </div>
      </div>
    </div>
  );
};
