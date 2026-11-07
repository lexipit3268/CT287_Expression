using ExpressionVisualizer.Models;

namespace ExpressionVisualizer.Services;

public class GrammarV1ParserService
{
    private readonly ITraceRecorder _recorder;
    private string _input = string.Empty;
    private int _currentPos = 0;

    public GrammarV1ParserService(ITraceRecorder recorder)
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

            _recorder.RecordStep("COMPLETE", rootAst.Id, _currentPos, $"Phân giải hoàn tất thành công! Kết quả biểu thức = {finalResult}");

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

    // E -> T + E | T
    private (ASTNode Node, double Value) CheckExpression()
    {
        _recorder.PushCallStack("checkExpression()");
        string eId = _recorder.CreateNode(NodeType.Expression, "E", _currentPos);
        var eNode = new ASTNode { Id = eId, Label = "E", Type = NodeType.Expression, Position = _currentPos };
        
        _recorder.RecordStep("CALL", eId, _currentPos, "Vào hàm checkExpression(): Khởi tạo nút E, gọi checkTerm()");

        var (tNode, termValue) = CheckTerm();
        eNode.Children.Add(tNode);
        _recorder.AddEdge(eId, tNode.Id);

        double result = termValue;
        SkipWhitespace();

        while (_currentPos < _input.Length && _input[_currentPos] == '+')
        {
            int opPos = _currentPos;
            string opId = _recorder.CreateNode(NodeType.Operator, "+", opPos, null);
            var opNode = new ASTNode { Id = opId, Label = "+", Type = NodeType.Operator, Position = opPos, Operator = "+" };
            eNode.Children.Add(opNode);
            _recorder.AddEdge(eId, opId);
            _recorder.RecordStep("TOKEN", opId, opPos, "Gặp toán tử '+', ghi nhận nút '+' vào cây");

            _currentPos++; // Bỏ qua '+'
            SkipWhitespace();

            _recorder.RecordStep("CALL", eId, _currentPos, "Đệ quy gọi checkExpression() để phân tích số hạng tiếp theo");
            var (nextENode, nextEValue) = CheckExpression();
            eNode.Children.Add(nextENode);
            _recorder.AddEdge(eId, nextENode.Id);

            result += nextEValue;
            _recorder.RecordStep("COMPUTE", eId, opPos, $"Thực hiện phép cộng E: {termValue} + {nextEValue} = {result}");
            SkipWhitespace();
        }

        eNode.Value = result;
        _recorder.SetNodeValue(eId, result);
        _recorder.RecordStep("RETURN", eId, _currentPos, $"Hoàn thành checkExpression(), nút E nhận giá trị = {result}");
        _recorder.PopCallStack();

        return (eNode, result);
    }

    // T -> F * T | F
    private (ASTNode Node, double Value) CheckTerm()
    {
        _recorder.PushCallStack("checkTerm()");
        string tId = _recorder.CreateNode(NodeType.Term, "T", _currentPos);
        var tNode = new ASTNode { Id = tId, Label = "T", Type = NodeType.Term, Position = _currentPos };

        _recorder.RecordStep("CALL", tId, _currentPos, "Vào hàm checkTerm(): Khởi tạo nút T, gọi checkFactor()");

        var (fNode, factorValue) = CheckFactor();
        tNode.Children.Add(fNode);
        _recorder.AddEdge(tId, fNode.Id);

        double result = factorValue;
        SkipWhitespace();

        while (_currentPos < _input.Length && _input[_currentPos] == '*')
        {
            int opPos = _currentPos;
            string opId = _recorder.CreateNode(NodeType.Operator, "*", opPos, null);
            var opNode = new ASTNode { Id = opId, Label = "*", Type = NodeType.Operator, Position = opPos, Operator = "*" };
            tNode.Children.Add(opNode);
            _recorder.AddEdge(tId, opId);
            _recorder.RecordStep("TOKEN", opId, opPos, "Gặp toán tử '*', ghi nhận nút '*' vào cây");

            _currentPos++; // Bỏ qua '*'
            SkipWhitespace();

            _recorder.RecordStep("CALL", tId, _currentPos, "Đệ quy gọi checkTerm() để phân tích thừa số tiếp theo");
            var (nextTNode, nextTValue) = CheckTerm();
            tNode.Children.Add(nextTNode);
            _recorder.AddEdge(tId, nextTNode.Id);

            result *= nextTValue;
            _recorder.RecordStep("COMPUTE", tId, opPos, $"Thực hiện phép nhân T: {factorValue} * {nextTValue} = {result}");
            SkipWhitespace();
        }

        tNode.Value = result;
        _recorder.SetNodeValue(tId, result);
        _recorder.RecordStep("RETURN", tId, _currentPos, $"Hoàn thành checkTerm(), nút T nhận giá trị = {result}");
        _recorder.PopCallStack();

        return (tNode, result);
    }

    // F -> (E) | id
    private (ASTNode Node, double Value) CheckFactor()
    {
        _recorder.PushCallStack("checkFactor()");
        string fId = _recorder.CreateNode(NodeType.Factor, "F", _currentPos);
        var fNode = new ASTNode { Id = fId, Label = "F", Type = NodeType.Factor, Position = _currentPos };

        _recorder.RecordStep("CALL", fId, _currentPos, "Vào hàm checkFactor(): Kiểm tra ký tự tại vị trí hiện tại");
        SkipWhitespace();

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
            // Đọc số nguyên (id)
            int start = _currentPos;
            while (_currentPos < _input.Length && (char.IsDigit(_input[_currentPos]) || _input[_currentPos] == '.'))
            {
                _currentPos++;
            }

            if (start == _currentPos)
            {
                char ch = _currentPos < _input.Length ? _input[_currentPos] : ' ';
                throw new Exception($"Lỗi cú pháp tại vị trí {_currentPos}: Mong đợi một chữ số nhưng gặp '{ch}'");
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

            // Highlight con trỏ tại vị trí số vừa đọc
            _recorder.RecordStep("READ", numId, start, $"Đọc được số {numStr}, gán cho nút F = {numValue}");

            fNode.Value = numValue;
            _recorder.SetNodeValue(fId, numValue);
            _recorder.RecordStep("RETURN", fId, start, $"Hoàn thành checkFactor(), nút F nhận giá trị = {numValue}");
            _recorder.PopCallStack();

            return (fNode, numValue);
        }
    }
}
