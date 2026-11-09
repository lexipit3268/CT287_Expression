namespace ExpressionVisualizer.Core.Pure;

/// <summary>
/// BÀI TẬP 2: CẢI TIẾN GIẢI THUẬT I HỖ TRỢ 4 PHÉP TOÁN HAI NGÔI: +, -, *, /
/// 
/// ĐIỂM CỐT LÕI CỦA BÀI TOÁN (TÍNH KẾT HỢP TRÁI - LEFT-ASSOCIATIVITY):
/// - Phép trừ (-) và chia (/) không có tính kết hợp phải!
///   Ví dụ: 10 - 4 - 2 phải tính là (10 - 4) - 2 = 4.
///   Nếu dùng đệ quy phải như Thuật toán I, biểu thức sẽ thành 10 - (4 - 2) = 8 (SAI HOÀN TOÀN).
/// - Giải pháp: Dùng vòng lặp tuần tự (while loop) để khử đệ quy trái,
///   tích lũy kết quả lần lượt từ trái sang phải:
///   E -> T ((+ | -) T)*
///   T -> F ((* | /) F)*
///   F -> (E) | id
/// </summary>
public class Algorithm2
{
    private string _input = string.Empty;
    private int _currentPos = 0;

    /// <summary>
    /// Điểm khởi đầu phân tích biểu thức
    /// </summary>
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

    // =========================================================================
    // 1. CheckExpression: Xử lý phép toán có độ ưu tiên thấp nhất (+ và -)
    // Luật sinh: E -> T ((+ | -) T)*  ==> KẾT HỢP TỪ TRÁI SANG PHẢI
    // =========================================================================
    private double CheckExpression()
    {
        // 1. Tính giá trị số hạng đầu tiên T
        double accumulated = CheckTerm();
        SkipWhitespace();

        // 2. Lặp qua các số hạng tiếp theo từ trái sang phải
        while (_currentPos < _input.Length && (_input[_currentPos] == '+' || _input[_currentPos] == '-'))
        {
            char op = _input[_currentPos];
            _currentPos++; // Bỏ qua toán tử '+' hoặc '-'
            SkipWhitespace();

            double nextTerm = CheckTerm();

            if (op == '+')
            {
                accumulated += nextTerm;
            }
            else // op == '-'
            {
                // Lấy kết quả đã tích lũy trừ đi số hạng mới (đảm bảo kết hợp trái)
                accumulated -= nextTerm;
            }

            SkipWhitespace();
        }

        return accumulated;
    }

    // =========================================================================
    // 2. CheckTerm: Xử lý phép toán có độ ưu tiên cao hơn (* và /)
    // Luật sinh: T -> F ((* | /) F)*  ==> KẾT HỢP TỪ TRÁI SANG PHẢI
    // =========================================================================
    private double CheckTerm()
    {
        // 1. Tính giá trị thừa số đầu tiên F
        double accumulated = CheckFactor();
        SkipWhitespace();

        // 2. Lặp qua các thừa số tiếp theo từ trái sang phải
        while (_currentPos < _input.Length && (_input[_currentPos] == '*' || _input[_currentPos] == '/'))
        {
            char op = _input[_currentPos];
            _currentPos++; // Bỏ qua toán tử '*' hoặc '/'
            SkipWhitespace();

            double nextFactor = CheckFactor();

            if (op == '*')
            {
                accumulated *= nextFactor;
            }
            else // op == '/'
            {
                if (Math.Abs(nextFactor) < 1e-12)
                {
                    throw new DivideByZeroException("Lỗi chia cho 0 (Division by zero)");
                }
                // Lấy kết quả đã tích lũy chia cho thừa số mới (đảm bảo kết hợp trái)
                accumulated /= nextFactor;
            }

            SkipWhitespace();
        }

        return accumulated;
    }

    // =========================================================================
    // 3. CheckFactor: Xử lý độ ưu tiên cao nhất: Dấu ngoặc (E) hoặc Số nguyên (id)
    // Luật sinh: F -> (E) | id
    // =========================================================================
    private double CheckFactor()
    {
        SkipWhitespace();

        // Trường hợp 1: Biểu thức con nằm trong ngoặc tròn (E)
        if (_currentPos < _input.Length && _input[_currentPos] == '(')
        {
            _currentPos++; // Bỏ qua '('
            SkipWhitespace();

            // Đệ quy quay lại đỉnh E để tính biểu thức con bên trong ngoặc
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
        // Trường hợp 2: Số nguyên hoặc số thực (id)
        else
        {
            return GetDigits();
        }
    }

    // =========================================================================
    // Hàm bổ trợ đọc số nhiều chữ số
    // =========================================================================
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
