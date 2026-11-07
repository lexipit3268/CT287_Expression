# BÁO CÁO TOÀN DIỆN DỰ ÁN: ARITHMETIC EXPRESSION PARSE TREE VISUALIZER
**Môn học:** Kiểm chứng mô hình (Model Checking) — Buổi 4 (Session 5: Biểu thức số học)  
**Đơn vị:** Khoa Công nghệ Thông tin & Truyền thông — Trường Đại học Cần Thơ (CTU)  
**Tác giả thực hiện:** B2303828  
**Công nghệ:** C# (.NET 10 Web API, MSTest) + React 19 (TypeScript, React Flow, Vite)

---

## MỤC LỤC
1. [TỔNG QUAN VÀ MỤC TIÊU ĐỀ TÀI](#1-tổng-quan-và-mục-tiêu-đề-tài)
2. [CƠ SỞ LÝ THUYẾT & CÁC KHÁI NIỆM CỐT LÕI](#2-cơ-sở-lý-thuyết--các-khái-niệm-cốt-lõi)
   - 2.1. Văn phạm phi ngữ cảnh (Context-Free Grammar - CFG)
   - 2.2. Ký hiệu kết thúc (Terminal) và Chưa kết thúc (Non-terminal)
   - 2.3. Thứ tự ưu tiên (Precedence) và Tính kết hợp (Associativity)
   - 2.4. Phương pháp phân tích cú pháp đệ quy xuống (Recursive Descent Parsing)
   - 2.5. Khía cạnh Kiểm chứng mô hình: Hệ chuyển trạng thái & Trace Log
3. [PHÂN TÍCH CHI TIẾT THUẬT TOÁN I VÀ THUẬT TOÁN II](#3-phân-tích-chi-tiết-thuật-toán-i-và-thuật-toán-ii)
   - 3.1. Thuật toán I: Văn phạm gốc Session 5 (Phép toán `+` và `*`)
   - 3.2. Thuật toán II: Mở rộng 4 phép toán hai ngôi (`+`, `-`, `*`, `/`)
   - 3.3. So sánh cấu trúc cây phân giải giữa Thuật toán I và II
4. [CẤU TRÚC DỰ ÁN TỪ ĐẦU ĐẾN CUỐI](#4-cấu-trúc-dự-án-từ-đầu-đến-cuối)
   - 4.1. Sơ đồ cây thư mục hoàn chỉnh
   - 4.2. Bảng kê công nghệ: Đã dùng những gì và dùng ở đâu
5. [CÁC MẪU THIẾT KẾ & PATTERN KIẾN TRÚC CODE](#5-các-mẫu-thiết-kế--pattern-kiến-trúc-code)
   - 5.1. Kiến trúc phân tầng (Layered Architecture)
   - 5.2. Mẫu thiết kế Facade (Facade Pattern)
   - 5.3. Mẫu thiết kế Ghi vết trạng thái (State Snapshot / Event Recorder Pattern)
   - 5.4. Đóng gói Hosting tích hợp (Unified SPA Hosting Pattern)
6. [CHI TIẾT TRIỂN KHAI MÃ NGUỒN C# VÀ FRONTEND](#6-chi-tiết-triển-khai-mã-nguồn-c-và-frontend)
   - 6.1. Triển khai Cài đặt Thuật toán I (`GrammarV1ParserService.cs`)
   - 6.2. Triển khai Cài đặt Thuật toán II (`GrammarV2ParserService.cs`)
   - 6.3. Cơ chế đồng bộ con trỏ và Snapshot (`TraceRecorder.cs`)
   - 6.4. Giao diện Đồ thị tương tác (`CustomNode.tsx`, `App.tsx`)
7. [KẾT QUẢ THỰC NGHIỆM & KIỂM THỬ ĐƠN VỊ (UNIT TESTS)](#7-kết-quả-thực-nghiệm--kiểm-thử-đơn-vị-unit-tests)
8. [HƯỚNG DẪN CÀI ĐẶT VÀ VẬN HÀNH](#8-hướng-dẫn-cài-đặt-và-vận-hành)

---

## 1. TỔNG QUAN VÀ MỤC TIÊU ĐỀ TÀI

Trong lý thuyết biên dịch và kiểm chứng mô hình, việc phân tích cú pháp (*Parsing*) một biểu thức toán học và tính toán giá trị của nó là bài toán nền tảng. Mục tiêu cốt lõi của bài toán là chuyển đổi một chuỗi văn bản tuyến tính (ví dụ: `2 * 3 + 6`) thành một cấu trúc dữ liệu dạng cây phân cấp (**Parse Tree** hoặc **AST - Abstract Syntax Tree**), từ đó kiểm chứng tính hợp lệ về mặt ngữ pháp và thực thi việc tính toán chính xác theo thứ tự ưu tiên của toán tử.

Dự án này giải quyết trọn vẹn 2 yêu cầu trong tài liệu thực hành **Session 5 - Biểu thức số học**:
1. **Bài tập 1:** Cài đặt giải thuật phân tích đệ quy xuống theo văn phạm gốc được cung cấp trong slide.
2. **Bài tập 2:** Cải tiến giải thuật để hỗ trợ đầy đủ 4 phép toán cơ bản `$+$`, `$-$`, `$*$`, `$/$` kèm dấu ngoặc tròn `()`, xử lý triệt để tính kết hợp từ trái sang phải (*Left-associativity*).
3. **Mở rộng sáng tạo (Interactive Visualizer):** Xây dựng một ứng dụng trực quan hóa đồ thị động bằng **C# .NET** kết hợp **React Flow**, cho phép xem từng bước chạy của giải thuật đệ quy, hiển thị chuyển động con trỏ, ngăn xếp gọi hàm (*Call Stack*) và quá trình hình thành từng nút trên cây.

---

## 2. CƠ SỞ LÝ THUYẾT & CÁC KHÁI NIỆM CỐT LÕI

### 2.1. Văn phạm phi ngữ cảnh (Context-Free Grammar - CFG)
Văn phạm phi ngữ cảnh là một bộ 4 thành phần $G = (V, \Sigma, R, S)$:
* $V$ (Variables / Non-terminals): Tập hợp các biến hay ký hiệu chưa kết thúc.
* $\Sigma$ (Alphabet / Terminals): Tập hợp các ký hiệu kết thúc (chữ số, toán tử, dấu ngoặc).
* $R$ (Production Rules): Tập các luật sinh có dạng $A \to \alpha$, với $A \in V$ và $\alpha \in (V \cup \Sigma)^*$.
* $S \in V$: Ký hiệu bắt đầu (Start symbol).

### 2.2. Ký hiệu kết thúc (Terminal) và Chưa kết thúc (Non-terminal)
Trong bài toán biểu thức số học:
* **Non-terminals:**
  * $E$ (*Expression*): Đại diện cho một biểu thức số học hoàn chỉnh.
  * $T$ (*Term*): Đại diện cho một số hạng.
  * $F$ (*Factor*): Đại diện cho một thừa số cơ sở.
* **Terminals:**
  * Các toán tử: `+`, `-`, `*`, `/`.
  * Dấu ngoặc: `(`, `)`.
  * `id` hoặc số nguyên/số thực: `0`, `1`, `2`, ..., `9`.

### 2.3. Thứ tự ưu tiên (Precedence) và Tính kết hợp (Associativity)

#### A. Thứ tự ưu tiên (Precedence)
Nguyên tắc xây dựng văn phạm theo tầng: **Luật sinh nào càng nằm sâu trong cây (xa gốc $E$, gần lá $F$) thì toán tử đó có độ ưu tiên càng cao.**
* Tầng $E$ (Expression): Xử lý phép cộng `$+$` và trừ `$-$` (Ưu tiên thấp nhất).
* Tầng $T$ (Term): Xử lý phép nhân `$*$` và chia `$/$` (Ưu tiên trung bình).
* Tầng $F$ (Factor): Xử lý dấu ngoặc `(E)` và giá trị số `id` (Ưu tiên cao nhất). Biểu thức con nằm trong ngoặc `(E)` quay ngược trở lại đỉnh $E$, do đó luôn được tính trước.

#### B. Tính kết hợp (Associativity)
* **Kết hợp phải (Right-associative):** Biểu diễn dưới dạng luật sinh đệ quy phải: $A \to B \text{ op } A \mid B$. 
  Ví dụ: $a + b + c$ được hiểu là $a + (b + c)$. Phép cộng và phép nhân có tính giao hoán và kết hợp nên cách hiểu này không làm sai lệch giá trị kết quả ($2 + (3 + 4) = (2 + 3) + 4$).
* **Kết hợp trái (Left-associative):** Biểu diễn dưới dạng luật sinh đệ quy trái: $A \to A \text{ op } B \mid B$. 
  Ví dụ: $a - b - c$ bắt buộc phải được hiểu là $(a - b) - c$. **Phép trừ và phép chia không có tính kết hợp phải**:
  $$\text{Đúng: } 10 - 4 - 2 = (10 - 4) - 2 = 4$$
  $$\text{Sai nếu kết hợp phải: } 10 - (4 - 2) = 10 - 2 = 8 \quad (\text{SAI!})$$

### 2.4. Phương pháp phân tích cú pháp đệ quy xuống (Recursive Descent Parsing)
Là kỹ thuật phân tích cú pháp từ trên xuống (*Top-Down Parsing*):
* Mỗi ký hiệu chưa kết thúc ($E, T, F$) được ánh xạ trực tiếp thành một hàm lập trình tương ứng: `CheckExpression()`, `CheckTerm()`, `CheckFactor()`.
* Quá trình phân giải bắt đầu bằng việc gọi hàm gốc `CheckExpression()`.
* Khi hàm này thực thi, nó gọi đệ quy các hàm cấp dưới theo đúng luật sinh của văn phạm.
* Quá trình đệ quy kết thúc khi gặp các ký hiệu kết thúc (đọc được số hoặc dấu ngoặc đóng `)`).

### 2.5. Khía cạnh Kiểm chứng mô hình: Hệ chuyển trạng thái & Trace Log
Trong môn **Kiểm chứng mô hình (Model Checking)**, một chương trình thực thi được xem là một **Hệ chuyển trạng thái (State Transition System)**.
Một trạng thái tại bước thứ $k$ được định nghĩa bằng bộ:
$$S_k = \langle \text{currentPos}, \text{CallStack}, \text{ActiveNode}, \text{TreeGraph}, \text{EvaluatedValues} \rangle$$
Mỗi hành động của Parser (`CALL`, `READ`, `TOKEN`, `COMPUTE`, `RETURN`) kích hoạt một bước chuyển trạng thái $S_k \xrightarrow{\text{action}} S_{k+1}$. Bộ công cụ Trace Player chính là công cụ cho phép "bước qua" (*single-step execution*) và kiểm chứng từng trạng thái chuyển đổi của giải thuật.

---

## 3. PHÂN TÍCH CHI TIẾT THUẬT TOÁN I VÀ THUẬT TOÁN II

### 3.1. Thuật toán I: Văn phạm gốc Session 5 (Phép toán `+` và `*`)

#### Văn phạm hình thức:
$$\begin{aligned}
E &\to T + E \mid T \\
T &\to F * T \mid F \\
F &\to (E) \mid id
\end{aligned}$$

#### Mã giả nguyên bản trong giáo trình:
```text
ALGORITHM checkExpression():
    result = checkTerm()
    if (currentPos == len(strInput)):
        return result
    while currentPos < len(strInput) and strInput[currentPos] == '+':
        currentPos += 1
        result1 = checkExpression()
        result += result1
    return result

ALGORITHM checkTerm():
    result = checkFactor()
    if (currentPos == len(strInput)):
        return result
    while currentPos < len(strInput) and strInput[currentPos] == '*':
        currentPos += 1
        result1 = checkTerm()
        result *= result1
    return result

ALGORITHM checkFactor():
    if (strInput[currentPos] == '('):
        currentPos += 1
        result = checkExpression()
        if strInput[currentPos] == ')':
            currentPos += 1
        else: raiseError("Invalid Expression")
        return result
    else:
        number = getDigits(currentPos)
        return number
```

#### Đặc điểm của Thuật toán I:
* Áp dụng đệ quy phải gián tiếp thông qua lời gọi đệ quy `result1 = checkExpression()` và `result1 = checkTerm()`.
* Cây phân giải phát triển lệch về bên phải (Right-leaning tree).
* Phù hợp hoàn hảo cho các toán tử có tính chất kết hợp phải hoặc giao hoán tự do như `$+$` và `$*$`.

---

### 3.2. Thuật toán II: Mở rộng 4 phép toán hai ngôi (`+`, `-`, `*`, `/`)

#### Vấn đề khi mở rộng trực tiếp:
Nếu ta chỉ đơn giản thêm `-` vào `checkExpression()` theo dạng đệ quy phải:
```python
# CÁCH LÀM SAI:
if strInput[currentPos] == '-':
    currentPos += 1
    result1 = checkExpression()
    result -= result1  # Dẫn đến: result - (phần còn lại) -> SAI BẢN CHẤT SỐ HỌC
```

#### Giải pháp chuẩn: Khử đệ quy trái bằng Vòng lặp duyệt tuần tự (Left-Associative Parsing)
Văn phạm toán học chuẩn:
$$\begin{aligned}
E &\to T \{ (+ \mid -) T \}^* \\
T &\to F \{ (* \mid /) F \}^* \\
F &\to (E) \mid id
\end{aligned}$$

#### Mã thuật toán II:
```csharp
// E -> T ((+ | -) T)*
double CheckExpression() {
    double accumulatedValue = CheckTerm();
    while (currentPos < len && (input[currentPos] == '+' || input[currentPos] == '-')) {
        char op = input[currentPos++];
        double nextValue = CheckTerm();
        if (op == '+') accumulatedValue += nextValue;
        else accumulatedValue -= nextValue; // Luôn lấy giá trị đã tích lũy trừ cho số hạng mới
    }
    return accumulatedValue;
}

// T -> F ((* | /) F)*
double CheckTerm() {
    double accumulatedValue = CheckFactor();
    while (currentPos < len && (input[currentPos] == '*' || input[currentPos] == '/')) {
        char op = input[currentPos++];
        double nextValue = CheckFactor();
        if (op == '*') accumulatedValue *= nextValue;
        else {
            if (Math.Abs(nextValue) < 1e-12) throw new DivideByZeroException("Lỗi chia cho 0");
            accumulatedValue /= nextValue; // Luôn lấy giá trị đã tích lũy chia cho thừa số mới
        }
    }
    return accumulatedValue;
}
```

---

### 3.3. So sánh cấu trúc cây phân giải giữa Thuật toán I và II

Với biểu thức $w = 2 * 3 + 6$:
* **Thuật toán I (Right-leaning):**
  Nút gốc $E$ sinh ra 3 nhánh: $T$, nút toán tử `$+$`, và một nút con $E$ bên phải. Nút $E$ bên phải tiếp tục phân rã thành $T \to F \to 6$.
* **Thuật toán II (N-ary Flat / Left-leaning):**
  Nút gốc $E$ quản lý trực tiếp chuỗi các số hạng $T$ ngăn cách bởi toán tử: $E \to [T(2*3), +, T(6)]$. Cấu trúc này phản ánh trực tiếp thứ tự thực hiện phép tính từ trái sang phải mà không tạo các tầng đệ quy giả thừa thãi.

```
       Thuật toán I (PDF gốc)                  Thuật toán II (Chuẩn hóa)
                E                                          E
             /  |  \                                    /  |  \
            T   +   E                                  T   +   T
          / | \     |                                / | \     |
         F  *  T    T                               F  *  F    F
         |     |    |                               |     |    |
         2     3    F                               2     3    6
                    |
                    6
```

---

## 4. CẤU TRÚC DỰ ÁN TỪ ĐẦU ĐẾN CUỐI

### 4.1. Sơ đồ cây thư mục hoàn chỉnh

```
Buoi 4/
│
├── ExpressionVisualizer/                 # DỰ ÁN CHÍNH (ASP.NET CORE + REACT HOST)
│   ├── Controllers/
│   │   └── ParserController.cs          # REST API Controllers (nhận chuỗi, trả JSON)
│   ├── Models/
│   │   ├── ASTNode.cs                   # Cấu trúc Node trên cây & tính toán layout X, Y
│   │   └── TraceModels.cs               # DTO truyền dữ liệu (TraceStep, CallStack, NodeStatus)
│   ├── Services/
│   │   ├── IParserService.cs            # Interface dịch vụ phân tích cú pháp
│   │   ├── ParserService.cs             # Facade Service điều hướng Thuật toán I hoặc II
│   │   ├── ITraceRecorder.cs            # Interface ghi nhận vết thực thi
│   │   ├── TraceRecorder.cs             # Triển khai bộ máy chụp State Snapshot
│   │   ├── GrammarV1ParserService.cs    # Cài đặt chi tiết Thuật toán I (Giáo trình)
│   │   └── GrammarV2ParserService.cs    # Cài đặt chi tiết Thuật toán II (Mở rộng 4 phép toán)
│   ├── client/                          # MÃ NGUỒN FRONTEND REACT (TypeScript + Vite)
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── Header.tsx           # Tiêu đề ứng dụng & thông tin môn học
│   │   │   │   ├── ControlBar.tsx       # Ô nhập biểu thức, nút giải thuật, ví dụ mẫu
│   │   │   │   ├── CustomNode.tsx       # Component nút cây đồ thị (E, T, F, Toán tử, Số)
│   │   │   │   ├── InspectorPanel.tsx   # Bảng thanh tra: Băng đọc ký tự, Call Stack, Chú giải
│   │   │   │   └── TracePlayer.tsx      # Thanh điều khiển: Play/Pause, Bước tới/lùi, Tốc độ
│   │   │   ├── App.tsx                  # Component trung tâm điều phối trạng thái & phím tắt
│   │   │   ├── types.ts                 # Định nghĩa Interface dữ liệu phía TypeScript
│   │   │   └── index.css                # CSS Variables, hiệu ứng viền phát sáng active-pulse
│   │   ├── package.json                 # Cấu hình gói thư viện (@xyflow/react, lucide-react)
│   │   └── vite.config.ts               # Cấu hình Vite build trực tiếp vào ../wwwroot
│   ├── wwwroot/                         # BẢN BUILD TÍCH HỢP SẴN CỦA REACT
│   │   ├── index.html                   # HTML Entrypoint
│   │   └── assets/                      # JS bundle & CSS bundle đã nén
│   ├── Program.cs                       # Khởi tạo Kestrel Server, cấu hình CORS, Static Files
│   └── ExpressionVisualizer.csproj      # File cấu hình dự án .NET 10
│
├── ExpressionVisualizer.Tests/          # DỰ ÁN KIỂM THỬ ĐƠN VỊ (UNIT TESTS)
│   ├── UnitTest1.cs                     # 8 Test cases kiểm chứng giải thuật I, II và các ngoại lệ
│   └── ExpressionVisualizer.Tests.csproj# Cấu hình kiểm thử MSTest
│
├── BAO_CAO_DU_AN_EXPRESSION_PARSER.md   # BÁO CÁO KỸ THUẬT NÀY
├── README.md                            # Hướng dẫn chạy nhanh
├── start.ps1                            # Script PowerShell 1-click khởi chạy
└── Session 5 - Expression.pdf           # Đề bài và lý thuyết gốc
```

---

### 4.2. Bảng kê công nghệ: Đã dùng những gì và dùng ở đâu

| Công nghệ / Thư viện | Phiên bản | Dùng ở đâu trong dự án | Lý do lựa chọn & Vai trò |
|---|:---:|---|---|
| **C# .NET SDK** | `10.0.302` | Toàn bộ thư mục `ExpressionVisualizer` | Nền tảng hướng đối tượng mạnh mẽ, thực thi thuật toán phân giải với hiệu năng cao và độ tin cậy kiểu dữ liệu tuyệt đối. |
| **ASP.NET Core Web API** | `10.0` | `Program.cs`, `ParserController.cs` | Xây dựng RESTful API nhận chuỗi biểu thức và trả về toàn bộ dữ liệu đồ thị + lịch sử bước chạy dưới dạng JSON. |
| **React** | `19.3.1` | `client/src` | Xây dựng Single-Page Application (SPA) phản ứng tức thì theo từng thay đổi của state con trỏ và cây đồ thị. |
| **TypeScript** | `6.0.3` | `client/src/**/*.ts(x)` | Đảm bảo tính nhất quán kiểu dữ liệu giữa DTO phía C# và các Component React (`TraceStep`, `FlowNode`, `FlowEdge`). |
| **@xyflow/react (React Flow)** | `12.12.1` | `App.tsx`, `CustomNode.tsx` | Thư viện đồ thị chuyên dụng hàng đầu. Cho phép render các nút cây phân cấp, hỗ trợ kéo thả, zoom, pan và tô màu động. |
| **Lucide React** | `1.70.0` | Các component UI | Hệ thống icon SVG vector sắc nét, thống nhất nét vẽ cho các nút Play, Pause, Step, Layers, Terminal. |
| **Vite** | `8.3.6` | `client/vite.config.ts` | Công cụ build frontend cực nhanh (< 1 giây), tự động đóng gói xuất bản vào thư mục `wwwroot` của C#. |
| **MSTest & Test SDK** | `3.6.4` | `ExpressionVisualizer.Tests` | Framework kiểm thử tự động của Microsoft để kiểm chứng tính đúng đắn toán học của 2 giải thuật. |

---

## 5. CÁC MẪU THIẾT KẾ & PATTERN KIẾN TRÚC CODE

### 5.1. Kiến trúc phân tầng (Layered Architecture)
Mã nguồn C# được tách biệt rành mạch thành 3 tầng:
1. **Presentation / API Layer (`Controllers`):**
   Chỉ tiếp nhận yêu cầu từ HTTP Request (`ParseRequest`), gọi tầng Service và trả kết quả về cho client (`ParseResponse`). Không chứa logic phân tích cú pháp.
2. **Business Logic Layer (`Services`):**
   Chứa toàn bộ thuật toán phân tích cú pháp đệ quy xuống (`GrammarV1ParserService`, `GrammarV2ParserService`).
3. **Domain / Data Transfer Layer (`Models`):**
   Định nghĩa các thực thể mô hình dữ liệu của cây cú pháp và bước chạy (`ASTNode`, `TraceStep`, `FlowNode`).

### 5.2. Mẫu thiết kế Facade (Facade Pattern)
Lớp `ParserService` đóng vai trò là một **Facade**:
* Nó cung cấp một điểm tiếp xúc duy nhất `Parse(ParseRequest request)` cho Controller.
* Phía sau hậu trường, `ParserService` tự động khởi tạo bộ ghi vết `TraceRecorder`, kiểm tra loại giải thuật được chọn (`v1` hay `v2`) để ủy quyền (*dispatch*) cho parser tương ứng xử lý, giúp mã lệnh Controller vô cùng ngắn gọn và dễ bảo trì.

### 5.3. Mẫu thiết kế Ghi vết trạng thái (State Snapshot / Event Recorder Pattern)
Để Frontend có thể tua lại (*playback*) quá trình đệ quy từng bước một cách tự nhiên mà không cần phải can thiệp chặn luồng đệ quy backend bằng Thread Sleep hay WebSocket phức tạp:
* Mỗi khi bộ phân tích thực hiện một hành động (gọi hàm đệ quy, nhận dạng toán tử, đọc số, tính toán kết quả), một bản chụp **Snapshot** đầy đủ được tạo ra:
  ```csharp
  var step = new TraceStep {
      StepIndex = _steps.Count + 1,
      CurrentPos = currentPos,
      CurrentChar = currentChar,
      CallStack = _callStack.Reverse().ToList(), // Sao chép ngăn xếp đệ quy hiện thời
      ActionType = actionType,
      ActiveNodeId = activeNodeId,
      Description = description,
      VisibleNodeIds = new List<string>(_visibleNodes), // Nút nào đã xuất hiện
      VisibleEdgeIds = new List<string>(_visibleEdges), // Cạnh nào đã vẽ
      NodeStatuses = new Dictionary<string, string>(_nodeStatuses),
      NodeValues = new Dictionary<string, double?>(_nodeValues)
  };
  ```
* Danh sách chuỗi các bước này được trả về một lần duy nhất cho Frontend. Phía Frontend chỉ việc điều khiển một chỉ số `currentStepIndex` (từ 0 đến $N-1$) để hiển thị chính xác trạng thái của hệ thống tại bất kỳ thời điểm nào.

### 5.4. Đóng gói Hosting tích hợp (Unified SPA Hosting Pattern)
Trong `Program.cs`:
```csharp
app.UseDefaultFiles(); // Tự động phục vụ index.html khi truy cập root
app.UseStaticFiles();  // Phục vụ các assets JS/CSS từ wwwroot
app.MapControllers();  // Phục vụ API
app.MapFallbackToFile("index.html"); // Đảm bảo SPA routing hoạt động mượt mà
```
Mẫu thiết kế này giúp giảng viên hoặc người chấm bài **không cần cài đặt Node.js hay mở 2 terminal song song**, chỉ cần cài .NET SDK là chạy được toàn bộ ứng dụng trên một cổng duy nhất (`http://localhost:5000`).

---

## 6. CHI TIẾT TRIỂN KHAI MÃ NGUỒN C# VÀ FRONTEND

### 6.1. Triển khai Cài đặt Thuật toán I (`GrammarV1ParserService.cs`)

Thuật toán I cài đặt chính xác các luật đệ quy phải trong tài liệu:
```csharp
// E -> T + E | T
private (ASTNode Node, double Value) CheckExpression()
{
    _recorder.PushCallStack("checkExpression()");
    string eId = _recorder.CreateNode(NodeType.Expression, "E", _currentPos);
    var eNode = new ASTNode { Id = eId, Label = "E", Type = NodeType.Expression, Position = _currentPos };
    
    _recorder.RecordStep("CALL", eId, _currentPos, "Vào hàm checkExpression(): Khởi tạo nút E, gọi checkTerm()");

    var (tNode, termValue) = CheckTerm();
    eNode.Children.Add(tNode);
    _recorder.AddEdge(eId, tNode.Id);

    double result = termValue;
    SkipWhitespace();

    while (_currentPos < _input.Length && _input[_currentPos] == '+')
    {
        int opPos = _currentPos;
        string opId = _recorder.CreateNode(NodeType.Operator, "+", opPos, null);
        var opNode = new ASTNode { Id = opId, Label = "+", Type = NodeType.Operator, Position = opPos, Operator = "+" };
        eNode.Children.Add(opNode);
        _recorder.AddEdge(eId, opId);
        
        // Ghi vết tại đúng vị trí ký tự toán tử '+'
        _recorder.RecordStep("TOKEN", opId, opPos, "Gặp toán tử '+', ghi nhận nút '+' vào cây");

        _currentPos++; // Bỏ qua ký tự '+'
        SkipWhitespace();

        _recorder.RecordStep("CALL", eId, _currentPos, "Đệ quy gọi checkExpression() để phân tích số hạng tiếp theo");
        var (nextENode, nextEValue) = CheckExpression();
        eNode.Children.Add(nextENode);
        _recorder.AddEdge(eId, nextENode.Id);

        result += nextEValue;
        _recorder.RecordStep("COMPUTE", eId, opPos, $"Thực hiện phép cộng E: {termValue} + {nextEValue} = {result}");
        SkipWhitespace();
    }

    eNode.Value = result;
    _recorder.SetNodeValue(eId, result);
    _recorder.RecordStep("RETURN", eId, _currentPos, $"Hoàn thành checkExpression(), nút E nhận giá trị = {result}");
    _recorder.PopCallStack();

    return (eNode, result);
}
```

---

### 6.2. Triển khai Cài đặt Thuật toán II (`GrammarV2ParserService.cs`)

Thuật toán II triển khai vòng lặp duyệt tuần tự từ trái sang phải, bảo đảm tính kết hợp trái:
```csharp
// E -> T ((+ | -) T)* (Left-associative)
private (ASTNode Node, double Value) CheckExpression()
{
    _recorder.PushCallStack("checkExpression()");
    string eId = _recorder.CreateNode(NodeType.Expression, "E", _currentPos);
    var eNode = new ASTNode { Id = eId, Label = "E", Type = NodeType.Expression, Position = _currentPos };

    _recorder.RecordStep("CALL", eId, _currentPos, "Vào checkExpression(): Khởi tạo nút E, gọi checkTerm()");

    var (tNode, termValue) = CheckTerm();
    eNode.Children.Add(tNode);
    _recorder.AddEdge(eId, tNode.Id);

    double accumulatedValue = termValue;
    SkipWhitespace();

    while (_currentPos < _input.Length && (_input[_currentPos] == '+' || _input[_currentPos] == '-'))
    {
        char op = _input[_currentPos];
        int opPos = _currentPos;

        string opId = _recorder.CreateNode(NodeType.Operator, op.ToString(), opPos, null);
        var opNode = new ASTNode { Id = opId, Label = op.ToString(), Type = NodeType.Operator, Position = opPos, Operator = op.ToString() };
        eNode.Children.Add(opNode);
        _recorder.AddEdge(eId, opId);
        _recorder.RecordStep("TOKEN", opId, opPos, $"Gặp toán tử '{op}', ghi nhận nút '{op}' vào cây");

        _currentPos++; // Bỏ qua toán tử '+' hoặc '-'
        SkipWhitespace();

        _recorder.RecordStep("CALL", eId, _currentPos, $"Gọi tiếp checkTerm() để lấy số hạng tiếp theo cho phép '{op}' (kết hợp trái)");
        var (nextTNode, nextTValue) = CheckTerm();
        eNode.Children.Add(nextTNode);
        _recorder.AddEdge(eId, nextTNode.Id);

        double prevValue = accumulatedValue;
        if (op == '+') accumulatedValue += nextTValue;
        else accumulatedValue -= nextTValue; // Tích lũy kết quả từ trái sang phải

        _recorder.RecordStep("COMPUTE", eId, opPos, $"Tính phép toán {op}: {prevValue} {op} {nextTValue} = {accumulatedValue}");
        SkipWhitespace();
    }

    eNode.Value = accumulatedValue;
    _recorder.SetNodeValue(eId, accumulatedValue);
    _recorder.RecordStep("RETURN", eId, _currentPos, $"Hoàn thành checkExpression(), nút E nhận giá trị = {accumulatedValue}");
    _recorder.PopCallStack();

    return (eNode, accumulatedValue);
}
```

---

### 6.3. Cơ chế đồng bộ con trỏ và Snapshot (`TraceRecorder.cs`)

Điểm mấu chốt được cải tiến để khắc phục lỗi lệch con trỏ:
* Khi nhận diện một ký hiệu (Token), con trỏ `currentPos` được truyền vào bản ghi vết chính là **vị trí thực tế của ký tự đó trên chuỗi** (`opPos`), trước khi tăng `_currentPos++`.
* Nhờ đó, người học nhìn vào giao diện sẽ thấy con trỏ đóng khung vàng sáng chính xác trên ký tự `+` hoặc `*` đúng tại thời điểm thông báo *"Gặp toán tử '+'"* xuất hiện.

Thuật toán tự động dàn bố cục cây (*Tree Layout Calculation*):
```csharp
private double ComputeTreeLayout(ASTNode node, double startX, double level, double levelHeight = 100)
{
    node.Y = level * levelHeight + 50;

    if (node.Children.Count == 0) {
        node.X = startX + 40;
        return startX + 80; // Độ rộng dành cho nút lá
    }

    double currentX = startX;
    var childMidPoints = new List<double>();

    foreach (var child in node.Children) {
        double nextX = ComputeTreeLayout(child, currentX, level + 1, levelHeight);
        childMidPoints.Add(child.X);
        currentX = nextX;
    }

    // Căn giữa nút cha ngay phía trên trung điểm các nút con
    node.X = (childMidPoints.First() + childMidPoints.Last()) / 2.0;
    return currentX;
}
```

---

### 6.4. Giao diện Đồ thị tương tác (`CustomNode.tsx`, `App.tsx`)

* **Nút tùy biến `CustomNode`:**
  Được tối ưu hóa bằng `React.memo` để tránh re-render lặp lại. Phân loại màu theo ngữ pháp:
  * Xanh dương: Nút biểu thức ($E$).
  * Tím: Nút số hạng ($T$).
  * Vàng cam: Nút thừa số ($F$).
  * Xanh lá: Nút giá trị số (`id`).
  * Đỏ hồng: Nút toán tử.
* **Hiệu ứng trực quan (`active-pulse`):**
  Nút đang được bộ phân giải xử lý sẽ có hiệu ứng viền phát sáng lan tỏa êm dịu (`box-shadow`), giúp định vị nút ngay lập tức giữa cây đồ thị rộng lớn.
* **Hệ thống phím tắt:**
  Lắng nghe sự kiện bàn phím toàn cục:
  * <kbd>Space</kbd>: Tạm dừng / Tiếp tục tự động chạy.
  * <kbd>→</kbd> / <kbd>←</kbd>: Tiến tới / Lùi lại từng bước.
  * <kbd>Home</kbd> / <kbd>End</kbd>: Về bước đầu / Tới bước cuối cùng.

---

## 7. KẾT QUẢ THỰC NGHIỆM & KIỂM THỬ ĐƠN VỊ (UNIT TESTS)

Dự án kiểm thử tự động `ExpressionVisualizer.Tests` được xây dựng bằng MSTest, bao phủ đầy đủ các ca kiểm thử:

```powershell
dotnet test --no-build
```

### Kết quả chạy kiểm thử:
```text
Passed!  - Failed: 0, Passed: 8, Skipped: 0, Total: 8, Duration: 32 ms - ExpressionVisualizer.Tests.dll (net10.0)
```

### Chi tiết 8 Test Cases đã được kiểm chứng:
1. `TestAlgorithm1_BasicSlideExample_Returns12`: Kiểm thử ví dụ trong slide: $2 * 3 + 6 = 12$.
2. `TestAlgorithm1_WithParentheses_Returns20`: Kiểm thử độ ưu tiên của dấu ngoặc đơn: $(2 + 3) * 4 = 20$.
3. `TestAlgorithm2_LeftAssociativitySubtraction_Returns4`: Kiểm chứng tính kết hợp trái phép trừ: $10 - 4 - 2 = (10 - 4) - 2 = 4$ (không bị tính sai thành 8).
4. `TestAlgorithm2_LeftAssociativityDivision_Returns2_5`: Kiểm chứng tính kết hợp trái phép chia: $20 / 4 / 2 = (20 / 4) / 2 = 2.5$ (không bị tính sai thành 10).
5. `TestAlgorithm2_ComplexExpression_Returns2`: Biểu thức hỗn hợp cả 4 phép toán: $(20 + 4) / 3 - 2 * 3 = 24 / 3 - 6 = 8 - 6 = 2$.
6. `TestInvalidSyntax_MissingParenthesis_ReturnsError`: Bắt lỗi thiếu dấu ngoặc đóng: `(2 + 3 * 4`.
7. `TestAlgorithm2_DivisionByZero_ReturnsError`: Bắt ngoại lệ chia cho 0: `10 / (5 - 5)`.
8. Kiểm tra tính toàn vẹn của danh sách Node và Snapshot sinh ra cho đồ thị.

---

## 8. HƯỚNG DẪN CÀI ĐẶT VÀ VẬN HÀNH

### Yêu cầu môi trường:
* .NET SDK 10.0 (hoặc .NET 8.0/9.0 tương đương).
* Bất kỳ trình duyệt web hiện đại nào (Chrome, Edge, Firefox).

### Khởi chạy chương trình:
1. Mở PowerShell hoặc Command Prompt tại thư mục dự án:
   ```powershell
   cd "D:\DU LIEU\CTU\Kiem chung mo hinh\Thưc hanh\Buoi 4\ExpressionVisualizer"
   ```
2. Chạy lệnh:
   ```powershell
   dotnet run --urls="http://localhost:5000"
   ```
3. Mở trình duyệt web và truy cập địa chỉ:
   👉 **`http://localhost:5000`**

*(Người dùng cũng có thể click đúp chuột vào file `start.ps1` trong thư mục `Buoi 4` để khởi chạy tự động chỉ bằng một cú click).*

---
**HẾT BÁO CÁO**
