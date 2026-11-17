# HW04-AI — Kiểm thử tự động EShop

**Nguyễn Ngọc Đại · MSSV 23120226 · Khóa 2023**

## Tóm tắt kiểm thử

| Chỉ số | Kết quả |
| --- | ---: |
| Tính năng đã kiểm thử | 3 |
| Ca kiểm thử riêng đã tự động hóa và đã chạy | 48 |
| Lượt chạy theo cặp tính năng và trình duyệt | 9 |
| Lần thực thi ca trên cả ba trình duyệt | 144 |
| Đạt (Pass) | 78 |
| Không đạt (Fail) | 66 |
| Lỗi SUT đã xác nhận sau khi gộp | 13 |

| Tính năng | Ca mỗi trình duyệt | Lượt chạy | Lần thực thi | Đạt | Không đạt |
| --- | ---: | ---: | ---: | ---: | ---: |
| FR-06 Chi tiết sản phẩm | 15 | 3 | 45 | 30 | 15 |
| FR-07 Giỏ hàng | 15 | 3 | 45 | 12 | 33 |
| FR-14 Quản lý danh mục trên web admin | 18 | 3 | 54 | 36 | 18 |
| **Tổng** | **48** | **9** | **144** | **78** | **66** |

Một ca chạy lần lượt trên Chromium, Firefox và WebKit được tính là ba lần thực thi. Số lỗi SUT đếm các lỗi đã tái hiện sau khi gộp các ca có cùng nguyên nhân.

## Hồ sơ bài làm

| Tài liệu | Nội dung |
| --- | --- |
| [Kho GitHub](https://github.com/nndai/HW04_AI_Automation) | Mã nguồn kiểm thử, dữ liệu JSON và báo cáo HTML |
| [Báo cáo chính](Report.md) | Phạm vi, ca kiểm thử, cách rà script và liên kết chín báo cáo HTML ở mục 5 |
| [Báo cáo lỗi](Bug_Report.md) | 13 lỗi đã xác nhận cùng ảnh minh chứng và GitHub Issues |
| [Agent Skill](agent-skill/SKILL.md) | Quy trình tái sử dụng để tạo, rà soát, chạy và cập nhật test |
| [AI Audit Report](AI_Audit_Report.md) | Kiểm toán đầu ra AI và căn cứ đánh giá |
| [AI Critique](AI_Critique.md) | Bản phản biện về thiếu sót và cách cộng tác với AI |
| [Khai báo sử dụng AI](AI_Disclosure.md) | Công cụ, giai đoạn hỗ trợ và cách xác minh |
| [Bảng kiểm riêng tư](AI_Privacy_Checklist.md) | Dữ liệu thử, minh chứng và các mục cần xác nhận trước khi nộp |
| [Nhật ký prompt](prompt_log.md) | Prompt và output nguyên văn, công cụ, thời điểm theo giờ Việt Nam |

## Video minh họa

| Video | Liên kết YouTube Unlisted |
| --- | --- |
| Nhiệm vụ 2 — Thực thi kiểm thử tự động | |
| Demo Agent Skill từ đầu đến cuối | |

## Tự đánh giá

| STT | Tiêu chí | Điểm tối đa | Điểm tự chấm |
| --- | --- | ---: | ---: |
| 1 | Nhiệm vụ 1 — Tính năng A: FR-06 | 25 | |
| 1 | Nhiệm vụ 1 — Tính năng B: FR-07 | 25 | |
| 1 | Nhiệm vụ 1 — Tính năng C: FR-14 | 25 | |
| 2 | Nhiệm vụ 2 — Video minh họa | 15 | |
| 3 | Agent Skill | 10 | |
| | **Tổng** | **100** | |
