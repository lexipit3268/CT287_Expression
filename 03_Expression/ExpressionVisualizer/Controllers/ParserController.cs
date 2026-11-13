using ExpressionVisualizer.Models;
using ExpressionVisualizer.Services;
using Microsoft.AspNetCore.Mvc;

namespace ExpressionVisualizer.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ParserController : ControllerBase
{
    private readonly IParserService _parserService;

    public ParserController(IParserService parserService)
    {
        _parserService = parserService;
    }

    [HttpPost("parse")]
    public ActionResult<ParseResponse> ParseExpression([FromBody] ParseRequest request)
    {
        var response = _parserService.Parse(request);
        return Ok(response);
    }

    [HttpGet("examples")]
    public ActionResult<List<ExampleExpression>> GetExamples()
    {
        var examples = _parserService.GetExamples();
        return Ok(examples);
    }
}
