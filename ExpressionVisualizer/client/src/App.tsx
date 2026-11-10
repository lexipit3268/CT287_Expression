import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { PanelRightClose, PanelRightOpen, Keyboard } from 'lucide-react';

import { Header } from './components/Header';
import { ControlBar, type DetectionAlert } from './components/ControlBar';
import { TracePlayer } from './components/TracePlayer';
import { InspectorPanel } from './components/InspectorPanel';
import { CustomNode } from './components/CustomNode';

import type { AlgorithmMode, ParseResponse, ExampleExpression, FlowNodeData } from './types';

const nodeTypes = {
  customNode: CustomNode
};

export const App: React.FC = () => {
  const [expression, setExpression] = useState<string>('2 * 3 + 6');
  const [algorithm, setAlgorithm] = useState<AlgorithmMode>('auto');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [detectionAlert, setDetectionAlert] = useState<DetectionAlert | null>(null);
  const [examples, setExamples] = useState<ExampleExpression[]>([]);
  const [parseResponse, setParseResponse] = useState<ParseResponse | null>(null);
  const didInitRef = useRef<boolean>(false);

  // Inspector panel collapse state
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(true);

  // Trace player state
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playSpeed, setPlaySpeed] = useState<number>(900);

  // React Flow states
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<FlowNodeData>>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

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

      if (data.autoDetected && data.detectionMessage) {
        setDetectionAlert({
          algorithm: data.selectedAlgorithm,
          message: data.detectionMessage,
          key: Date.now()
        });
      } else {
        setDetectionAlert(null);
      }

      setParseResponse(data);
      setCurrentStepIndex(0);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể kết nối đến máy chủ C# API';
      setError(msg);
      setDetectionAlert(null);
    } finally {
      setLoading(false);
    }
  }, [expression, algorithm]);

  // Fetch examples & do initial parse once on mount
  useEffect(() => {
    if (didInitRef.current) return;
    didInitRef.current = true;

    fetch('/api/parser/examples')
      .then((res) => res.json())
      .then((data: ExampleExpression[]) => setExamples(data))
      .catch((err) => console.error('Error fetching examples:', err));

    handleParse('2 * 3 + 6', 'auto');
  }, [handleParse]);

  // Global Keyboard shortcuts
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
    const updatedNodes: Node<FlowNodeData>[] = parseResponse.nodes
      .filter((n) => currentStep.visibleNodeIds.includes(n.id))
      .map((n) => {
        const status = currentStep.nodeStatuses[n.id] || 'idle';
        const value = currentStep.nodeValues[n.id];
        const isCurrent = n.id === currentStep.activeNodeId;

        return {
          id: n.id,
          type: n.type,
          position: n.position,
          data: {
            ...n.data,
            status,
            value,
            isCurrent
          }
        };
      });

    // Lexipit Black Hand-cut Graph Edges
    const updatedEdges: Edge[] = parseResponse.edges
      .filter((e) => currentStep.visibleEdgeIds.includes(e.id))
      .map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        style: {
          stroke: '#000000',
          strokeWidth: 2
        }
      }));

    setNodes(updatedNodes);
    setEdges(updatedEdges);
  }, [parseResponse, currentStepIndex, setNodes, setEdges]);

  // Auto-play effect
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
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

  const handleAlgorithmChange = (mode: AlgorithmMode) => {
    setAlgorithm(mode);
    if (mode !== 'auto') {
      setDetectionAlert(null);
    }
  };

  const handleSelectExample = (ex: ExampleExpression) => {
    setExpression(ex.expression);
    if (algorithm === 'auto') {
      handleParse(ex.expression, 'auto');
    } else {
      setAlgorithm(ex.algorithm);
      handleParse(ex.expression, ex.algorithm);
    }
  };

  const currentStep = parseResponse?.steps[currentStepIndex];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
      backgroundColor: '#dceeff' // Lexipit Sky Wash Pastel Paper
    }}>
      {/* 1. Header with Full-bleed Marquee */}
      <Header />

      {/* 2. Control Bar */}
      <ControlBar
        expression={expression}
        setExpression={setExpression}
        algorithm={algorithm}
        setAlgorithm={handleAlgorithmChange}
        onParse={() => handleParse()}
        loading={loading}
        examples={examples}
        onSelectExample={handleSelectExample}
        error={error}
        result={parseResponse?.result}
        detectionAlert={detectionAlert}
        onDismissAlert={() => setDetectionAlert(null)}
      />

      {/* 3. Main Workspace: Canvas + Inspector */}
      <div style={{ display: 'flex', flex: '1', overflow: 'hidden', position: 'relative' }}>
        {/* React Flow Canvas (Sky Wash Pastel Ground) */}
        <main style={{ flex: '1', height: '100%', backgroundColor: '#dceeff', position: 'relative' }}>
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
            {/* Lexipit Paper Grid */}
            <Background gap={20} size={1.5} color="#cccccc" />
            <Controls
              style={{
                borderRadius: '1600px',
                border: '1.5px solid #000000',
                overflow: 'hidden'
              }}
            />
            <MiniMap
              nodeColor={(node) => {
                const nodeData = node.data as unknown as FlowNodeData | undefined;
                if (nodeData?.status === 'active') return '#ffd731'; // Sunburst
                if (nodeData?.status === 'completed') return '#55db9c'; // Mint Pop
                return '#000000';
              }}
              style={{
                borderRadius: '20px',
                border: '2px solid #000000',
                backgroundColor: '#ffffff'
              }}
            />
          </ReactFlow>

          {/* Lexipit Floating Shortcuts Pill Sticker */}
          <div style={{
            position: 'absolute',
            bottom: '16px',
            left: '16px',
            backgroundColor: '#ffffff',
            border: '1.5px solid #000000',
            borderRadius: '1600px',
            padding: '6px 14px',
            fontSize: '11px',
            fontWeight: 700,
            color: '#000000',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            pointerEvents: 'none'
          }}>
            <Keyboard size={14} color="#000000" />
            <span>PHÍM TẮT: <strong>SPACE</strong> (CHẠY/DỪNG) • <strong>← / →</strong> (LÙI/TIẾN) • <strong>HOME/END</strong></span>
          </div>

          {/* Lexipit Outlined Toggle Button */}
          <button
            type="button"
            onClick={() => setIsInspectorOpen((prev) => !prev)}
            title={isInspectorOpen ? 'Thu gọn bảng chi tiết' : 'Mở rộng bảng chi tiết'}
            aria-label={isInspectorOpen ? 'Thu gọn bảng chi tiết' : 'Mở rộng bảng chi tiết'}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              backgroundColor: '#ffffff',
              border: '1.5px solid #000000',
              borderRadius: '1600px',
              padding: '8px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 800,
              letterSpacing: '0.030em',
              textTransform: 'uppercase',
              color: '#000000',
              zIndex: 10,
              transition: 'background-color 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#dceeff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
            }}
          >
            {isInspectorOpen ? <PanelRightClose size={15} /> : <PanelRightOpen size={15} />}
            <span>{isInspectorOpen ? 'ẨN BẢNG' : 'HIỆN BẢNG'}</span>
          </button>
        </main>

        {/* Right Inspector Panel */}
        {isInspectorOpen && (
          <InspectorPanel
            expression={parseResponse?.cleanExpression || expression}
            step={currentStep}
          />
        )}
      </div>

      {/* 4. Bottom Lexipit Trace Player */}
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
