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
        borderTop: '1px solid #e2e8f0',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        flexWrap: 'wrap',
        boxShadow: '0 -2px 10px rgba(0,0,0,0.03)'
      }}
    >
      {/* Play Controls with Explicit Accessible Labels */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          type="button"
          onClick={() => onStepChange(0)}
          disabled={currentStepIndex <= 0}
          title="Về bước đầu tiên: Khởi tạo phân giải"
          aria-label="Về bước đầu tiên: Khởi tạo phân giải"
          style={{
            minWidth: '40px',
            minHeight: '40px',
            padding: '8px',
            borderRadius: '6px',
            border: '1px solid #cbd5e1',
            backgroundColor: '#f8fafc',
            cursor: currentStepIndex <= 0 ? 'not-allowed' : 'pointer',
            opacity: currentStepIndex <= 0 ? 0.4 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <SkipBack size={18} />
        </button>

        <button
          type="button"
          onClick={() => onStepChange(Math.max(0, currentStepIndex - 1))}
          disabled={currentStepIndex <= 0}
          title="Lùi lại một bước"
          aria-label="Lùi lại một bước"
          style={{
            minWidth: '40px',
            minHeight: '40px',
            padding: '8px',
            borderRadius: '6px',
            border: '1px solid #cbd5e1',
            backgroundColor: '#f8fafc',
            cursor: currentStepIndex <= 0 ? 'not-allowed' : 'pointer',
            opacity: currentStepIndex <= 0 ? 0.4 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <ChevronLeft size={18} />
        </button>

        <button
          type="button"
          onClick={onPlayPause}
          title={isPlaying ? 'Tạm dừng chạy tự động' : 'Tự động chạy diễn hoạt qua từng bước'}
          aria-label={isPlaying ? 'Tạm dừng chạy tự động' : 'Bắt đầu tự động chạy diễn hoạt từng bước'}
          style={{
            minHeight: '40px',
            padding: '8px 18px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: isPlaying ? '#be123c' : '#059669',
            color: '#ffffff',
            fontWeight: 600,
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          <span>{isPlaying ? 'Tạm dừng' : 'Chạy tự động'}</span>
        </button>

        <button
          type="button"
          onClick={() => onStepChange(Math.min(totalSteps - 1, currentStepIndex + 1))}
          disabled={currentStepIndex >= totalSteps - 1}
          title="Tiến tới bước kế tiếp"
          aria-label="Tiến tới bước kế tiếp"
          style={{
            minWidth: '40px',
            minHeight: '40px',
            padding: '8px',
            borderRadius: '6px',
            border: '1px solid #cbd5e1',
            backgroundColor: '#f8fafc',
            cursor: currentStepIndex >= totalSteps - 1 ? 'not-allowed' : 'pointer',
            opacity: currentStepIndex >= totalSteps - 1 ? 0.4 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <ChevronRight size={18} />
        </button>

        <button
          type="button"
          onClick={() => onStepChange(totalSteps - 1)}
          disabled={currentStepIndex >= totalSteps - 1}
          title="Tới bước hoàn tất cuối cùng"
          aria-label="Tới bước hoàn tất cuối cùng"
          style={{
            minWidth: '40px',
            minHeight: '40px',
            padding: '8px',
            borderRadius: '6px',
            border: '1px solid #cbd5e1',
            backgroundColor: '#f8fafc',
            cursor: currentStepIndex >= totalSteps - 1 ? 'not-allowed' : 'pointer',
            opacity: currentStepIndex >= totalSteps - 1 ? 0.4 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <SkipForward size={18} />
        </button>
      </div>

      {/* Progress Slider with Context Description */}
      <div style={{ flex: '1 1 250px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span
          role="status"
          aria-live="polite"
          style={{ fontSize: '13px', fontWeight: 700, color: '#334155', minWidth: '95px' }}
        >
          Bước {currentStepIndex + 1} / {totalSteps}
        </span>
        <label htmlFor="step-progress-slider" style={{
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
          Thanh trượt chuyển bước thực thi
        </label>
        <input
          id="step-progress-slider"
          type="range"
          min={0}
          max={totalSteps - 1}
          value={currentStepIndex}
          onChange={(e) => onStepChange(Number(e.target.value))}
          aria-label={`Thanh trượt chuyển bước thực thi, hiện tại bước ${currentStepIndex + 1} trên tổng số ${totalSteps} bước`}
          style={{
            width: '100%',
            cursor: 'pointer',
            accentColor: '#2563eb'
          }}
        />
      </div>

      {/* Speed Selector with Explicit Time Label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475569' }}>
        <Clock size={16} color="#64748b" />
        <label htmlFor="speed-select" style={{ fontWeight: 600 }}>Tốc độ diễn giải:</label>
        <select
          id="speed-select"
          value={playSpeed}
          onChange={(e) => setPlaySpeed(Number(e.target.value))}
          aria-label="Chọn khoảng thời gian dừng giữa mỗi bước khi chạy tự động"
          style={{
            padding: '6px 10px',
            borderRadius: '6px',
            border: '1px solid #cbd5e1',
            fontSize: '13px',
            backgroundColor: '#f8fafc',
            cursor: 'pointer',
            fontWeight: 500,
            color: '#1e293b'
          }}
        >
          <option value={1500}>1.5 giây / bước (Xem kỹ)</option>
          <option value={900}>0.9 giây / bước (Tiêu chuẩn)</option>
          <option value={400}>0.4 giây / bước (Nhanh)</option>
        </select>
      </div>
    </nav>
  );
};
