import { expect, test as base, type APIRequestContext, type Page, type Request, type TestInfo } from '@playwright/test';
import { randomUUID } from 'node:crypto';
import data from '../data/fr-14.json';

type Role = keyof typeof data.accounts;
type Category = { id: number; name: string };
type ResponseWithCategory = { ok(): boolean; json(): Promise<{ id: number }> };

const categoriesUrl = `${data.apiUrl}/categories`;
const categoryUrl = (id: number) => `${categoriesUrl}/${id}`;
const auth = (token: string) => ({ Authorization: `Bearer ${token}` });

async function logInViaApi(request: APIRequestContext, role: Role): Promise<string> {
  const response = await request.post(`${data.apiUrl}/login`, { data: data.accounts[role] });
  await expect(response).toBeOK();
  const { token, user } = await response.json();
  expect(user.role).toBe(role);
  expect(token).toBeTruthy();
  return token;
}

function categoryFixture(request: APIRequestContext, testInfo: TestInfo) {
  const prefix = `${testInfo.title.slice(0, 7)}-${randomUUID().slice(0, 8)}`;
  const created = new Set<number>();
  let adminToken: Promise<string> | undefined;
  const adminHeaders = async () => auth(await (adminToken ??= logInViaApi(request, 'admin')));

  async function trackCreation(response: ResponseWithCategory) {
    if (!response.ok()) return;
    const { id } = await response.json();
    expect(Number.isInteger(id), 'POST danh mục phải trả ID dùng để dọn dữ liệu').toBe(true);
    created.add(id);
    return id;
  }

  async function list(): Promise<Category[]> {
    const response = await request.get(categoriesUrl, { headers: await adminHeaders() });
    await expect(response).toBeOK();
    const categories: Category[] = await response.json();
    return categories.sort((a, b) => a.id - b.id);
  }

  return {
    adminHeaders,
    name: (suffix: string) => `${prefix} ${suffix}`,
    list,
    trackCreation,
    async create(name: string): Promise<Category> {
      const response = await request.post(categoriesUrl, { headers: await adminHeaders(), data: { name } });
      await expect(response).toBeOK();
      const id = await trackCreation(response);
      return { id: id!, name };
    },
    async cleanup() {
      for (const id of created) {
        const response = await request.delete(categoryUrl(id), { headers: await adminHeaders() });
        expect.soft(response.ok() || response.status() === 404, `Dọn danh mục thử #${id}`).toBe(true);
      }
    },
  };
}

const test = base.extend<{ catalog: ReturnType<typeof categoryFixture> }>({
  catalog: async ({ request }, use, testInfo) => {
    const catalog = categoryFixture(request, testInfo);
    try {
      await use(catalog);
    } finally {
      await catalog.cleanup();
    }
  },
});

// Failures are independent, but list snapshots must not overlap other category writes.
test.describe.configure({ mode: 'default' });

const categoryHeading = (page: Page) => page.getByRole('heading', { name: 'Quản lý Danh mục', exact: true });
const loginHeading = (page: Page) => page.getByRole('heading', { name: 'Admin Login', exact: true });
const nameInput = (page: Page) => page.getByPlaceholder('Tên danh mục mới', { exact: true });
const addButton = (page: Page) => page.getByRole('button', { name: 'Thêm mới', exact: true });
const rowByCell = (page: Page, value: string) => page.getByRole('table').getByRole('row')
  .filter({ has: page.getByRole('cell', { name: value, exact: true }) });

async function fillLogin(page: Page, role: Role) {
  await page.goto(data.adminUrl);
  await page.getByPlaceholder('Email', { exact: true }).fill(data.accounts[role].email);
  await page.getByPlaceholder('Password', { exact: true }).fill(data.accounts[role].password);
}

async function openCategories(page: Page) {
  await page.getByText('Danh mục', { exact: true }).click();
  await expect(categoryHeading(page)).toBeVisible();
}

async function openAsAdmin(page: Page) {
  await fillLogin(page, 'admin');
  await page.getByRole('button', { name: 'Login', exact: true }).click();
  await openCategories(page);
}

function isCategoryCreate(request: Request) {
  return request.url() === categoriesUrl && request.method() === 'POST';
}

function waitForCreate(page: Page, timeout?: number) {
  return page.waitForResponse(response => isCategoryCreate(response.request()), { timeout });
}

async function assertCategory(page: Page, id: number, name: string) {
  const row = rowByCell(page, `#${id}`);
  await expect(row).toHaveCount(1);
  await expect(row).toBeVisible();
  await expect(row.getByRole('cell').nth(1)).toHaveText(name);
}

async function createOnWeb(page: Page, catalog: ReturnType<typeof categoryFixture>, name: string) {
  await nameInput(page).fill(name);
  await expect(nameInput(page)).toHaveValue(name);
  const [response] = await Promise.all([waitForCreate(page), addButton(page).click()]);
  expect(response.ok(), 'POST từ form phải tạo danh mục thành công').toBe(true);
  const id = await catalog.trackCreation(response);
  await expect(rowByCell(page, name)).toHaveCount(1);
  await assertCategory(page, id!, name);
  return id!;
}

function expectRejected(status: number) {
  expect.soft(Math.floor(status / 100), `Phải từ chối yêu cầu, nhận HTTP ${status}`).toBe(4);
}

test('FR14-01 admin xem các danh mục mẫu', async ({ page }) => {
  await openAsAdmin(page);
  for (const { name, id } of data.seed) {
    await expect(rowByCell(page, name)).toHaveCount(1);
    await assertCategory(page, id, name);
  }
});

test('FR14-02 tạo danh mục từ web admin', async ({ page, catalog }) => {
  await openAsAdmin(page);
  await createOnWeb(page, catalog, catalog.name(data.names.create));
});

test('FR14-03 danh mục vẫn còn sau khi tải lại', async ({ page, catalog }) => {
  const entry = await catalog.create(catalog.name(data.names.fixtureA));
  await openAsAdmin(page);
  await assertCategory(page, entry.id, entry.name);
  await page.reload();
  await openCategories(page);
  await assertCategory(page, entry.id, entry.name);
});

test('FR14-04 sửa qua API và xem tên mới trên web admin', async ({ request, page, catalog }) => {
  const first = await catalog.create(catalog.name(data.names.fixtureA));
  const second = await catalog.create(catalog.name(data.names.fixtureB));
  const name = catalog.name(data.names.updated);
  const response = await request.put(categoryUrl(first.id), { headers: await catalog.adminHeaders(), data: { name } });
  await expect(response).toBeOK();
  await openAsAdmin(page);
  await assertCategory(page, first.id, name);
  await assertCategory(page, second.id, second.name);
});

for (const [id, label, name] of [
  ['FR14-05', 'tên rỗng', data.invalid.empty],
  ['FR14-06', 'tên chỉ có khoảng trắng', data.invalid.whitespace],
]) {
  test(`${id} từ chối thêm danh mục với ${label}`, async ({ page, catalog }) => {
    const before = await catalog.list();
    await openAsAdmin(page);
    const input = nameInput(page);
    const submit = addButton(page);
    await input.fill(name);
    await expect(input).toHaveValue(name);
    if (await submit.isDisabled()) {
      await expect(submit).toBeDisabled();
    } else {
      let postSent = false;
      const observePost = (request: Request) => { postSent ||= isCategoryCreate(request); };
      page.on('request', observePost);
      try {
        const [response] = await Promise.all([
          waitForCreate(page, 5000).catch(error => {
            if (error.name !== 'TimeoutError') throw error;
            return null;
          }),
          submit.click(),
        ]);
        if (response) {
          expect(await response.finished(), 'POST danh mục phải hoàn tất').toBeNull();
          await catalog.trackCreation(response);
          expectRejected(response.status());
        } else {
          expect(postSent, 'POST đã gửi nhưng chưa nhận phản hồi').toBe(false);
          const invalid = await input.evaluate(element =>
            element.matches(':invalid') || element.getAttribute('aria-invalid') === 'true');
          expect(invalid || await submit.isDisabled(), 'Form phải có dấu hiệu chặn tên không hợp lệ').toBe(true);
        }
      } finally {
        page.off('request', observePost);
      }
    }
    expect(await catalog.list()).toEqual(before);
  });
}

test('FR14-07 từ chối sửa thành tên rỗng', async ({ request, catalog }) => {
  const entry = await catalog.create(catalog.name(data.names.fixtureA));
  const response = await request.put(categoryUrl(entry.id), {
    headers: await catalog.adminHeaders(), data: { name: data.invalid.empty },
  });
  expectRejected(response.status());
  expect((await catalog.list()).find(category => category.id === entry.id)?.name).toBe(entry.name);
});

test('FR14-08 xóa đúng danh mục và kiểm tra lại sau tải trang', async ({ page, catalog }) => {
  const first = await catalog.create(catalog.name(data.names.fixtureA));
  const second = await catalog.create(catalog.name(data.names.fixtureB));
  await openAsAdmin(page);
  await assertCategory(page, first.id, first.name);
  page.once('dialog', dialog => dialog.accept());
  await rowByCell(page, `#${first.id}`).getByRole('button', { name: 'Xóa', exact: true }).click();
  const confirm = page.getByRole('dialog').or(page.getByRole('alertdialog'))
    .getByRole('button', { name: /^(Xóa|Xác nhận|Đồng ý)$/i });
  if (await confirm.isVisible()) await confirm.click();
  await expect(rowByCell(page, `#${first.id}`)).toHaveCount(0);
  await page.reload();
  await openCategories(page);
  await assertCategory(page, second.id, second.name);
  await expect(rowByCell(page, `#${first.id}`)).toHaveCount(0);
});

test('FR14-09 khách phải đăng nhập để vào quản lý danh mục', async ({ page }) => {
  await page.goto(data.adminUrl);
  await expect(loginHeading(page)).toBeVisible();
  await expect(categoryHeading(page)).toHaveCount(0);
  await expect(addButton(page)).toHaveCount(0);
});

test('FR14-10 tài khoản user bị từ chối vào web admin', async ({ page }) => {
  await fillLogin(page, 'user');
  let denial = '';
  page.once('dialog', async dialog => {
    denial = dialog.message();
    await dialog.dismiss();
  });
  await page.getByRole('button', { name: 'Login', exact: true }).click();
  const message = /không phải là admin|không có quyền|quyền truy cập/i;
  await expect.poll(async () => message.test(denial) || await page.getByText(message).isVisible()).toBe(true);
  await expect(loginHeading(page)).toBeVisible();
  await expect(categoryHeading(page)).toHaveCount(0);
});

test('FR14-11 POST danh mục yêu cầu JWT', async ({ request, catalog }) => {
  const before = await catalog.list();
  const response = await request.post(categoriesUrl, { data: { name: catalog.name(data.names.create) } });
  await catalog.trackCreation(response);
  expectRejected(response.status());
  expect(await catalog.list()).toEqual(before);
});

test('FR14-12 JWT không hợp lệ không được xóa danh mục', async ({ request, catalog }) => {
  const entry = await catalog.create(catalog.name(data.names.fixtureA));
  const response = await request.delete(categoryUrl(entry.id), { headers: auth(data.invalid.token) });
  expectRejected(response.status());
  expect((await catalog.list()).find(category => category.id === entry.id)).toEqual(entry);
});

test('FR14-13 JWT user không được thêm danh mục', async ({ request, catalog }) => {
  const before = await catalog.list();
  const headers = auth(await logInViaApi(request, 'user'));
  const response = await request.post(categoriesUrl, { headers, data: { name: catalog.name(data.names.create) } });
  await catalog.trackCreation(response);
  expectRejected(response.status());
  expect(await catalog.list()).toEqual(before);
});

test('FR14-14 JWT user không được sửa danh mục', async ({ request, catalog }) => {
  const entry = await catalog.create(catalog.name(data.names.fixtureA));
  const headers = auth(await logInViaApi(request, 'user'));
  const response = await request.put(categoryUrl(entry.id), { headers, data: { name: catalog.name(data.names.updated) } });
  expectRejected(response.status());
  expect((await catalog.list()).find(category => category.id === entry.id)).toEqual(entry);
});

test('FR14-15 JWT user không được xóa danh mục', async ({ request, catalog }) => {
  const entry = await catalog.create(catalog.name(data.names.fixtureA));
  const response = await request.delete(categoryUrl(entry.id), { headers: auth(await logInViaApi(request, 'user')) });
  expectRejected(response.status());
  expect((await catalog.list()).find(category => category.id === entry.id)).toEqual(entry);
});

test('FR14-16 tạo tên danh mục gồm đúng một ký tự', async ({ page, catalog }) => {
  const name = data.names.single;
  expect((await catalog.list()).some(category => category.name === name)).toBe(false);
  await openAsAdmin(page);
  await createOnWeb(page, catalog, name);
});

test('FR14-17 tạo liên tiếp hai danh mục khác tên', async ({ page, catalog }) => {
  const first = catalog.name(data.names.sequentialFirst);
  const second = catalog.name(data.names.sequentialSecond);
  await openAsAdmin(page);
  const firstId = await createOnWeb(page, catalog, first);
  const secondId = await createOnWeb(page, catalog, second);
  expect(secondId).not.toBe(firstId);
  await assertCategory(page, firstId, first);
  await expect(rowByCell(page, first)).toHaveCount(1);
});

test('FR14-18 danh mục vừa tạo vẫn còn sau khi đổi tab', async ({ page, catalog }) => {
  const name = catalog.name(data.names.switchTab);
  await openAsAdmin(page);
  const id = await createOnWeb(page, catalog, name);
  await page.getByText('Dashboard', { exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Dashboard', exact: true })).toBeVisible();
  await openCategories(page);
  await assertCategory(page, id, name);
});
