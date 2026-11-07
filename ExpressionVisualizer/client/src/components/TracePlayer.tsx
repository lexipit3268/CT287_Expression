import React from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ChevronLeft,
  ChevronRight,
  Clock
} from 'lucide-react';

interface TracePlayerProps {
  currentStepIndex: number;
  totalSteps: number;
  isPlaying: boolean;
  onPlayPause: () => void;
  onStepChange: (index: number) => void;
  playSpeed: number;
  setPlaySpeed: (speed: number) => void;
}

export const TracePlayer: React.FC<TracePlayerProps> = ({
  currentStepIndex,
  totalSteps,
  isPlaying,
  onPlayPause,
  onStepChange,
  playSpeed,
  setPlaySpeed
}) => {
  if (totalSteps <= 0) return null;

  return (
    <nav
      aria-label="Thanh điều khiển tiến trình phân giải"
      style={{
        backgroundColor: '#ffffff',
        borderTop: '2px solid #000000',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        flexWrap: 'wrap',
        userSelect: 'none'
      }}
    >
      {/* 1. Lexipit Outlined Pill Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          type="button"
          onClick={() => onStepChange(0)}
          disabled={currentStepIndex <= 0}
          title="Về bước đầu tiên"
          aria-label="Về bước đầu tiên"
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '1600px',
            border: '1.5px solid #000000',
            backgroundColor: '#ffffff',
            cursor: currentStepIndex <= 0 ? 'not-allowed' : 'pointer',
            opacity: currentStepIndex <= 0 ? 0.35 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#000000',
            transition: 'background-color 0.1s ease'
          }}
          onMouseEnter={(e) => {
            if (currentStepIndex > 0) e.currentTarget.style.backgroundColor = '#dceeff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#ffffff';
          }}
        >
          <SkipBack size={16} />
        </button>

        <button
          type="button"
          onClick={() => onStepChange(Math.max(0, currentStepIndex - 1))}
          disabled={currentStepIndex <= 0}
          title="Lùi một bước"
          aria-label="Lùi một bước"
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '1600px',
            border: '1.5px solid #000000',
            backgroundColor: '#ffffff',
            cursor: currentStepIndex <= 0 ? 'not-allowed' : 'pointer',
            opacity: currentStepIndex <= 0 ? 0.35 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#000000',
            transition: 'background-color 0.1s ease'
          }}
          onMouseEnter={(e) => {
            if (currentStepIndex > 0) e.currentTarget.style.backgroundColor = '#dceeff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#ffffff';
          }}
        >
          <ChevronLeft size={18} />
        </button>

        {/* Lexipit Play/Pause Sticker Button */}
        <button
          type="button"
          onClick={onPlayPause}
          title={isPlaying ? 'Tạm dừng' : 'Chạy tự động'}
          aria-label={isPlaying ? 'Tạm dừng chạy tự động' : 'Bắt đầu tự động chạy'}
          style={{
            height: '38px',
            padding: '0 20px',
            borderRadius: '1600px',
            border: '2px solid #000000',
            backgroundColor: isPlaying ? '#fb4903' : '#ffd731', // Ember vs Sunburst
            color: isPlaying ? '#ffffff' : '#000000',
            fontWeight: 800,
            fontSize: '13px',
            letterSpacing: '0.032em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'transform 0.1s ease'
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'scale(0.96)';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          {isPlaying ? <Pause size={16} fill="#ffffff" /> : <Play size={16} fill="#000000" />}
          <span>{isPlaying ? 'TẠM DỪNG' : 'TỰ ĐỘNG CHẠY'}</span>
        </button>

        <button
          type="button"
          onClick={() => onStepChange(Math.min(totalSteps - 1, currentStepIndex + 1))}
          disabled={currentStepIndex >= totalSteps - 1}
          title="Tiến một bước"
          aria-label="Tiến một bước"
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '1600px',
            border: '1.5px solid #000000',
            backgroundColor: '#ffffff',
            cursor: currentStepIndex >= totalSteps - 1 ? 'not-allowed' : 'pointer',
            opacity: currentStepIndex >= totalSteps - 1 ? 0.35 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#000000',
            transition: 'background-color 0.1s ease'
          }}
          onMouseEnter={(e) => {
            if (currentStepIndex < totalSteps - 1) e.currentTarget.style.backgroundColor = '#dceeff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#ffffff';
          }}
        >
          <ChevronRight size={18} />
        </button>

        <button
          type="button"
          onClick={() => onStepChange(totalSteps - 1)}
          disabled={currentStepIndex >= totalSteps - 1}
          title="Tới bước cuối cùng"
          aria-label="Tới bước cuối cùng"
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '1600px',
            border: '1.5px solid #000000',
            backgroundColor: '#ffffff',
            cursor: currentStepIndex >= totalSteps - 1 ? 'not-allowed' : 'pointer',
            opacity: currentStepIndex >= totalSteps - 1 ? 0.35 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#000000',
            transition: 'background-color 0.1s ease'
          }}
          onMouseEnter={(e) => {
            if (currentStepIndex < totalSteps - 1) e.currentTarget.style.backgroundColor = '#dceeff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#ffffff';
          }}
        >
          <SkipForward size={16} />
        </button>
      </div>

      {/* 2. Step Progress with Lexipit Lavender Sticker Tag */}
      <div style={{ flex: '1 1 240px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            backgroundColor: '#e9ccff', // Lavender
            border: '1.5px solid #000000',
            borderRadius: '1600px',
            padding: '4px 12px',
            fontSize: '12px',
            fontWeight: 800,
            color: '#000000',
            letterSpacing: '0.02em',
            minWidth: '100px',
            textAlign: 'center'
          }}
        >
          BƯỚC {currentStepIndex + 1} / {totalSteps}
        </div>

        <input
          id="step-progress-slider"
          type="range"
          min={0}
          max={totalSteps - 1}
          value={currentStepIndex}
          onChange={(e) => onStepChange(Number(e.target.value))}
          aria-label={`Thanh trượt chuyển bước thực thi, hiện tại bước ${currentStepIndex + 1} trên ${totalSteps}`}
          style={{
            width: '100%',
            cursor: 'pointer',
            accentColor: '#000000'
          }}
        />
      </div>

      {/* 3. Speed Selector Pill */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Clock size={16} color="#000000" />
        <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.02em' }}>
          Tốc độ:
        </span>
        <select
          id="speed-select"
          value={playSpeed}
          onChange={(e) => setPlaySpeed(Number(e.target.value))}
          aria-label="Chọn khoảng thời gian mỗi bước"
          style={{
            padding: '6px 14px',
            borderRadius: '1600px',
            border: '1.5px solid #000000',
            fontSize: '12px',
            fontWeight: 700,
            backgroundColor: '#ffffff',
            color: '#000000',
            cursor: 'pointer',
            outline: 'none'
          }}
        >
          <option value={1500}>0.5x (1.5s / bước)</option>
          <option value={900}>1.0x (0.9s / bước)</option>
          <option value={400}>2.0x (0.4s / bước)</option>
        </select>
      </div>
    </nav>
  );
};
