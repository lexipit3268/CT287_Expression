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

        if (request.Algorithm.Equals("v2", StringComparison.OrdinalIgnoreCase))
        {
            var parserV2 = new GrammarV2ParserService(recorder);
            return parserV2.Parse(request.Expression);
        }
        else
        {
            var parserV1 = new GrammarV1ParserService(recorder);
            return parserV1.Parse(request.Expression);
        }
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
