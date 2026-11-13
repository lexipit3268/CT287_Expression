import React from 'react';
import { Handle, Position } from '@xyflow/react';
import type { FlowNodeData } from '../types';

interface CustomNodeProps {
  data: FlowNodeData;
}

export const CustomNodeComponent: React.FC<CustomNodeProps> = ({ data }) => {
  const { label, nodeType, value, status, isCurrent } = data;

  // Lexipit 6-Color Sticker Palette Mapping
  const getNodeColor = () => {
    switch (nodeType) {
      case 'Expression':
        return { bg: '#4da2ff', text: '#000000', tagBg: '#ffffff', tagText: '#000000' }; // Electric Blue
      case 'Term':
        return { bg: '#5c4ade', text: '#ffffff', tagBg: '#e9ccff', tagText: '#000000' }; // Voltage Violet
      case 'Factor':
        return { bg: '#ffd731', text: '#000000', tagBg: '#ffffff', tagText: '#000000' }; // Sunburst
      case 'Operator':
        return { bg: '#fb4903', text: '#ffffff', tagBg: '#000000', tagText: '#ffffff' }; // Ember
      case 'Number':
        return { bg: '#55db9c', text: '#000000', tagBg: '#ffffff', tagText: '#000000' }; // Mint Pop
      case 'Parenthesis':
        return { bg: '#e9e9e9', text: '#000000', tagBg: '#ffffff', tagText: '#000000' }; // Soft Mist
      default:
        return { bg: '#ffffff', text: '#000000', tagBg: '#cccccc', tagText: '#000000' };
    }
  };

  const colors = getNodeColor();

  // Active or error sticker styling
  const getOutlineStyle = () => {
    if (status === 'error') {
      return {
        boxShadow: '0 0 0 4px #fb4903, 0 0 0 6px #000000',
        transform: 'scale(1.08)'
      };
    }
    if (isCurrent) {
      return {
        boxShadow: '0 0 0 4px #ffd731, 0 0 0 6px #000000',
        transform: 'scale(1.10)'
      };
    }
    return {
      boxShadow: 'none',
      transform: 'scale(1)'
    };
  };

  const outline = getOutlineStyle();

  return (
    <div
      style={{
        minWidth: '76px',
        padding: '7px 14px',
        borderRadius: nodeType === 'Operator' ? '1600px' : '20px', // Lexipit pill or soft card
        border: '2px solid #000000', // Hand-cut black sticker outline
        backgroundColor: colors.bg,
        color: colors.text,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        userSelect: 'none',
        ...outline
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: '#000000',
          width: 8,
          height: 8,
          border: '1px solid #ffffff'
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span
          style={{
            fontSize: '17px',
            fontWeight: 900,
            letterSpacing: '-0.02em',
            lineHeight: 1.1
          }}
        >
          {label}
        </span>

        {/* Lexipit Non-Terminal Badge */}
        <span
          style={{
            fontSize: '11px',
            fontWeight: 800,
            padding: '2px 6px',
            borderRadius: '1600px',
            border: '1px solid #000000',
            backgroundColor: colors.tagBg,
            color: colors.tagText,
            letterSpacing: '0.02em',
            textTransform: 'uppercase'
          }}
        >
          {nodeType === 'Expression' ? 'E' :
           nodeType === 'Term' ? 'T' :
           nodeType === 'Factor' ? 'F' :
           nodeType === 'Operator' ? 'OP' : 'ID'}
        </span>
      </div>

      {/* Evaluated Value Sticker Tag */}
      {value !== undefined && value !== null && (
        <div
          style={{
            marginTop: '5px',
            fontSize: '13px',
            fontWeight: 800,
            color: '#000000',
            backgroundColor: '#ffffff',
            padding: '2px 8px',
            borderRadius: '1600px',
            border: '1.5px solid #000000',
            letterSpacing: '-0.01em'
          }}
        >
          = {value}
        </div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: '#000000',
          width: 8,
          height: 8,
          border: '1px solid #ffffff'
        }}
      />
    </div>
  );
};

export const CustomNode = React.memo(CustomNodeComponent);
