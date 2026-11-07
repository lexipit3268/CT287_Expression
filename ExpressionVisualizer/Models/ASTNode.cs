namespace ExpressionVisualizer.Models;

public enum NodeType
{
    Expression, // E
    Term,       // T
    Factor,     // F
    Operator,   // +, -, *, /
    Number,     // id
    Parenthesis // (, )
}

public class ASTNode
{
    public string Id { get; set; } = string.Empty;
    public string Label { get; set; } = string.Empty;
    public NodeType Type { get; set; }
    public double? Value { get; set; }
    public string? Operator { get; set; }
    public int Position { get; set; }
    public List<ASTNode> Children { get; set; } = new();

    // UI Layout coordinates
    public double X { get; set; }
    public double Y { get; set; }
}

public class FlowNode
{
    public string Id { get; set; } = string.Empty;
    public string Type { get; set; } = "customNode";
    public FlowPosition Position { get; set; } = new();
    public FlowNodeData Data { get; set; } = new();
}

public class FlowPosition
{
    public double X { get; set; }
    public double Y { get; set; }
}

public class FlowNodeData
{
    public string Label { get; set; } = string.Empty;
    public string NodeType { get; set; } = string.Empty;
    public double? Value { get; set; }
    public string Status { get; set; } = "idle"; // idle, active, completed, error
}

public class FlowEdge
{
    public string Id { get; set; } = string.Empty;
    public string Source { get; set; } = string.Empty;
    public string Target { get; set; } = string.Empty;
    public string? Label { get; set; }
    public bool Animated { get; set; } = false;
}
