# AI Critique — HW04

**Nguyễn Ngọc Đại · MSSV 23120226**

Bản đầu do AI tạo có đủ ca chạy nhưng một số assertion chưa chứng minh đúng kết quả cần quan sát. FR06-15 chỉ kiểm badge sau lần thêm đầu và dùng assertion mềm, nên script vẫn tiếp tục với P2 khi P1 có thể chưa vào giỏ. Khi yêu cầu kiểm dòng P1 trước badge, cả ba trình duyệt đều dừng vì giỏ chưa nhận P1 sau một lần bấm. Cách rà này giúp xác định đúng bước phát sinh lỗi.

FR-07 cho thấy AI dễ gộp hai yêu cầu độc lập vào cùng một chuỗi. Khi nhãn “Tổng cộng” sai, assertion cũ có thể khiến ca thao tác giỏ thất bại dù số tiền đúng. Sau khi tách assertion, FR07-13 ghi rõ số tiền đúng còn nhãn sai. Với FR14-05/06, bản đầu cho phép đọc dữ liệu sau khi hết thời gian chờ phản hồi. Bản sửa yêu cầu xác nhận form chặn hoặc đợi POST hoàn tất trước khi so danh sách. Kết quả chạy lại ghi nhận SUT trả HTTP 200 và lưu tên rỗng.

Những thiếu sót này xuất hiện vì prompt ban đầu mô tả kết quả mong đợi nhưng chưa chỉ rõ thứ tự kiểm chứng và dấu hiệu cho phép chuyển bước. Nguyên tắc rút ra là chỉ định một bằng chứng có thể quan sát cho từng yêu cầu, xác nhận điều kiện trước khi đọc kết quả và ghi điểm dừng khi một lỗi cản các bước sau. AI có thể soạn test và tổng hợp kết quả. Sinh viên cần đối chiếu SRS, kiểm lại bằng chứng thật và chịu trách nhiệm về kết luận.
