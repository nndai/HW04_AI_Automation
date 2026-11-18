# Biểu mẫu khai báo sử dụng AI — HW04

**Khoa Công nghệ Thông tin · Trường Đại học Khoa học Tự nhiên, ĐHQG-HCM**

| Mục | Giá trị |
| --- | --- |
| Họ và tên | Nguyễn Ngọc Đại |
| MSSV | 23120226 |
| Khóa | 2023 |
| Môn học | Kiểm chứng Phần mềm |
| Bài tập | HW04-AI — Kiểm thử tự động EShop |
| Bloom-AI theo đề | G9.2 Áp dụng, G9.3 Phân tích, G9.4 Cộng tác |
| Công cụ AI | OpenAI Codex |
| Ngày ký | 18/11/2026 |

## Giai đoạn có AI hỗ trợ

- Đọc SRS và đối chiếu SUT, lập kế hoạch ca, soạn script Playwright và dữ liệu JSON.
- Rà soát assertion và bộ chọn, chạy thử và ba trình duyệt, kiểm liên kết và tổng hợp kết quả.
- Biên tập Markdown, soạn Agent Skill, trình bày ảnh chụp khi tái hiện và liên kết GitHub Issues đã có.

## Prompt tiêu biểu

```text
giữ 15 ca. fr07-13 kiểm nhãn và số tiền, các ca thao tác giỏ chỉ kiểm số tiền. chạy lại 3 trình duyệt, cập nhật report và log, rồi commit riêng phần sửa. ko sửa sut.
```

```text
commit, sau đó sửa fr14-05/06: xác nhận form chặn hoặc chờ post xong rồi mới so dữ liệu, chạy test, cập nhật report, ghi lỗi ai và cách sửa
```

[Prompt, output và timestamp của các lượt tương tác](prompt_log.md)

## Đóng góp của AI và phần rà soát

Codex viết bản đầu cho các ca và script, hỗ trợ chạy Playwright, đối chiếu kết quả và soạn các báo cáo Markdown. Sinh viên chọn phạm vi từ HW02, chỉ định các bước cần kiểm lại và yêu cầu sửa FR06-15, tách kiểm nhãn và giá trị trong FR-07, đồng bộ phản hồi POST trước khi so dữ liệu trong FR-14. Các HTML và ảnh minh chứng được tạo từ lượt chạy và tái hiện thực tế.

Codex tổng hợp 13 lỗi từ kết quả chạy và thao tác tái hiện, đồng thời đối chiếu các liên kết GitHub Issues theo mã lỗi.

Đầu ra được kiểm bằng SRS, giao diện và mã nguồn SUT, các lượt chạy trên Chromium, Firefox, WebKit và kết quả hiển thị trong chín báo cáo HTML. Báo cáo ghi rõ các ca không đạt và ca bị cản ở bước trước. [Chi tiết kiểm toán](AI_Audit_Report.md)

## Cam đoan trung thực

Tôi xác nhận phần khai báo mô tả phạm vi sử dụng AI trong HW04 và tôi chịu trách nhiệm về bài nộp.

**Chữ ký sinh viên** — Nguyễn Ngọc Đại
