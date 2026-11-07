# Script khởi chạy ứng dụng Expression Visualizer
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " KHOI CHAY EXPRESSION PARSE TREE VISUALIZER (BUOI 4 - CTU)" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan

Set-Location "$PSScriptRoot\ExpressionVisualizer"
Start-Process "http://localhost:5000"
dotnet run --urls="http://localhost:5000"
