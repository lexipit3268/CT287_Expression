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
        <div style={{ flex: '1', height: '100%', backgroundColor: '#f1f5f9' }}>
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
        </div>

        {/* Right Inspector Panel */}
        <InspectorPanel
          expression={parseResponse?.cleanExpression || expression}
          step={currentStep}
        />
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
