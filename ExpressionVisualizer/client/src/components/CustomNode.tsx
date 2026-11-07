import React from 'react';
import { Handle, Position } from '@xyflow/react';
import type { FlowNodeData } from '../types';

interface CustomNodeProps {
  data: FlowNodeData;
}

export const CustomNodeComponent: React.FC<CustomNodeProps> = ({ data }) => {
  const { label, nodeType, value, status, isCurrent } = data;

  return (
    <div
      className={isCurrent ? 'active-pulse' : ''}
      style={{
        minWidth: '68px',
        padding: '6px 12px',
        borderRadius: '12px',
        border: '2px solid',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.25s ease-in-out',
        background: status === 'error' ? '#fef2f2' : isCurrent ? '#fffbeb' : '#ffffff',
        borderColor: status === 'error' ? '#ef4444' : isCurrent ? '#f59e0b' : status === 'completed' ? '#10b981' : '#cbd5e1',
        boxShadow: isCurrent ? '0 4px 12px rgba(245, 158, 11, 0.35)' : '0 2px 5px rgba(0,0,0,0.06)',
        transform: isCurrent ? 'scale(1.08)' : 'scale(1)'
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: '#94a3b8', width: 8, height: 8 }}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <span
          style={{
            fontSize: '15px',
            fontWeight: 700,
            color: nodeType === 'Number' ? '#047857' : nodeType === 'Operator' ? '#be123c' : '#0f172a'
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontSize: '10px',
            padding: '2px 5px',
            borderRadius: '6px',
            backgroundColor:
              nodeType === 'Expression' ? '#dbeafe' :
              nodeType === 'Term' ? '#f3e8ff' :
              nodeType === 'Factor' ? '#fef3c7' :
              nodeType === 'Operator' ? '#ffe4e6' : '#d1fae5',
            color:
              nodeType === 'Expression' ? '#1e40af' :
              nodeType === 'Term' ? '#6b21a8' :
              nodeType === 'Factor' ? '#92400e' :
              nodeType === 'Operator' ? '#9f1239' : '#065f46',
            fontWeight: 700
          }}
        >
          {nodeType.substring(0, 3)}
        </span>
      </div>

      {value !== undefined && value !== null && (
        <div
          style={{
            marginTop: '4px',
            fontSize: '12px',
            fontWeight: 700,
            color: '#047857',
            backgroundColor: '#ecfdf5',
            padding: '2px 6px',
            borderRadius: '4px',
            border: '1px solid #a7f3d0'
          }}
        >
          = {value}
        </div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: '#94a3b8', width: 8, height: 8 }}
      />
    </div>
  );
};

export const CustomNode = React.memo(CustomNodeComponent);
