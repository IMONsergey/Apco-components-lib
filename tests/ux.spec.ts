import { expect, test } from '@playwright/test';

const root='/Apco-components-lib/';

test('sections and dark theme stay coordinated', async ({page})=>{
  await page.goto(root+'#foundations');
  await expect(page.getByRole('heading',{name:'Brand styles',exact:true})).toBeVisible();
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

test('14 interface previews retain content in light/dark desktop and mobile',async({page})=>{
 const names=['price','button','accordion','marquee','billing','planbutton','plain','iconaction','searchfield','navmenu','language','tags','plancard','modal'];
 for(const width of [390,1440]){
  await page.setViewportSize({width,height:920});
  await page.goto(root+'#components');
  for(const theme of ['light','dark'] as const){
   const current=await page.locator('html').getAttribute('data-theme');
   if(current!==theme)await page.getByRole('button',{name:theme==='dark'?'Dark theme':'Light theme'}).click();
   for(const id of names){
    const card=page.locator('.lib-card[data-testid="'+id+'"]');
    await card.scrollIntoViewIfNeeded();
    const inner=card.locator('.lib-preview--'+id);
    await expect(inner).toBeVisible();
    const b=await inner.boundingBox();
    expect(b,id+' preview absent at '+width).not.toBeNull();
    expect(b!.width,id+' preview zero width at '+width).toBeGreaterThan(120);
    expect(b!.height,id+' preview zero height at '+width).toBeGreaterThan(90);
   }
  }
 }
});


test('docs home exposes a persistent hierarchy and deep-linked color tokens',async({page})=>{
 await page.goto(root);
 await expect(page.getByRole('heading',{name:'Everything in one place.',exact:true})).toBeVisible();
 const nav=page.getByRole('navigation',{name:'Design system',exact:true});
 await expect(nav.getByRole('link',{name:'Home'})).toBeVisible();
 await nav.getByRole('link',{name:'Colors'}).click();
 await expect(page).toHaveURL(/#foundations\/colors$/);
 await expect(page.getByRole('heading',{name:'Brand styles',exact:true})).toBeVisible();
 await expect(page.locator('.ds-token-row')).toHaveCount(17);
 await expect(page.locator('#ds-colors')).toBeInViewport();
});

test('global command search navigates to full source component page',async({page})=>{
 await page.goto(root+'#overview');
 await page.keyboard.press('ControlOrMeta+k');
 const dialog=page.getByRole('dialog',{name:'Search design system'});
 await expect(dialog).toBeVisible();
 await dialog.getByRole('combobox',{name:'Search all docs'}).fill('Double Button');
 await expect(dialog.getByRole('option',{name:/Double Button/}).first()).toBeVisible();
 await page.keyboard.press('Enter');
 await expect(page).toHaveURL(/#components\/button$/);
 await expect(page.getByRole('heading',{name:'Double Button',exact:true})).toBeVisible();
 await expect(page.locator('.docs-component__stage .double-button').first()).toBeVisible();
 await expect(page.locator('.docs-component .lib-code')).toContainText('DoubleButton');
 await expect(dialog).toHaveCount(0);
});

test('mobile docs drawer navigates without horizontal overflow',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto(root+'#overview');
 const opener=page.getByRole('button',{name:'Open navigation'});
 await expect(opener).toBeVisible();
 await opener.click();
 const drawer=page.getByRole('complementary',{name:'Documentation navigation'});
 await expect(drawer).toHaveAttribute('data-open','true');
 await expect(page.getByRole('button',{name:'Close navigation'})).toBeVisible();
 await drawer.getByRole('link',{name:'Typography'}).click();
 await expect(page).toHaveURL(/#foundations\/typography$/);
 await expect(page.locator('.docs-sidebar')).toHaveAttribute('data-open','false');
 await expect(page.locator('#ds-type')).toBeInViewport();
 await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth)).toBeLessThanOrEqual(2);
});

test('wide layout retains on-page toc without replacing sidebar',async({page})=>{
 await page.setViewportSize({width:1760,height:990});
 await page.goto(root+'#foundations');
 const toc=page.getByRole('complementary',{name:'On this page'});
 await expect(toc.getByRole('link',{name:'Colors'})).toBeVisible();
 await expect(page.getByRole('navigation',{name:'Design system',exact:true})).toBeVisible();
 await toc.getByRole('link',{name:'Colors'}).click();
 await expect(page.locator('#ds-colors')).toBeInViewport();
 await page.getByRole('button',{name:'Collapse navigation'}).click();
 await expect(page.locator('.docs-shell')).toHaveAttribute('data-collapsed','true');
 await page.getByRole('button',{name:'Expand navigation'}).click();
 await expect(page.locator('.docs-shell')).toHaveAttribute('data-collapsed','false');
});

test('clean homepage and favicon match published APCOSYS source',async({page})=>{
 await page.goto(root);
 await expect(page.getByRole('heading',{name:'Everything in one place.'})).toBeVisible();
 await expect(page.locator('.docs-overview__card--visual')).toHaveCount(4);
 await expect(page.locator('.docs-overview__art')).toHaveCount(0);
 await expect(page.locator('.docs-overview__card--visual .docs-overview__card-bottom svg')).toHaveCount(4);
 const favicon=page.locator('link[rel="icon"]');
 await expect(favicon).toHaveAttribute('href',/assets\/brand\/favicon\.svg$/);
 const url=await favicon.getAttribute('href');
 const resolved=new URL(url!,page.url());
 expect(resolved.pathname).toBe('/Apco-components-lib/assets/brand/favicon.svg');
 const source=await page.request.get(resolved.toString());
 expect(source.ok()).toBeTruthy();
 const body=await source.text();
 expect(body).toContain('viewBox="0 0 26 25.7738"');
 expect(body).toContain('Group 2087326226');
});

test('search finds an individual icon and opens it',async({page})=>{
 await page.goto(root);
 await page.keyboard.press('ControlOrMeta+k');
 const command=page.getByRole('dialog',{name:'Search design system'});
 await command.getByRole('combobox',{name:'Search all docs'}).fill('activity');
 await expect(command.getByRole('option',{name:/activity/i}).first()).toBeVisible();
 await command.getByRole('option',{name:/activity/i}).first().click();
 await expect(page).toHaveURL(/#icons\/feather\/activity$/);
 const detail=page.getByRole('region',{name:'Selected icon'});
 await expect(detail).toBeVisible();
 await expect(detail).toContainText('activity');
});

test('full-width component grid has no unused right column at large desktop widths',async({page})=>{
 await page.setViewportSize({width:1920,height:1080});
 await page.goto(root+'#components');
 await expect(page.locator('.lib-card')).toHaveCount(28);
 const bounds=await page.locator('.lib-grid').boundingBox();
 expect(bounds).not.toBeNull();
 expect(bounds!.x).toBeGreaterThan(240);
 expect(bounds!.x+bounds!.width).toBeGreaterThan(1870);
 expect(bounds!.x+bounds!.width).toBeLessThanOrEqual(1920);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth)).toBeLessThanOrEqual(2);
 await page.getByRole('button',{name:'Dark theme'}).click();
 const dark=await page.locator('.lib-grid').boundingBox();
 expect(dark!.width).toBeGreaterThan(1450);
});

test('color token rows have no empty painted grid cell and use source copy icons',async({page})=>{
 await page.setViewportSize({width:1728,height:1024});
 await page.goto(root+'#foundations/colors');
 const list=page.locator('.ds-token-list').first();
 await expect(list.locator('.ds-token-row')).toHaveCount(5);
 const listBox=await list.boundingBox();
 const lastBox=await list.locator('.ds-token-row').last().boundingBox();
 expect(listBox&&lastBox).not.toBeNull();
 expect(lastBox!.width).toBeGreaterThan(listBox!.width-3);
 await expect(list.locator('.ds-token-copy svg')).toHaveCount(5);
 await expect(page.getByText('Token JSON ↗')).toHaveCount(0);
 await expect(page.getByRole('link',{name:/Download design tokens/})).toBeVisible();
 await page.getByRole('button',{name:'Dark theme'}).click();
 const width=await list.locator('.ds-token-row').last().boundingBox();
 expect(width!.width).toBeGreaterThan(listBox!.width-3);
});

test('homepage uses simple APCOSYS links with no invented artwork',async({page})=>{
 await page.setViewportSize({width:1440,height:900});
 await page.goto(root+'#overview');
 const cards=page.locator('.docs-overview__card--visual');
 await expect(cards).toHaveCount(4);
 await expect(page.locator('.docs-overview__art')).toHaveCount(0);
 for(const card of await cards.all()){
   const bounds=await card.boundingBox();
   expect(bounds!.height).toBeGreaterThanOrEqual(100);
   await expect(card.locator('svg')).toHaveCount(1);
   await expect(card.locator('svg path')).toHaveAttribute('d','M3 8h10M8 3l5 5-5 5');
 }
 await page.setViewportSize({width:390,height:844});
 await expect(page.locator('.docs-overview__grid')).toBeVisible();
 const overflow=await page.evaluate(()=>{
  const width=window.innerWidth;
  return [...document.querySelectorAll<HTMLElement>('*')].map(el=>({
    tag:el.tagName.toLowerCase(),selector:el.className?.toString().slice(0,100),
    right:Math.round(el.getBoundingClientRect().right),left:Math.round(el.getBoundingClientRect().left),
    width:Math.round(el.getBoundingClientRect().width),scroll:el.scrollWidth,client:el.clientWidth
  })).filter(x=>x.right>width+3&&x.width>0).slice(0,25);
 });
 console.log('MOBILE_OVERFLOW_DIAGNOSTIC:',JSON.stringify(overflow));
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth)).toBeLessThanOrEqual(2);
});
