using ExpressionVisualizer.Models;

namespace ExpressionVisualizer.Services;

public interface IParserService
{
    ParseResponse Parse(ParseRequest request);
    List<ExampleExpression> GetExamples();
}

public class ParserService : IParserService
{
    public ParseResponse Parse(ParseRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Expression))
        {
            return new ParseResponse
            {
                Success = false,
                ErrorMessage = "Biểu thức không được để trống!"
            };
        }

        var recorder = new TraceRecorder();
        bool isAuto = string.IsNullOrWhiteSpace(request.Algorithm) ||
                      request.Algorithm.Equals("auto", StringComparison.OrdinalIgnoreCase);

        string targetAlgorithm;
        string? detectionMessage = null;

        if (isAuto)
        {
            (targetAlgorithm, detectionMessage) = DetectAlgorithm(request.Expression);
        }
        else
        {
            targetAlgorithm = request.Algorithm.Equals("v2", StringComparison.OrdinalIgnoreCase) ? "v2" : "v1";
        }

        ParseResponse response;
        if (targetAlgorithm == "v2")
        {
            var parserV2 = new GrammarV2ParserService(recorder);
            response = parserV2.Parse(request.Expression);
        }
        else
        {
            var parserV1 = new GrammarV1ParserService(recorder);
            response = parserV1.Parse(request.Expression);
        }

        response.SelectedAlgorithm = targetAlgorithm;
        response.AutoDetected = isAuto;
        response.DetectionMessage = detectionMessage;
        return response;
    }

    private static (string Algorithm, string Message) DetectAlgorithm(string expression)
    {
        bool hasMinus = expression.Contains('-');
        bool hasDivide = expression.Contains('/');

        if (hasMinus || hasDivide)
        {
            string foundOps = (hasMinus && hasDivide)
                ? "'-' và '/'"
                : (hasMinus ? "'-'" : "'/'");
            return ("v2", $"Phát hiện toán tử {foundOps} trong biểu thức → Hệ thống tự động chọn Giải thuật II (+, -, *, / kết hợp trái) để chạy.");
        }

        return ("v1", "Biểu thức chỉ dùng phép '+' / '*' (hoặc ngoặc) → Hệ thống tự động chọn Giải thuật I (Văn phạm gốc Session 5) để chạy.");
    }

    public List<ExampleExpression> GetExamples()
    {
        return new List<ExampleExpression>
        {
            new()
            {
                Title = "Bài tập mẫu Slide (2 * 3 + 6)",
                Expression = "2 * 3 + 6",
                Algorithm = "v1",
                Description = "Ví dụ cơ bản trong Session 5, minh họa thứ tự nhân trước cộng sau"
            },
            new()
            {
                Title = "Có dấu ngoặc ((2 + 3) * 4)",
                Expression = "(2 + 3) * 4",
                Algorithm = "v1",
                Description = "Độ ưu tiên trong ngoặc được nâng lên cao nhất"
            },
            new()
            {
                Title = "Phép tính nhiều bước (3 * 4 + 2 * 5)",
                Expression = "3 * 4 + 2 * 5",
                Algorithm = "v1",
                Description = "Hai phép nhân độc lập được cộng lại với nhau"
            },
            new()
            {
                Title = "Bài 2: Đầy đủ 4 phép tính (10 - 4 - 2)",
                Expression = "10 - 4 - 2",
                Algorithm = "v2",
                Description = "Kiểm tra tính kết hợp trái: (10 - 4) - 2 = 4 (nếu tính sai kết hợp phải sẽ ra 8)"
            },
            new()
            {
                Title = "Bài 2: Hỗn hợp ngoặc & chia ((20 + 4) / 3 - 2 * 3)",
                Expression = "(20 + 4) / 3 - 2 * 3",
                Algorithm = "v2",
                Description = "Biểu thức hỗn hợp cả 4 phép toán và dấu ngoặc: 24/3 - 6 = 8 - 6 = 2"
            }
        };
    }
}
