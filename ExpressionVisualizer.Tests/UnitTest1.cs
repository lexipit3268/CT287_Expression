using ExpressionVisualizer.Models;
using ExpressionVisualizer.Services;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace ExpressionVisualizer.Tests;

[TestClass]
public class ExpressionParserTests
{
    private readonly IParserService _parserService = new ParserService();

    [TestMethod]
    public void TestAlgorithm1_BasicSlideExample_Returns12()
    {
        // w = 2 * 3 + 6 (Ví dụ trong Session 5 slide)
        var response = _parserService.Parse(new ParseRequest
        {
            Expression = "2 * 3 + 6",
            Algorithm = "v1"
        });

        Assert.IsTrue(response.Success);
        Assert.AreEqual(12.0, response.Result);
        Assert.IsTrue(response.Steps.Count > 0);
        Assert.IsTrue(response.Nodes.Count > 0);
    }

    [TestMethod]
    public void TestAlgorithm1_WithParentheses_Returns20()
    {
        // (2 + 3) * 4 = 20
        var response = _parserService.Parse(new ParseRequest
        {
            Expression = "(2 + 3) * 4",
            Algorithm = "v1"
        });

        Assert.IsTrue(response.Success);
        Assert.AreEqual(20.0, response.Result);
    }

    [TestMethod]
    public void TestAlgorithm2_LeftAssociativitySubtraction_Returns4()
    {
        // 10 - 4 - 2 = (10 - 4) - 2 = 4 (Không phải 10 - (4 - 2) = 8)
        var response = _parserService.Parse(new ParseRequest
        {
            Expression = "10 - 4 - 2",
            Algorithm = "v2"
        });

        Assert.IsTrue(response.Success);
        Assert.AreEqual(4.0, response.Result);
    }

    [TestMethod]
    public void TestAlgorithm2_LeftAssociativityDivision_Returns2_5()
    {
        // 20 / 4 / 2 = (20 / 4) / 2 = 5 / 2 = 2.5 (Không phải 20 / (4 / 2) = 10)
        var response = _parserService.Parse(new ParseRequest
        {
            Expression = "20 / 4 / 2",
            Algorithm = "v2"
        });

        Assert.IsTrue(response.Success);
        Assert.AreEqual(2.5, response.Result);
    }

    [TestMethod]
    public void TestAlgorithm2_ComplexExpression_Returns2()
    {
        // (20 + 4) / 3 - 2 * 3 = 24 / 3 - 6 = 8 - 6 = 2
        var response = _parserService.Parse(new ParseRequest
        {
            Expression = "(20 + 4) / 3 - 2 * 3",
            Algorithm = "v2"
        });

        Assert.IsTrue(response.Success);
        Assert.AreEqual(2.0, response.Result);
    }

    [TestMethod]
    public void TestInvalidSyntax_MissingParenthesis_ReturnsError()
    {
        var response = _parserService.Parse(new ParseRequest
        {
            Expression = "(2 + 3 * 4",
            Algorithm = "v1"
        });

        Assert.IsFalse(response.Success);
        Assert.IsNotNull(response.ErrorMessage);
    }

    [TestMethod]
    public void TestAlgorithm2_DivisionByZero_ReturnsError()
    {
        var response = _parserService.Parse(new ParseRequest
        {
            Expression = "10 / (5 - 5)",
            Algorithm = "v2"
        });

        Assert.IsFalse(response.Success);
        Assert.IsTrue(response.ErrorMessage?.Contains("chia cho 0") ?? false);
    }
}
