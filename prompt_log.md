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

## 5

Tool: OpenAI Codex

Thời gian: 15/11/2026 22:35:36 (UTC+07:00)

### Prompt

```text
hay commit những code hiện tại, viết 15 test FR-06 theo `Report.md`, dữ liệu JSON riêng, ít nhất 3 mẫu assertion, expected theo SRS, chạy Chromium, lưu HTML có MSSV (`Run by: `23120226) và timestamp ISO

```

### Output

```text
Mình sẽ commit phần hiện có trước, sau đó viết 15 ca FR-06 theo `Report.md` và chạy Chromium. Báo cáo HTML sẽ ghi `Run by: 23120226` cùng thời điểm chạy theo ISO 8601.


Commit khởi tạo đã xong. Chromium đã chạy qua các ca hiển thị tên, ảnh, giá và mô tả. Những ca đã báo lỗi đến giờ liên quan đến danh mục, breadcrumb và thao tác thêm vào giỏ sau một lần bấm.


Đã commit phần khởi tạo ở `f2d5364`. Sau đó mình viết [15 test FR-06](<D:/HocTap/N4K1/Testing/HW4/2026.HW04.Automation Testing_work/tests/fr-06.spec.ts>) theo SRS, với [dữ liệu JSON riêng](<D:/HocTap/N4K1/Testing/HW4/2026.HW04.Automation Testing_work/data/fr-06.json>) và hơn ba mẫu assertion. Phần test mới chưa commit.

**Chromium chạy đủ 15 ca, 6 đạt và 9 lỗi.** Các ca lỗi liên quan đến danh mục, breadcrumb, phản hồi và thao tác thêm vào giỏ, kiểm tra số lượng và badge giỏ hàng. Mình đã ghi kết quả vào `Report.md` và giữ nguyên logic SUT.

Đã mở và kiểm tra [báo cáo HTML](<D:/HocTap/N4K1/Testing/HW4/2026.HW04.Automation Testing_work/reports/fr-06/chromium/index.html>) có dòng `Run by: 23120226 | 2026-11-15T15:37:17.560Z`. Lượt này đã được ghi vào `prompt_log.md`.
```

## 6

Tool: OpenAI Codex

Thời gian: 16/11/2026 14:49:19 (UTC+07:00)

### Prompt

```text
sửa FR06-15 theo luồng chuẩn: giỏ trống, vào chi tiết P1, thêm 1 lần, xác nhận P1 vào giỏ rồi kiểm badge 1. làm tương tự với P2, xác nhận giỏ có cả hai rồi kiểm badge 2. assertion sai thì fail ngay, ko bấm thêm lần hai, ko dùng nút thêm ở trang chủ. cập nhật test case trong Report.md cho khớp script.

```

### Output

```text
Mình sẽ sửa riêng FR06-15 để kiểm tra sản phẩm đã vào giỏ trước khi kiểm badge, rồi đồng bộ ca này trong `Report.md`.


Đã sửa [FR06-15](<D:/HocTap/N4K1/Testing/HW4/2026.HW04.Automation Testing_work/tests/fr-06.spec.ts:154>) và đồng bộ ca trong [Report.md](<D:/HocTap/N4K1/Testing/HW4/2026.HW04.Automation Testing_work/Report.md:72>). Ca bắt đầu với giỏ trống, bấm thêm đúng một lần trên trang chi tiết của từng sản phẩm, xác nhận các dòng trong giỏ rồi mới kiểm badge.

Chạy riêng trên Chromium, ca dừng đúng tại assertion đầu tiên bị lỗi: **P1 chưa có trong giỏ sau một lần bấm**. Ca chưa tới bước kiểm badge 1 hay thêm P2. Lượt 6 đã được ghi vào `prompt_log.md`.
```

## 7

Tool: OpenAI Codex

Thời gian: 16/11/2026 17:04:04 (UTC+07:00)

### Prompt

```text
cập nhật report, điền kết quả và link firefox, webkit, ghi lỗi ai ở fr06-15 và cách sửa. commit, sau đó thêm ít nhất 12 ca fr-07 theo srs. chưa viết test hay commit, ghi prompt/output vào log.

```

### Output

```text
Mình sẽ kiểm tra báo cáo Firefox và WebKit hiện có, chạy các lượt còn thiếu rồi cập nhật `Report.md` và commit phần FR-06. Sau đó mình sẽ thêm các ca FR-07 theo SRS và để phần này ở bản nháp chưa commit.


Mình đã mở và xác minh các báo cáo HTML hiện có. Firefox đạt 7/15, WebKit đạt 6/15, và cả hai báo cáo đều có MSSV cùng timestamp ISO. Phần kết quả và rà soát FR06-15 đã được commit.


Đã cập nhật [Report.md](<D:/HocTap/N4K1/Testing/HW4/2026.HW04.Automation Testing_work/Report.md>) với kết quả FR-06 và liên kết HTML. Firefox chạy 15 ca, đạt 7, lỗi 8. WebKit chạy 15 ca, đạt 6, lỗi 9. Phần rà soát ghi rõ bản AI của FR06-15 chỉ kiểm badge và dùng `expect.soft`, còn bản sửa kiểm tra sản phẩm trong giỏ trước và dừng tại assertion thất bại đầu tiên. Đã commit phần này ở `a941f14`.

Sau commit, mình thêm **15 ca FR-07 theo SRS** vào mục 4.2, có dữ liệu, thao tác, kết quả mong đợi và assertion dự kiến. Phần FR-07 chưa có script và chưa commit. Lượt 7 đã được ghi nguyên văn vào `prompt_log.md`.
```

## 8

Tool: OpenAI Codex

Thời gian: 16/11/2026 18:30:04 (UTC+07:00)

### Prompt

```text
đổi fr07-06 thành fail nếu bước chuẩn bị sai. viết 15 test fr-07 theo report, data json riêng, ít nhất 3 mẫu assertion. chạy chromium trước, lưu html có mssv và timestamp iso.

```

### Output

```text
Mình sẽ đổi FR07-06 để ca thất bại ngay khi dữ liệu chuẩn bị sai, rồi viết đủ 15 ca với JSON riêng và chạy Chromium để xuất báo cáo HTML.


Lượt đầu phát hiện một lỗi trong script: bước chuẩn bị tìm nút “Thêm vào giỏ hàng”, trong khi trang chủ dùng nhãn “Thêm vào giỏ”. Mình sẽ sửa bộ chọn và chạy lại đủ 15 ca trước khi chốt số liệu.


Đã viết [15 test FR-07](<D:/HocTap/N4K1/Testing/HW4/2026.HW04.Automation Testing_work/tests/fr-07.spec.ts>) với [dữ liệu JSON riêng](<D:/HocTap/N4K1/Testing/HW4/2026.HW04.Automation Testing_work/data/fr-07.json>) và 5 mẫu assertion. FR07-06 thất bại ngay ở bước chuẩn bị vì hai lần thêm P1 tạo **2 dòng**, trong khi ca yêu cầu **1 dòng có số lượng 2**.

**Chromium chạy đủ 15 ca, 4 đạt và 11 lỗi.** Mình đã cập nhật `Report.md` và xác minh [báo cáo HTML](<D:/HocTap/N4K1/Testing/HW4/2026.HW04.Automation Testing_work/reports/fr-07/chromium/index.html>) hiển thị `Run by: 23120226 | 2026-11-16T11:34:12.398Z`.

Lượt đầu dùng sai nhãn nút thêm ở trang chủ. Mình đã sửa bộ chọn và chạy lại toàn bộ. Chưa chạy Firefox hay WebKit, chưa commit. Lượt 8 đã được ghi vào `prompt_log.md`.
```

## 9

Tool: OpenAI Codex

Thời gian: 16/11/2026 18:49:54 (UTC+07:00)

### Prompt

```text
giữ 15 ca. fr07-13 kiểm nhãn và số tiền, các ca thao tác giỏ chỉ kiểm số tiền. chạy lại 3 trình duyệt, cập nhật report và log, rồi commit riêng phần sửa. ko sửa sut.

```

### Output

```text
Mình sẽ giữ 15 ca và tách kiểm tra tổng tiền khỏi nhãn “Tổng cộng”. Sau đó mình sẽ chạy lại cả ba trình duyệt, cập nhật báo cáo và nhật ký rồi commit riêng phần sửa FR-07.


Cổng 5173 đang được EngDrill sử dụng nên Playwright chưa khởi động được EShop. Mình sẽ chạy web mua sắm EShop trên cổng 5175 qua cấu hình kiểm thử để giữ phiên EngDrill đang chạy.


Chromium và Firefox đều chạy đủ 15 ca. Báo cáo Chromium cho thấy FR07-13 vẫn thực hiện bước kiểm số tiền sau khi nhãn sai. WebKit đang chạy lượt cuối.


Giữ đủ **15 ca FR-07**. FR07-13 kiểm nhãn và số tiền bằng hai assertion riêng. Các ca thao tác giỏ chỉ kiểm giá trị khi xác minh tổng tiền. Trên cả ba trình duyệt, FR07-13 đọc đúng **58.000.000 ₫** nhưng thất bại vì SUT hiển thị nhãn “Tổng tạm tính”.

Mỗi trình duyệt chạy đủ 15 ca, **4 đạt và 11 không đạt**. Cả ba báo cáo HTML đã được xác minh có MSSV và timestamp ISO. [Chromium](<D:/HocTap/N4K1/Testing/HW4/2026.HW04.Automation Testing_work/reports/fr-07/chromium/index.html>) · [Firefox](<D:/HocTap/N4K1/Testing/HW4/2026.HW04.Automation Testing_work/reports/fr-07/firefox/index.html>) · [WebKit](<D:/HocTap/N4K1/Testing/HW4/2026.HW04.Automation Testing_work/reports/fr-07/webkit/index.html>)

Đã cập nhật `Report.md` và `prompt_log.md`, rồi commit riêng với thông điệp `Separate FR-07 total assertions and refresh browser reports`. Lượt chạy dùng cổng 5175 vì EngDrill đang dùng 5173. Không sửa mã SUT.
```
