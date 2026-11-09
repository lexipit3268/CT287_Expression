namespace ExpressionVisualizer.Core.Pure;

/// <summary>
/// BÀI TẬP 1: Cài đặt giải thuật I theo đúng văn phạm trong slide Session 5:
/// E -> T + E | T
/// T -> F * T | F
/// F -> (E) | id
/// (Đệ quy phải, chỉ hỗ trợ phép toán + và *)
/// </summary>
public class Algorithm1
{
    private string _input = string.Empty;
    private int _currentPos = 0;

    public double Evaluate(string expression)
    {
        _input = expression ?? string.Empty;
        _currentPos = 0;

        SkipWhitespace();
        double result = CheckExpression();
        SkipWhitespace();

        if (_currentPos < _input.Length)
        {
            throw new Exception($"Ký tự không hợp lệ tại vị trí {_currentPos}: '{_input[_currentPos]}'");
        }

        return result;
    }

    private void SkipWhitespace()
    {
        while (_currentPos < _input.Length && char.IsWhiteSpace(_input[_currentPos]))
        {
            _currentPos++;
        }
    }

    // E -> T + E | T
    private double CheckExpression()
    {
        double result = CheckTerm();
        SkipWhitespace();

        while (_currentPos < _input.Length && _input[_currentPos] == '+')
        {
            _currentPos++; // Bỏ qua '+'
            SkipWhitespace();
            double result1 = CheckExpression(); // Đệ quy phải theo slide
            result += result1;
            SkipWhitespace();
        }

        return result;
    }

    // T -> F * T | F
    private double CheckTerm()
    {
        double result = CheckFactor();
        SkipWhitespace();

        while (_currentPos < _input.Length && _input[_currentPos] == '*')
        {
            _currentPos++; // Bỏ qua '*'
            SkipWhitespace();
            double result1 = CheckTerm(); // Đệ quy phải theo slide
            result *= result1;
            SkipWhitespace();
        }

        return result;
    }

    // F -> (E) | id
    private double CheckFactor()
    {
        SkipWhitespace();

        if (_currentPos < _input.Length && _input[_currentPos] == '(')
        {
            _currentPos++; // Bỏ qua '('
            double result = CheckExpression();
            SkipWhitespace();

            if (_currentPos < _input.Length && _input[_currentPos] == ')')
            {
                _currentPos++; // Bỏ qua ')'
            }
            else
            {
                throw new Exception("Lỗi cú pháp: Thiếu dấu ngoặc đóng ')'");
            }

            return result;
        }
        else
        {
            return GetDigits();
        }
    }

    // Hàm đọc số nguyên/thực
    private double GetDigits()
    {
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
        return double.Parse(numStr, System.Globalization.CultureInfo.InvariantCulture);
    }
}
