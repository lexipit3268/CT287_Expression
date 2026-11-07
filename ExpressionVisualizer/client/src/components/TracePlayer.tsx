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
    <div style={{
      backgroundColor: '#ffffff',
      borderTop: '1px solid #e2e8f0',
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px',
      flexWrap: 'wrap',
      boxShadow: '0 -2px 10px rgba(0,0,0,0.03)'
    }}>
      {/* Play Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          onClick={() => onStepChange(0)}
          disabled={currentStepIndex <= 0}
          title="Về bước đầu tiên"
          style={{
            padding: '8px',
            borderRadius: '6px',
            border: '1px solid #cbd5e1',
            backgroundColor: '#f8fafc',
            cursor: currentStepIndex <= 0 ? 'not-allowed' : 'pointer',
            opacity: currentStepIndex <= 0 ? 0.4 : 1
          }}
        >
          <SkipBack size={16} />
        </button>

        <button
          onClick={() => onStepChange(Math.max(0, currentStepIndex - 1))}
          disabled={currentStepIndex <= 0}
          title="Bước trước"
          style={{
            padding: '8px',
            borderRadius: '6px',
            border: '1px solid #cbd5e1',
            backgroundColor: '#f8fafc',
            cursor: currentStepIndex <= 0 ? 'not-allowed' : 'pointer',
            opacity: currentStepIndex <= 0 ? 0.4 : 1
          }}
        >
          <ChevronLeft size={16} />
        </button>

        <button
          onClick={onPlayPause}
          title={isPlaying ? 'Tạm dừng' : 'Tự động chạy qua các bước'}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: isPlaying ? '#e11d48' : '#10b981',
            color: '#ffffff',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          <span>{isPlaying ? 'Tạm dừng' : 'Tự động chạy'}</span>
        </button>

        <button
          onClick={() => onStepChange(Math.min(totalSteps - 1, currentStepIndex + 1))}
          disabled={currentStepIndex >= totalSteps - 1}
          title="Bước tiếp theo"
          style={{
            padding: '8px',
            borderRadius: '6px',
            border: '1px solid #cbd5e1',
            backgroundColor: '#f8fafc',
            cursor: currentStepIndex >= totalSteps - 1 ? 'not-allowed' : 'pointer',
            opacity: currentStepIndex >= totalSteps - 1 ? 0.4 : 1
          }}
        >
          <ChevronRight size={16} />
        </button>

        <button
          onClick={() => onStepChange(totalSteps - 1)}
          disabled={currentStepIndex >= totalSteps - 1}
          title="Tới bước cuối cùng"
          style={{
            padding: '8px',
            borderRadius: '6px',
            border: '1px solid #cbd5e1',
            backgroundColor: '#f8fafc',
            cursor: currentStepIndex >= totalSteps - 1 ? 'not-allowed' : 'pointer',
            opacity: currentStepIndex >= totalSteps - 1 ? 0.4 : 1
          }}
        >
          <SkipForward size={16} />
        </button>
      </div>

      {/* Slider Progress */}
      <div style={{ flex: '1 1 250px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569', minWidth: '80px' }}>
          Bước {currentStepIndex + 1} / {totalSteps}
        </span>
        <input
          type="range"
          min={0}
          max={totalSteps - 1}
          value={currentStepIndex}
          onChange={(e) => onStepChange(Number(e.target.value))}
          style={{
            width: '100%',
            cursor: 'pointer',
            accentColor: '#2563eb'
          }}
        />
      </div>

      {/* Speed Selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#64748b' }}>
        <Clock size={15} />
        <span>Tốc độ:</span>
        <select
          value={playSpeed}
          onChange={(e) => setPlaySpeed(Number(e.target.value))}
          style={{
            padding: '4px 8px',
            borderRadius: '6px',
            border: '1px solid #cbd5e1',
            fontSize: '13px',
            backgroundColor: '#f8fafc',
            cursor: 'pointer'
          }}
        >
          <option value={1500}>Chậm (1.5s)</option>
          <option value={900}>Bình thường (0.9s)</option>
          <option value={400}>Nhanh (0.4s)</option>
        </select>
      </div>
    </div>
  );
};
