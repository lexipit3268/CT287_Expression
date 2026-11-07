export interface FlowNodeData {
  label: string;
  nodeType: 'Expression' | 'Term' | 'Factor' | 'Number' | 'Operator' | 'Parenthesis' | string;
  value?: number | null;
  status: 'idle' | 'active' | 'completed' | 'error';
  isCurrent?: boolean;
}

export interface TraceStep {
  stepIndex: number;
  currentPos: number;
  currentChar?: string | null;
  callStack: string[];
  actionType: string;
  activeNodeId: string;
  description: string;
  visibleNodeIds: string[];
  visibleEdgeIds: string[];
  nodeStatuses: Record<string, 'idle' | 'active' | 'completed' | 'error'>;
  nodeValues: Record<string, number | null>;
}

export interface FlowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: FlowNodeData;
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  animated?: boolean;
}

export interface ParseResponse {
  success: boolean;
  result?: number | null;
  errorMessage?: string;
  cleanExpression: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
  steps: TraceStep[];
  totalSteps: number;
}

export interface ExampleExpression {
  title: string;
  expression: string;
  algorithm: 'v1' | 'v2';
  description: string;
}
