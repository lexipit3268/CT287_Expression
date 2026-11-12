using ExpressionVisualizer.Models;

namespace ExpressionVisualizer.Services;

public class GrammarV2ParserService
{
    private readonly ITraceRecorder _recorder;
    private string _input = string.Empty;
    private int _currentPos = 0;

    public GrammarV2ParserService(ITraceRecorder recorder)
    {
        _recorder = recorder;
    }

    public ParseResponse Parse(string expression)
    {
        _input = expression;
        _currentPos = 0;
        _recorder.Initialize(expression);

        try
        {
            SkipWhitespace();
            var (rootAst, finalResult) = CheckExpression();
            SkipWhitespace();

            if (_currentPos < _input.Length)
            {
                throw new Exception($"Ký tự không hợp lệ tại vị trí {_currentPos}: '{_input[_currentPos]}'");
            }

            _recorder.RecordStep("COMPLETE", rootAst.Id, _currentPos, $"Phân giải hoàn tất thành công (Giải thuật II)! Kết quả = {finalResult}");

            var (nodes, edges, steps) = _recorder.FinalizeGraph(rootAst);

            return new ParseResponse
            {
                Success = true,
                Result = finalResult,
                CleanExpression = expression,
                Nodes = nodes,
                Edges = edges,
                Steps = steps
            };
        }
        catch (Exception ex)
        {
            _recorder.RecordError(string.Empty, _currentPos, ex.Message);
            var (nodes, edges, steps) = _recorder.FinalizeGraph(new ASTNode { Id = "root", Label = "Error" });

            return new ParseResponse
            {
                Success = false,
                ErrorMessage = ex.Message,
                CleanExpression = expression,
                Nodes = nodes,
                Edges = edges,
                Steps = steps
            };
        }
    }

    private void SkipWhitespace()
    {
        while (_currentPos < _input.Length && char.IsWhiteSpace(_input[_currentPos]))
        {
            _currentPos++;
        }
    }

    // E -> T ((+ | -) T)* (Left-associative)
    private (ASTNode Node, double Value) CheckExpression()
    {
        _recorder.PushCallStack("checkExpression()");
        string eId = _recorder.CreateNode(NodeType.Expression, "E", _currentPos);
        var eNode = new ASTNode { Id = eId, Label = "E", Type = NodeType.Expression, Position = _currentPos };

        _recorder.RecordStep("CALL", eId, _currentPos, "Vào checkExpression(): Khởi tạo nút E, gọi checkTerm()");

        var (tNode, termValue) = CheckTerm();
        eNode.Children.Add(tNode);
        _recorder.AddEdge(eId, tNode.Id);

        double accumulatedValue = termValue;
        SkipWhitespace();

        while (_currentPos < _input.Length && (_input[_currentPos] == '+' || _input[_currentPos] == '-'))
        {
            char op = _input[_currentPos];
            int opPos = _currentPos;

            string opId = _recorder.CreateNode(NodeType.Operator, op.ToString(), opPos, null);
            var opNode = new ASTNode { Id = opId, Label = op.ToString(), Type = NodeType.Operator, Position = opPos, Operator = op.ToString() };
            eNode.Children.Add(opNode);
            _recorder.AddEdge(eId, opId);
            _recorder.RecordStep("TOKEN", opId, opPos, $"Gặp toán tử '{op}', ghi nhận nút '{op}' vào cây");

            _currentPos++; // Bỏ qua toán tử '+' hoặc '-'
            SkipWhitespace();

            _recorder.RecordStep("CALL", eId, _currentPos, $"Gọi tiếp checkTerm() để lấy số hạng tiếp theo cho phép '{op}' (kết hợp trái)");
            var (nextTNode, nextTValue) = CheckTerm();
            eNode.Children.Add(nextTNode);
            _recorder.AddEdge(eId, nextTNode.Id);

            double prevValue = accumulatedValue;
            if (op == '+')
            {
                accumulatedValue += nextTValue;
            }
            else
            {
                accumulatedValue -= nextTValue;
            }

            _recorder.RecordStep("COMPUTE", eId, opPos, $"Tính phép toán {op}: {prevValue} {op} {nextTValue} = {accumulatedValue}");
            SkipWhitespace();
        }

        eNode.Value = accumulatedValue;
        _recorder.SetNodeValue(eId, accumulatedValue);
        _recorder.RecordStep("RETURN", eId, _currentPos, $"Hoàn thành checkExpression(), nút E nhận giá trị = {accumulatedValue}");
        _recorder.PopCallStack();

        return (eNode, accumulatedValue);
    }

    // T -> F ((* | /) F)* (Left-associative)
    private (ASTNode Node, double Value) CheckTerm()
    {
        _recorder.PushCallStack("checkTerm()");
        string tId = _recorder.CreateNode(NodeType.Term, "T", _currentPos);
        var tNode = new ASTNode { Id = tId, Label = "T", Type = NodeType.Term, Position = _currentPos };

        _recorder.RecordStep("CALL", tId, _currentPos, "Vào checkTerm(): Khởi tạo nút T, gọi checkFactor()");

        var (fNode, factorValue) = CheckFactor();
        tNode.Children.Add(fNode);
        _recorder.AddEdge(tId, fNode.Id);

        double accumulatedValue = factorValue;
        SkipWhitespace();

        while (_currentPos < _input.Length && (_input[_currentPos] == '*' || _input[_currentPos] == '/'))
        {
            char op = _input[_currentPos];
            int opPos = _currentPos;

            string opId = _recorder.CreateNode(NodeType.Operator, op.ToString(), opPos, null);
            var opNode = new ASTNode { Id = opId, Label = op.ToString(), Type = NodeType.Operator, Position = opPos, Operator = op.ToString() };
            tNode.Children.Add(opNode);
            _recorder.AddEdge(tId, opId);
            _recorder.RecordStep("TOKEN", opId, opPos, $"Gặp toán tử '{op}', ghi nhận nút '{op}' vào cây");

            _currentPos++; // Bỏ qua toán tử '*' hoặc '/'
            SkipWhitespace();

            _recorder.RecordStep("CALL", tId, _currentPos, $"Gọi tiếp checkFactor() để lấy thừa số tiếp theo cho phép '{op}' (kết hợp trái)");
            var (nextFNode, nextFValue) = CheckFactor();
            tNode.Children.Add(nextFNode);
            _recorder.AddEdge(tId, nextFNode.Id);

            double prevValue = accumulatedValue;
            if (op == '*')
            {
                accumulatedValue *= nextFValue;
            }
            else
            {
                if (Math.Abs(nextFValue) < 1e-12)
                {
                    throw new Exception("Lỗi chia cho 0 (Division by zero)");
                }
                accumulatedValue /= nextFValue;
            }

            _recorder.RecordStep("COMPUTE", tId, opPos, $"Tính phép toán {op}: {prevValue} {op} {nextFValue} = {accumulatedValue}");
            SkipWhitespace();
        }

        tNode.Value = accumulatedValue;
        _recorder.SetNodeValue(tId, accumulatedValue);
        _recorder.RecordStep("RETURN", tId, _currentPos, $"Hoàn thành checkTerm(), nút T nhận giá trị = {accumulatedValue}");
        _recorder.PopCallStack();

        return (tNode, accumulatedValue);
    }

    // F -> -F | +F | (E) | id
    private (ASTNode Node, double Value) CheckFactor()
    {
        _recorder.PushCallStack("checkFactor()");
        string fId = _recorder.CreateNode(NodeType.Factor, "F", _currentPos);
        var fNode = new ASTNode { Id = fId, Label = "F", Type = NodeType.Factor, Position = _currentPos };

        _recorder.RecordStep("CALL", fId, _currentPos, "Vào checkFactor(): Kiểm tra ký tự tại vị trí hiện tại");
        SkipWhitespace();

        if (_currentPos < _input.Length && (_input[_currentPos] == '-' || _input[_currentPos] == '+'))
        {
            char unaryOp = _input[_currentPos];
            int opPos = _currentPos;
            string opId = _recorder.CreateNode(NodeType.Operator, unaryOp.ToString(), opPos, null);
            var opNode = new ASTNode
            {
                Id = opId,
                Label = unaryOp.ToString(),
                Type = NodeType.Operator,
                Position = opPos,
                Operator = unaryOp.ToString()
            };
            fNode.Children.Add(opNode);
            _recorder.AddEdge(fId, opId);
            _recorder.RecordStep("TOKEN", opId, opPos, $"Gặp toán tử một ngôi '{unaryOp}', ghi nhận nút '{unaryOp}' vào cây");

            _currentPos++; // Bỏ qua dấu một ngôi
            SkipWhitespace();

            _recorder.RecordStep("CALL", fId, _currentPos, $"Đệ quy gọi checkFactor() để phân tích toán hạng cho '{unaryOp}'");
            var (subFNode, subFValue) = CheckFactor();
            fNode.Children.Add(subFNode);
            _recorder.AddEdge(fId, subFNode.Id);

            double result = unaryOp == '-' ? -subFValue : subFValue;
            if (result == 0) result = 0;

            _recorder.RecordStep("COMPUTE", fId, opPos, $"Áp dụng dấu một ngôi '{unaryOp}': {unaryOp}({subFValue}) = {result}");

            fNode.Value = result;
            _recorder.SetNodeValue(fId, result);
            _recorder.RecordStep("RETURN", fId, opPos, $"Hoàn thành checkFactor(), nút F nhận giá trị = {result}");
            _recorder.PopCallStack();
            return (fNode, result);
        }

        if (_currentPos < _input.Length && _input[_currentPos] == '(')
        {
            int openParenPos = _currentPos;
            string openId = _recorder.CreateNode(NodeType.Parenthesis, "(", openParenPos);
            fNode.Children.Add(new ASTNode { Id = openId, Label = "(", Type = NodeType.Parenthesis, Position = openParenPos });
            _recorder.AddEdge(fId, openId);
            _recorder.RecordStep("TOKEN", openId, openParenPos, "Gặp dấu mở ngoặc '(', bắt đầu phân tích biểu thức con bên trong");

            _currentPos++; // Bỏ qua '('
            SkipWhitespace();

            var (subENode, subEValue) = CheckExpression();
            fNode.Children.Add(subENode);
            _recorder.AddEdge(fId, subENode.Id);

            SkipWhitespace();
            if (_currentPos < _input.Length && _input[_currentPos] == ')')
            {
                int closeParenPos = _currentPos;
                string closeId = _recorder.CreateNode(NodeType.Parenthesis, ")", closeParenPos);
                fNode.Children.Add(new ASTNode { Id = closeId, Label = ")", Type = NodeType.Parenthesis, Position = closeParenPos });
                _recorder.AddEdge(fId, closeId);
                _recorder.RecordStep("TOKEN", closeId, closeParenPos, "Gặp dấu đóng ngoặc ')' tương ứng");
                _currentPos++; // Bỏ qua ')'
            }
            else
            {
                throw new Exception($"Lỗi cú pháp tại vị trí {_currentPos}: Thiếu dấu ngoặc đóng ')'");
            }

            fNode.Value = subEValue;
            _recorder.SetNodeValue(fId, subEValue);
            _recorder.RecordStep("RETURN", fId, openParenPos, $"Hoàn thành checkFactor() từ biểu thức trong ngoặc, giá trị = {subEValue}");
            _recorder.PopCallStack();
            return (fNode, subEValue);
        }
        else
        {
            // Kiểm tra số nguyên hoặc số thực
            int start = _currentPos;
            while (_currentPos < _input.Length && (char.IsDigit(_input[_currentPos]) || _input[_currentPos] == '.'))
            {
                _currentPos++;
            }

            if (start == _currentPos)
            {
                char ch = _currentPos < _input.Length ? _input[_currentPos] : ' ';
                throw new Exception($"Lỗi cú pháp tại vị trí {_currentPos}: Mong đợi chữ số nhưng gặp '{ch}'");
            }

            string numStr = _input[start.._currentPos];
            if (!double.TryParse(numStr, System.Globalization.CultureInfo.InvariantCulture, out double numValue))
            {
                throw new Exception($"Số không hợp lệ: '{numStr}'");
            }

            string numId = _recorder.CreateNode(NodeType.Number, numStr, start, numValue);
            var numNode = new ASTNode { Id = numId, Label = numStr, Type = NodeType.Number, Value = numValue, Position = start };
            fNode.Children.Add(numNode);
            _recorder.AddEdge(fId, numId);
            _recorder.SetNodeValue(numId, numValue);

            // Highlight đúng vị trí số vừa đọc
            _recorder.RecordStep("READ", numId, start, $"Đọc được số {numStr}, gán cho nút F = {numValue}");

            fNode.Value = numValue;
            _recorder.SetNodeValue(fId, numValue);
            _recorder.RecordStep("RETURN", fId, start, $"Hoàn thành checkFactor(), nút F nhận giá trị = {numValue}");
            _recorder.PopCallStack();

            return (fNode, numValue);
        }
    }
}
