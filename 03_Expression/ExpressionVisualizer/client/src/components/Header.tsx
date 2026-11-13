import React from 'react';
import { Sparkles, Terminal } from 'lucide-react';

export const Header: React.FC = () => {
  const marqueeText = "LEXIPIT • ARITHMETIC EXPRESSION PARSE TREE • RECURSIVE DESCENT ENGINE • SESSION 5: FORMAL METHODS • CTU 2026 • MODEL CHECKING WORKBENCH • ";

  return (
    <header style={{ display: 'flex', flexDirection: 'column', width: '100%', flexShrink: 0 }}>
      {/* 1. Full-bleed Marquee Banner */}
      <div style={{
        backgroundColor: '#000000',
        color: '#ffffff',
        height: '28px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid #000000',
        userSelect: 'none'
      }}>
        <div className="marquee-track">
          <span style={{
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            paddingRight: '16px'
          }}>
            {marqueeText.repeat(4)}
          </span>
          <span style={{
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            paddingRight: '16px'
          }}>
            {marqueeText.repeat(4)}
          </span>
        </div>
      </div>

      {/* 2. Main Top Navigation Bar (Lexipit Sticker Collage) */}
      <nav style={{
        backgroundColor: '#ffffff',
        borderBottom: '2px solid #000000',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* Left: Brand Mark + Sculptural Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Circular Black-outlined 'L' Logo Mark */}
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '1600px',
            border: '2px solid #000000',
            backgroundColor: '#4da2ff', // Electric Blue
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 900,
            fontSize: '22px',
            color: '#000000',
            boxShadow: 'none'
          }}>
            L
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontSize: '20px',
                fontWeight: 900,
                letterSpacing: '-0.03em',
                lineHeight: 1.0,
                color: '#000000',
                textTransform: 'uppercase'
              }}>
                PARSE TREE VISUALIZER
              </span>

              {/* Floating Pill Sticker Accent */}
              <span style={{
                backgroundColor: '#ffd731', // Sunburst
                color: '#000000',
                border: '1.5px solid #000000',
                borderRadius: '1600px',
                padding: '2px 8px',
                fontSize: '10px',
                fontWeight: 800,
                letterSpacing: '0.032em',
                textTransform: 'uppercase'
              }}>
                LEXIPIT EDITION
              </span>
            </div>

            <span style={{ fontSize: '13px', fontWeight: 600, color: '#000000', marginTop: '2px' }}>
              Kiểm Chứng Mô Hình • Session 5: Phân Giải Biểu Thức Số Học Đệ Quy Xuống
            </span>
          </div>
        </div>

        {/* Right: Hand-cut Sticker Pill Tags */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            backgroundColor: '#e9ccff', // Lavender
            border: '1.5px solid #000000',
            borderRadius: '1600px',
            padding: '6px 14px',
            fontSize: '12px',
            fontWeight: 700,
            color: '#000000',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Terminal size={14} color="#000000" />
            <span>C# .NET 10 API</span>
          </div>

          <div style={{
            backgroundColor: '#55db9c', // Mint Pop
            border: '1.5px solid #000000',
            borderRadius: '1600px',
            padding: '6px 14px',
            fontSize: '12px',
            fontWeight: 700,
            color: '#000000',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Sparkles size={14} color="#000000" />
            <span>React Flow</span>
          </div>
        </div>
      </nav>
    </header>
  );
};
