import { expect, test, type Page } from '@playwright/test';
import data from '../data/fr-06.json';

const { products, quantities, badge } = data;
const { P1, P2, P3 } = products;
type Product = (typeof products)[keyof typeof products];

test.use({ locale: 'vi-VN' });

function cartLink(page: Page) {
  return page.getByRole('banner').getByRole('link', { name: /^Giỏ hàng/i });
}

function cartBadge(page: Page, value: string) {
  return cartLink(page).getByText(value, { exact: true });
}

function cartRow(page: Page, product: Product) {
  return page.getByRole('row').filter({
    has: page.getByRole('cell', { name: product.name, exact: true }),
  });
}

function addButton(page: Page) {
  return page.getByRole('button', { name: /^(Thêm vào giỏ hàng|Đã thêm)$/i });
}

async function openProduct(page: Page, product: Product) {
  await page.goto(product.path, { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { name: product.name, exact: true })).toBeVisible();
}

async function selectProduct(page: Page, product: Product) {
  await page.getByRole('main').getByRole('link', { name: 'Xem chi tiết', exact: true })
    .and(page.locator(`[href="${product.path}"]`)).click();
}

async function openCart(page: Page) {
  await cartLink(page).click();
  await expect(page).toHaveURL('/cart');
  await expect(page.getByRole('heading', { name: /^Giỏ hàng/i })).toBeVisible();
}

test('FR06-01 mở đúng chi tiết và có một H1', async ({ page }) => {
  await page.goto('/');
  await selectProduct(page, P1);
  await expect(page).toHaveURL(P1.path);
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('h1')).toHaveText(P1.name);
});

test('FR06-02 hiển thị ảnh chi tiết đúng và tải được', async ({ page }) => {
  await openProduct(page, P1);
  const image = page.getByRole('main').getByRole('img');
  await expect(image).toBeVisible();
  await expect(image).toHaveAttribute('src', P1.image);
  await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.naturalWidth),
    { message: 'Ảnh chi tiết phải tải được', timeout: 10000 }).toBeGreaterThan(0);
});

test('FR06-03 ảnh sản phẩm có alt không rỗng', async ({ page }) => {
  await openProduct(page, P2);
  await expect(page.getByRole('main').locator('img')).toHaveAttribute('alt', /\S/);
});

test('FR06-04 định dạng giá khi API trả số', async ({ page }) => {
  await openProduct(page, P1);
  await expect(page.getByRole('main').getByText(P1.price, { exact: true })).toBeVisible();
});

test('FR06-05 định dạng giá khi API trả chuỗi', async ({ page }) => {
  await openProduct(page, P2);
  await expect(page.getByRole('main').getByText(P2.price, { exact: true })).toBeVisible();
});

test('FR06-06 hiển thị mô tả đúng sản phẩm', async ({ page }) => {
  await openProduct(page, P2);
  await expect(page.getByRole('main').getByText(P2.description, { exact: true })).toBeVisible();
});

test('FR06-07 hiển thị danh mục của sản phẩm', async ({ page }) => {
  await openProduct(page, P3);
  const main = page.getByRole('main');
  const category = main.getByText(P3.category, { exact: true })
    .or(main.getByText(`Danh mục: ${P3.category}`, { exact: true }));
  await expect(category).toBeVisible();
});

test('FR06-08 breadcrumb hiển thị trang hiện tại và dẫn về trang chủ', async ({ page }) => {
  await openProduct(page, P1);
  const home = page.getByRole('link', { name: 'Trang chủ', exact: true });
  const breadcrumb = page.locator('nav, ol, ul, .breadcrumb')
    .filter({ has: home })
    .filter({ has: page.getByText(P1.name, { exact: true }) })
    .last();
  await expect(breadcrumb).toBeVisible();
  await expect(breadcrumb.getByText(P1.name, { exact: true })).toBeVisible();
  await breadcrumb.getByRole('link', { name: 'Trang chủ', exact: true }).click();
  await expect(page).toHaveURL('/');
});

test('FR06-09 phản hồi trực quan sau một lần bấm thêm', async ({ page }) => {
  await openProduct(page, P1);
  const quantity = page.getByRole('spinbutton');
  await quantity.fill(quantities.minimum);
  await expect(quantity).toHaveValue(quantities.minimum);
  await addButton(page).click();

  const confirmation = /đã thêm|thêm .*thành công/i;
  const toast = page.getByRole('status').or(page.getByRole('alert')).filter({ hasText: confirmation });
  await expect.poll(async () => {
    const visibleToasts = await toast.filter({ visible: true }).count();
    return visibleToasts > 0 || await cartBadge(page, badge.afterFirst).isVisible();
  }, { message: 'Một lần bấm phải hiển thị toast hoặc cập nhật badge' }).toBe(true);
});

test('FR06-10 một lần bấm thêm đúng số lượng 2', async ({ page }) => {
  await openProduct(page, P1);
  const quantity = page.getByRole('spinbutton');
  await quantity.fill(quantities.multiple);
  await expect(quantity).toHaveValue(quantities.multiple);
  await addButton(page).click();
  await openCart(page);
  const row = cartRow(page, P1);
  await expect(row).toBeVisible();
  await expect(row.getByRole('cell').nth(2)).toHaveText(quantities.multiple);
});

for (const { id, label, value } of quantities.invalid) {
  test(`${id} từ chối số lượng không hợp lệ: ${label}`, async ({ page }) => {
    await openProduct(page, P1);
    const quantity = page.getByRole('spinbutton');
    await quantity.fill(value);
    await expect(quantity).toHaveValue(value);
    await addButton(page).click();
    await openCart(page);
    await expect(cartRow(page, P1)).toHaveCount(0);
  });
}

test('FR06-15 badge tăng sau từng lần thêm hai sản phẩm khác nhau', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await openCart(page);
  await expect(page.getByRole('heading', { name: 'Giỏ hàng của bạn đang trống' })).toBeVisible();

  const homeLink = page.getByRole('banner').getByRole('link', { name: 'EShop', exact: true });
  await homeLink.click();
  await selectProduct(page, P1);
  await expect(page).toHaveURL(P1.path);
  await page.getByRole('spinbutton').fill(quantities.minimum);
  await addButton(page).click();

  await openCart(page);
  const firstRow = cartRow(page, P1);
  await expect(firstRow).toBeVisible();
  await expect(firstRow.getByRole('cell').nth(2)).toHaveText(quantities.minimum);
  await expect(cartBadge(page, badge.afterFirst)).toHaveText(badge.afterFirst);

  await homeLink.click();
  await selectProduct(page, P2);
  await expect(page).toHaveURL(P2.path);
  await page.getByRole('spinbutton').fill(quantities.minimum);
  await addButton(page).click();

  await openCart(page);
  const secondRow = cartRow(page, P2);
  await expect(firstRow).toBeVisible();
  await expect(secondRow).toBeVisible();
  await expect(firstRow.getByRole('cell').nth(2)).toHaveText(quantities.minimum);
  await expect(secondRow.getByRole('cell').nth(2)).toHaveText(quantities.minimum);
  await expect(cartBadge(page, badge.afterSecond)).toHaveText(badge.afterSecond);
});
