# AI Audit Report — HW04

**Nguyễn Ngọc Đại · MSSV 23120226 · Khóa 2023**  
**Kiểm chứng Phần mềm · HW04-AI · OpenAI Codex**

I use AI tools for the following tasks,

- Đọc đề và SRS, chuẩn bị môi trường, đề xuất ca và viết script Playwright cùng dữ liệu thử.
- Rà soát các assertion, thực thi trên ba trình duyệt, tổng hợp kết quả và liên kết minh chứng.
- Soạn bản nháp tài liệu, gộp lỗi đã tái hiện và xây dựng Agent Skill.

## Bảng kiểm toán đầu ra AI

Đánh giá bản đầu của từng nhóm hiện vật. Cột Prompt và đầu ra dẫn tới bản ghi nguyên văn theo từng lượt, có công cụ và giờ Việt Nam. Một nhóm được đánh dấu INCOMPLETE nếu cần sửa trước khi sử dụng.

| Hiện vật | Prompt và đầu ra AI | Đánh giá bản đầu | Căn cứ và phát hiện | Điều chỉnh và xác minh |
| --- | --- | --- | --- | --- |
| Thiết lập Playwright | [Lượt 1](prompt_log.md#1) | VALID | Khởi động được SUT và mở web mua sắm, web admin trên cả ba trình duyệt. | Khởi động và kiểm tra API trả dữ liệu mẫu. |
| Ca và dữ liệu FR-06 | [Lượt 2](prompt_log.md#2), [lượt 5](prompt_log.md#5), [lượt 15](prompt_log.md#15) | INCOMPLETE | FR-06 yêu cầu số nguyên dương. Bản đầu coi giỏ trống là đủ trong một nhánh và có lần bấm thứ hai để đi qua lỗi cú bấm đầu. | Xác nhận giá trị nhập, thử thêm một lần và kiểm P1 không vào giỏ. Giữ giới hạn diễn giải vì SUT bỏ qua lần bấm đầu. [Lượt 16](prompt_log.md#16) |
| Script FR-06 và phản hồi | [Lượt 5](prompt_log.md#5) | INCOMPLETE | FR06-15 dùng assertion mềm cho badge và có thể tiếp tục dù P1 chưa vào giỏ. FR06-03 yêu cầu alt trùng nguyên văn tên sản phẩm, vượt mức FR-24. | Kiểm dòng trong giỏ trước badge và dừng ở bước thất bại. Alt kiểm khác khoảng trắng, phần diễn đạt nội dung được rà thủ công. [Lượt 6](prompt_log.md#6), [lượt 17](prompt_log.md#17) |
| Ca, dữ liệu và script FR-07 | [Lượt 7](prompt_log.md#7), [lượt 8](prompt_log.md#8) | INCOMPLETE | Bộ chọn chuẩn bị dùng nhãn từ trang chi tiết. Kiểm chung nhãn và số tiền làm lẫn hai yêu cầu. Bộ chọn ảnh bao trùm toàn bộ nội dung chính. | Sửa nhãn bộ chọn, tách nhãn khỏi số tiền, giới hạn hình trong vùng giỏ trống. Xác minh lại ba trình duyệt. [Lượt 9](prompt_log.md#9), [lượt 17](prompt_log.md#17), [lượt 18](prompt_log.md#18) |
| Ca, dữ liệu và script FR-14 | [Lượt 10](prompt_log.md#10), [lượt 11](prompt_log.md#11), [lượt 12](prompt_log.md#12) | INCOMPLETE | Hai ca tên sai có thể tiếp tục đọc dữ liệu khi hết thời gian chờ. FR-14 bắt buộc có tên, FR-12 giới hạn vai trò truy cập. | Xác nhận form chặn hoặc chờ POST hoàn tất rồi so dữ liệu. Chạy lại 18 ca trên ba trình duyệt. [Lượt 13](prompt_log.md#13), [lượt 14](prompt_log.md#14) |
| Báo cáo HTML và tổng hợp | [Lượt 14](prompt_log.md#14), [lượt 18](prompt_log.md#18) | VALID | Chín báo cáo có MSSV, timestamp ISO và số liệu theo từng cặp tính năng và trình duyệt. | Đối chiếu HTML với bảng chính. 48 ca riêng, 144 lần thực thi, 78 đạt và 66 không đạt. [Bảng kết quả](Report.md) |
| Báo cáo lỗi và minh chứng | [Lượt 19](prompt_log.md#19), [lượt 20](prompt_log.md#20) | VALID | 22 ca không đạt lặp lại trên ba trình duyệt. Tái hiện và tách lỗi trước khỏi các bước bị cản, sau đó gộp thành 13 lỗi. | Đối chiếu ảnh chụp thật và 13 liên kết issue theo mã lỗi. [Báo cáo lỗi](Bug_Report.md) |
| Agent Skill | [Lượt 21](prompt_log.md#21) | VALID | Có hướng dẫn thiết kế, rà soát, chạy đa trình duyệt và cập nhật khi đổi SRS. | Đã kiểm cấu trúc, các đường dẫn tham chiếu và lệnh liệt kê đủ 15 ca FR-06. [Agent Skill](agent-skill/SKILL.md) · [Video demo chung](README.md#video-demo) |

## Tổng hợp đánh giá

| Phân loại | Số nhóm | Tỷ lệ |
| --- | ---: | ---: |
| VALID | 4 | 50% |
| INVALID | 0 | 0% |
| INCOMPLETE | 4 | 50% |
| **Tổng** | **8** | **100%** |

Tỷ lệ mô tả tám nhóm hiện vật trong bảng kiểm toán, khác với tỷ lệ đạt của test trên SUT.

## Kết luận kiểm toán

AI phù hợp với việc viết nháp ca, tạo script hướng dữ liệu và đối chiếu số liệu. Ba điểm cần rà sát là căn cứ SRS, thứ tự assertion và điều kiện chờ trước khi đọc trạng thái. Mỗi kết luận lỗi cần dựa trên thao tác tái hiện được và kết quả quan sát thật. Báo cáo ghi rõ khi lỗi ở bước trước cản một bước kiểm tra sau.

## Khai báo và tài liệu liên quan

Bản thiết kế ca, script, phần tổng hợp báo cáo và tài liệu hỗ trợ có sử dụng OpenAI Codex. Sinh viên đã chỉ định phạm vi, yêu cầu sửa các bước xác minh và quyết định cách tách assertion. Các báo cáo HTML và ảnh minh chứng ghi lại quá trình thực thi.

- [Nhật ký đầy đủ](prompt_log.md)
- [Bài phản biện AI](AI_Critique.md)
- [Biểu mẫu khai báo](AI_Disclosure.md)
- Đề HW04, mục 9 và 10

**Ngày xác nhận** — 18/11/2026

**Chữ ký sinh viên** — Nguyễn Ngọc Đại
