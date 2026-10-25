import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const root = '/Apco-components-lib/';
const patternIds = ['workspace', 'controls', 'search', 'results', 'object', 'scanner', 'auth', 'account', 'billing', 'feedback', 'usage', 'history'];

async function choose(page: Page, label: string, option: string) {
  await page.getByRole('button', { name: new RegExp(`^${label} `) }).click();
  await page.getByRole('listbox', { name: label }).getByRole('option', { name: option, exact: true }).click();
}

test('SaaS directory exposes twelve documented and runnable patterns', async ({ page }) => {
  await page.goto(root + '#saas');
  await expect(page.getByRole('heading', { name: /SaaS: от элемента/ })).toBeVisible();
  const directory = page.locator('.s-pattern-directory');
  await expect(directory.locator('a')).toHaveCount(patternIds.length);
  for (const id of patternIds) {
    await expect(directory.locator(`a[href="#saas/${id}"]`)).toBeVisible();
  }
  await directory.locator('a[href="#saas/results"]').click();
  await expect(page.locator('.saas-scope table')).toBeVisible();
  await expect(page.locator('#saas-usage')).toContainText('Правила использования');
  await expect(page.locator('#saas-source a').first()).toHaveAttribute('href', /Assaasdev\/blob\/7cb2bcf/);
});

test('SaaS preview controls, retry, reset and copy fallback remain usable', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: {
      writeText: async () => { throw new Error('Clipboard blocked'); },
    } });
  });
  await page.goto(root + '#saas/results');
  const states = page.getByRole('group', { name: 'Состояние SaaS-примера' });
  await states.getByRole('button', { name: 'Загрузка', exact: true }).click();
  await expect(page.locator('.saas-scope [aria-busy=true]')).toBeVisible();
  await states.getByRole('button', { name: 'Ошибка', exact: true }).click();
  await expect(page.locator('.s-preview-device > .saas-scope').getByRole('alert')).toBeVisible();
  await page.getByRole('button', { name: 'Сбросить', exact: true }).click();
  await expect(page.locator('.saas-scope table')).toBeVisible();
  await expect(states.getByRole('button', { name: 'Обычное', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('group', { name: 'Ширина SaaS-примера' }).getByRole('button', { name: 'Телефон' }).click();
  await expect(page.locator('.s-preview-device')).toHaveAttribute('data-width', 'mobile');
  await page.getByRole('group', { name: 'Тема SaaS-примера' }).getByRole('button', { name: 'Dark', exact: true }).click();
  await expect(page.locator('.s-preview-device > .saas-scope')).toHaveAttribute('data-tone', 'dark');
  await page.getByRole('button', { name: 'Скопировать код', exact: true }).click();
  await expect(page.locator('.s-copy-status')).toContainText('Выделите код');
  await expect(page.locator('#saas-code pre')).toContainText('ResultsPattern');
  await expect(page.locator('#saas-code pre')).toContainText('data-tone="dark"');
  await page.getByRole('button', { name: 'Скопировать ссылку', exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'Ссылка на паттерн для ручного копирования' })).toHaveValue(page.url());
});

test('result pagination distinguishes known totals, unknown totals and plan limits', async ({ page }) => {
  await page.goto(root + '#saas/results');
  const pages = page.getByRole('navigation', { name: 'Example result pages' });
  await expect(pages).toContainText('46 results · Page 1 of 5');
  await expect(pages.getByRole('button', { name: /^Result page / })).toHaveCount(5);
  await expect(pages.getByRole('button', { name: 'Previous result page' })).toBeDisabled();
  await pages.getByRole('button', { name: 'Result page 2', exact: true }).click();
  await expect(page.locator('.s-table tbody tr').first()).toContainText('192.0.2.20');
  await page.getByRole('button', { name: 'Ports', exact: true }).click();
  await expect(page.locator('.s-table th').filter({ hasText: 'Ports' })).toHaveAttribute('aria-sort', 'ascending');
  await expect(pages).toContainText('Page 1 of 5');

  const mode = page.getByRole('button', { name: /^Pagination mode / });
  await mode.press('ArrowDown');
  const list = page.getByRole('listbox', { name: 'Pagination mode' });
  await expect(list).toBeFocused();
  await list.press('Home');
  await list.press('ArrowDown');
  await list.press('Enter');
  await expect(mode).toBeFocused();
  await expect(pages).toContainText('Page 1 · total not provided');
  await expect(pages.getByRole('button', { name: /^Result page / })).toHaveCount(0);
  await expect(pages).not.toContainText('46 results');
  const fullPageHeight = await page.locator('.s-table-scroll').evaluate(el => el.getBoundingClientRect().height);
  for (let index = 0; index < 4; index++) await pages.getByRole('button', { name: 'Next result page' }).click();
  await expect(page.locator('.s-table tbody tr')).toHaveCount(6);
  await expect(pages.getByRole('button', { name: 'Next result page' })).toBeDisabled();
  const lastPageHeight = await page.locator('.s-table-scroll').evaluate(el => el.getBoundingClientRect().height);
  expect(Math.abs(lastPageHeight - fullPageHeight)).toBeLessThanOrEqual(1);
  await choose(page, 'Pagination mode', 'Plan limit · 2 pages');
  await pages.getByRole('button', { name: 'Next result page' }).click();
  await expect(page.locator('.s-preview-device > .saas-scope')).toContainText('Plan limit reached');
  await expect(pages.getByRole('button', { name: 'Next result page' })).toBeDisabled();
});

test('usage distinguishes additional balance and unknown or missing values', async ({ page }) => {
  await page.goto(root + '#saas/usage');
  const search = page.locator('.s-usage-card').filter({ has: page.getByRole('heading', { name: 'Search credits', exact: true }) });
  await expect(search).toContainText('65% remaining');
  await choose(page, 'Balance scenario', 'Additional balance');
  await expect(search).toContainText('12,000');
  await expect(search).toContainText('120% of allocation available');
  await expect(search.getByRole('meter')).toHaveAttribute('aria-valuenow', '10000');
  await expect(search.getByRole('meter')).toHaveAttribute('aria-valuetext', /12,000 available/);
  await choose(page, 'Balance scenario', 'Unknown allocation');
  await expect(search).toContainText('6,500');
  await expect(search).toContainText('Percentage unavailable');
  await expect(search.getByRole('meter')).toHaveCount(0);
  await choose(page, 'Balance scenario', 'Balance not returned');
  await expect(search.locator('.s-usage-amount')).toHaveText('—');
  await expect(search.getByRole('meter')).toHaveCount(0);
});

test('authentication examples validate locally and tabs support keyboard selection', async ({ page }) => {
  await page.goto(root + '#saas/auth');
  const tabs = page.getByRole('tablist', { name: 'Authentication examples' });
  await tabs.getByRole('tab', { name: 'Sign in' }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(tabs.getByRole('tab', { name: 'Verify code' })).toHaveAttribute('aria-selected', 'true');
  await expect(tabs.getByRole('tab', { name: 'Verify code' })).toBeFocused();
  await page.getByLabel('Verification code', { exact: true }).fill('000000');
  await page.getByRole('button', { name: 'Verify demo code' }).click();
  await expect(page.locator('.s-preview-device > .saas-scope')).toContainText('Use the demo code 123456');
  await expect(page.getByLabel('Verification code', { exact: true })).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByLabel('Verification code', { exact: true })).toBeFocused();
  await page.getByLabel('Verification code', { exact: true }).fill('123 456');
  await page.getByRole('button', { name: 'Verify demo code' }).click();
  await expect(page.locator('.s-preview-device > .saas-scope')).toContainText('Demo verification complete. No account was verified.');
});

test('object section errors preserve other tabs and their layout height', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(root + '#saas/object');
  await page.getByRole('group', { name: 'Состояние SaaS-примера' }).getByRole('button', { name: 'Ошибка', exact: true }).click();
  const panels = page.locator('.s-object-panels');
  await expect(panels.getByRole('alert')).toBeVisible();
  const height = await panels.evaluate(el => el.getBoundingClientRect().height);
  const tabs = page.getByRole('tablist', { name: 'Example object sections' });
  await tabs.getByRole('tab', { name: 'Services', exact: true }).click();
  await expect(panels.getByRole('alert')).toHaveCount(0);
  await expect(panels.getByRole('button', { name: /443 HTTPS/ })).toBeVisible();
  await tabs.getByRole('tab', { name: 'WHOIS', exact: true }).click();
  await expect(panels.getByText('Documentation address block', { exact: true })).toBeVisible();
  expect(Math.abs(await panels.evaluate(el => el.getBoundingClientRect().height) - height)).toBeLessThanOrEqual(1);
  await tabs.getByRole('tab', { name: 'Overview', exact: true }).click();
  await expect(panels.getByRole('alert')).toBeVisible();
});

test('scanner validation identifies only the invalid field and moves focus', async ({ page }) => {
  await page.goto(root + '#saas/scanner');
  const targets = page.getByLabel('Hosts and IP addresses', { exact: true });
  const ports = page.getByLabel('Ports', { exact: true });
  await targets.fill('');
  await page.getByRole('button', { name: 'Review scan', exact: true }).click();
  await expect(targets).toHaveAttribute('aria-invalid', 'true');
  await expect(targets).toBeFocused();
  await expect(ports).not.toHaveAttribute('aria-invalid', 'true');
  await targets.fill('192.0.2.12');
  await ports.fill('99999');
  await page.getByRole('button', { name: 'Review scan', exact: true }).click();
  await expect(ports).toHaveAttribute('aria-invalid', 'true');
  await expect(ports).toBeFocused();
  await expect(targets).not.toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('demo API key replacement requires a native dialog and restores focus', async ({ page }) => {
  await page.goto(root + '#saas/account');
  await page.getByRole('tab', { name: 'API key', exact: true }).click();
  const opener = page.getByRole('button', { name: 'Replace demo key', exact: true });
  const sampleKey = page.getByLabel('API key', { exact: true }).and(page.locator('input'));
  await expect(sampleKey).toHaveAttribute('type', 'password');
  await opener.click();
  const dialog = page.getByRole('dialog', { name: 'Replace this demo API key?' });
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveJSProperty('open', true);
  await expect.poll(() => dialog.evaluate(el => el.contains(document.activeElement))).toBe(true);
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(opener).toBeFocused();
  await expect(sampleKey).toHaveValue('apco_demo_only_not_a_real_key_001');
  await opener.click();
  await dialog.getByRole('button', { name: 'Replace demo key', exact: true }).click();
  await expect(dialog).not.toBeVisible();
  await expect(sampleKey).toHaveValue('apco_demo_only_not_a_real_key_002');
  await expect(page.locator('.s-preview-device > .saas-scope')).toContainText('No real API access changed.');
});

test('billing presents correct monthly prices, annual equivalents and full order total', async ({ page }) => {
  await page.goto(root + '#saas/billing');
  const cards = page.locator('.s-plan');
  await expect(cards).toHaveCount(4);
  const plus = cards.filter({ has: page.getByRole('heading', { name: 'Plus', exact: true }) });
  const expert = cards.filter({ has: page.getByRole('heading', { name: 'Expert', exact: true }) });
  const business = cards.filter({ has: page.getByRole('heading', { name: 'Business', exact: true }) });
  await expect(plus.locator('.s-plan-price strong')).toHaveText('$50');
  await expect(expert.locator('.s-plan-price strong')).toHaveText('$300');
  await expect(business.locator('.s-plan-price strong')).toHaveText('$900');
  await page.getByRole('group', { name: 'Billing period' }).getByRole('button', { name: /Annually/ }).click();
  await expect(plus.locator('.s-plan-price strong')).toHaveText('$40');
  await expect(expert.locator('.s-plan-price strong')).toHaveText('$240');
  await expect(business.locator('.s-plan-price strong')).toHaveText('$720');
  await plus.getByRole('button', { name: 'Review Plus' }).click();
  const order = page.getByRole('dialog', { name: 'Review order' });
  await expect(order).toBeVisible();
  await expect(order).toContainText('12 months');
  await expect(order.locator('.s-order-total')).toContainText('$480');
  await expect(order).toContainText('No payment will be created or processed.');
  await order.getByRole('button', { name: 'Close demo order' }).click();
  await expect(order).not.toBeVisible();
});

test('all SaaS patterns fit mobile in both themes without runtime errors', async ({ page }) => {
  test.setTimeout(60000);
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.setViewportSize({ width: 390, height: 844 });
  for (const id of patternIds) {
    await page.goto(root + '#saas/' + id);
    const preview = page.locator('.s-preview-device > .saas-scope');
    await expect(preview, id).toBeVisible();
    for (const theme of ['Light', 'Dark']) {
      await page.getByRole('group', { name: 'Тема SaaS-примера' }).getByRole('button', { name: theme, exact: true }).click();
      await expect(preview).toHaveAttribute('data-tone', theme.toLowerCase());
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth), id + ' / ' + theme).toBeLessThanOrEqual(2);
    }
  }
  expect(errors).toEqual([]);
});

test('native marketing scenes stay inert and readable with reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const id of ['query', 'results', 'host', 'evidence', 'suggestions', 'api']) {
    await page.goto(root + '#components/' + id);
    const scene = page.locator('.docs-component__stage .application-scene');
    await expect(scene).toBeVisible();
    await expect(scene).toHaveAttribute('data-scene', id);
    await expect(scene).toHaveAttribute('aria-hidden', 'true');
    await expect(scene).toHaveAttribute('inert', '');
    await expect(scene).toHaveAttribute('data-demo-playback', 'static');
    expect((await scene.innerText()).length, id + ' static content').toBeGreaterThan(50);
    await expect(scene.locator('button,a,input,select,textarea')).toHaveCount(0);
    await expect(page.locator('apcosys-product-demo,api-developer-demo')).toHaveCount(0);
  }
});

test('component configuration keeps exported code and local preview theme in sync', async ({ page }) => {
  await page.goto(root + '#components/ai-orb');
  const code = page.locator('.docs-component__code pre');
  await expect(code).toContainText('state="idle"');
  await page.getByRole('group', { name: 'Состояние индикатора ассистента' }).getByRole('button', { name: 'answer', exact: true }).click();
  await expect(code).toContainText('state="answer"');
  await page.getByRole('button', { name: 'Сбросить пример' }).click();
  await expect(code).toContainText('state="idle"');
  await expect(page.getByRole('button', { name: 'idle', exact: true })).toHaveAttribute('aria-pressed', 'true');

  await page.goto(root + '#components/tags');
  await page.getByRole('button', { name: 'Тёмная тема', exact: true }).click();
  await page.getByRole('group', { name: 'Тема примера' }).getByRole('button', { name: 'Светлая', exact: true }).click();
  const preview = page.locator('.docs-component__stage');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(preview).toHaveAttribute('data-tone', 'light');
  await expect.poll(() => preview.evaluate(el => getComputedStyle(el).colorScheme)).toBe('light');
  await expect.poll(() => preview.locator('.use-case-tags li').first().evaluate(el => getComputedStyle(el).color)).toBe('rgb(18, 19, 20)');
});

test('SaaS controls and order dialog have no serious accessibility violations', async ({ page }) => {
  test.setTimeout(60000);
  for (const id of ['controls', 'results', 'billing']) {
    await page.goto(root + '#saas/' + id);
    await expect(page.locator('.s-preview-device > .saas-scope')).toBeVisible();
    if (id === 'billing') await page.getByRole('button', { name: 'Review Plus' }).click();
    for (const theme of ['Light', 'Dark']) {
      if (id !== 'billing') await page.getByRole('group', { name: 'Тема SaaS-примера' }).getByRole('button', { name: theme, exact: true }).click();
      const results = await new AxeBuilder({ page }).include(id === 'billing' ? '.s-dialog[open]' : '.s-preview-device > .saas-scope').analyze();
      const serious = results.violations.filter(violation => violation.impact === 'serious' || violation.impact === 'critical');
      expect(serious, id + ' / ' + theme).toEqual([]);
      if (id === 'billing') break;
    }
  }
});
