import { expect, test } from '@playwright/test';

const root='/Apco-components-lib/';

test('sections and dark theme stay coordinated', async ({page})=>{
  await page.goto(root+'#foundations');
  await expect(page.getByRole('heading',{name:'Основы стиля',exact:true})).toBeVisible();
  await expect(page.locator('.ds-token-row')).toHaveCount(17);
  const first=page.locator('.ds-token-row').first();
  await expect(first).toContainText('#F6F6F6');
  await page.getByRole('button',{name:'Тёмная тема'}).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
  await expect(first).toContainText('#0D1113');
  await expect.poll(async()=>page.locator('body').evaluate(el=>getComputedStyle(el).backgroundColor)).toBe('rgb(13, 17, 19)');
  const breakpoint=page.locator('#ds-breakpoints');
  await expect(breakpoint.getByRole('heading',{name:'Диапазоны ширины'})).toBeVisible();
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
 await expect(page.locator('#docs-icon-library [role=status]')).toContainText('Код скопирован · activity');
 await expect(page.locator('.ds-selected-icon')).toHaveCount(0);
 const settings=page.locator('#docs-icon-options');
 await expect(settings.getByRole('group',{name:'Размер иконки'})).toBeVisible();
 await expect(settings.getByRole('group',{name:'Толщина линии иконки'})).toBeVisible();
 await page.getByRole('button',{name:/Phosphor/}).click();
 await expect(page.getByRole('searchbox',{name:'Поиск иконок'})).toHaveValue('');
});

test('guides expose practical rules and persistent handoff checklist',async({page})=>{
 await page.goto(root+'#guidelines');
 await expect(page.getByRole('heading',{name:'От компонента к готовому экрану',exact:true})).toBeVisible();
 await expect(page.locator('.client-topic-nav a')).toHaveCount(6);
 await expect(page.locator('.client-guide > section')).toHaveCount(6);
 await expect(page.locator('.client-guide details')).toHaveCount(0);
 await page.goto(root+'#guide/handoff');
 const checks=page.locator('.client-checklist input[type="checkbox"]');
 await expect(checks).toHaveCount(9);
 await checks.first().check();
 await expect(page.locator('.client-checklist__summary')).toContainText('Отмечено 1 из 9');
 await page.reload();
 await expect(checks.first()).toBeChecked();
 await page.getByRole('button',{name:'Сбросить отметки'}).click();
 await expect(checks.first()).not.toBeChecked();
});

test('component card opens documentation with visible usage code',async({page})=>{
 await page.goto(root+'#components');
 await expect(page.locator('.lib-card')).toHaveCount(28);
 await expect(page.locator('dialog.lib-dialog')).toHaveCount(0);
 await expect(page.locator('.lib-card').first()).toHaveAttribute('data-group','Interface motion');
 const card=page.locator('.lib-card[data-testid="button"]');
 await card.getByRole('link',{name:'Составная кнопка'}).click();
 await expect(page).toHaveURL(/#components\/button$/);
 await expect(page.locator('.docs-component__stage .double-button').first()).toBeVisible();
 const usage=page.locator('.docs-component__code');
 await expect(page.locator('details.docs-component__code')).toHaveCount(0);
 await expect(usage.locator('pre.lib-code')).toContainText('DoubleButton');
 await expect(usage.getByRole('button',{name:/Копировать код/})).toBeVisible();
 await page.locator('.docs-component__back').click();
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
  await page.getByRole('button',{name:'Тёмная тема'}).click();
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
  await page.getByRole('button',{name:'Тёмная тема'}).click();
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
  await expect(panel.locator('button[lang="ru"]')).toBeEnabled();
  await expect(panel.locator('button[lang="zh-Hans"]')).toBeEnabled();
  const triggerBox=await trigger.boundingBox();
  const panelBox=await panel.boundingBox();
  expect(triggerBox&&panelBox).toBeTruthy();
  expect(Math.abs((panelBox!.x+panelBox!.width)-(triggerBox!.x+triggerBox!.width))).toBeLessThanOrEqual(3);
  expect(panelBox!.y).toBeGreaterThanOrEqual(triggerBox!.y+triggerBox!.height);
  await panel.locator('button[lang="ru"]').click();
  await expect(trigger).toContainText('RU');
  await expect(panel).toHaveAttribute('data-open','false');
  await trigger.press('ArrowDown');
  await page.keyboard.press('End');
  await expect(panel.locator('button[lang="zh-Hans"]')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(trigger).toContainText('ZH');
  await trigger.click();
  await expect(panel.locator('button[lang="zh-Hans"]')).toHaveAttribute('aria-checked','true');
  await page.keyboard.press('Escape');
  await expect(panel).toHaveAttribute('data-open','false');
  await expect(trigger).toBeFocused();
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
   if(current!==theme)await page.getByRole('button',{name:theme==='dark'?'Тёмная тема':'Светлая тема'}).click();
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
 await expect(page.getByRole('heading',{name:/Одна система\.\s*Все детали интерфейса\./})).toBeVisible();
 const nav=page.getByRole('navigation',{name:'Дизайн-система',exact:true});
 await expect(nav.getByRole('link',{name:'Главная'})).toBeVisible();
 await nav.getByRole('link',{name:'Цвета'}).click();
 await expect(page).toHaveURL(/#foundations\/colors$/);
 await expect(page.getByRole('heading',{name:'Цвета',exact:true})).toBeVisible();
 await expect(page.locator('.ds-token-row')).toHaveCount(17);
 await expect(page.locator('#ds-colors')).toBeInViewport();
});

test('global command search navigates to full source component page',async({page})=>{
 await page.goto(root+'#overview');
 await page.keyboard.press('ControlOrMeta+k');
 const dialog=page.getByRole('dialog',{name:'Поиск по дизайн-системе'});
 await expect(dialog).toBeVisible();
 await dialog.getByRole('combobox',{name:'Поиск по библиотеке'}).fill('Double Button');
 await expect(dialog.getByRole('option',{name:/Составная кнопка/}).first()).toBeVisible();
 await page.keyboard.press('Enter');
 await expect(page).toHaveURL(/#components\/button$/);
 await expect(page.getByRole('heading',{name:'Составная кнопка',exact:true})).toBeVisible();
 await expect(page.locator('.docs-component__stage .double-button').first()).toBeVisible();
 await expect(page.locator('.docs-component .lib-code')).toContainText('DoubleButton');
 await expect(dialog).toHaveCount(0);
});

test('mobile docs drawer navigates without horizontal overflow',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto(root+'#overview');
 const opener=page.getByRole('button',{name:'Открыть навигацию'});
 await expect(opener).toBeVisible();
 await opener.click();
 const drawer=page.getByRole('complementary',{name:'Навигация библиотеки'});
 await expect(drawer).toHaveAttribute('data-open','true');
 await expect(page.getByRole('button',{name:'Закрыть навигацию'})).toBeVisible();
 await drawer.getByRole('link',{name:'Типографика'}).click();
 await expect(page).toHaveURL(/#foundations\/typography$/);
 await expect(page.locator('.docs-sidebar')).toHaveAttribute('data-open','false');
 await expect(page.locator('#ds-type')).toBeInViewport();
 await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth)).toBeLessThanOrEqual(2);
});

test('wide layout retains on-page toc without replacing sidebar',async({page})=>{
 await page.setViewportSize({width:1760,height:990});
 await page.goto(root+'#foundations');
 const toc=page.getByRole('complementary',{name:'На этой странице'});
 await expect(toc.getByRole('link',{name:'Цвета'})).toBeVisible();
 await expect(page.getByRole('navigation',{name:'Дизайн-система',exact:true})).toBeVisible();
 await toc.getByRole('link',{name:'Цвета'}).click();
 await expect(page.locator('#ds-colors')).toBeInViewport();
 await page.getByRole('button',{name:'Свернуть навигацию'}).click();
 await expect(page.locator('.docs-shell')).toHaveAttribute('data-collapsed','true');
 await page.getByRole('button',{name:'Развернуть навигацию'}).click();
 await expect(page.locator('.docs-shell')).toHaveAttribute('data-collapsed','false');
});

test('clean homepage and favicon match published APCOSYS source',async({page})=>{
 await page.goto(root);
 await expect(page.getByRole('heading',{name:/Одна система\.\s*Все детали интерфейса\./})).toBeVisible();
 await expect(page.locator('.client-product-card')).toHaveCount(2);
 await expect(page.locator('.client-foundation-link')).toHaveCount(4);
 await expect(page.locator('.client-product-card[href="#saas"]')).toBeVisible();
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
 const command=page.getByRole('dialog',{name:'Поиск по дизайн-системе'});
 await command.getByRole('combobox',{name:'Поиск по библиотеке'}).fill('activity');
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
 const content=await page.locator('main.docs-content').boundingBox();
 expect(content).not.toBeNull();
 expect(Math.abs(bounds!.x-content!.x)).toBeLessThanOrEqual(2);
 expect(Math.abs(bounds!.width-content!.width)).toBeLessThanOrEqual(2);
 expect(bounds!.width).toBeGreaterThan(1450);
 expect(bounds!.x+bounds!.width).toBeLessThanOrEqual(1920);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth)).toBeLessThanOrEqual(2);
 await page.getByRole('button',{name:'Тёмная тема'}).click();
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
 await expect(page.getByRole('link',{name:/Скачать токены/})).toBeVisible();
 await page.getByRole('button',{name:'Тёмная тема'}).click();
 const width=await list.locator('.ds-token-row').last().boundingBox();
 expect(width!.width).toBeGreaterThan(listBox!.width-3);
});

test('homepage directs clients to website, SaaS and foundations at desktop and mobile sizes',async({page})=>{
 await page.setViewportSize({width:1440,height:900});
 await page.goto(root+'#overview');
 const cards=page.locator('.client-product-card');
 await expect(cards).toHaveCount(2);
 await expect(cards.filter({hasText:'SaaS'})).toHaveAttribute('href','#saas');
 await expect(page.locator('.client-product-card[href="#components"]')).toBeVisible();
 await expect(page.locator('.client-foundation-link')).toHaveCount(4);
 await expect(page.locator('.client-home__intro a[href="#start"]')).toBeVisible();
 for(const card of await cards.all()){
   const bounds=await card.boundingBox();
   expect(bounds!.height).toBeGreaterThanOrEqual(100);
   await expect(card.locator('svg')).toHaveCount(1);
 }
 await page.setViewportSize({width:390,height:844});
 await expect(page.locator('.client-product-grid')).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth)).toBeLessThanOrEqual(2);
});

test('library reference links avoid the superseded marketing site',async({page})=>{
 const routes=['#overview','#components','#foundations/colors','#foundations/typography','#icons','#guidelines'];
 for(const route of routes){
  await page.goto(root+route);
  const publishedLinks=page.locator('a[href*="imonsergey.github.io/apcoweb"]');
  await expect(publishedLinks).toHaveCount(0);
 }
 // Library repository and asset links remain available.
 await expect(page.getByRole('link',{name:/GitHub/i}).first()).toBeVisible();
});


test('navigation has no duplicate controls or icon family filters in the sidebar',async({page})=>{
 await page.goto(root+'#components');
 const nav=page.getByRole('navigation',{name:'Дизайн-система',exact:true});
 await expect(nav.getByRole('link',{name:'Компоненты сайта',exact:true})).toHaveCount(1);
 await expect(nav.getByRole('link',{name:'Иконки',exact:true})).toHaveCount(1);
 await expect(nav.getByRole('link',{name:'Interface & controls'})).toHaveCount(0);
 await expect(nav.getByRole('link',{name:'Phosphor'})).toHaveCount(0);
 await expect(page.locator('.lib-card__open,.lib-card__foot')).toHaveCount(0);
 await expect(page.locator('.lib-tabs a')).toHaveCount(4);
});

test('search results do not repeat the same token destination',async({page})=>{
 await page.goto(root+'#overview');
 await page.keyboard.press('ControlOrMeta+k');
 const dialog=page.getByRole('dialog',{name:'Поиск по дизайн-системе'});
 await dialog.getByRole('combobox',{name:'Поиск по библиотеке'}).fill('color');
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
 await expect(fallback.getByRole('textbox',{name:'JSX-код иконки'})).toHaveValue(/LibraryIcon.*activity/);
 await fallback.getByRole('button',{name:'Закрыть поле копирования'}).click();
 await expect(fallback).toHaveCount(0);
});

test('empty catalog states offer a clear way back to results',async({page})=>{
 await page.goto(root+'#components');
 await page.getByRole('searchbox',{name:'Найти компонент'}).fill('zz_nonexistent_component');
 await expect(page.getByText('Компоненты не найдены.')).toBeVisible();
 await page.getByRole('button',{name:'Сбросить поиск и фильтры'}).click();
 await expect(page.locator('.lib-card')).toHaveCount(28);
 await page.goto(root+'#icons');
 await page.getByRole('searchbox',{name:'Поиск иконок'}).fill('zz_nonexistent_icon');
 await expect(page.getByText('Иконки не найдены.')).toBeVisible();
 await page.getByRole('button',{name:'Очистить поиск'}).click();
 await expect(page.getByRole('searchbox',{name:'Поиск иконок'})).toHaveValue('');
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
 await expect(settings.getByRole('group',{name:'Размер иконки'})).toBeVisible();
 await expect(settings.getByRole('group',{name:'Толщина линии иконки'})).toBeVisible();
 await expect(page.locator('#docs-icon-states .ds-icon-state')).toHaveCount(5);
 const morph=page.locator('#docs-icon-morph');
 await expect(morph.getByRole('heading',{name:'Morphicons'})).toBeAttached();
 await expect(morph.locator('.ds-morph-card')).toHaveCount(4);
 await expect(page.locator('.ds-icons-page details')).toHaveCount(0);
 const before=await settings.boundingBox(),after=await page.locator('.ds-icon-options').boundingBox();
 expect(before&&after).not.toBeNull();
 expect(Math.abs(before!.x-after!.x)).toBeLessThanOrEqual(2);
 await settings.getByRole('group',{name:'Размер иконки'}).getByRole('button',{name:'32',exact:true}).click();
 await expect(settings.getByRole('group',{name:'Размер иконки'}).getByRole('button',{name:'32',exact:true})).toHaveAttribute('aria-pressed','true');
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
 const toc=page.getByRole('complementary',{name:'На этой странице'});
 await toc.getByRole('link',{name:'Адаптив'}).click();
 await expect(page.locator('#ds-breakpoints')).toBeInViewport();
 await page.goto(root+'#icons');
 await toc.getByRole('link',{name:'Переходы'}).click();
 await expect(page.locator('#docs-icon-morph')).toBeInViewport();
});
