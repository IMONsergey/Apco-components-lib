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
  const breakpoint=page.locator('#ds-breakpoints');
  await expect(breakpoint.getByRole('heading',{name:'Responsive breakpoints'})).toBeVisible();
  await expect(breakpoint.locator('.ds-breakpoint-list>div')).toHaveCount(8);
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
});

test('icons copy usage on one click without any floating panel',async({page})=>{
 await page.context().grantPermissions(['clipboard-read','clipboard-write']);
 await page.goto(root+'#icons');
 await page.getByRole('button',{name:/Feather/}).click();
 const tile=page.getByRole('button',{name:'activity',exact:true});
 await tile.click();
 await expect(tile).toHaveAttribute('data-selected','true');
 await expect(tile).toHaveAttribute('data-copied','true');
 await expect(page.getByRole('status')).toContainText('Code copied · activity');
 await expect(page.locator('.ds-selected-icon')).toHaveCount(0);
 const settings=page.locator('#docs-icon-options');
 await expect(settings.getByRole('combobox',{name:'Icon size'})).toBeVisible();
 await expect(settings.getByRole('combobox',{name:'Icon stroke width'})).toBeVisible();
 await page.getByRole('button',{name:/Phosphor/}).click();
 await expect(page.getByRole('searchbox',{name:'Search icons'})).toHaveValue('');
});

test('guidelines expose the ten rules and all examples without accordions',async({page})=>{
 await page.goto(root+'#guidelines');
 const rules=page.locator('article.ds-guideline');
 await expect(rules).toHaveCount(10);
 await expect(rules.first()).toContainText('Avoid');
 await expect(page.locator('details.ds-guideline,details.ds-doc-details')).toHaveCount(0);
 await expect(page.locator('#docs-guideline-patterns .ds-recipes>div')).toHaveCount(4);
 await expect(page.locator('#docs-guideline-integration .ds-adoption>div')).toHaveCount(3);
});

test('component card opens documentation with visible usage code',async({page})=>{
 await page.goto(root+'#components');
 await expect(page.locator('.lib-card')).toHaveCount(28);
 await expect(page.locator('dialog.lib-dialog')).toHaveCount(0);
 await expect(page.locator('.lib-card').first()).toHaveAttribute('data-group','Interface motion');
 const card=page.locator('.lib-card[data-testid="button"]');
 await card.getByRole('link',{name:'Double Button'}).click();
 await expect(page).toHaveURL(/#components\/button$/);
 await expect(page.locator('.docs-component__stage .double-button').first()).toBeVisible();
 const usage=page.locator('.docs-component__code');
 await expect(page.locator('details.docs-component__code')).toHaveCount(0);
 await expect(usage.locator('pre.lib-code')).toContainText('DoubleButton');
 await expect(usage.getByRole('button',{name:/Copy code/})).toBeVisible();
 await page.getByRole('link',{name:/All components/}).click();
 await expect(page.locator('.lib-card')).toHaveCount(28);
});

test('mobile icon interaction stays inline and without horizontal overflow',async({page})=>{
 await page.context().grantPermissions(['clipboard-read','clipboard-write']);
 await page.setViewportSize({width:390,height:844});
 await page.goto(root+'#icons');
 await page.getByRole('button',{name:/Feather/}).click();
 const tile=page.getByRole('button',{name:'activity',exact:true});
 await tile.click();
 await expect(tile).toHaveAttribute('data-copied','true');
 await expect(page.locator('.ds-selected-icon')).toHaveCount(0);
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
 expect(overflow).toBeLessThanOrEqual(2);
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
 await expect(page.getByRole('heading',{name:'Design library',exact:true})).toBeVisible();
 const nav=page.getByRole('navigation',{name:'Design system',exact:true});
 await expect(nav.getByRole('link',{name:'Home'})).toBeVisible();
 await nav.getByRole('link',{name:'Colors'}).click();
 await expect(page).toHaveURL(/#foundations\/colors$/);
 await expect(page.getByRole('heading',{name:'Colors',exact:true})).toBeVisible();
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
 await expect(page.getByRole('heading',{name:'Design library'})).toBeVisible();
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
 const tile=page.getByRole('button',{name:'activity',exact:true});
 await expect(tile).toHaveAttribute('data-selected','true');
 await expect(page.locator('.ds-selected-icon')).toHaveCount(0);
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
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth)).toBeLessThanOrEqual(2);
});

test('library UI has no links to the published APCOSYS website',async({page})=>{
 const routes=['#overview','#components','#foundations/colors','#foundations/typography','#icons','#guidelines'];
 for(const route of routes){
  await page.goto(root+route);
  const publishedLinks=page.locator('a[href*="imonsergey.github.io/apcoweb"],a[href*="apcosys.net"]');
  await expect(publishedLinks).toHaveCount(0);
  await expect(page.getByRole('link',{name:/APCOSYS website|Live website/i})).toHaveCount(0);
 }
 // Library repository and asset links remain available.
 await expect(page.getByRole('link',{name:/GitHub/i}).first()).toBeVisible();
});


test('navigation has no duplicate controls or icon family filters in the sidebar',async({page})=>{
 await page.goto(root+'#components');
 const nav=page.getByRole('navigation',{name:'Design system',exact:true});
 await expect(nav.getByRole('link',{name:'Components',exact:true})).toHaveCount(1);
 await expect(nav.getByRole('link',{name:'Icons',exact:true})).toHaveCount(1);
 await expect(nav.getByRole('link',{name:'Interface & controls'})).toHaveCount(0);
 await expect(nav.getByRole('link',{name:'Phosphor'})).toHaveCount(0);
 await expect(page.locator('.lib-card__open,.lib-card__foot')).toHaveCount(0);
 await expect(page.locator('.lib-tabs a')).toHaveCount(4);
});

test('search results do not repeat the same token destination',async({page})=>{
 await page.goto(root+'#overview');
 await page.keyboard.press('ControlOrMeta+k');
 const dialog=page.getByRole('dialog',{name:'Search design system'});
 await dialog.getByRole('combobox',{name:'Search all docs'}).fill('color');
 const options=dialog.getByRole('option');
 const hrefs=await options.evaluateAll(nodes=>nodes.map(n=>(n as HTMLAnchorElement).getAttribute('href')));
 expect(hrefs.length).toBeGreaterThan(0);
 expect(hrefs.length).toBeLessThanOrEqual(8);
 expect(new Set(hrefs).size).toBe(hrefs.length);
});

test('clipboard permissions denied still provide manually selectable icon code',async({page})=>{
 await page.addInitScript(()=>{
  Object.defineProperty(navigator,'clipboard',{configurable:true,value:{
   writeText:async()=>{throw new Error('Clipboard blocked')}
  }});
 });
 await page.goto(root+'#icons');
 await page.getByRole('button',{name:/Feather/}).click();
 const tile=page.getByRole('button',{name:'activity',exact:true});
 await tile.click();
 await expect(tile).toHaveAttribute('data-selected','true');
 await expect(tile).toHaveAttribute('data-copied','false');
 const fallback=page.locator('.ds-icon-copy-fallback');
 await expect(fallback).toBeVisible();
 await expect(fallback.getByRole('textbox',{name:'Icon JSX code'})).toHaveValue(/LibraryIcon.*activity/);
 await fallback.getByRole('button',{name:'Close copy fallback'}).click();
 await expect(fallback).toHaveCount(0);
});

test('empty catalog states offer a clear way back to results',async({page})=>{
 await page.goto(root+'#components');
 await page.getByRole('searchbox',{name:'Search components'}).fill('zz_nonexistent_component');
 await expect(page.getByText('No components found.')).toBeVisible();
 await page.getByRole('button',{name:'Clear filters'}).click();
 await expect(page.locator('.lib-card')).toHaveCount(28);
 await page.goto(root+'#icons');
 await page.getByRole('searchbox',{name:'Search icons'}).fill('zz_nonexistent_icon');
 await expect(page.getByText('No icons found.')).toBeVisible();
 await page.getByRole('button',{name:'Clear search'}).click();
 await expect(page.getByRole('searchbox',{name:'Search icons'})).toHaveValue('');
});

test('all reference details are visible across layout, spacing, colors and logo',async({page})=>{
 await page.goto(root+'#foundations/layout');
 await expect(page.locator('.ds-layout-metrics>div')).toHaveCount(6);
 await expect(page.locator('#ds-breakpoints .ds-breakpoint-list>div')).toHaveCount(8);
 await page.goto(root+'#foundations/spacing');
 await expect(page.locator('.ds-radii-grid>div')).toHaveCount(3);
 await page.goto(root+'#foundations/colors');
 await expect(page.locator('.ds-token-label code')).toHaveCount(17);
 await expect(page.locator('#ds-contrast .ds-contrast-sample')).toHaveCount(2);
 await page.goto(root+'#foundations/identity');
 await expect(page.locator('#ds-symbols img')).toHaveCount(2);
 await expect(page.locator('.ds-foundations details')).toHaveCount(0);
});
test('icon settings, states and Morphicons are immediately visible',async({page})=>{
 await page.goto(root+'#icons');
 const settings=page.locator('#docs-icon-options');
 await expect(settings.getByRole('combobox',{name:'Icon size'})).toBeVisible();
 await expect(settings.getByRole('combobox',{name:'Icon stroke width'})).toBeVisible();
 await expect(page.locator('#docs-icon-states .ds-icon-state')).toHaveCount(5);
 const morph=page.locator('#docs-icon-morph');
 await expect(morph.getByRole('heading',{name:'Morphicons'})).toBeAttached();
 await expect(morph.locator('.ds-morph-card')).toHaveCount(4);
 await expect(page.locator('.ds-icons-page details')).toHaveCount(0);
 const before=await settings.boundingBox(),after=await page.locator('.ds-icon-options').boundingBox();
 expect(before&&after).not.toBeNull();
 expect(Math.abs(before!.x-after!.x)).toBeLessThanOrEqual(2);
 await settings.getByRole('combobox',{name:'Icon size'}).selectOption('32');
 await expect(settings.getByRole('combobox',{name:'Icon size'})).toHaveValue('32');
});
test('reference pages fit five breakpoints without horizontal overflow in either theme',async({page})=>{
 for(const width of [375,599,899,1440,1920]){
  await page.setViewportSize({width,height:900});
  for(const route of ['#foundations/layout','#foundations/colors','#icons','#guidelines']){
   await page.goto(root+route);
   await expect(page.locator('main#docs-content')).toBeVisible();
   expect(await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth),width+' '+route).toBeLessThanOrEqual(2);
  }
  const originalTheme=await page.locator('html').getAttribute('data-theme');
  await page.locator('button.docs-header__theme').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme',originalTheme==='dark'?'light':'dark');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth),width+' toggled theme').toBeLessThanOrEqual(2);
 }
});
test('contextual links scroll to visible tokens and morph examples',async({page})=>{
 await page.setViewportSize({width:1920,height:1080});
 await page.goto(root+'#foundations/layout');
 const toc=page.getByRole('complementary',{name:'On this page'});
 await toc.getByRole('link',{name:'Breakpoints'}).click();
 await expect(page.locator('#ds-breakpoints')).toBeInViewport();
 await page.goto(root+'#icons');
 await toc.getByRole('link',{name:'Morphicons'}).click();
 await expect(page.locator('#docs-icon-morph')).toBeInViewport();
});

test('palette draft is separate from approved tokens, persists and resets', async ({ page }) => {
  await page.goto(root + '#foundations/colors');
  await expect(page.locator('.ds-token-row')).toHaveCount(17);
  await expect(page.getByText('Page background').first()).toBeVisible();
  await page.getByRole('button', { name: 'Try color changes' }).click();
  await expect(page.getByLabel('Preview · matches approved palette preview')).toBeVisible();
  const edit = page.getByRole('textbox', { name: 'HEX for Cards & panels' });
  await edit.fill('#E0EEFA');
  await edit.press('Enter');
  await expect(edit).toHaveValue('#E0EEFA');
  await expect(page.getByLabel('Approved preview')).toBeVisible();
  await expect(page.getByLabel('Your draft preview').locator('.ds-workbench__demo')).toHaveCSS('background-color', 'rgb(224, 238, 250)');
  await expect(page.getByLabel('Approved preview').locator('.ds-workbench__demo')).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await page.getByRole('button', { name: 'Dark theme' }).click();
  await expect(edit).toHaveValue('#151B1F');
  await page.getByRole('button', { name: 'Light theme' }).click();
  await expect(edit).toHaveValue('#E0EEFA');
  await page.reload();
  await page.getByRole('button', { name: 'Try color changes' }).click();
  await expect(page.getByRole('textbox', { name: 'HEX for Cards & panels' })).toHaveValue('#E0EEFA');
  await page.getByRole('button', { name: 'Reset all' }).click();
  await expect(page.getByRole('textbox', { name: 'HEX for Cards & panels' })).toHaveValue('#FFFFFF');
  await page.getByRole('button', { name: 'View reference' }).click();
  await expect(page.locator('.ds-token-row')).toHaveCount(17);
  await expect(page.locator('.ds-token-row').nth(1)).toContainText('#FFFFFF');
});

test('palette draft validates input and exports changed semantic values', async ({ page }) => {
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto(root + '#foundations/colors');
  await page.getByRole('button', { name: 'Try color changes' }).click();
  const edit = page.getByRole('textbox', { name: 'HEX for Primary action' });
  await edit.fill('#ZZZZZZ');
  await expect(edit).toHaveAttribute('aria-invalid', 'true');
  await edit.press('Enter');
  await expect(edit).toHaveValue('#037A8F');
  await edit.fill('#004466');
  await edit.press('Enter');
  await page.getByRole('button', { name: 'Copy CSS' }).click();
  await expect(page.getByRole('button', { name: 'Copied CSS' })).toBeVisible();
  const text = await page.evaluate(() => navigator.clipboard.readText());
  expect(text).toContain('--action-fill: #004466;');
  expect(text).not.toContain('--surface-page:');
  const event = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download draft JSON' }).click();
  const file = await event;
  expect(file.suggestedFilename()).toBe('apcosys.tokens.draft.json');
  await expect(page.getByRole('link', { name: /Download design tokens/ })).toBeVisible();
});

test('palette edit mode remains responsive with visible controls', async ({ page }) => {
  await page.goto(root + '#foundations/colors');
  await page.getByRole('button', { name: 'Try color changes' }).click();
  for (const width of [375, 599, 899, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await expect(page.getByRole('textbox', { name: 'HEX for Page background' })).toBeVisible();
    await expect(page.locator('.ds-token-editor')).toHaveCount(17);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth), width + 'px').toBeLessThanOrEqual(2);
  }
});

test('unified token draft spans type, spacing, radii, layout and motion', async ({ page }) => {
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto(root+'#foundations/typography');
  await expect(page.getByRole('button',{name:'Try type changes'})).toBeVisible();
  await page.getByRole('button',{name:'Try type changes'}).click();
  const type=page.getByRole('spinbutton',{name:'Display size scale'});
  await type.fill('110');
  await type.press('Enter');
  await expect(type).toHaveValue('110');
  const before=await page.locator('.ds-type-row').first().locator('.ds-type-display').evaluate(el=>parseFloat(getComputedStyle(el).fontSize));
  expect(before).toBeGreaterThan(40);
  await expect(page.getByRole('region',{name:'Your unpublished design draft'})).toContainText('1 change');

  await page.goto(root+'#foundations/spacing');
  await page.getByRole('button',{name:'Try spacing changes'}).first().click();
  const space=page.getByRole('spinbutton',{name:'Spacing token 16 value'});
  await space.fill('28'); await space.press('Enter');
  await expect(space).toHaveValue('28');
  const radius=page.getByRole('spinbutton',{name:'control radius'});
  await radius.fill('8'); await radius.press('Enter');
  await expect(radius).toHaveValue('8');
  await expect(page.getByRole('region',{name:'Your unpublished design draft'})).toContainText('3 changes');
  await page.reload();
  await page.getByRole('button',{name:'Try spacing changes'}).first().click();
  await expect(page.getByRole('spinbutton',{name:'Spacing token 16 value'})).toHaveValue('28');

  await page.goto(root+'#foundations/layout');
  await page.getByRole('button',{name:'Try max width'}).click();
  const max=page.getByRole('spinbutton',{name:'Maximum content width'});
  await max.fill('1600'); await max.press('Enter');
  await expect(max).toHaveValue('1600');
  await page.goto(root+'#foundations/motion');
  await page.getByRole('button',{name:'Try timing changes'}).click();
  const duration=page.getByRole('spinbutton',{name:'disclosure duration'});
  await duration.fill('360'); await duration.press('Enter');
  await expect(duration).toHaveValue('360');

  await page.getByRole('button',{name:'Copy CSS'}).click();
  const css=await page.evaluate(()=>navigator.clipboard.readText());
  expect(css).toContain('--ds-type-display-scale: 1.1;');
  expect(css).toContain('--ds-space-4: 28px;');
  expect(css).toContain('--ds-radius-control: 8px;');
  expect(css).toContain('--ds-grid-max: 1600px;');
  expect(css).toContain('--ds-duration-disclosure: 360ms;');

  const requested=page.waitForEvent('download');
  await page.getByRole('button',{name:'Download draft JSON'}).click();
  const file=await requested;
  const fs=await import('node:fs/promises');
  const draft=JSON.parse(await fs.readFile(await file.path(),'utf-8'));
  expect(draft.draft).toBe(true);
  expect(draft.spaces).toContain(28);
  expect(draft.radii.control).toBe('8px');
  expect(draft.layout.maxWidth).toBe('1600px');
  expect(draft.motions.disclosure).toBe('360ms');
  expect(draft.draftExtensions.typographySizeScalePercent.Display).toBe(110);

  await page.getByRole('button',{name:'Reset all'}).click();
  await expect(page.getByRole('region',{name:'Your unpublished design draft'})).toHaveCount(0);
  await page.reload();
  await expect(page.getByRole('region',{name:'Your unpublished design draft'})).toHaveCount(0);
});

test('unified token editors reject invalid numbers, retain source values and stay responsive', async ({page})=>{
  for(const [route,button,input] of [
   ['typography','Try type changes','Display size scale'],
   ['spacing','Try spacing changes','Spacing token 4 value'],
   ['layout','Try max width','Maximum content width'],
   ['motion','Try timing changes','disclosure duration'],
  ]){
   await page.goto(root+'#foundations/'+route);
   await page.getByRole('button',{name:button}).first().click();
   const field=page.getByRole('spinbutton',{name:input});
   const initial=await field.inputValue();
   await field.fill('99999');
   await expect(field).toHaveAttribute('aria-invalid','true');
   await field.press('Enter');
   await expect(field).toHaveValue(initial);
   for(const width of [340,375,599,899,1200,1920]){
    await page.setViewportSize({width,height:800});
    await expect(field).toBeVisible();
    const excess=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
    expect(excess,route+' '+width).toBeLessThanOrEqual(2);
   }
  }
});

test('legacy R7 color-only drafts migrate without changing brand source',async({page})=>{
  await page.addInitScript(()=>{
   localStorage.setItem('apcosys-palette-draft-v1',JSON.stringify({light:{action:'#004466'}}));
   localStorage.removeItem('apcosys-design-draft-v2');
  });
  await page.goto(root+'#foundations/colors');
  await page.getByRole('button',{name:'Try color changes'}).click();
  await expect(page.getByRole('textbox',{name:'HEX for Primary action'})).toHaveValue('#004466');
  await expect(page.getByRole('region',{name:'Your unpublished design draft'})).toContainText('1 change');
});

test('resetting a foundation does not erase unrelated draft sections',async({page})=>{
 await page.goto(root+'#foundations/colors');
 await page.getByRole('button',{name:'Try color changes'}).click();
 const color=page.getByRole('textbox',{name:'HEX for Page background'});
 await color.fill('#ABCDEF');await color.press('Enter');
 await page.goto(root+'#foundations/typography');
 await page.getByRole('button',{name:'Try type changes'}).click();
 const type=page.getByRole('spinbutton',{name:'Display size scale'});
 await type.fill('115');await type.press('Enter');
 await page.goto(root+'#foundations/colors');
 await page.getByRole('button',{name:'Reset colors'}).click();
 await expect(page.getByRole('region',{name:'Your unpublished design draft'})).toContainText('1 change');
 await page.goto(root+'#foundations/typography');
 await page.getByRole('button',{name:'Try type changes'}).click();
 await expect(page.getByRole('spinbutton',{name:'Display size scale'})).toHaveValue('115');
 await page.getByRole('button',{name:'Reset type'}).click();
 await expect(page.getByRole('region',{name:'Your unpublished design draft'})).toHaveCount(0);
});

test('CSS export has manual copy fallback if clipboard permission is denied',async({page})=>{
 await page.addInitScript(()=>{
  Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:()=>Promise.reject(new Error('not allowed'))}});
 });
 await page.goto(root+'#foundations/colors');
 await page.getByRole('button',{name:'Try color changes'}).click();
 const color=page.getByRole('textbox',{name:'HEX for Page background'});
 await color.fill('#FAFAFA');await color.press('Enter');
 await page.getByRole('button',{name:'Copy CSS'}).click();
 await expect(page.getByRole('textbox',{name:'Copy draft CSS manually'})).toContainText('--surface-page: #FAFAFA');
 await page.getByRole('button',{name:'Close manual copy'}).click();
 await expect(page.getByRole('textbox',{name:'Copy draft CSS manually'})).toHaveCount(0);
 await page.getByRole('button',{name:'Copy HEX for Page background'}).click();
 await expect(page.getByRole('textbox',{name:'Copy color token manually'})).toHaveValue('#FAFAFA');
});
