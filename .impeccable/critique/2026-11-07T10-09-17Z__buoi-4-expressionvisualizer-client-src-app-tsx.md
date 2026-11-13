---
target: "d:\\DU LIEU\\CTU\\Kiem chung mo hinh\\Thưc hanh\\Buoi 4\\ExpressionVisualizer\\client\\src\\App.tsx"
total_score: 26
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 2
target_identity: "file:d:\\DU LIEU\\CTU\\Kiem chung mo hinh\\Thưc hanh\\Buoi 4\\ExpressionVisualizer\\client\\src\\App.tsx"
target_fingerprint: "sha256:d763c4cb6d4f5f08d8e125ba28d437d64e5f129a0d0e7318f9b55551efcf6a80"
target_path: "d:\\DU LIEU\\CTU\\Kiem chung mo hinh\\Thưc hanh\\Buoi 4\\ExpressionVisualizer\\client\\src\\App.tsx"
timestamp: 2026-11-07T10-09-17Z
slug: buoi-4-expressionvisualizer-client-src-app-tsx
---
Method: dual-agent (A: 09d7916b-9b0a-4818-a0f5-8ac4ec0c30ad · B: 3c71cb64-6e90-4ae6-b6e9-b5045ba3462b)

### Design Health Score

| # | Heuristic | Score (0-4) | Key Issue / Specific Finding |
|---|---|:---:|---|
| 1 | Visibility of System Status | 3 | Phản hồi đồng bộ tốt (pulse node, tape cursor, stack top), nhưng thanh trượt chưa có mốc đánh dấu kiểu bước (CALL vs COMPUTE vs RETURN). |
| 2 | Match System / Real World | 3 | Thuật ngữ chuẩn tiếng Việt môn học, nhưng huy hiệu 3 ký tự (Exp, Ter, Fac) làm giảm độ khớp với ký hiệu BNF chuẩn (E, T, F) trong slide. |
| 3 | User Control and Freedom | 3 | Phím tắt linh hoạt (Space, Arrow, Home/End), nhưng chưa hỗ trợ click trực tiếp vào Node hoặc Stack frame để tua tới bước tương ứng. |
| 4 | Consistency and Standards | 2 | Rải rác hơn 200 dòng inline styles, nhiều bán kính bo góc (6px, 8px, 12px, 20px) và lệch tông vàng giữa MiniMap và Node active. |
| 5 | Error Prevention | 2 | Phản ứng thụ động: Nhập toán tử không hợp lệ chỉ báo lỗi sau khi bấm Phân tích, chưa có linting hay gợi ý ràng buộc cú pháp tức thời. |
| 6 | Recognition Rather Than Recall | 3 | Bảng chú giải và phím tắt nổi bật, nhưng khi ẩn bảng chi tiết thì mất luôn chú giải ký hiệu ngữ pháp. |
| 7 | Flexibility and Efficiency | 3 | Hỗ trợ phím tắt toàn cục và điều chỉnh tốc độ, nhưng thiếu lịch sử biểu thức đã nhập và xuất cây đồ thị ra ảnh/SVG. |
| 8 | Aesthetic and Minimalist Design | 2 | Header màu tối quá nặng áp đảo toàn bộ bàn làm việc, mật độ huy hiệu viền cạnh cạnh nhau tạo cảm giác phân tán thị giác. |
| 9 | Error Recovery | 3 | Thông báo lỗi có gợi ý khắc phục cụ thể, nhưng chưa đánh dấu gạch đỏ chính xác tại vị trí ký tự gây lỗi trong chuỗi. |
| 10 | Help and Documentation | 2 | Có tooltip giải thích luật ngữ pháp cơ bản, nhưng thiếu bảng tra cứu BNF trực quan cho sinh viên xem lại lý thuyết đệ quy. |
| **Total** | | **26/40** | **Acceptable / Nền tảng sư phạm vững chắc** (65%) |

### Design Specificity Verdict
- **Đánh giá Thiết kế (LLM Review)**: Giao diện bám sát nghiệp vụ với bộ ba kinh điển: Băng đọc ký tự (Lexical tape), Ngăn xếp đệ quy (Call stack) và Cây phân giải (AST). Tuy nhiên, phong cách thị giác vẫn mang hơi hướng dashboard quản trị chung chung hơn là một công cụ Compiler Workbench chuyên nghiệp.
- **Quét cơ học (Deterministic Scan)**: Impeccable CLI detector quét 10 tệp nguồn cho kết quả 0 lỗi vi phạm tĩnh (`[]`). Bản build Vite/TypeScript hoàn thành trơn tru (613ms, xuất thẳng ra `wwwroot`). Tuy nhiên, ESLint ghi nhận 8 cảnh báo/lỗi kiểu dữ liệu (`any` và `useEffect` dependencies trong `App.tsx`).

### Overall Impression
Một công cụ sư phạm trực quan rất hiệu quả, truyền tải chuẩn xác nguyên lý đệ quy xuống của môn Kiểm chứng mô hình. Trải nghiệm bước chạy rất thuyết phục khi tính toán dồn lên từ lá, nhưng người dùng phải đảo mắt liên tục giữa 3 vùng màn hình để theo dõi.

### What's Working
1. Đồng bộ nhịp nhàng giữa con trỏ chuỗi, ngăn xếp gọi hàm và hiệu ứng phát sáng của Node trên cây.
2. Hệ thống phím tắt toàn cục mượt mà (Space, mũi tên, Home/End) rất tiện khi giảng bài hoặc báo cáo.
3. Cơ chế chuyển đổi linh hoạt giữa Giải thuật I (văn phạm gốc Session 5) và Giải thuật II (kết hợp trái chuẩn toán học).

### Priority Issues
- **[P1] Quá tải nhận thức do phân tán thị giác (Split-Attention Effect)**: Node đang duyệt nằm trên canvas nhưng thông tin token và luật sinh lại nằm ở sidebar cách 400px, khiến mắt phải đảo liên tục.
- **[P1] Thiếu định vị lỗi cú pháp trực tiếp**: Lỗi chỉ hiện bằng banner đỏ bên dưới mà không chỉ rõ ký tự nào trong ô nhập liệu hay trên băng ký tự bị sai.
- **[P2] Trọng số thị giác của Header quá nặng**: Header gradient đen/xanh đậm hút trọn sự chú ý thay vì làm nền cho khu vực canvas và thanh tra.
- **[P2] Rải rác Inline CSS và phân mảnh Design Tokens**: Chưa gom biến màu tập trung, gây khó khăn nếu muốn hỗ trợ Dark Mode hoàn chỉnh.

### Persona Red Flags
- **Alex (Power User / Trợ giảng)**: Không thể click vào một Node trên cây để nhảy ngay tới bước sinh ra nó; không có nút xuất cây AST sang SVG/PNG để dán vào slide báo cáo.
- **Jordan (Sinh viên mới học)**: Nhãn `Exp`, `Ter`, `Fac` làm bối rối so với ký hiệu $E, T, F$ trên lớp; khi ẩn bảng bên phải thì mất luôn bảng tra cứu ý nghĩa ký hiệu.
- **Sam (Người dùng trợ năng)**: Cây React Flow chưa có cấu trúc ARIA Tree phân cấp (`role="treeitem"`); thay đổi trạng thái phụ thuộc nhiều vào màu sắc phát sáng.

### Minor Observations & Questions to Consider
- Nút chỉnh tốc độ nên dùng nhãn hệ số trực quan hơn (`0.5x Chậm`, `1x Chuẩn`, `2x Nhanh`).
- *Câu hỏi:* Sẽ thế nào nếu sinh viên có thể click vào từng luật sinh ngữ pháp ($E \to T+E$) để thấy các node tương ứng trên cây sáng lên đồng bộ?
