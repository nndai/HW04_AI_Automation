# Báo cáo HW04 — Kiểm thử tự động EShop

## 1. Thông tin sinh viên

- Họ và tên
- MSSV
- Lớp
- Ngày nộp

## 2. Phạm vi kiểm thử

| Nhóm | Yêu cầu | Tính năng | Giao diện |
| --- | --- | --- | --- |
| A | FR-06 | Chi tiết sản phẩm | Web mua sắm |
| B | FR-07 | Giỏ hàng | Web mua sắm |
| C | FR-14 | Quản lý danh mục | Web admin |

Ba tính năng FR-06, FR-07 và FR-14 được lấy từ phạm vi đã chọn trong HW02. Kết quả mong đợi của từng ca kiểm thử được xác định theo SRS EShop.

## 3. Môi trường và cách chạy

### Thiết lập đã xác minh

- SUT EShop hiện có gồm API tại cổng 3000, web mua sắm tại cổng 5173 và web admin tại cổng 5174. Backend tự nạp lại dữ liệu mẫu khi khởi động.
- Dùng Node.js 24.11.0 và Playwright 1.65.1. Cấu hình gồm ba trình duyệt Chromium, Firefox, WebKit và trình báo cáo HTML của Playwright. [Cấu hình Playwright](playwright.config.ts)
- Kiểm tra môi trường đã mở được trang chi tiết, giỏ hàng và màn hình đăng nhập admin trên cả ba trình duyệt. API sản phẩm trả HTTP 200 cùng 5 sản phẩm mẫu.
- Mã nguồn bài làm được quản lý bằng Git cục bộ trên nhánh `main`.

### Hướng dẫn chạy bộ kiểm thử và xuất báo cáo HTML

### Kho GitHub công khai và nhật ký commit

## 4. Nhiệm vụ 1 — Thiết kế, tự động hóa và rà soát script

### 4.1 FR-06 — Chi tiết sản phẩm

#### Căn cứ và đối chiếu SUT

- [SRS EShop](../eshop-sut/README.md) quy định nội dung chi tiết, số lượng nguyên dương tối thiểu 1 và phản hồi khi thêm vào giỏ (FR-06). FR-21 quy định định dạng giá và tiêu đề, FR-23 quy định breadcrumb và badge, FR-24 quy định phản hồi và văn bản thay thế của ảnh.
- Chromium ở `/product/1` hiển thị tên, giá, mô tả và ô số lượng mặc định 1. Màn hình thiếu danh mục và breadcrumb. Sau một lần bấm thêm, nhãn nút và liên kết giỏ hàng vẫn giữ nguyên.
- [ProductDetail.jsx](../eshop-sut/frontend-web/src/pages/ProductDetail.jsx) bỏ qua lần bấm đầu, gọi `parseInt` ở lần bấm tiếp theo và đổi nhãn nút trong hai giây. Ô số lượng thiếu `min`, bước mặc định của HTML là 1 và thao tác thêm qua nút không tự kích hoạt xác thực form. [CartContext.jsx](../eshop-sut/frontend-web/src/context/CartContext.jsx) đưa số lượng nhận được vào giỏ trực tiếp. [App.jsx](../eshop-sut/frontend-web/src/App.jsx) chỉ hiển thị liên kết giỏ hàng dạng chữ.
- [Dữ liệu seed](../eshop-sut/backend/database.js) cung cấp sản phẩm và danh mục. [API chi tiết](../eshop-sut/backend/server.js) trả giá kiểu số cho ID lẻ và kiểu chuỗi cho ID chẵn, nên có hai ca kiểm tra cùng chuẩn hiển thị.

#### Dữ liệu và điều kiện chung

Mỗi ca mở một browser context mới, bắt đầu với khách chưa đăng nhập và giỏ trống. Dùng desktop viewport, locale `vi-VN` và dữ liệu seed của SUT. Khi viết script, đưa dữ liệu và giá trị mong đợi vào JSON riêng. Dùng giá trị từ SRS và bản seed đã đối chiếu làm chuẩn so sánh.

| Mã dữ liệu | Đường dẫn | Tên | Giá hiển thị | Mô tả | Danh mục | Ảnh seed |
| --- | --- | --- | --- | --- | --- | --- |
| P1 | `/product/1` | iPhone 15 Pro Max | 30.000.000 ₫ | Điện thoại cao cấp của Apple | Điện thoại | `https://placehold.co/300x300/png?text=iPhone+15` |
| P2 | `/product/2` | Samsung Galaxy S24 Ultra | 28.000.000 ₫ | Màn hình hiển thị xuất sắc, camera siêu zoom | Điện thoại | `https://placehold.co/300x300/png?text=Samsung+S24` |
| P3 | `/product/3` | MacBook Pro M3 | 45.000.000 ₫ | Laptop chuyên nghiệp mạnh mẽ | Laptop | `https://placehold.co/300x300/png?text=Macbook+Pro` |

#### Ca kiểm thử dự kiến

| ID | Dữ liệu | Thao tác | Kết quả mong đợi | Căn cứ SRS | Assertion Playwright dự kiến |
| --- | --- | --- | --- | --- | --- |
| FR06-01 | P1, mở từ trang chủ | Mở trang chủ và chọn liên kết `Xem chi tiết` trong thẻ sản phẩm P1. | Mở đúng trang và có đúng một tiêu đề H1 mang tên P1. | FR-06 tên, FR-21 tiêu đề | `toHaveURL` đúng đường dẫn, `toHaveCount(1)` trên H1, `toHaveText` tên P1. |
| FR06-02 | P1, ảnh seed | Mở chi tiết ở viewport desktop, tìm ảnh sản phẩm trong nội dung chính. | Ảnh đúng sản phẩm hiển thị ở vùng ảnh chi tiết và có dữ liệu ảnh tải được. | FR-06 ảnh lớn | `toBeVisible`, `toHaveAttribute('src', expectedImage)`, `expect.poll` kiểm tra `naturalWidth > 0`. Quan sát vùng ảnh chính ở desktop, không áp ngưỡng pixel vì SRS không định lượng. |
| FR06-03 | P2, tên sản phẩm | Mở chi tiết P2 và kiểm tra tên truy cập của ảnh. | Alt mô tả đúng sản phẩm. | FR-24 văn bản alt | `toHaveAttribute('alt', expectedName)` trên ảnh sản phẩm. |
| FR06-04 | P1, giá kiểu số | Mở chi tiết P1 và đọc giá. | Hiển thị đúng `30.000.000 ₫`. | FR-06 giá, FR-21 định dạng tiền | `toBeVisible` trên văn bản giá khớp chính xác trong `main`. |
| FR06-05 | P2, API trả giá kiểu chuỗi | Mở chi tiết P2 và đọc giá. | Hiển thị đúng `28.000.000 ₫`. | FR-06 giá, FR-21 định dạng tiền | `toBeVisible` trên văn bản giá khớp chính xác trong `main`. |
| FR06-06 | P2, mô tả từ seed | Mở chi tiết P2 và đọc mô tả. | Hiển thị đúng mô tả của P2. | FR-06 mô tả | `toBeVisible` trên mô tả khớp chính xác trong `main`. |
| FR06-07 | P3, danh mục Laptop | Mở chi tiết P3 và đọc danh mục. | Danh mục `Laptop` được hiển thị rõ trong thông tin sản phẩm. | FR-06 danh mục | `toBeVisible` trên mục danh mục chứa giá trị `Laptop` trong `main`, đối chiếu đúng trường và tránh khớp với từ Laptop trong mô tả. |
| FR06-08 | P1, breadcrumb Trang chủ → tên P1 | Mở chi tiết P1, tìm đường dẫn phân cấp và chọn mục trang chủ trong đường dẫn đó. | Breadcrumb cho biết trang hiện tại và điều hướng về trang chủ. | FR-23 breadcrumb | `toBeVisible` cho breadcrumb và tên hiện tại, `toHaveURL` về trang chủ sau khi chọn liên kết trong breadcrumb. |
| FR06-09 | P1, số lượng 1 | Nhập 1 và bấm thêm một lần. Kiểm tra phản hồi tại trang chi tiết. | Một lần bấm hiển thị toast xác nhận hoặc badge giỏ hàng được cập nhật. | FR-06, FR-24 phản hồi | `toHaveValue('1')` trước khi bấm. Dùng `expect.poll` kiểm tra toast xác nhận hoặc badge hiển thị số 1 trong khoảng chờ UI. |
| FR06-10 | P1, số lượng 2 | Nhập 2, bấm thêm một lần rồi đi tới giỏ bằng liên kết trong header. | Giỏ nhận đúng P1 với số lượng 2. | FR-06 số nguyên dương và thao tác thêm | `toHaveValue('2')` trước khi bấm, `toBeVisible` trên dòng P1 và `toHaveText` giá trị 2 tại ô số lượng của dòng đó. |
| FR06-11 | P1, số lượng 0 | Nhập 0. Nếu ô chặn hoặc tự sửa, quan sát giá trị. Nếu ô giữ 0, thử bấm thêm và kiểm tra giỏ. | 0 bị chặn hoặc được sửa thành số nguyên hợp lệ trước khi thêm. Nếu giá trị vẫn là 0, giỏ giữ trống. | FR-06 tối thiểu 1 | `toHaveValue` khớp số nguyên dương khi tự sửa, hoặc `toHaveCount(0)` đối với dòng P1 trong giỏ khi giá trị vẫn là 0. |
| FR06-12 | P1, số lượng −1 (nhập `-1`) | Nhập −1, kiểm tra giá trị rồi thử thêm nếu ô vẫn giữ −1. | Số âm bị chặn hoặc được sửa rõ ngay ở ô. Nếu ô vẫn giữ −1, giỏ giữ trống. | FR-06 số nguyên dương | `toHaveValue` khớp số nguyên dương khi tự sửa, hoặc `toHaveCount(0)` đối với dòng P1 trong giỏ. |
| FR06-13 | P1, số lượng 1,5 (nhập `1.5`) | Nhập 1.5, kiểm tra giá trị rồi thử thêm nếu ô vẫn giữ phân số. | Phân số bị chặn hoặc được sửa rõ ngay ở ô. Nếu ô vẫn hiển thị 1.5, giỏ giữ trống. | FR-06 chỉ nhận số nguyên | `toHaveValue` khớp số nguyên dương khi tự sửa, hoặc `toHaveCount(0)` đối với dòng P1, kể cả khi SUT định thêm 1 do cắt phần thập phân. |
| FR06-14 | P1, số lượng rỗng | Xóa giá trị. Thử bấm thêm nếu ô vẫn rỗng và thao tác khả dụng. | Ô được khôi phục về số nguyên dương trước khi có thể thêm, hoặc thao tác thêm bị chặn khi ô rỗng. | FR-06 số nguyên dương tối thiểu 1 | `toHaveValue` khớp số nguyên dương khi tự khôi phục, hoặc `toBeDisabled` trên nút hoặc `toHaveCount(0)` trên dòng P1 trong giỏ khi ô rỗng. |
| FR06-15 | Giỏ trống, P1 và P2, số lượng 1 cho mỗi sản phẩm | Xác nhận giỏ trống. Mở chi tiết P1 qua liên kết Xem chi tiết, nhập 1 và bấm thêm đúng một lần. Mở giỏ, xác nhận P1 rồi kiểm tra badge 1. Quay về trang chủ qua điều hướng nội bộ, mở chi tiết P2, nhập 1 và bấm thêm đúng một lần. Mở giỏ, xác nhận có cả P1 và P2 rồi kiểm tra badge 2. Dừng ca ngay khi một assertion thất bại. | Sau lần thêm P1, giỏ có P1 số lượng 1 và badge hiển thị 1. Sau lần thêm P2, giỏ có cả P1 và P2, mỗi sản phẩm số lượng 1, và badge hiển thị 2. | FR-06 thêm vào giỏ, FR-23 badge số lượng | `toBeVisible` cho trạng thái giỏ trống, `toHaveURL` cho trang chi tiết, `toBeVisible` cho từng dòng cần có trong giỏ, rồi `toHaveText('1')` cho số lượng mỗi dòng và `toHaveText` cho badge 1 hoặc 2 ở bước tương ứng. |

#### Ghi chú khi chuyển thành script

- Với FR06-11 đến FR06-14, phải xác minh giá trị nhập, trạng thái điều khiển hoặc tín hiệu từ chối có thể quan sát trước khi kết luận. Giỏ trống sau lần bấm đầu riêng lẻ có thể do lỗi bỏ qua cú bấm. Khi ô vẫn giữ dữ liệu sai, thử nút còn khả dụng lần thứ hai để kiểm tra đường xử lý thêm, rồi xác nhận giỏ giữ trống. FR06-09 và FR06-10 vẫn phải dùng đúng một cú bấm.
- Kiểm tra giỏ bằng điều hướng nội bộ để giữ trạng thái React. Các ca dùng giỏ làm điểm quan sát hậu quả của thao tác trong FR-06.
- FR06-02 phụ thuộc ảnh seed ở máy chủ ngoài. Ghi nhận riêng lỗi tải từ nguồn ngoài khi phân tích kết quả.

#### Cách hướng dẫn AI theo từng bước

1. Đọc SRS và đối chiếu các yêu cầu FR-06, FR-21, FR-23, FR-24 với web mua sắm và mã SUT.
2. Thiết kế 15 ca với dữ liệu, thao tác, kết quả mong đợi và assertion dự kiến. Dùng SRS để xác định kết quả mong đợi.
3. Chuyển từng ca thành script Playwright, tách dữ liệu sang JSON, chạy Chromium và kiểm tra báo cáo HTML.

#### Dữ liệu kiểm thử

Tệp JSON chứa dữ liệu ba sản phẩm mẫu, các giá trị số lượng hợp lệ và không hợp lệ, cùng số lượng mong đợi trên badge. [Dữ liệu FR-06](data/fr-06.json)

#### Assertion sử dụng

- `toHaveURL` kiểm tra điều hướng. `toHaveCount` kiểm tra số tiêu đề hoặc số dòng sản phẩm.
- `toBeVisible`, `toHaveText` và `toHaveAttribute` kiểm tra nội dung, phản hồi trực quan và thuộc tính ảnh.
- `toHaveValue` kiểm tra số lượng. `expect.poll` đợi ảnh tải hoặc đợi toast hay badge cập nhật.

#### Script kiểm thử

Mỗi ca chạy trong một browser context mới. Các ca số lượng sai dùng cùng luồng kiểm thử với dữ liệu đầu vào riêng. [Script FR-06](tests/fr-06.spec.ts)

#### Rà soát script AI, nguyên nhân thiếu sót và cách sửa

- **Thiếu sót trong FR06-15 do AI viết.** Bản đầu chỉ kiểm badge sau khi bấm thêm. Lần kiểm đầu dùng `expect.soft`, nên script vẫn tiếp tục với P2 dù P1 có thể chưa được thêm. Kết quả vì thế khó phân biệt lỗi thêm sản phẩm với lỗi hiển thị badge.
- **Cách sửa.** Xác nhận giỏ trống trước khi bắt đầu. Với P1, mở trang chi tiết, nhập 1 và bấm thêm một lần, rồi kiểm giỏ có P1 với số lượng 1 trước khi kiểm badge 1. Với P2, thực hiện tương tự, kiểm giỏ có cả hai dòng với số lượng 1 rồi mới kiểm badge 2. Dùng assertion dừng ca ngay khi một bước thất bại.
- **Xác minh sau khi sửa.** Trên cả ba trình duyệt, FR06-15 dừng ở bước xác nhận P1 có trong giỏ sau một lần bấm. Lượt chạy này chưa tới bước kiểm badge 1 hoặc thêm P2.

#### Ca chưa tự động hóa và lý do

### 4.2 FR-07 — Giỏ hàng

#### Đối chiếu SRS và SUT

#### Danh sách ca kiểm thử

#### Cách hướng dẫn AI theo từng bước

#### Dữ liệu kiểm thử

#### Assertion sử dụng

#### Script kiểm thử

#### Rà soát script AI, nguyên nhân thiếu sót và cách sửa

#### Ca chưa tự động hóa và lý do

### 4.3 FR-14 — Quản lý danh mục

#### Đối chiếu SRS và SUT

#### Danh sách ca kiểm thử

#### Cách hướng dẫn AI theo từng bước

#### Dữ liệu kiểm thử

#### Assertion sử dụng

#### Script kiểm thử

#### Rà soát script AI, nguyên nhân thiếu sót và cách sửa

#### Ca chưa tự động hóa và lý do

## 5. Kết quả thực thi đa trình duyệt

### Tổng hợp ca tự động hóa, đã chạy, đạt, không đạt và số lỗi

### Các lượt chạy theo tính năng và trình duyệt

Mỗi dòng tương ứng với một lượt chạy. Các lượt chưa thực thi để trống số liệu và liên kết. Cột Lỗi ghi số ca kiểm thử không đạt trong lượt chạy.

| Tính năng | Trình duyệt | Số ca chạy | Đạt | Lỗi | Liên kết HTML |
| --- | --- | --- | --- | --- | --- |
| FR-06 | Chromium | 15 | 6 | 9 | [HTML](reports/fr-06/chromium/index.html) |
| FR-06 | Firefox | 15 | 7 | 8 | [HTML](reports/fr-06/firefox/index.html) |
| FR-06 | WebKit | 15 | 6 | 9 | [HTML](reports/fr-06/webkit/index.html) |
| FR-07 | Chromium | | | | |
| FR-07 | Firefox | | | | |
| FR-07 | WebKit | | | | |
| FR-14 | Chromium | | | | |
| FR-14 | Firefox | | | | |
| FR-14 | WebKit | | | | |

Mỗi lượt chạy phải có một báo cáo HTML riêng. Báo cáo phải hiển thị `Run by: {StudentID}` với MSSV thật và dấu thời gian chạy theo định dạng ISO 8601.

## 6. Báo cáo lỗi và minh chứng

### Lỗi xác nhận khi thực thi, ảnh chụp và liên kết GitHub Issues

## 7. Nhiệm vụ 2 — Video minh họa

### Liên kết YouTube Unlisted

## 8. Agent Skill

### Tệp Skill và video sử dụng Skill

## 9. Tài liệu tham khảo

- [Đề HW04](../2026.HW04.Automation%20Testing_Vi.md)
- [SRS EShop](../eshop-sut/README.md)

