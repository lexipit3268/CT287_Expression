namespace ExpressionVisualizer.Core.Pure;

public class Algorithm2
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

    private double CheckExpression()
    {
        double accumulated = CheckTerm();
        SkipWhitespace();

        while (_currentPos < _input.Length && (_input[_currentPos] == '+' || _input[_currentPos] == '-'))
        {
            char op = _input[_currentPos];
            _currentPos++;
            SkipWhitespace();

            double nextTerm = CheckTerm();

            if (op == '+')
            {
                accumulated += nextTerm;
            }
            else
            {
                accumulated -= nextTerm;
            }

            SkipWhitespace();
        }

        return accumulated;
    }

    private double CheckTerm()
    {
        double accumulated = CheckFactor();
        SkipWhitespace();

        while (_currentPos < _input.Length && (_input[_currentPos] == '*' || _input[_currentPos] == '/'))
        {
            char op = _input[_currentPos];
            _currentPos++;
            SkipWhitespace();

            double nextFactor = CheckFactor();

            if (op == '*')
            {
                accumulated *= nextFactor;
            }
            else
            {
                if (Math.Abs(nextFactor) < 1e-12)
                {
                    throw new DivideByZeroException("Lỗi chia cho 0 (Division by zero)");
                }

                accumulated /= nextFactor;
            }

            SkipWhitespace();
        }

        return accumulated;
    }

    // F -> -F | +F | (E) | id
    private double CheckFactor()
    {
        SkipWhitespace();

        if (_currentPos < _input.Length && (_input[_currentPos] == '-' || _input[_currentPos] == '+'))
        {
            char unaryOp = _input[_currentPos];
            _currentPos++;
            SkipWhitespace();

            double value = CheckFactor();
            double result = unaryOp == '-' ? -value : value;
            return result == 0 ? 0 : result;
        }

        if (_currentPos < _input.Length && _input[_currentPos] == '(')
        {
            _currentPos++;
            SkipWhitespace();

            double result = CheckExpression();
            SkipWhitespace();

            if (_currentPos < _input.Length && _input[_currentPos] == ')')
            {
                _currentPos++;
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
