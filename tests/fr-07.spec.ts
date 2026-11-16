import { expect, test, type Dialog, type Locator, type Page } from '@playwright/test';
import data from '../data/fr-07.json';

const { P1, P2 } = data.products;
const { single, double } = data.quantities;
type Product = (typeof data.products)[keyof typeof data.products];

test.use({ locale: 'vi-VN' });

function main(page: Page) {
  return page.getByRole('main');
}

function rows(page: Page) {
  return main(page).getByRole('row').filter({ has: page.getByRole('cell') });
}

function productRow(page: Page, product: Product) {
  return rows(page).filter({
    has: page.getByRole('cell', { name: product.name, exact: true }),
  });
}

function quantityCell(row: Locator) {
  return row.getByRole('cell').nth(2);
}

function emptyMessage(page: Page) {
  return main(page).getByText(/giỏ hàng.*(?:đang trống|không có sản phẩm)/i);
}

function emptyIllustration(page: Page) {
  return main(page).getByRole('img').or(main(page).locator('svg, img')).first();
}

async function openCart(page: Page, ...products: Product[]) {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  for (const product of products) {
    const card = main(page).getByRole('heading', { name: product.name, exact: true }).locator('..');
    await card.getByRole('button', { name: 'Thêm vào giỏ', exact: true }).click({ timeout: 5000 });
  }
  await page.getByRole('banner').getByRole('link', { name: /^Giỏ hàng/i }).click();
  await expect(page).toHaveURL('/cart');
}

async function expectTotal(page: Page, amount: string) {
  await expect(main(page).getByText(`${data.totalLabel}: ${amount}`, { exact: true })).toBeVisible();
}

async function expectSingleUnit(page: Page, product: Product) {
  const row = productRow(page, product);
  await expect(row).toHaveCount(1);
  await expect(row).toBeVisible();
  await expect(quantityCell(row)).toHaveText(single);
}

async function requestRemoval(page: Page, product: Product, action: 'inspect' | 'cancel' | 'confirm') {
  const row = productRow(page, product);
  let dialogType: string | undefined;
  const handleDialog = async (dialog: Dialog) => {
    dialogType = dialog.type();
    if (dialogType === 'confirm' && action === 'confirm') {
      await dialog.accept();
    } else {
      await dialog.dismiss();
    }
  };
  page.once('dialog', handleDialog);
  try {
    await row.getByRole('button', { name: /^Xóa(?: sản phẩm)?$/i }).click();
  } finally {
    page.off('dialog', handleDialog);
  }

  if (dialogType !== undefined) {
    expect(dialogType, 'Hộp thoại gốc phải yêu cầu xác nhận xóa').toBe('confirm');
    return;
  }

  const dialog = page.getByRole('alertdialog').or(page.getByRole('dialog'));
  await expect(dialog, 'Phải hiển thị dialog xác nhận trước khi xóa').toBeVisible();
  await expect(row).toBeVisible();
  if (action !== 'inspect') {
    const button = action === 'confirm' ? /^(xác nhận|xóa|đồng ý)$/i : /^(hủy|hủy bỏ|không)$/i;
    await dialog.getByRole('button', { name: button }).click();
  }
}

async function continueShopping(page: Page) {
  const name = { name: data.continueLabel, exact: true };
  const control = main(page).getByRole('link', name).or(main(page).getByRole('button', name));
  await expect(control).toBeVisible();
  await control.click();
  await expect(page).toHaveURL('/');
}

test('FR07-01 giỏ trống có thông báo và không có dòng sản phẩm', async ({ page }) => {
  await openCart(page);
  await expect(emptyMessage(page)).toBeVisible();
  await expect(rows(page)).toHaveCount(0);
});

test('FR07-02 giỏ trống có hình minh họa', async ({ page }) => {
  await openCart(page);
  await expect(emptyMessage(page)).toBeVisible();
  await expect(emptyIllustration(page)).toBeVisible();
});

test('FR07-03 bảng giỏ có đúng năm tiêu đề cột', async ({ page }) => {
  await openCart(page, P1);
  await expect(main(page).getByRole('columnheader')).toHaveText(data.columns);
});

test('FR07-04 dòng sản phẩm có đơn giá, số lượng và thành tiền', async ({ page }) => {
  await openCart(page, P1);
  const cells = productRow(page, P1).getByRole('cell');
  await expect(cells.nth(0)).toHaveText(P1.name);
  await expect(cells.nth(1)).toHaveText(P1.unitPrice);
  await expect(cells.nth(2)).toHaveText(single);
  await expect(cells.nth(3)).toHaveText(P1.unitPrice);
});

test('FR07-05 tăng số lượng và tính lại tiền', async ({ page }) => {
  await openCart(page, P1);
  const row = productRow(page, P1);
  await row.getByRole('button', { name: /^(\+|tăng(?: số lượng)?)$/i }).click({ timeout: 5000 });
  await expect(quantityCell(row)).toHaveText(double);
  await expect(row.getByRole('cell').nth(3)).toHaveText(data.totals.doubleP1);
  await expectTotal(page, data.totals.doubleP1);
});

test('FR07-06 giảm số lượng và tính lại tiền', async ({ page }) => {
  await openCart(page, P1, P1);
  const row = productRow(page, P1);
  await expect(row, 'Chuẩn bị FR07-06: P1 phải nằm trên đúng một dòng').toHaveCount(1);
  await expect(quantityCell(row), 'Chuẩn bị FR07-06: P1 phải có số lượng 2').toHaveText(double);
  await row.getByRole('button', { name: /^(-|−|giảm(?: số lượng)?)$/i }).click({ timeout: 5000 });
  await expectSingleUnit(page, P1);
  await expect(row.getByRole('cell').nth(3)).toHaveText(P1.unitPrice);
  await expectTotal(page, P1.unitPrice);
});

test('FR07-07 gộp hai lần thêm cùng sản phẩm', async ({ page }) => {
  await openCart(page, P1, P1);
  const row = productRow(page, P1);
  await expect(row).toHaveCount(1);
  await expect(quantityCell(row)).toHaveText(double);
});

test('FR07-08 sản phẩm khác nhau nằm trên hai dòng', async ({ page }) => {
  await openCart(page, P1, P2);
  await expect(rows(page)).toHaveCount(2);
  await expectSingleUnit(page, P1);
  await expectSingleUnit(page, P2);
});

test('FR07-09 yêu cầu xác nhận trước khi xóa', async ({ page }) => {
  await openCart(page, P1);
  await requestRemoval(page, P1, 'inspect');
  await expect(productRow(page, P1)).toBeVisible();
});

test('FR07-10 hủy xóa giữ nguyên giỏ và tổng tiền', async ({ page }) => {
  await openCart(page, P1, P2);
  await requestRemoval(page, P1, 'cancel');
  await expectSingleUnit(page, P1);
  await expectSingleUnit(page, P2);
  await expectTotal(page, data.totals.oneOfEach);
});

test('FR07-11 xác nhận xóa đúng sản phẩm và tính lại tổng', async ({ page }) => {
  await openCart(page, P1, P2);
  await requestRemoval(page, P1, 'confirm');
  await expect(productRow(page, P1)).toHaveCount(0);
  await expectSingleUnit(page, P2);
  await expectTotal(page, P2.unitPrice);
});

test('FR07-12 xóa sản phẩm cuối đưa giỏ về trạng thái trống', async ({ page }) => {
  await openCart(page, P1);
  await requestRemoval(page, P1, 'confirm');
  await expect(rows(page)).toHaveCount(0);
  await expect(emptyMessage(page)).toBeVisible();
  await expect(emptyIllustration(page)).toBeVisible();
});

test('FR07-13 hiển thị nhãn Tổng cộng và tổng đúng', async ({ page }) => {
  await openCart(page, P1, P2);
  await expectTotal(page, data.totals.oneOfEach);
});

test('FR07-14 tiếp tục mua sắm từ giỏ trống', async ({ page }) => {
  await openCart(page);
  await expect(emptyMessage(page)).toBeVisible();
  await continueShopping(page);
});

test('FR07-15 tiếp tục mua sắm từ giỏ có sản phẩm', async ({ page }) => {
  await openCart(page, P1);
  await expectSingleUnit(page, P1);
  await continueShopping(page);
});
