import React, { useState, useEffect, useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { PanelRightClose, PanelRightOpen, Keyboard } from 'lucide-react';

import { Header } from './components/Header';
import { ControlBar } from './components/ControlBar';
import { TracePlayer } from './components/TracePlayer';
import { InspectorPanel } from './components/InspectorPanel';
import { CustomNode } from './components/CustomNode';

import type { ParseResponse, ExampleExpression } from './types';

const nodeTypes = {
  customNode: CustomNode
};

export const App: React.FC = () => {
  const [expression, setExpression] = useState<string>('2 * 3 + 6');
  const [algorithm, setAlgorithm] = useState<'v1' | 'v2'>('v1');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [examples, setExamples] = useState<ExampleExpression[]>([]);
  const [parseResponse, setParseResponse] = useState<ParseResponse | null>(null);

  // Inspector panel collapse state
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(true);

  // Trace player state
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playSpeed, setPlaySpeed] = useState<number>(900);

  // React Flow states
  const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);

  // Fetch examples on mount
  useEffect(() => {
    fetch('/api/parser/examples')
      .then((res) => res.json())
      .then((data: ExampleExpression[]) => setExamples(data))
      .catch((err) => console.error('Error fetching examples:', err));
  }, []);

  // Parse handler
  const handleParse = useCallback(async (expr = expression, algo = algorithm) => {
    if (!expr.trim()) return;

    setLoading(true);
    setError(null);
    setIsPlaying(false);

    try {
      const response = await fetch('/api/parser/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expression: expr, algorithm: algo })
      });

      const data: ParseResponse = await response.json();

      if (!data.success && data.errorMessage) {
        setError(data.errorMessage);
      }

      setParseResponse(data);
      setCurrentStepIndex(0);
    } catch (err: any) {
      setError(err.message || 'Không thể kết nối đến máy chủ C# API');
    } finally {
      setLoading(false);
    }
  }, [expression, algorithm]);

  // Initial parse on first render
  useEffect(() => {
    handleParse();
  }, []);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'SELECT' || target.tagName === 'TEXTAREA') {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setIsPlaying(false);
        if (parseResponse) {
          setCurrentStepIndex((prev) => Math.min(parseResponse.totalSteps - 1, prev + 1));
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setIsPlaying(false);
        setCurrentStepIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'Home') {
        e.preventDefault();
        setIsPlaying(false);
        setCurrentStepIndex(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        setIsPlaying(false);
        if (parseResponse) {
          setCurrentStepIndex(parseResponse.totalSteps - 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [parseResponse]);

  // Update Graph when step changes
  useEffect(() => {
    if (!parseResponse || parseResponse.steps.length === 0) {
      setNodes([]);
      setEdges([]);
      return;
    }

    const currentStep = parseResponse.steps[currentStepIndex];
    if (!currentStep) return;

    // Filter visible nodes and update states
    const updatedNodes = parseResponse.nodes
      .filter((n) => currentStep.visibleNodeIds.includes(n.id))
      .map((n) => {
        const status = currentStep.nodeStatuses[n.id] || 'idle';
        const value = currentStep.nodeValues[n.id];
        const isCurrent = n.id === currentStep.activeNodeId;

        return {
          ...n,
          data: {
            ...n.data,
            status,
            value,
            isCurrent
          }
        };
      });

    // Filter visible edges
    const updatedEdges = parseResponse.edges
      .filter((e) => currentStep.visibleEdgeIds.includes(e.id))
      .map((e) => ({
        ...e,
        style: {
          stroke: '#94a3b8',
          strokeWidth: 2
        }
      }));

    setNodes(updatedNodes);
    setEdges(updatedEdges);
  }, [parseResponse, currentStepIndex, setNodes, setEdges]);

  // Auto-play effect
  useEffect(() => {
    let timer: any = null;
    if (isPlaying && parseResponse) {
      if (currentStepIndex >= parseResponse.steps.length - 1) {
        setIsPlaying(false);
      } else {
        timer = setTimeout(() => {
          setCurrentStepIndex((prev) => prev + 1);
        }, playSpeed);
      }
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isPlaying, currentStepIndex, parseResponse, playSpeed]);

  const handleSelectExample = (ex: ExampleExpression) => {
    setExpression(ex.expression);
    setAlgorithm(ex.algorithm);
    handleParse(ex.expression, ex.algorithm);
  };

  const currentStep = parseResponse?.steps[currentStepIndex];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* 1. Header */}
      <Header />

      {/* 2. Control Bar */}
      <ControlBar
        expression={expression}
        setExpression={setExpression}
        algorithm={algorithm}
        setAlgorithm={setAlgorithm}
        onParse={() => handleParse()}
        loading={loading}
        examples={examples}
        onSelectExample={handleSelectExample}
        error={error}
        result={parseResponse?.result}
      />

      {/* 3. Main Workspace: Canvas + Inspector */}
      <div style={{ display: 'flex', flex: '1', overflow: 'hidden', position: 'relative' }}>
        {/* React Flow Canvas */}
        <main style={{ flex: '1', height: '100%', backgroundColor: '#f1f5f9', position: 'relative' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            fitView
            minZoom={0.2}
            maxZoom={2}
          >
            <Background gap={16} size={1} color="#cbd5e1" />
            <Controls />
            <MiniMap
              nodeColor={(node: any) => {
                if (node.data?.status === 'active') return '#f59e0b';
                if (node.data?.status === 'completed') return '#10b981';
                return '#94a3b8';
              }}
              style={{ borderRadius: '8px', border: '1px solid #cbd5e1' }}
            />
          </ReactFlow>

          {/* Quick Shortcuts Pill */}
          <div style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.88)',
            backdropFilter: 'blur(6px)',
            border: '1px solid #cbd5e1',
            borderRadius: '20px',
            padding: '5px 12px',
            fontSize: '11px',
            fontWeight: 500,
            color: '#475569',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
            pointerEvents: 'none'
          }}>
            <Keyboard size={13} color="#2563eb" />
            <span>Phím tắt: <strong>Space</strong> (Chạy/Dừng), <strong>← / →</strong> (Lùi/Tiến), <strong>Home/End</strong></span>
          </div>

          {/* Inspector Panel Toggle Button */}
          <button
            type="button"
            onClick={() => setIsInspectorOpen((prev) => !prev)}
            title={isInspectorOpen ? 'Thu gọn bảng thanh tra' : 'Mở rộng bảng thanh tra'}
            aria-label={isInspectorOpen ? 'Thu gọn bảng thanh tra' : 'Mở rộng bảng thanh tra'}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              padding: '8px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 600,
              color: '#334155',
              boxShadow: '0 2px 5px rgba(0,0,0,0.06)',
              zIndex: 10
            }}
          >
            {isInspectorOpen ? <PanelRightClose size={15} /> : <PanelRightOpen size={15} />}
            <span>{isInspectorOpen ? 'Ẩn bảng chi tiết' : 'Hiện bảng chi tiết'}</span>
          </button>
        </main>

        {/* Right Inspector Panel (Collapsible) */}
        {isInspectorOpen && (
          <InspectorPanel
            expression={parseResponse?.cleanExpression || expression}
            step={currentStep}
          />
        )}
      </div>

      {/* 4. Bottom Trace Player */}
      <TracePlayer
        currentStepIndex={currentStepIndex}
        totalSteps={parseResponse?.totalSteps || 0}
        isPlaying={isPlaying}
        onPlayPause={() => setIsPlaying(!isPlaying)}
        onStepChange={(idx) => {
          setIsPlaying(false);
          setCurrentStepIndex(idx);
        }}
        playSpeed={playSpeed}
        setPlaySpeed={setPlaySpeed}
      />
    </div>
  );
};

export default App;
