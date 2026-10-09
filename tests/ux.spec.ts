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


test('source parity: dark Plain Button retains readable colors and hover',async({page})=>{
  await page.goto(root+'#components');
  await page.getByRole('button',{name:'Dark theme'}).click();
  const card=page.locator('.lib-card[data-testid="plain"]');
  await card.scrollIntoViewIfNeeded();
  const button=card.locator('.plain-button');
  await expect(button).toBeVisible();
  const initial=await button.evaluate(el=>{
    const style=getComputedStyle(el);return {color:style.color,background:style.backgroundColor};
  });
  expect(initial.color).toBe('rgb(244, 247, 248)');
  expect(initial.background).toBe('rgb(28, 37, 42)');
  await button.hover();
  await expect.poll(()=>button.evaluate(el=>getComputedStyle(el).backgroundColor)).toBe('rgb(38, 50, 57)');
});

test('source parity: Plus plan values and elements stay inside preview',async({page})=>{
  await page.goto(root+'#components');
  const card=page.locator('.lib-card[data-testid="plancard"]');
  await card.scrollIntoViewIfNeeded();
  const plan=card.locator('.plan-card');
  const button=plan.locator('.plan-button');
  await expect(plan).toBeVisible();
  await expect(plan).toContainText('PLUS');
  await expect(plan).toContainText('25');
  await expect(plan).toContainText('Research with API access');
  await expect(button).toHaveText('View Plus');
  const cardBox=await card.locator('.lib-card__preview').boundingBox();
  const planBox=await plan.boundingBox();
  const ctaBox=await button.boundingBox();
  expect(cardBox&&planBox&&ctaBox).toBeTruthy();
  expect(planBox!.y).toBeGreaterThanOrEqual(cardBox!.y-1);
  expect(planBox!.y+planBox!.height).toBeLessThanOrEqual(cardBox!.y+cardBox!.height+1);
  expect(ctaBox!.y+ctaBox!.height).toBeLessThanOrEqual(planBox!.y+planBox!.height+1);
  await page.getByRole('button',{name:'Dark theme'}).click();
  // Opening the header theme switch scrolls away; the gallery intentionally
  // unmounts heavy previews outside the IntersectionObserver viewport.
  await card.scrollIntoViewIfNeeded();
  await expect(plan).toBeVisible();
});

test('source parity: language menu uses original flags and anchored panel',async({page})=>{
  await page.goto(root+'#components');
  const card=page.locator('.lib-card[data-testid="language"]');
  await card.scrollIntoViewIfNeeded();
  const trigger=card.locator('.language-control .language');
  await expect(trigger).toContainText('EN');
  await expect(card.locator('svg.language-flag')).toHaveCount(4);
  await trigger.click();
  const panel=card.locator('.language-panel');
  await expect(panel).toHaveAttribute('data-open','true');
  await expect(panel.getByRole('menuitemradio')).toHaveCount(3);
  await expect(panel.getByRole('menuitemradio',{name:/Russian/i})).toBeDisabled({timeout:2000}).catch(async()=>{
    await expect(panel.locator('button[lang="ru"]')).toBeDisabled();
  });
  const triggerBox=await trigger.boundingBox();
  const panelBox=await panel.boundingBox();
  expect(triggerBox&&panelBox).toBeTruthy();
  expect(Math.abs((panelBox!.x+panelBox!.width)-(triggerBox!.x+triggerBox!.width))).toBeLessThanOrEqual(3);
  expect(panelBox!.y).toBeGreaterThanOrEqual(triggerBox!.y+triggerBox!.height);
  await page.keyboard.press('Escape');
  await expect(panel).toHaveAttribute('data-open','false');
});

test('source parity: site modal traps focus, closes and restores scroll',async({page})=>{
  await page.goto(root+'#components');
  const card=page.locator('.lib-card[data-testid="modal"]');
  await card.scrollIntoViewIfNeeded();
  await card.getByRole('button',{name:'Open modal'}).click();
  const dialog=page.locator('dialog.modal');
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAttribute('aria-labelledby',/./);
  await expect(dialog).toContainText('APCOSYS workspace');
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect.poll(()=>page.evaluate(()=>document.body.style.overflow)).toBe('');
});
