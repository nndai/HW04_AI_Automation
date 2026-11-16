# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: fr-07.spec.ts >> FR07-06 giảm số lượng và tính lại tiền
- Location: tests\fr-07.spec.ts:132:1

# Error details

```
Error: Chuẩn bị FR07-06: P1 phải nằm trên đúng một dòng

expect(locator).toHaveCount(expected) failed

Locator:  getByRole('main').getByRole('row').filter({ has: getByRole('cell') }).filter({ has: getByRole('cell', { name: 'iPhone 15 Pro Max', exact: true }) })
Expected: 1
Received: 2
Timeout:  5000ms

Call log:
  - Chuẩn bị FR07-06: P1 phải nằm trên đúng một dòng getByRole('main').getByRole('row').filter({ has: getByRole('cell') }).filter({ has: getByRole('cell', { name: 'iPhone 15 Pro Max', exact: true }) }) with timeout 5000ms
  - waiting for getByRole('main').getByRole('row').filter({ has: getByRole('cell') }).filter({ has: getByRole('cell', { name: 'iPhone 15 Pro Max', exact: true }) })
    14 × locator resolved to 2 elements
       - unexpected value "2"

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - link "EShop" [ref=e5] [cursor=pointer]:
      - /url: /
    - navigation [ref=e6]:
      - link "Giỏ hàng" [active] [ref=e7] [cursor=pointer]:
        - /url: /cart
      - link "Đăng nhập" [ref=e8] [cursor=pointer]:
        - /url: /login
      - link "Đăng ký" [ref=e9] [cursor=pointer]:
        - /url: /register
  - main [ref=e10]:
    - generic [ref=e11]:
      - heading "Giỏ Hàng" [level=2] [ref=e12]
      - table [ref=e13]:
        - rowgroup [ref=e14]:
          - row [ref=e15]:
            - columnheader "Sản phẩm" [ref=e16]
            - columnheader "Giá" [ref=e17]
            - columnheader "Số lượng" [ref=e18]
            - columnheader "Thành tiền" [ref=e19]
            - columnheader "Thao tác" [ref=e20]
        - rowgroup [ref=e21]:
          - row [ref=e22]:
            - cell "iPhone 15 Pro Max" [ref=e23]
            - cell "30.000.000 ₫" [ref=e24]
            - cell "1" [ref=e25]
            - cell "30.000.000 ₫" [ref=e26]
            - cell [ref=e27]:
              - button "Xóa" [ref=e28] [cursor=pointer]
          - row [ref=e29]:
            - cell "iPhone 15 Pro Max" [ref=e30]
            - cell "30.000.000 ₫" [ref=e31]
            - cell "1" [ref=e32]
            - cell "30.000.000 ₫" [ref=e33]
            - cell [ref=e34]:
              - button "Xóa" [ref=e35] [cursor=pointer]
      - generic [ref=e36]:
        - generic [ref=e37]:
          - text: "Tổng tạm tính:"
          - generic [ref=e38]: 60.000.000 ₫
        - generic [ref=e39]:
          - link "← Mua tiếp" [ref=e40] [cursor=pointer]:
            - /url: /
          - button "Tiến hành thanh toán" [ref=e41] [cursor=pointer]
  - contentinfo [ref=e42]: © 2026 EShop SUT. Dành cho mục đích kiểm thử.
```

# Test source

```ts
  35  | 
  36  | async function openCart(page: Page, ...products: Product[]) {
  37  |   await page.goto('/', { waitUntil: 'domcontentloaded' });
  38  |   for (const product of products) {
  39  |     const card = main(page).getByRole('heading', { name: product.name, exact: true }).locator('..');
  40  |     await card.getByRole('button', { name: 'Thêm vào giỏ', exact: true }).click({ timeout: 5000 });
  41  |   }
  42  |   await page.getByRole('banner').getByRole('link', { name: /^Giỏ hàng/i }).click();
  43  |   await expect(page).toHaveURL('/cart');
  44  | }
  45  | 
  46  | async function expectTotal(page: Page, amount: string) {
  47  |   await expect(main(page).getByText(`${data.totalLabel}: ${amount}`, { exact: true })).toBeVisible();
  48  | }
  49  | 
  50  | async function expectSingleUnit(page: Page, product: Product) {
  51  |   const row = productRow(page, product);
  52  |   await expect(row).toHaveCount(1);
  53  |   await expect(row).toBeVisible();
  54  |   await expect(quantityCell(row)).toHaveText(single);
  55  | }
  56  | 
  57  | async function requestRemoval(page: Page, product: Product, action: 'inspect' | 'cancel' | 'confirm') {
  58  |   const row = productRow(page, product);
  59  |   let dialogType: string | undefined;
  60  |   const handleDialog = async (dialog: Dialog) => {
  61  |     dialogType = dialog.type();
  62  |     if (dialogType === 'confirm' && action === 'confirm') {
  63  |       await dialog.accept();
  64  |     } else {
  65  |       await dialog.dismiss();
  66  |     }
  67  |   };
  68  |   page.once('dialog', handleDialog);
  69  |   try {
  70  |     await row.getByRole('button', { name: /^Xóa(?: sản phẩm)?$/i }).click();
  71  |   } finally {
  72  |     page.off('dialog', handleDialog);
  73  |   }
  74  | 
  75  |   if (dialogType !== undefined) {
  76  |     expect(dialogType, 'Hộp thoại gốc phải yêu cầu xác nhận xóa').toBe('confirm');
  77  |     return;
  78  |   }
  79  | 
  80  |   const dialog = page.getByRole('alertdialog').or(page.getByRole('dialog'));
  81  |   await expect(dialog, 'Phải hiển thị dialog xác nhận trước khi xóa').toBeVisible();
  82  |   await expect(row).toBeVisible();
  83  |   if (action !== 'inspect') {
  84  |     const button = action === 'confirm' ? /^(xác nhận|xóa|đồng ý)$/i : /^(hủy|hủy bỏ|không)$/i;
  85  |     await dialog.getByRole('button', { name: button }).click();
  86  |   }
  87  | }
  88  | 
  89  | async function continueShopping(page: Page) {
  90  |   const name = { name: data.continueLabel, exact: true };
  91  |   const control = main(page).getByRole('link', name).or(main(page).getByRole('button', name));
  92  |   await expect(control).toBeVisible();
  93  |   await control.click();
  94  |   await expect(page).toHaveURL('/');
  95  | }
  96  | 
  97  | test('FR07-01 giỏ trống có thông báo và không có dòng sản phẩm', async ({ page }) => {
  98  |   await openCart(page);
  99  |   await expect(emptyMessage(page)).toBeVisible();
  100 |   await expect(rows(page)).toHaveCount(0);
  101 | });
  102 | 
  103 | test('FR07-02 giỏ trống có hình minh họa', async ({ page }) => {
  104 |   await openCart(page);
  105 |   await expect(emptyMessage(page)).toBeVisible();
  106 |   await expect(emptyIllustration(page)).toBeVisible();
  107 | });
  108 | 
  109 | test('FR07-03 bảng giỏ có đúng năm tiêu đề cột', async ({ page }) => {
  110 |   await openCart(page, P1);
  111 |   await expect(main(page).getByRole('columnheader')).toHaveText(data.columns);
  112 | });
  113 | 
  114 | test('FR07-04 dòng sản phẩm có đơn giá, số lượng và thành tiền', async ({ page }) => {
  115 |   await openCart(page, P1);
  116 |   const cells = productRow(page, P1).getByRole('cell');
  117 |   await expect(cells.nth(0)).toHaveText(P1.name);
  118 |   await expect(cells.nth(1)).toHaveText(P1.unitPrice);
  119 |   await expect(cells.nth(2)).toHaveText(single);
  120 |   await expect(cells.nth(3)).toHaveText(P1.unitPrice);
  121 | });
  122 | 
  123 | test('FR07-05 tăng số lượng và tính lại tiền', async ({ page }) => {
  124 |   await openCart(page, P1);
  125 |   const row = productRow(page, P1);
  126 |   await row.getByRole('button', { name: /^(\+|tăng(?: số lượng)?)$/i }).click({ timeout: 5000 });
  127 |   await expect(quantityCell(row)).toHaveText(double);
  128 |   await expect(row.getByRole('cell').nth(3)).toHaveText(data.totals.doubleP1);
  129 |   await expectTotal(page, data.totals.doubleP1);
  130 | });
  131 | 
  132 | test('FR07-06 giảm số lượng và tính lại tiền', async ({ page }) => {
  133 |   await openCart(page, P1, P1);
  134 |   const row = productRow(page, P1);
> 135 |   await expect(row, 'Chuẩn bị FR07-06: P1 phải nằm trên đúng một dòng').toHaveCount(1);
      |                                                                         ^ Error: Chuẩn bị FR07-06: P1 phải nằm trên đúng một dòng
  136 |   await expect(quantityCell(row), 'Chuẩn bị FR07-06: P1 phải có số lượng 2').toHaveText(double);
  137 |   await row.getByRole('button', { name: /^(-|−|giảm(?: số lượng)?)$/i }).click({ timeout: 5000 });
  138 |   await expectSingleUnit(page, P1);
  139 |   await expect(row.getByRole('cell').nth(3)).toHaveText(P1.unitPrice);
  140 |   await expectTotal(page, P1.unitPrice);
  141 | });
  142 | 
  143 | test('FR07-07 gộp hai lần thêm cùng sản phẩm', async ({ page }) => {
  144 |   await openCart(page, P1, P1);
  145 |   const row = productRow(page, P1);
  146 |   await expect(row).toHaveCount(1);
  147 |   await expect(quantityCell(row)).toHaveText(double);
  148 | });
  149 | 
  150 | test('FR07-08 sản phẩm khác nhau nằm trên hai dòng', async ({ page }) => {
  151 |   await openCart(page, P1, P2);
  152 |   await expect(rows(page)).toHaveCount(2);
  153 |   await expectSingleUnit(page, P1);
  154 |   await expectSingleUnit(page, P2);
  155 | });
  156 | 
  157 | test('FR07-09 yêu cầu xác nhận trước khi xóa', async ({ page }) => {
  158 |   await openCart(page, P1);
  159 |   await requestRemoval(page, P1, 'inspect');
  160 |   await expect(productRow(page, P1)).toBeVisible();
  161 | });
  162 | 
  163 | test('FR07-10 hủy xóa giữ nguyên giỏ và tổng tiền', async ({ page }) => {
  164 |   await openCart(page, P1, P2);
  165 |   await requestRemoval(page, P1, 'cancel');
  166 |   await expectSingleUnit(page, P1);
  167 |   await expectSingleUnit(page, P2);
  168 |   await expectTotal(page, data.totals.oneOfEach);
  169 | });
  170 | 
  171 | test('FR07-11 xác nhận xóa đúng sản phẩm và tính lại tổng', async ({ page }) => {
  172 |   await openCart(page, P1, P2);
  173 |   await requestRemoval(page, P1, 'confirm');
  174 |   await expect(productRow(page, P1)).toHaveCount(0);
  175 |   await expectSingleUnit(page, P2);
  176 |   await expectTotal(page, P2.unitPrice);
  177 | });
  178 | 
  179 | test('FR07-12 xóa sản phẩm cuối đưa giỏ về trạng thái trống', async ({ page }) => {
  180 |   await openCart(page, P1);
  181 |   await requestRemoval(page, P1, 'confirm');
  182 |   await expect(rows(page)).toHaveCount(0);
  183 |   await expect(emptyMessage(page)).toBeVisible();
  184 |   await expect(emptyIllustration(page)).toBeVisible();
  185 | });
  186 | 
  187 | test('FR07-13 hiển thị nhãn Tổng cộng và tổng đúng', async ({ page }) => {
  188 |   await openCart(page, P1, P2);
  189 |   await expectTotal(page, data.totals.oneOfEach);
  190 | });
  191 | 
  192 | test('FR07-14 tiếp tục mua sắm từ giỏ trống', async ({ page }) => {
  193 |   await openCart(page);
  194 |   await expect(emptyMessage(page)).toBeVisible();
  195 |   await continueShopping(page);
  196 | });
  197 | 
  198 | test('FR07-15 tiếp tục mua sắm từ giỏ có sản phẩm', async ({ page }) => {
  199 |   await openCart(page, P1);
  200 |   await expectSingleUnit(page, P1);
  201 |   await continueShopping(page);
  202 | });
  203 | 
```