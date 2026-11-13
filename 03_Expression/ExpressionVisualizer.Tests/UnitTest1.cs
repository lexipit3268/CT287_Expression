using ExpressionVisualizer.Core.Pure;
using ExpressionVisualizer.Models;
using ExpressionVisualizer.Services;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace ExpressionVisualizer.Tests;

[TestClass]
public class ExpressionParserTests
{
    private readonly IParserService _parserService = new ParserService();
    private readonly Algorithm1 _algo1 = new();
    private readonly Algorithm2 _algo2 = new();

    // =========================================================================
    // KIỂM THỬ THUẬT TOÁN I & II THUẦN TÚY (CORE LOGIC ĐỘC LẬP)
    // =========================================================================
    [TestMethod]
    public void TestPureAlgorithm1_Basic()
    {
        Assert.AreEqual(12.0, _algo1.Evaluate("2 * 3 + 6"));
        Assert.AreEqual(20.0, _algo1.Evaluate("(2 + 3) * 4"));
    }

    [TestMethod]
    public void TestPureAlgorithm2_LeftAssociativeSubtraction()
    {
        // 10 - 4 - 2 = (10 - 4) - 2 = 4 (nếu kết hợp phải sẽ sai thành 8)
        Assert.AreEqual(4.0, _algo2.Evaluate("10 - 4 - 2"));
    }

    [TestMethod]
    public void TestPureAlgorithm2_LeftAssociativeDivision()
    {
        // 20 / 4 / 2 = (20 / 4) / 2 = 2.5 (nếu kết hợp phải sẽ sai thành 10)
        Assert.AreEqual(2.5, _algo2.Evaluate("20 / 4 / 2"));
    }

    [TestMethod]
    public void TestPureAlgorithm2_MixedOperatorsAndParentheses()
    {
        // (20 + 4) / 3 - 2 * 3 = 24 / 3 - 6 = 8 - 6 = 2
        Assert.AreEqual(2.0, _algo2.Evaluate("(20 + 4) / 3 - 2 * 3"));
    }

    [TestMethod]
    public void TestPureAlgorithm2_UnaryNegativeNumbers()
    {
        Assert.AreEqual(-7.0, _algo2.Evaluate("-4-3"));
        Assert.AreEqual(-1.0, _algo2.Evaluate("(-4) + 3"));
        Assert.AreEqual(-10.0, _algo2.Evaluate("5 * -2"));
        Assert.AreEqual(-5.0, _algo2.Evaluate("-(2 + 3)"));
    }

    // =========================================================================
    // KIỂM THỬ GRAPH & TRACE VISUALIZER
    // =========================================================================
    [TestMethod]
    public void TestAlgorithm1_BasicSlideExample_Returns12()
    {
        var response = _parserService.Parse(new ParseRequest
        {
            Expression = "2 * 3 + 6",
            Algorithm = "v1"
        });

        Assert.IsTrue(response.Success);
        Assert.AreEqual(12.0, response.Result);
        Assert.IsNotEmpty(response.Steps);
        Assert.IsNotEmpty(response.Nodes);
    }

    [TestMethod]
    public void TestAlgorithm1_WithParentheses_Returns20()
    {
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

    // =========================================================================
    // KIỂM THỬ CƠ CHẾ TỰ ĐỘNG PHÁT HIỆN GIẢI THUẬT (AUTO MODE)
    // =========================================================================
    [TestMethod]
    public void TestAutoDetect_PlusAndMultiply_SelectsAlgorithm1()
    {
        var response = _parserService.Parse(new ParseRequest
        {
            Expression = "2 * 3 + 6",
            Algorithm = "auto"
        });

        Assert.IsTrue(response.Success);
        Assert.IsTrue(response.AutoDetected);
        Assert.AreEqual("v1", response.SelectedAlgorithm);
        Assert.IsFalse(string.IsNullOrWhiteSpace(response.DetectionMessage));
        Assert.AreEqual(12.0, response.Result);
    }

    [TestMethod]
    public void TestAutoDetect_Subtraction_SelectsAlgorithm2()
    {
        var response = _parserService.Parse(new ParseRequest
        {
            Expression = "10 - 4 - 2",
            Algorithm = "auto"
        });

        Assert.IsTrue(response.Success);
        Assert.IsTrue(response.AutoDetected);
        Assert.AreEqual("v2", response.SelectedAlgorithm);
        Assert.IsTrue(response.DetectionMessage?.Contains("Giải thuật II") ?? false);
        Assert.AreEqual(4.0, response.Result);
    }

    [TestMethod]
    public void TestAutoDetect_Division_SelectsAlgorithm2()
    {
        var response = _parserService.Parse(new ParseRequest
        {
            Expression = "20 / 4 / 2",
            Algorithm = "auto"
        });

        Assert.IsTrue(response.Success);
        Assert.IsTrue(response.AutoDetected);
        Assert.AreEqual("v2", response.SelectedAlgorithm);
        Assert.AreEqual(2.5, response.Result);
    }

    [TestMethod]
    public void TestAutoDetect_UnaryNegativeExpression_ReturnsMinus7()
    {
        var response = _parserService.Parse(new ParseRequest
        {
            Expression = "-4-3",
            Algorithm = "auto"
        });

        Assert.IsTrue(response.Success);
        Assert.IsTrue(response.AutoDetected);
        Assert.AreEqual("v2", response.SelectedAlgorithm);
        Assert.AreEqual(-7.0, response.Result);
        Assert.IsNotEmpty(response.Nodes);
        Assert.IsNotEmpty(response.Steps);
    }
}
