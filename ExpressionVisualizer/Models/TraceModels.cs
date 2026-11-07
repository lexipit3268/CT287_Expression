namespace ExpressionVisualizer.Models;

public class TraceStep
{
    public int StepIndex { get; set; }
    public int CurrentPos { get; set; }
    public string? CurrentChar { get; set; }
    public List<string> CallStack { get; set; } = new();
    public string ActionType { get; set; } = string.Empty; // CALL, READ, CREATE, COMPUTE, RETURN, ERROR
    public string ActiveNodeId { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public List<string> VisibleNodeIds { get; set; } = new();
    public List<string> VisibleEdgeIds { get; set; } = new();
    public Dictionary<string, string> NodeStatuses { get; set; } = new(); // id -> "idle" | "active" | "completed" | "error"
    public Dictionary<string, double?> NodeValues { get; set; } = new();
}

public class ParseRequest
{
    public string Expression { get; set; } = string.Empty;
    public string Algorithm { get; set; } = "v1"; // "v1" (PDF Original) or "v2" (+, -, *, / Left-associative)
}

public class ParseResponse
{
    public bool Success { get; set; }
    public double? Result { get; set; }
    public string? ErrorMessage { get; set; }
    public string CleanExpression { get; set; } = string.Empty;
    public List<FlowNode> Nodes { get; set; } = new();
    public List<FlowEdge> Edges { get; set; } = new();
    public List<TraceStep> Steps { get; set; } = new();
    public int TotalSteps => Steps.Count;
}

public class ExampleExpression
{
    public string Title { get; set; } = string.Empty;
    public string Expression { get; set; } = string.Empty;
    public string Algorithm { get; set; } = "v1";
    public string Description { get; set; } = string.Empty;
}
