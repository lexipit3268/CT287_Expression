using ExpressionVisualizer.Models;

namespace ExpressionVisualizer.Services;

public interface ITraceRecorder
{
    void Initialize(string expression);
    string CreateNode(NodeType type, string label, int pos, double? initialValue = null);
    void AddEdge(string sourceId, string targetId, string? label = null);
    void PushCallStack(string functionName);
    void PopCallStack();
    void SetNodeValue(string nodeId, double value);
    void SetNodeStatus(string nodeId, string status);
    void RecordStep(string actionType, string activeNodeId, int currentPos, string description);
    void RecordError(string activeNodeId, int currentPos, string errorMessage);
    (List<FlowNode> Nodes, List<FlowEdge> Edges, List<TraceStep> Steps) FinalizeGraph(ASTNode root);
}

public class TraceRecorder : ITraceRecorder
{
    private string _expression = string.Empty;
    private int _nodeCounter = 0;
    private readonly List<FlowNode> _flowNodes = new();
    private readonly List<FlowEdge> _flowEdges = new();
    private readonly List<TraceStep> _steps = new();
    private readonly Stack<string> _callStack = new();
    private readonly Dictionary<string, string> _nodeStatuses = new();
    private readonly Dictionary<string, double?> _nodeValues = new();
    private readonly HashSet<string> _visibleNodes = new();
    private readonly HashSet<string> _visibleEdges = new();

    public void Initialize(string expression)
    {
        _expression = expression;
        _nodeCounter = 0;
        _flowNodes.Clear();
        _flowEdges.Clear();
        _steps.Clear();
        _callStack.Clear();
        _nodeStatuses.Clear();
        _nodeValues.Clear();
        _visibleNodes.Clear();
        _visibleEdges.Clear();

        RecordStep("START", string.Empty, 0, $"Bắt đầu phân giải biểu thức: \"{expression}\"");
    }

    public string CreateNode(NodeType type, string label, int pos, double? initialValue = null)
    {
        _nodeCounter++;
        var id = $"node_{_nodeCounter}";
        var flowNode = new FlowNode
        {
            Id = id,
            Type = "customNode",
            Position = new FlowPosition { X = 0, Y = 0 },
            Data = new FlowNodeData
            {
                Label = label,
                NodeType = type.ToString(),
                Value = initialValue,
                Status = "active"
            }
        };

        _flowNodes.Add(flowNode);
        _nodeStatuses[id] = "active";
        _nodeValues[id] = initialValue;
        _visibleNodes.Add(id);

        return id;
    }

    public void AddEdge(string sourceId, string targetId, string? label = null)
    {
        var edgeId = $"edge_{sourceId}_{targetId}";
        var flowEdge = new FlowEdge
        {
            Id = edgeId,
            Source = sourceId,
            Target = targetId,
            Label = label,
            Animated = true
        };

        _flowEdges.Add(flowEdge);
        _visibleEdges.Add(edgeId);
    }

    public void PushCallStack(string functionName)
    {
        _callStack.Push(functionName);
    }

    public void PopCallStack()
    {
        if (_callStack.Count > 0)
        {
            _callStack.Pop();
        }
    }

    public void SetNodeValue(string nodeId, double value)
    {
        _nodeValues[nodeId] = value;
        _nodeStatuses[nodeId] = "completed";
        var node = _flowNodes.FirstOrDefault(n => n.Id == nodeId);
        if (node != null)
        {
            node.Data.Value = value;
            node.Data.Status = "completed";
        }
    }

    public void SetNodeStatus(string nodeId, string status)
    {
        _nodeStatuses[nodeId] = status;
        var node = _flowNodes.FirstOrDefault(n => n.Id == nodeId);
        if (node != null)
        {
            node.Data.Status = status;
        }
    }

    public void RecordStep(string actionType, string activeNodeId, int currentPos, string description)
    {
        string? currentChar = null;
        if (currentPos >= 0 && currentPos < _expression.Length)
        {
            currentChar = _expression[currentPos].ToString();
        }

        // Clone current status dictionaries
        var step = new TraceStep
        {
            StepIndex = _steps.Count + 1,
            CurrentPos = currentPos,
            CurrentChar = currentChar,
            CallStack = _callStack.Reverse().ToList(),
            ActionType = actionType,
            ActiveNodeId = activeNodeId,
            Description = description,
            VisibleNodeIds = new List<string>(_visibleNodes),
            VisibleEdgeIds = new List<string>(_visibleEdges),
            NodeStatuses = new Dictionary<string, string>(_nodeStatuses),
            NodeValues = new Dictionary<string, double?>(_nodeValues)
        };

        _steps.Add(step);
    }

    public void RecordError(string activeNodeId, int currentPos, string errorMessage)
    {
        if (!string.IsNullOrEmpty(activeNodeId))
        {
            _nodeStatuses[activeNodeId] = "error";
        }
        RecordStep("ERROR", activeNodeId, currentPos, $"LỖI: {errorMessage}");
    }

    public (List<FlowNode> Nodes, List<FlowEdge> Edges, List<TraceStep> Steps) FinalizeGraph(ASTNode root)
    {
        // Compute tree layout coordinates (X, Y)
        ComputeTreeLayout(root, 0, 0, 100);

        // Update flow nodes positions from ASTNode layout
        UpdateFlowPositions(root);

        return (_flowNodes, _flowEdges, _steps);
    }

    private void UpdateFlowPositions(ASTNode node)
    {
        var flowNode = _flowNodes.FirstOrDefault(n => n.Id == node.Id);
        if (flowNode != null)
        {
            flowNode.Position.X = node.X;
            flowNode.Position.Y = node.Y;
        }

        foreach (var child in node.Children)
        {
            UpdateFlowPositions(child);
        }
    }

    // Helper for tree layout: calculates width of subtrees and assigns coordinates
    private double ComputeTreeLayout(ASTNode node, double startX, double level, double levelHeight = 100)
    {
        node.Y = level * levelHeight + 50;

        if (node.Children.Count == 0)
        {
            node.X = startX + 40;
            return startX + 80; // Leaf node width
        }

        double currentX = startX;
        var childMidPoints = new List<double>();

        foreach (var child in node.Children)
        {
            double nextX = ComputeTreeLayout(child, currentX, level + 1, levelHeight);
            childMidPoints.Add(child.X);
            currentX = nextX;
        }

        // Center parent above children
        node.X = (childMidPoints.First() + childMidPoints.Last()) / 2.0;

        return currentX;
    }
}
