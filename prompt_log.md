# Prompt log

## 1

Tool: OpenAI Codex

Thời gian: 15/11/2026 20:20:05 (UTC+07:00)

### Prompt

```text
đọc đề HW04, các AI Templates liên quan. dùng folder work hiện có, setup Git và Playwright với Chromium, Firefox, WebKit. phạm vi làm bài là FR-06 chi tiết sản phẩm, FR-07 giỏ hàng và FR-14 quản lý danh mục trên web admin. dùng SUT hiện có, ko sửa logic SUT.

tạo `prompt_log.md` ở gốc work theo format HW3, đánh số từng lượt, ghi tool, thời gian gửi prompt theo giờ Việt Nam, `### Prompt` và `### Output` nguyên văn trong code block `text`. ghi từ prompt này, ko cần ID hay session, git commit log để cuối bài xuất.

bước này chỉ setup và kiểm tra môi trường chạy được, báo ngắn gọn đã làm gì và còn thiếu gì. chưa viết test, chưa commit, pdf để cuối bài mới tạo.

```

### Output

```text
Mình sẽ đọc đề HW04 và các AI Template liên quan, rồi kiểm tra Git, Playwright và SUT trong thư mục `work` hiện có.


Mình đã tìm được mẫu `prompt_log.md` trong bản nộp HW3 và đã cài thư viện cho backend, web mua sắm và web admin. Playwright đang tải ba trình duyệt để mình kiểm tra chúng có mở được hai giao diện của SUT hay không.


Playwright đã khởi động được backend và hai web của EShop từ cấu hình trong `work`. Chromium đã cài xong. Firefox và WebKit cần tải xong trước khi mình kiểm tra mở trang trên cả ba trình duyệt.


- Đã đọc đề HW04 và các AI Templates, chốt phạm vi **FR-06 Chi tiết sản phẩm, FR-07 Giỏ hàng và FR-14 Quản lý danh mục trên web admin**.
- Đã khởi tạo Git cục bộ trên nhánh `main` và cài Playwright 1.65.1. **Chromium, Firefox và WebKit** đều mở được trang chi tiết sản phẩm, giỏ hàng và màn hình đăng nhập admin. API trả HTTP 200 với 5 sản phẩm mẫu. SUT tự nạp lại dữ liệu khi khởi động, nên mình đã khôi phục tệp SQLite sau khi kiểm tra.
- Đã ghi lượt 1 theo mẫu HW3, nguyên văn và theo giờ Việt Nam. [prompt_log.md](<D:/HocTap/N4K1/Testing/HW4/2026.HW04.Automation Testing_work/prompt_log.md>)

**Còn lại cho các bước sau** gồm kết nối GitHub, viết test, tạo commit và báo cáo. PDF và Git commit log sẽ xuất cuối bài.
```

## 2

Tool: OpenAI Codex

Thời gian: 15/11/2026 21:39:32 (UTC+07:00)

### Prompt

```text
commit, đọc SRS của FR-06 và các yêu cầu liên quan, đối chiếu giao diện và code SUT hiện tại. lập ít nhất 12 ca kiểm thử để tự động hóa bằng Playwright. mỗi ca ghi ID, dữ liệu, thao tác, kết quả mong đợi, căn cứ SRS và assertion dự kiến. bước này chỉ lập danh sách ca FR-06, chưa viết script, ko sửa SUT, chưa commit. và từ lần này, ghi lại log cho mỗi prompt của tôi

```

### Output

```text
Mình sẽ đối chiếu FR-06 với giao diện và mã SUT, rồi lập danh sách ca kiểm thử và ghi lượt này vào `prompt_log.md`. Mình giữ bước này ở phần thiết kế ca, theo yêu cầu cuối prompt là chưa commit.


Đã lập **15 ca kiểm thử FR-06**. Mỗi ca có ID, dữ liệu, thao tác, kết quả mong đợi, căn cứ SRS và assertion Playwright dự kiến. [Danh sách ca kiểm thử](<D:/HocTap/N4K1/Testing/HW4/2026.HW04.Automation Testing_work/FR-06_Test_Cases.md>)

Đối chiếu Chromium và mã SUT cho thấy trang chi tiết thiếu danh mục và breadcrumb, lần bấm thêm đầu tiên bị bỏ qua, và đường xử lý khi thêm dùng `parseInt` mà chưa kiểm tra số lượng hợp lệ.

Đã ghi nguyên văn lượt 2 theo giờ Việt Nam. Bước này dừng ở thiết kế ca kiểm thử, chưa viết script, sửa SUT hay commit. [prompt_log.md](<D:/HocTap/N4K1/Testing/HW4/2026.HW04.Automation Testing_work/prompt_log.md>)
```

## 3

Tool: OpenAI Codex

Thời gian: 15/11/2026 22:18:20 (UTC+07:00)

### Prompt

```text
dựa vào yêu cầu file báo cáo, tạo một file md chưa các mục cần thiết, các mục chưa làm để trống, đựa nội dung của FR06 vào report chung, ko tạo file md riêng

```

### Output

```text
Mình sẽ tạo báo cáo Markdown chung theo đề HW04, chuyển phần FR-06 vào báo cáo và để trống các mục chưa làm.


Đã tạo [Báo cáo chính HW04](<D:/HocTap/N4K1/Testing/HW4/2026.HW04.Automation Testing_work/Bao-Cao-Chinh.md>) và đưa toàn bộ phần đối chiếu SRS, dữ liệu và **15 ca kiểm thử FR-06** vào mục 4.1. Tệp FR-06 riêng đã được gộp vào báo cáo.

Các mục chưa thực hiện đã có tiêu đề và để trống. Lượt này đã được ghi nguyên văn vào [prompt_log.md](<D:/HocTap/N4K1/Testing/HW4/2026.HW04.Automation Testing_work/prompt_log.md>).
```

## 4

Tool: OpenAI Codex

Thời gian: 15/11/2026 22:31:54 (UTC+07:00)

### Prompt

```text
mục phạm vi ghi fr06, fr07 và fr14 lấy từ hw2, expected lấy từ srs. giữ bảng 15 ca fr06 trong báo cáo. mỗi tính năng có mục ghi cách hướng dẫn AI theo từng bước, dữ liệu, assertion, mục kết quả tạo bảng mỗi lượt chạy một dòng, có tính năng, trình duyệt, số ca chạy, đạt, lỗi, link HTML. ghi yêu cầu từng báo cáo HTML có `Run by: {StudentID}` và timestamp ISO. bỏ phụ lục AI và link `prompt_log.md`, bỏ mục kết luận nếu chỉ lặp số liệu.

```

### Output

```text
Mình sẽ cập nhật phạm vi, thêm mục hướng dẫn AI theo từng bước cho cả ba tính năng và tạo bảng kết quả chạy. Mình sẽ giữ nguyên bảng 15 ca FR-06.


Đã cập nhật [Report.md](<D:/HocTap/N4K1/Testing/HW4/2026.HW04.Automation Testing_work/Report.md>). Phạm vi ghi rõ FR-06, FR-07 và FR-14 lấy từ HW02, còn kết quả mong đợi lấy từ SRS. Bảng 15 ca FR-06 được giữ nguyên.

Mỗi tính năng có mục riêng về cách hướng dẫn AI theo từng bước, dữ liệu và assertion. Bảng kết quả có 9 dòng dự kiến cho ba tính năng trên ba trình duyệt, để trống số liệu và liên kết HTML. Báo cáo ghi rõ mỗi HTML phải có `Run by: {StudentID}` và timestamp ISO 8601.

Đã bỏ mục kết luận, phụ lục AI và liên kết nhật ký khỏi báo cáo. Lượt 4 đã được ghi vào `prompt_log.md`.
```
