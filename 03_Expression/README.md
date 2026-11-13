# BÁO CÁO & HƯỚNG DẪN: ARITHMETIC EXPRESSION PARSE TREE VISUALIZER

**Môn học:** Kiểm chứng mô hình (Model Checking)  
**Bài thực hành:** Buổi 4 (Session 5 - Phân giải biểu thức số học)

---

## 1. Giới thiệu tổng quan

Dự án được xây dựng nhằm mô phỏng trực quan hóa giải thuật **Phân tích cú pháp đệ quy xuống (Recursive Descent Parsing)** cho biểu thức số học, bao gồm:

1. **Bài tập 1 (Giải thuật I):** Cài đặt chính xác văn phạm trong tài liệu Session 5:
   - $E \to T + E \mid T$
   - $T \to F * T \mid F$
   - $F \to (E) \mid id$
2. **Bài tập 2 (Giải thuật II):** Cải tiến hỗ trợ đầy đủ 4 phép toán cơ bản `$+$`, `$-$`, `$*$`, `$/$` với **tính kết hợp trái (Left-associative)** để đảm bảo đúng giá trị số học (ví dụ: $10 - 4 - 2 = (10 - 4) - 2 = 4$, $20 / 4 / 2 = 2.5$).
3. **Interactive Graph & Step-by-Step Trace:**
   - Trực quan hóa **Cây phân giải cú pháp (Parse Tree)** bằng **React Flow**.
   - Bộ điều khiển chạy từng bước (**Trace Player**): Chạy tự động (_Play_), tạm dừng (_Pause_), bước tới (_Next_), bước lùi (_Prev_), thanh trượt tiến độ (_Step Slider_), tùy chỉnh tốc độ.
   - Bảng theo dõi: Vị trí con trỏ `currentPos`, Ngăn xếp đệ quy (`Call Stack`), và giải thích hành động chi tiết bằng tiếng Việt.

---

## 2. Kiến trúc Hệ thống

Hệ thống được tổ chức theo mô hình phân tầng chặt chẽ (_Layered Architecture_):

```
Buoi 4/
├── ExpressionVisualizer/                 # ASP.NET Core Web API + SPA Host
│   ├── Controllers/
│   │   └── ParserController.cs          # API endpoints (/api/parser/parse, /api/parser/examples)
│   ├── Models/
│   │   ├── ASTNode.cs                   # Cấu trúc Node trên cây & Layout đồ thị
│   │   └── TraceModels.cs               # Mô hình vết (TraceStep, CallStack, NodeStatus, Snapshot)
│   ├── Services/
│   │   ├── ITraceRecorder.cs & TraceRecorder.cs   # Ghi lại snapshot từng bước đệ quy
│   │   ├── GrammarV1ParserService.cs    # Cài đặt Giải thuật I (PDF slide gốc)
│   │   ├── GrammarV2ParserService.cs    # Cài đặt Giải thuật II (hỗ trợ +, -, *, / kết hợp trái)
│   │   └── ParserService.cs             # Facade Service điều phối giải thuật
│   ├── client/                          # React + TypeScript + React Flow source code
│   ├── wwwroot/                         # Bản build sản phẩm của React (tích hợp sẵn)
│   └── Program.cs                       # Cấu hình Web Server & Static Files
└── ExpressionVisualizer.Tests/          # Bộ kiểm thử tự động (Unit Tests - MSTest)
    └── UnitTest1.cs                     # 8 Test cases phủ toàn bộ giải thuật & ngoại lệ
```

---

## 3. Hướng dẫn chạy chương trình

### Cách 1: Chạy ứng dụng Web (Chỉ cần 1 lệnh duy nhất)

Mở terminal tại thư mục `ExpressionVisualizer` và chạy:

```powershell
cd "ExpressionVisualizer"
dotnet run --launch-profile http
```

Sau đó mở trình duyệt và truy cập:
👉 **`http://localhost:5000`** (hoặc cổng được hiển thị trên console).

_(Toàn bộ mã giao diện React đã được đóng gói sẵn trong thư mục `wwwroot`, không cần cài đặt thêm Node.js khi chạy)._

---

### Cách 2: Chạy kiểm thử tự động (Unit Test)

Để kiểm tra tính đúng đắn của giải thuật:

```powershell
cd "ExpressionVisualizer.Tests"
dotnet test
```

**Kết quả:** 8/8 Test cases đạt yêu cầu (_Passed_).
