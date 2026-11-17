---
name: agent-skill
description: Thiết kế, tạo, rà soát và bảo trì kiểm thử web hướng dữ liệu bằng Playwright từ SRS. Dùng khi cần liên kết ca kiểm thử với yêu cầu, chạy trên Chromium, Firefox và WebKit, hoặc tạo báo cáo HTML có mã sinh viên và thời điểm chạy.
---

# Kiểm thử web hướng dữ liệu từ SRS với Playwright

Dùng quy trình này cho một tính năng web mới hoặc khi bảo trì bộ ca hiện có. Xác định phiên bản SRS, tính năng, đường dẫn SUT, môi trường chạy và mã sinh viên từ thông tin được giao. Nếu workspace đã có cấu hình Playwright và quy ước đặt tên, dùng chúng. Giữ nguyên logic SUT trong quá trình kiểm thử. Các ngưỡng 12 ca, 3 dạng assertion và 3 báo cáo cho mỗi tính năng dưới đây áp dụng cho HW04.

## 1. Đọc SRS và lập ca

1. Đọc yêu cầu tính năng và các yêu cầu liên quan về giao diện, quyền truy cập, phản hồi hoặc dữ liệu. Ghi phiên bản hoặc mốc SRS. Đọc đặc tả API nếu luồng phụ thuộc vào API và xác định rõ căn cứ của từng bước.
2. Đối chiếu với giao diện, mã SUT và dữ liệu mẫu để xác định cách tái hiện. Lấy expected từ SRS hoặc hợp đồng đã được xác nhận. Ghi chỗ đặc tả chưa rõ và giả định được dùng. Giữ khác biệt của SUT để kiểm chứng khi chạy test.
3. Lập bảng gồm ID, căn cứ SRS, điều kiện trước, dữ liệu, thao tác, expected và assertion dự kiến. Bao phủ luồng chuẩn, dữ liệu sai, giá trị biên và quyền truy cập nếu có. Với HW04, lập ít nhất 12 ca cho mỗi tính năng. Hướng dẫn AI theo các lượt có mục tiêu rõ, từ phân tích yêu cầu, lập ca, viết script đến rà từng assertion.

## 2. Tách dữ liệu và viết test

1. Lưu dữ liệu trong JSON hoặc CSV riêng, chẳng hạn `data/fr-xx.json`. Đưa đầu vào, dữ liệu mẫu và giá trị kỳ vọng có thể tái sử dụng vào tệp. Giữ nguyên ý nghĩa của chuỗi rỗng, khoảng trắng và kiểu số. Với CSV, đọc bằng trình phân tích CSV và xác nhận cột bắt buộc. Dùng tài khoản thử và lấy thông tin bí mật thật từ môi trường.
2. Liên kết từng dòng dữ liệu với mã ca trong tiêu đề test. Dùng Playwright context mới cho mỗi ca. Xác nhận điều kiện chuẩn bị trước thao tác chính. Tạo dữ liệu riêng cho ca có thao tác ghi, theo dõi ID và dọn dữ liệu do ca tạo. Chạy tuần tự những ca cùng ghi hoặc so sánh toàn bộ dữ liệu trên một SUT dùng chung.
3. Chọn locator theo role, accessible name, label hoặc dấu hiệu ổn định trong đúng vùng giao diện. Dùng assertion tự chờ như `toBeVisible`, `toHaveText`, `toHaveCount`, `toHaveValue` hoặc `toHaveURL`. Chọn ít nhất ba dạng phù hợp với SRS. Đăng ký theo dõi phản hồi mạng trước khi kích hoạt thao tác. Với ca bị từ chối, so dữ liệu trước và sau khi đã xác nhận thao tác bị chặn hoặc request đã hoàn tất.

## 3. Rà soát test theo từng nhóm lỗi

- So khớp từng assertion với yêu cầu. Giữ mức độ cụ thể mà SRS quy định. Kiểm xem locator có thể khớp nhầm phần tử, assertion vắng mặt có chạy trước khi dữ liệu tải xong, hoặc nhánh thoát sớm có bỏ qua kết quả chính hay không.
- Xác nhận test dùng đúng thao tác và trạng thái ban đầu. Giữ số lần bấm theo ca. Nếu lỗi ở bước chuẩn bị cản thao tác chính, ghi rõ điểm dừng trong báo cáo để phân biệt với lỗi cần kiểm.
- Với ca có nhiều kết quả, dùng assertion riêng cho từng kết quả cần quan sát. Ghi trong audit lỗi của bản AI, nguyên nhân, thay đổi và kết quả kiểm lại. Lưu prompt và output theo quy định bài làm.

| Ví dụ | Cách áp dụng |
| --- | --- |
| FR-06 · Chi tiết sản phẩm | Dùng dữ liệu sản phẩm và số lượng biên từ [JSON FR-06](../data/fr-06.json). FR06-03 kiểm alt có ký tự khác khoảng trắng theo FR-24. Đối chiếu nội dung alt với ảnh khi rà thủ công. FR06-11 đến FR06-14 thử thêm đúng một lần với dữ liệu sai. Khi SUT bỏ qua lần bấm đầu, ghi giới hạn của kết quả đạt ở mức giỏ giữ nguyên sau lần bấm đó. |
| FR-07 · Giỏ hàng | Dùng tên, đơn giá và tổng dự kiến từ [JSON FR-07](../data/fr-07.json). Giới hạn kiểm hình minh họa trong vùng giỏ trống. Kiểm nhãn “Tổng cộng” ở ca nhãn, kiểm số tiền ở các ca thao tác. Nếu hai lần thêm P1 tạo hai dòng, ca giảm số lượng thất bại ở bước chuẩn bị và chưa kiểm được nút giảm. |
| FR-14 · Quản lý danh mục | Dùng [JSON FR-14](../data/fr-14.json) và danh mục thử riêng. Với thêm tên rỗng, xác nhận form chặn hoặc chờ POST hoàn tất rồi so dữ liệu. Với quyền truy cập, kiểm cả phản hồi API và dữ liệu có thay đổi hay không. Luồng sửa của EShop dùng hợp đồng PUT và xác minh trên bảng web admin. |

## 4. Chạy đa trình duyệt và lưu minh chứng

1. Cài thư viện của dự án và Chromium, Firefox, WebKit theo cấu hình hiện có. Kiểm tra đúng SUT và đúng dữ liệu trước khi chạy. Cấu hình ba project Playwright riêng và một thư mục HTML riêng cho mỗi cặp tính năng và trình duyệt trong mỗi đợt.
2. Đặt tiêu đề trình báo cáo HTML theo mẫu `Run by: ${studentId} | ${new Date().toISOString()}`, trong đó `studentId` là MSSV được giao. Để Playwright sinh timestamp khi bắt đầu lượt chạy. Nếu workspace đã cấu hình tiêu đề, kiểm tra giá trị trước khi dùng lại. [Cấu hình HW04](../playwright.config.ts)
3. Chạy từng project và giữ lại toàn bộ thư mục HTML, gồm tệp đính kèm. Tiếp tục các trình duyệt còn lại khi assertion thất bại. Khi trình chạy không thực thi ca do môi trường, xử lý lỗi môi trường và chạy lại trước khi cập nhật bảng điểm. Mở từng `index.html` để kiểm MSSV, timestamp ISO, project và số ca chạy, đạt, lỗi.
4. Cập nhật bảng mỗi lượt một dòng và liên kết HTML. Gộp ca không đạt theo lỗi SUT đã xác nhận. Ghi ca bị chặn ở bước nào. Chụp minh chứng thật khi tái hiện và dẫn đến issue tương ứng nếu có.

Lệnh PowerShell chạy một tính năng trong workspace HW04. Đổi `$feature` cho tính năng khác có cùng quy ước tên tệp. Với SUT dùng chung cơ sở dữ liệu cục bộ, chờ lượt trước kết thúc rồi mới chạy lượt sau.

```powershell
$feature = 'fr-06'
$runFolder = Get-Date -Format 'yyyyMMdd-HHmmss'
foreach ($project in 'chromium', 'firefox', 'webkit') {
    $env:PLAYWRIGHT_HTML_OUTPUT_DIR = "reports/$feature/$runFolder/$project"
    node node_modules/playwright/cli.js test "tests/$feature.spec.ts" "--project=$project" --workers=1
    Write-Output "$project Playwright exit code $LASTEXITCODE"
}
```

## 5. Cập nhật khi SRS thay đổi

1. Đối chiếu hai phiên bản SRS theo mã yêu cầu và đánh dấu ca bị tác động. Giữ ID của ca còn cùng mục đích. Ghi liên hệ đến ca thay thế nếu thay đổi mục tiêu hoặc bỏ ca.
2. Cập nhật bảng ca và expected trước, sau đó sửa JSON hoặc CSV, script và assertion. Đi theo quan hệ phụ thuộc để phát hiện tính năng dùng chung luồng, fixture hoặc bước chuẩn bị. Ghi căn cứ phiên bản và lý do đổi trong phần rà soát.
3. Chạy tập ca ảnh hưởng để rà nhanh rồi chạy lại trọn tính năng trên cả ba trình duyệt. Lưu kết quả vào thư mục mới và đổi liên kết trong bảng chính đến phiên bản hiện hành. Giữ báo cáo cũ làm lịch sử.

## 6. Demo từ đầu đến cuối với FR-06

1. Mở tệp skill trong Codex và yêu cầu áp dụng cho FR-06. Một prompt mẫu là “Dùng `agent-skill/SKILL.md` cho FR-06. Đọc SRS và giao diện, đề xuất bảng ca và JSON trước. Khi bảng đã được rà, chuyển từng nhóm ca thành test Playwright, rồi chạy cả ba trình duyệt.” Khi dùng tính năng đã có script, thực hiện phần tạo và minh họa chỉnh sửa trong bản sao làm việc.
2. Quay quá trình đối chiếu SRS, rà bảng ca, giải thích dữ liệu JSON và assertion. Trình bày một chỉnh sửa cụ thể, ví dụ FR06-03 chuyển từ đối chiếu nguyên văn tên sản phẩm sang kiểm alt không rỗng, sau khi đối chiếu FR-24.
3. Chạy đủ bộ FR-06 trên ba trình duyệt bằng lệnh trên. Mở cả ba HTML, chỉ MSSV, timestamp ISO và kết quả thật. Giải thích một ca đạt, một ca không đạt và đối chiếu bảng kết quả. Chỉ rõ cách cập nhật một ca nếu yêu cầu liên quan đổi.
4. Dùng giọng thuyết minh của chính sinh viên để quay demo. Nếu dùng chung video cho Nhiệm vụ 2, bảo đảm ít nhất 5 phút, thuyết minh tiếng Việt và quay khuôn mặt hoặc hiển thị `whoami` cùng `hostname`. Đăng YouTube Unlisted, thử mở liên kết và ghi vào phần Agent Skill trong báo cáo.
