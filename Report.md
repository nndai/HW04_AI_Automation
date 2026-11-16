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

Nếu cổng 5173 đang được dùng, đặt biến môi trường `ESHOP_STOREFRONT_PORT` thành một cổng còn trống trước khi chạy Playwright. Lượt chạy lại FR-07 dùng cổng 5175.

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

- FR-07 quy định các cột trong giỏ, nút tăng/giảm, gộp sản phẩm trùng, xác nhận trước khi xóa, điều hướng mua tiếp, nhãn tổng tiền và trạng thái giỏ trống. FR-21 quy định định dạng tiền và FR-24 bổ sung yêu cầu về dialog và hình minh họa. [SRS EShop](../eshop-sut/README.md)
- Khi đọc mã SUT, thấy giỏ hiện dùng cột “Giá” và nhãn “Tổng tạm tính”, hiển thị số lượng dạng chữ, xóa trực tiếp và chưa có hình minh họa khi trống. Hàm thêm tạo một dòng mới mỗi lần. Ghi nhận này dùng để chuẩn bị lượt chạy. Cột kết quả mong đợi trong bảng luôn theo SRS. [Cart.jsx](../eshop-sut/frontend-web/src/pages/Cart.jsx) · [CartContext.jsx](../eshop-sut/frontend-web/src/context/CartContext.jsx)

#### Danh sách ca kiểm thử

| ID | Dữ liệu | Thao tác | Kết quả mong đợi | Căn cứ SRS | Assertion Playwright dự kiến |
| --- | --- | --- | --- | --- | --- |
| FR07-01 | Giỏ trống | Mở giỏ trong context mới. | Giỏ hiển thị thông báo trống rõ ràng và không có dòng sản phẩm. | FR-07 giỏ trống, FR-24 trạng thái trống | `toBeVisible` cho thông báo trong nội dung chính và `toHaveCount(0)` cho dòng sản phẩm. |
| FR07-02 | Giỏ trống | Mở giỏ và kiểm tra vùng thông báo trống. | Có biểu tượng hoặc hình minh họa hiển thị cùng thông báo trống. | FR-07 giỏ trống, FR-24 hình minh họa | `toBeVisible` cho ảnh hoặc biểu tượng trong vùng trạng thái trống. |
| FR07-03 | P1 × 1 | Mở giỏ và đọc các tiêu đề cột. | Có lần lượt Sản phẩm, Đơn giá, Số lượng, Thành tiền và Thao tác. | FR-07 cột giỏ hàng | `toHaveText` trên danh sách `columnheader` với năm nhãn đúng thứ tự. |
| FR07-04 | P1 × 1 | Mở giỏ và đọc dòng P1. | Dòng ghi đúng tên P1, đơn giá 30.000.000 ₫, số lượng 1 và thành tiền 30.000.000 ₫. | FR-07 dữ liệu dòng, FR-21 định dạng tiền | `toHaveText` trên từng ô của dòng được xác định theo tên P1. |
| FR07-05 | P1 × 1 | Bấm nút tăng trên dòng P1. | Dòng P1 hiển thị số lượng 2, thành tiền và tổng tiền đều bằng 60.000.000 ₫. | FR-07 chỉnh số lượng và tính tiền | `toHaveText` cho số lượng và thành tiền. `toBeVisible` cho số tiền 60.000.000 ₫ trong vùng tổng giỏ. |
| FR07-06 | P1 × 2 trên một dòng | Thêm P1 hai lần, mở giỏ, xác nhận đúng một dòng P1 với số lượng 2. Ca thất bại ngay nếu bước chuẩn bị sai. Khi dữ liệu đúng, bấm nút giảm trên dòng P1. | Vẫn có một dòng P1, số lượng giảm còn 1, thành tiền và tổng tiền đều bằng 30.000.000 ₫. | FR-07 chỉnh số lượng và tính tiền | Dùng `toHaveCount(1)` và `toHaveText('2')` trước khi bấm giảm. Sau khi bấm, kiểm tra đúng một dòng, số lượng và thành tiền bằng `toHaveCount` và `toHaveText`, rồi dùng `toBeVisible` cho số tiền trong vùng tổng giỏ. |
| FR07-07 | Giỏ trống, P1 được thêm hai lần | Bấm thêm P1 hai lần tại trang chủ rồi mở giỏ. | Chỉ có một dòng P1, số lượng là 2. | FR-07 gộp sản phẩm trùng | `toHaveCount(1)` cho dòng P1 và `toHaveText('2')` tại ô số lượng của dòng đó. |
| FR07-08 | P1 × 1, P2 × 1 | Mở giỏ và đọc danh sách dòng. | Hai sản phẩm khác nhau nằm ở hai dòng riêng, mỗi dòng có số lượng 1. | FR-07 danh sách sản phẩm | `toHaveCount(2)` cho dòng sản phẩm, `toBeVisible` cho từng dòng và `toHaveText('1')` cho hai ô số lượng. |
| FR07-09 | P1 × 1 | Bấm Xóa trên dòng P1, chưa chọn tùy chọn trong dialog. | Dialog yêu cầu xác nhận xuất hiện trước khi giỏ bị thay đổi. | FR-07 xác nhận xóa, FR-24 dialog | Với modal, dùng `toBeVisible` cho dialog và xác nhận dòng P1 còn tồn tại. Với hộp xác nhận gốc, đợi sự kiện `dialog`, kiểm tra kiểu `confirm` và chọn hủy để kiểm tra dòng P1 vẫn còn. |
| FR07-10 | P1 × 1, P2 × 1 | Bấm Xóa P1 rồi chọn hủy. | P1 và P2 vẫn còn, mỗi dòng số lượng 1 và tổng vẫn là 58.000.000 ₫. | FR-07 xác nhận trước khi xóa | `toHaveCount(1)` và `toBeVisible` cho từng dòng, `toHaveText` cho số lượng và `toBeVisible` cho số tiền trong vùng tổng giỏ. |
| FR07-11 | P1 × 1, P2 × 1 | Bấm Xóa P1 rồi xác nhận. | Chỉ P1 bị xóa. P2 còn một dòng số lượng 1 và tổng còn 28.000.000 ₫. | FR-07 xóa đúng dòng và tính tiền | `toHaveCount(0)` cho dòng P1, `toHaveCount(1)` và `toBeVisible` cho dòng P2, `toHaveText` cho số lượng và `toBeVisible` cho số tiền trong vùng tổng giỏ. |
| FR07-12 | P1 × 1 là dòng duy nhất | Bấm Xóa P1 rồi xác nhận. | Giỏ chuyển sang trạng thái trống, có thông báo và hình minh họa. | FR-07 xóa và giỏ trống, FR-24 trạng thái trống | `toHaveCount(0)` cho dòng sản phẩm và `toBeVisible` cho thông báo và hình minh họa. |
| FR07-13 | P1 × 1, P2 × 1 | Mở giỏ và kiểm tra riêng nhãn và số tiền trong vùng tổng giỏ. | Nhãn hiển thị chính xác “Tổng cộng” và số tiền là 58.000.000 ₫. | FR-07 nhãn tổng tiền, FR-21 định dạng tiền | `expect.soft(...).toHaveText` kiểm nhãn và `toBeVisible` kiểm số tiền, để cả hai assertion được thực hiện khi nhãn sai. |
| FR07-14 | Giỏ trống | Bấm Tiếp tục mua sắm từ trạng thái trống. | Điều hướng về trang chủ. | FR-07 tiếp tục mua sắm | `toBeVisible` cho điều khiển có nhãn và `toHaveURL('/')` sau khi bấm. |
| FR07-15 | P1 × 1 | Bấm Tiếp tục mua sắm từ giỏ đang có sản phẩm. | Điều hướng về trang chủ. | FR-07 tiếp tục mua sắm | `toBeVisible` cho điều khiển có nhãn và `toHaveURL('/')` sau khi bấm. |

#### Cách hướng dẫn AI theo từng bước

1. Đọc từng yêu cầu FR-07, đối chiếu mã trang giỏ và quy tắc cập nhật giỏ.
2. Tách ca theo trạng thái trống, dữ liệu dòng, thay đổi số lượng, gộp, xác nhận xóa, tổng tiền và điều hướng. Với mỗi ca, ghi rõ điều kiện ban đầu và kết quả theo SRS.
3. Chọn các assertion dự kiến và xác định điều kiện cần kiểm tra trước khi thực hiện thao tác chính.

#### Dữ liệu kiểm thử

Dùng P1 và P2 từ dữ liệu mẫu của SUT. Đơn giá tương ứng là 30.000.000 ₫ và 28.000.000 ₫. Mỗi ca bắt đầu với context mới và locale `vi-VN`. Với ca cần giỏ có sản phẩm, chuẩn bị bằng nút thêm trên trang chủ và mở giỏ qua liên kết nội bộ. FR07-06 thất bại nếu bước chuẩn bị chưa tạo đúng một dòng P1 với số lượng 2. [Dữ liệu FR-07](data/fr-07.json)

#### Assertion sử dụng

- `toBeVisible` cho thông báo, hình minh họa, dòng sản phẩm và dialog.
- `toHaveCount` cho số dòng, `toHaveText` cho tiêu đề cột, dữ liệu dòng và tổng tiền.
- `toHaveURL` cho điều hướng từ giỏ tới trang chủ, `toBe` cho loại dialog gốc.

#### Script kiểm thử

[15 ca Playwright FR-07](tests/fr-07.spec.ts)

#### Rà soát script AI, nguyên nhân thiếu sót và cách sửa

- Lượt chạy nháp phát hiện bộ chọn chuẩn bị giỏ dùng nhãn “Thêm vào giỏ hàng” của trang chi tiết. Trang chủ dùng nhãn “Thêm vào giỏ”, nên các ca cần sản phẩm bị hết thời gian chờ ở bước chuẩn bị. Đã sửa bộ chọn theo nhãn chính xác trong thẻ của sản phẩm và chạy lại toàn bộ FR-07.
- Bản đầu kiểm tra nhãn và số tiền bằng cùng một chuỗi. Khi nhãn sai, các ca thao tác có thể báo lỗi tổng ngay cả khi số tiền đúng. Đã dùng assertion riêng cho số tiền trong vùng tổng giỏ ở FR07-05, FR07-06, FR07-10 và FR07-11. FR07-13 kiểm cả nhãn lẫn số tiền bằng hai assertion độc lập.

#### Ca chưa tự động hóa và lý do

### 4.3 FR-14 — Quản lý danh mục

#### Đối chiếu SRS và SUT

- FR-14 yêu cầu quản trị viên thêm, xem, xóa danh mục và bắt buộc có tên. Phần mô tả FR-14 chỉ liệt kê ba thao tác này. Ca sửa dùng hợp đồng `PUT /api/categories/:id` ở đặc tả API mục 3.4. Kiểm tra dữ liệu sau khi sửa bằng bảng danh mục trên web admin. [SRS EShop](../eshop-sut/README.md) · [Đặc tả API](../eshop-sut/api_specification.md)
- FR-12 yêu cầu vai trò admin để vào web admin và yêu cầu JWT hợp lệ thuộc vai trò admin cho POST, PUT, DELETE danh mục. GET danh mục phục vụ đọc dữ liệu nên các ca giới hạn quyền đọc kiểm tra giao diện admin. [SRS EShop](../eshop-sut/README.md)
- Web admin có bảng danh mục, form thêm và nút xóa trên từng dòng. Chức năng sửa hiện có ở API. POST và PUT chuyển tên từ request vào SQLite, còn middleware JWT của nhóm route ghi chỉ xác minh token. Kiểm tra thực thi sẽ đối chiếu các hành vi này với SRS và hợp đồng API. [Giao diện admin](../eshop-sut/frontend-admin/src/App.jsx) · [Mã backend](../eshop-sut/backend/server.js)

#### Danh sách ca kiểm thử

| ID | Dữ liệu | Bước chạy | Kết quả mong đợi | Căn cứ | Assertion Playwright dự kiến |
| --- | --- | --- | --- | --- | --- |
| FR14-01 | Admin, dữ liệu mẫu Điện thoại, Laptop, Phụ kiện | Đăng nhập web admin, chọn Danh mục và xem bảng. | Trang Quản lý Danh mục hiển thị ba danh mục mẫu, mỗi mục một dòng có ID. | FR-14 xem danh mục | `toBeVisible` cho tiêu đề và từng dòng, `toHaveCount(1)` theo tên và `toHaveText` cho ID tương ứng. |
| FR14-02 | Admin, tên mới `<prefix> Thiết bị học tập` | Mở Danh mục, nhập tên và bấm Thêm mới một lần. | Danh mục mới xuất hiện đúng một dòng, với tên đã nhập và một ID. | FR-14 thêm danh mục | `toHaveCount(1)` và `toHaveText` cho tên, kiểm ô ID có giá trị. |
| FR14-03 | Admin, danh mục thử đã tạo và ID của nó | Mở Danh mục, tải lại web admin rồi mở lại tab Danh mục. | Danh mục vẫn có cùng ID và tên sau khi tải lại. | FR-14 thêm và xem danh mục đã lưu | `toHaveCount(1)` và `toHaveText` trên dòng được xác định bằng ID. |
| FR14-04 | Admin, danh mục A và B có ID riêng, tên mới cho A | Gửi PUT danh mục A bằng JWT admin, sau đó mở bảng Danh mục. | PUT thành công. A giữ ID và hiển thị tên mới, B giữ nguyên. | Hợp đồng API 3.4 sửa, FR-14 xem | `toBeOK` cho PUT và `toHaveText` cho tên của A và B theo ID. |
| FR14-05 | Admin, tên trống `""` | Ghi lại danh sách, để trống tên rồi thử thêm. Xác nhận form chặn hoặc chờ POST hoàn tất trước khi đọc lại danh sách. | Form chặn hoặc máy chủ trả 4xx. Danh sách lưu giữ nguyên. | FR-14 tên bắt buộc | `toHaveValue` cho đầu vào. Xác nhận nút bị vô hiệu hóa hoặc trạng thái invalid khi không gửi POST. Nếu có POST, dùng `toBeNull` cho lỗi hoàn tất và kiểm mã 4xx. Cuối cùng dùng `toEqual` so danh sách. |
| FR14-06 | Admin, tên gồm ba dấu cách | Ghi lại danh sách, nhập ba dấu cách rồi thử thêm. Xác nhận form chặn hoặc chờ POST hoàn tất trước khi đọc lại danh sách. | Tên chỉ có khoảng trắng bị từ chối và danh sách lưu giữ nguyên. | FR-14 tên bắt buộc, diễn giải tên chỉ có khoảng trắng | `toHaveValue` cho ba dấu cách, sau đó dùng cùng các assertion xác nhận form chặn hoặc POST từ chối như FR14-05 và `toEqual` so danh sách. |
| FR14-07 | Admin, danh mục A có sẵn, tên sửa `""` | Gửi PUT với tên rỗng rồi đọc lại A theo ID. | API từ chối yêu cầu và tên gốc của A giữ nguyên. | FR-14 tên bắt buộc, hợp đồng API 3.4 sửa | Mã phản hồi thuộc 4xx và tên đọc lại `toBe` tên gốc. |
| FR14-08 | Admin, danh mục thử A và B không có sản phẩm | Trên bảng, bấm Xóa ở dòng A, hoàn tất xác nhận nếu giao diện có hỏi, rồi tải lại và mở tab Danh mục. | A biến mất và vẫn vắng mặt sau khi tải lại, B còn nguyên ID và tên. | FR-14 xóa và xem | `toHaveCount(0)` cho A sau thao tác và sau tải lại, `toHaveText` cho B theo ID. |
| FR14-09 | Context mới, khách chưa đăng nhập | Mở trực tiếp web admin. | Màn hình đăng nhập xuất hiện. Khách chưa thấy bảng và thao tác quản lý danh mục. | FR-12 quyền vào web admin | `toBeVisible` cho form đăng nhập và `toHaveCount(0)` cho tiêu đề quản lý cùng nút Thêm mới. |
| FR14-10 | Tài khoản mẫu có vai trò user | Đăng nhập trên web admin bằng tài khoản user hợp lệ. | Bị từ chối quyền admin và giao diện quản lý danh mục không xuất hiện. | FR-12 vai trò admin | Kiểm phản hồi từ chối qua dialog hoặc nội dung trang, rồi `toBeVisible` cho form đăng nhập và `toHaveCount(0)` cho giao diện danh mục. |
| FR14-11 | Không gửi JWT, tên mới hợp lệ | Gửi POST danh mục, sau đó đối chiếu danh sách bằng phiên admin. | Yêu cầu bị từ chối và tên mới không tồn tại. | FR-12 JWT bắt buộc cho POST | Mã phản hồi thuộc 4xx và danh sách sau `toEqual` danh sách trước. |
| FR14-12 | JWT sai định dạng, danh mục thử A có sẵn | Gửi DELETE A với JWT sai, sau đó đọc lại danh mục. | Yêu cầu bị từ chối và A vẫn còn với ID và tên cũ. | FR-12 JWT hợp lệ cho DELETE | Mã phản hồi thuộc 4xx và đối tượng A đọc lại `toEqual` đối tượng gốc. |
| FR14-13 | JWT hợp lệ của user, tên mới hợp lệ | Dùng JWT user gửi POST rồi đối chiếu danh sách bằng phiên admin. | Yêu cầu bị từ chối vì thiếu vai trò admin và danh sách không đổi. | FR-12 vai trò admin cho POST | Mã phản hồi thuộc 4xx và danh sách sau `toEqual` danh sách trước. |
| FR14-14 | JWT hợp lệ của user, danh mục thử A, tên sửa hợp lệ | Dùng JWT user gửi PUT cho A rồi đọc lại A theo ID. | Yêu cầu bị từ chối và A vẫn giữ tên gốc. | FR-12 vai trò admin cho PUT | Mã phản hồi thuộc 4xx và đối tượng A đọc lại `toEqual` đối tượng gốc. |
| FR14-15 | JWT hợp lệ của user, danh mục thử A không có sản phẩm | Dùng JWT user gửi DELETE cho A rồi đọc lại theo ID. | Yêu cầu bị từ chối và A vẫn tồn tại. | FR-12 vai trò admin cho DELETE | Mã phản hồi thuộc 4xx và đối tượng A đọc lại `toEqual` đối tượng gốc. |
| FR14-16 | Admin, tên `Q` gồm đúng một ký tự, chưa có trong dữ liệu thử | Mở tab Danh mục, nhập `Q` vào ô Tên danh mục mới và bấm Thêm mới. | Tạo thành công một danh mục có ID và tên đúng là `Q`. Tên một ký tự đáp ứng yêu cầu tên không trống của SRS. | FR-14 thêm danh mục, tên bắt buộc | `toHaveValue('Q')` trước khi gửi, `toHaveCount(1)` cho dòng có ô tên khớp chính xác và `toHaveText` cho ô tên và ID. |
| FR14-17 | Admin, hai tên khác nhau `<prefix> Sách` và `<prefix> Văn phòng phẩm` | Mở tab Danh mục, nhập và thêm tên thứ nhất. Khi dòng thứ nhất xuất hiện, nhập tên thứ hai trong cùng form rồi bấm Thêm mới. | Bảng hiển thị đúng một dòng cho mỗi tên. Hai dòng có ID riêng và tên thứ nhất vẫn giữ nguyên sau khi thêm tên thứ hai. | FR-14 thêm và xem danh mục | `toHaveCount(1)` và `toHaveText` cho từng dòng theo tên khớp chính xác, đối chiếu hai ID bằng `not.toBe`. |
| FR14-18 | Admin, tên mới `<prefix> Đồ dùng học tập` | Thêm danh mục trên web admin, ghi nhận ID từ bảng. Chuyển sang Dashboard, xác nhận đã đổi tab, rồi quay lại Danh mục. | Danh mục vừa tạo vẫn xuất hiện đúng một dòng với cùng ID và tên. | FR-14 thêm và xem danh mục | `toBeVisible` cho tiêu đề Dashboard và Quản lý Danh mục ở từng bước, `toHaveCount(1)` cho dòng theo ID và `toHaveText` cho tên sau khi quay lại. |

#### Cách hướng dẫn AI theo từng bước

1. Đọc FR-14 và FR-12, đối chiếu trang Danh mục, các route và đặc tả API cho thao tác sửa.
2. Chọn luồng tạo, xem, sửa, xóa, dữ liệu thiếu tên và kiểm soát quyền. Xác định kết quả mong đợi trước khi chọn assertion.
3. Ghi điều kiện chuẩn bị, thao tác, kết quả mong đợi và kiểm tra tác động lên dữ liệu cho từng ca.

#### Dữ liệu kiểm thử

Dùng tài khoản admin và user mẫu của SUT theo đúng vai trò, mỗi ca giao diện có phiên riêng. Dùng tên thử phân biệt theo mã ca và lượt chạy. FR14-16 dùng đúng một ký tự và cần xác nhận tên đó chưa tồn tại trước khi bắt đầu. Với ca sửa hoặc xóa, tạo danh mục riêng bằng phiên admin và lưu ID từ phản hồi POST. Dọn dữ liệu thử theo ID sau khi kiểm tra để tránh ảnh hưởng các danh mục mẫu và các ca khác. Các ca so sánh nguyên danh sách chạy tuần tự để kết quả không bị nhiễu bởi thao tác ghi đồng thời.

[Dữ liệu FR-14](data/fr-14.json)

#### Assertion sử dụng

- `toBeVisible`, `toHaveCount` và `toHaveText` kiểm tra màn hình admin, dòng, ID và tên danh mục. `toHaveValue` kiểm tra trường tên trước khi gửi.
- `toBeOK` kiểm tra phản hồi hợp lệ. `toBe` kiểm tra vai trò, trạng thái từ chối và tên còn lưu. `toEqual` so sánh dữ liệu trước và sau yêu cầu bị từ chối.
- Với ca âm ở API, assertion trạng thái dùng `expect.soft` để kiểm tra cả việc dữ liệu có bị thay đổi khi máy chủ trả 2xx.

#### Script kiểm thử

[18 ca Playwright FR-14](tests/fr-14.spec.ts) chạy lần lượt trong mỗi trình duyệt. Ca sửa dùng API theo hợp đồng 3.4 rồi đối chiếu giao diện. Các yêu cầu ghi đã tạo dữ liệu được theo dõi bằng ID trả về để dọn danh mục thử sau mỗi ca, kể cả khi assertion thất bại.

#### Rà soát script AI, nguyên nhân thiếu sót và cách sửa

- **Thiếu sót ở FR14-05/06.** Bản AI dùng hết thời gian chờ phản hồi làm căn cứ đi tiếp. Khi POST chậm hoặc form không có dấu hiệu xác thực, ca có thể đọc danh sách quá sớm và kết luận sai rằng dữ liệu giữ nguyên.
- **Cách sửa.** Theo dõi yêu cầu POST và chờ phản hồi hoàn tất trước khi so dữ liệu. Nếu không nhận phản hồi, ca xác nhận chưa có POST và form đã chặn qua trạng thái invalid hoặc nút vô hiệu hóa. POST đang chờ hoặc việc thiếu dấu hiệu chặn khiến ca thất bại.

#### Ca chưa tự động hóa và lý do

## 5. Kết quả thực thi đa trình duyệt

### Tổng hợp ca tự động hóa, đã chạy, đạt, không đạt và số lỗi

Đã tự động hóa 48 ca và thực hiện 9 lượt chạy. Mỗi ca chạy trên cả ba trình duyệt, tổng cộng 144 lần thực thi, gồm 67 đạt và 77 không đạt. Cột Lỗi trong bảng đếm số ca không đạt theo lượt chạy.

### Các lượt chạy theo tính năng và trình duyệt

Mỗi dòng tương ứng với một lượt chạy. Các lượt chưa thực thi để trống số liệu và liên kết. Cột Lỗi ghi số ca kiểm thử không đạt trong lượt chạy.

| Tính năng | Trình duyệt | Số ca chạy | Đạt | Lỗi | Liên kết HTML |
| --- | --- | --- | --- | --- | --- |
| FR-06 | Chromium | 15 | 6 | 9 | [HTML](reports/fr-06/chromium/index.html) |
| FR-06 | Firefox | 15 | 7 | 8 | [HTML](reports/fr-06/firefox/index.html) |
| FR-06 | WebKit | 15 | 6 | 9 | [HTML](reports/fr-06/webkit/index.html) |
| FR-07 | Chromium | 15 | 4 | 11 | [HTML](reports/fr-07/chromium/index.html) |
| FR-07 | Firefox | 15 | 4 | 11 | [HTML](reports/fr-07/firefox/index.html) |
| FR-07 | WebKit | 15 | 4 | 11 | [HTML](reports/fr-07/webkit/index.html) |
| FR-14 | Chromium | 18 | 12 | 6 | [HTML](reports/fr-14/chromium/index.html) |
| FR-14 | Firefox | 18 | 12 | 6 | [HTML](reports/fr-14/firefox/index.html) |
| FR-14 | WebKit | 18 | 12 | 6 | [HTML](reports/fr-14/webkit/index.html) |

Trong cả ba lượt FR-07, FR07-13 thấy số tiền 58.000.000 ₫ đúng. Ca vẫn không đạt vì nhãn hiển thị “Tổng tạm tính”.

FR-14 có cùng sáu ca không đạt trên cả ba trình duyệt. FR14-05, FR14-06 và FR14-07 ghi nhận tên rỗng hoặc chỉ có khoảng trắng vẫn được lưu. FR14-13, FR14-14 và FR14-15 ghi nhận JWT của user nhận HTTP 200 và làm thay đổi dữ liệu khi thêm, sửa hoặc xóa.

Chạy lại riêng FR14-05/06 sau khi sửa đồng bộ. Cả hai ca đều không đạt trên từng trình duyệt vì POST hoàn tất với HTTP 200 và danh sách có thêm bản ghi. Kết quả chạy lại hai ca được ghi riêng với bảng chạy toàn bộ. [Chromium](reports/fr-14/recheck-05-06/chromium/index.html) · [Firefox](reports/fr-14/recheck-05-06/firefox/index.html) · [WebKit](reports/fr-14/recheck-05-06/webkit/index.html)

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

