import { expect, test } from '@playwright/test';

const root='/Apco-components-lib/';

test('sections and dark theme stay coordinated', async ({page})=>{
  await page.goto(root+'#foundations');
  await expect(page.getByRole('heading',{name:'Foundations',exact:true})).toBeVisible();
  await expect(page.locator('.ds-token-row')).toHaveCount(17);
  const first=page.locator('.ds-token-row').first();
  await expect(first).toContainText('#F6F6F6');
  await page.getByRole('button',{name:'Dark theme'}).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
  await expect(first).toContainText('#0D1113');
  await expect.poll(async()=>page.locator('body').evaluate(el=>getComputedStyle(el).backgroundColor)).toBe('rgb(13, 17, 19)');
  const breakpoint=page.locator('details').filter({hasText:'Responsive breakpoints'});
  await expect(breakpoint).not.toHaveAttribute('open','');
  await breakpoint.locator('summary').click();
  await expect(breakpoint).toHaveAttribute('open','');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
});

test('icon selection shows immediate copy inspector and dismisses', async ({page})=>{
  await page.goto(root+'#icons');
  await page.getByRole('button',{name:/Feather/}).click();
  await page.getByRole('button',{name:'activity',exact:true}).click();
  const inspector=page.getByRole('region',{name:'Selected icon'});
  await expect(inspector).toBeVisible();
  await expect(inspector).toContainText('activity');
  await expect(inspector).toContainText('LibraryIcon');
  await expect.poll(()=>inspector.evaluate(el=>getComputedStyle(el).position)).toBe('fixed');
  await inspector.getByRole('button',{name:'Close icon inspector'}).click();
  await expect(inspector).toHaveCount(0);
  const settings=page.locator('details.ds-icon-settings');
  await expect(settings).not.toHaveAttribute('open','');
  await settings.locator('summary').click();
  await expect(settings).toHaveAttribute('open','');
});

test('guidelines use progressive disclosure',async({page})=>{
  await page.goto(root+'#guidelines');
  const rules=page.locator('details.ds-guideline');
  await expect(rules).toHaveCount(10);
  await expect(rules.first()).not.toHaveAttribute('open','');
  await rules.first().locator('summary').click();
  await expect(rules.first()).toHaveAttribute('open','');
  await expect(rules.first()).toContainText('Avoid');
  const examples=page.locator('details.ds-doc-details').first();
  await expect(examples).not.toHaveAttribute('open','');
});

test('component inspector displays preview and usable code',async({page})=>{
  await page.goto(root+'#components');
  await expect(page.locator('.lib-card')).toHaveCount(28);
  await page.getByRole('button',{name:'Double Button',exact:true}).click();
  const dialog=page.locator('dialog.lib-dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('.lib-dialog__preview')).toBeVisible();
  await expect(dialog.locator('pre.lib-code')).toContainText('DoubleButton');
  const box=await dialog.locator('.lib-dialog__preview').boundingBox();
  const code=await dialog.locator('pre.lib-code').boundingBox();
  expect(box).not.toBeNull();
  expect(code).not.toBeNull();
  expect(box!.x+box!.width).toBeLessThanOrEqual(code!.x+8);
  await dialog.getByRole('button',{name:'Close'}).click();
  await expect(dialog).toHaveCount(0);
});

test('small screens have no horizontal overflow and inspector fits viewport',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto(root+'#icons');
  await page.getByRole('button',{name:/Feather/}).click();
  await page.getByRole('button',{name:'activity',exact:true}).click();
  const inspector=page.getByRole('region',{name:'Selected icon'});
  await expect(inspector).toBeVisible();
  const bounds=await inspector.boundingBox();
  expect(bounds).not.toBeNull();
  expect(bounds!.x).toBeGreaterThanOrEqual(0);
  expect(bounds!.x+bounds!.width).toBeLessThanOrEqual(391);
  await inspector.getByRole('button',{name:'Close icon inspector'}).click();
  const overflows=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+2);
  expect(overflows).toBe(false);
});
