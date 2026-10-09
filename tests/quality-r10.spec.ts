import {expect,test} from '@playwright/test';
import {enterDraft} from './support/editing';
const root='/Apco-components-lib/';

for(const width of [375,1440])test('first edit keeps the color field in place at '+width,async({page})=>{
 await page.setViewportSize({width,height:812});await page.goto(root+'#foundations/colors');await enterDraft(page);
 await page.evaluate(()=>document.fonts.ready);const field=page.getByRole('textbox',{name:'HEX for Page background'});await field.focus();
 const before=await field.boundingBox();await field.fill('#AABBCC');await field.press('Enter');
 await expect(field).toHaveValue('#AABBCC');const after=await field.boundingBox();
 expect(Math.abs(after!.y-before!.y)).toBeLessThanOrEqual(1);
 await expect(page.locator('.ds-workbench__preview')).toHaveCount(1);
 if(width===375)expect(before!.y).toBeLessThan(620);
 await page.getByRole('button',{name:'Undo',exact:true}).click();
 await expect(field).toHaveValue('#F6F6F6');await expect(page.getByRole('button',{name:'Redo',exact:true})).toBeFocused();
 await page.getByRole('button',{name:'Redo',exact:true}).click();await expect(field).toHaveValue('#AABBCC');
});

test('all foundation pages keep their edit mode during the session without repeated activation',async({page})=>{
 for(const section of ['colors','typography','spacing','layout','motion']){await page.goto(root+'#foundations/'+section);await enterDraft(page);}
 for(const section of ['colors','typography','spacing','layout','motion']){await page.goto(root+'#foundations/'+section);await expect(page.getByRole('button',{name:'View reference'})).toBeVisible();}
 await page.reload();await expect(page.getByRole('button',{name:'Edit draft',exact:true})).toBeVisible();
});

test('standard HEX pastes are normalized and Escape still cancels pending edits',async({page})=>{
 await page.goto(root+'#foundations/colors');await enterDraft(page);const field=page.getByRole('textbox',{name:'HEX for Page background'});
 for(const [input,expected] of [['09f','#0099FF'],['#AbC','#AABBCC'],[' 1122aa ','#1122AA'],['#224466','#224466']]){await field.fill(input!);await field.press('Enter');await expect(field).toHaveValue(expected!);}
 await field.fill('#fed');await field.press('Escape');await expect(field).toHaveValue('#224466');
 await field.fill('red;display:none');await expect(field).toHaveAttribute('aria-invalid','true');await field.press('Enter');await expect(field).toHaveValue('#224466');
});

test('manual copy fallback appears beside the requested color, not at the page top',async({page})=>{
 await page.addInitScript(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:()=>Promise.reject(Error('Denied'))}}));
 await page.setViewportSize({width:390,height:844});await page.goto(root+'#foundations/colors');await enterDraft(page);
 const button=page.getByRole('button',{name:'Copy HEX for Strong borders'});await button.click();
 const fallback=page.getByRole('textbox',{name:'Copy color token manually'});await expect(fallback).toHaveValue('#828993');
 expect(await fallback.evaluate(el=>!!el.closest('.ds-token-cell')?.querySelector('[data-token="strongBorder"]'))).toBe(true);
 const fieldY=(await fallback.boundingBox())!.y,buttonY=(await button.boundingBox())!.y;expect(Math.abs(fieldY-buttonY)).toBeLessThan(220);
});

test('component return restores the filtered catalog, query, scroll and originating card',async({page})=>{
 await page.setViewportSize({width:1440,height:900});await page.goto(root+'#components/interface');
 const search=page.getByRole('searchbox',{name:'Search components'});await search.fill('original');
 const link=page.locator('.lib-card[data-testid="tags"] .lib-card__name');await link.scrollIntoViewIfNeeded();
 const saved=await page.evaluate(()=>scrollY);await link.click();await page.locator('.docs-component__back').click();
 await expect(page).toHaveURL(/#components\/interface$/);await expect(search).toHaveValue('original');
 await expect(link).toBeFocused();expect(Math.abs(await page.evaluate(()=>scrollY)-saved)).toBeLessThanOrEqual(2);
});

test('browser Back also retains catalog position and component counts reflect filters',async({page})=>{
 await page.setViewportSize({width:1440,height:900});await page.goto(root+'#components/interface');
 const link=page.locator('.lib-card[data-testid="plancard"] .lib-card__name');await link.scrollIntoViewIfNeeded();const y=await page.evaluate(()=>scrollY);await link.click();await page.goBack();
 await expect(page).toHaveURL(/#components\/interface$/);await expect(link).toBeFocused();expect(Math.abs(await page.evaluate(()=>scrollY)-y)).toBeLessThanOrEqual(2);
 await page.getByRole('searchbox',{name:'Search components'}).fill('secondary original');
 await expect(page.locator('.lib-card')).toHaveCount(1);await expect(page.locator('main h1>span')).toHaveText('1');
});

test('icon browser keeps size, stroke, query and expanded results while switching pages',async({page})=>{
 await page.goto(root+'#icons');await page.getByRole('button',{name:/Feather/}).click();
 await page.getByLabel('Icon size').selectOption('32');await page.getByLabel('Icon stroke width').selectOption('2');
 await page.getByRole('button',{name:/Show more/}).click();const count=await page.locator('.ds-icon-tile').count();
 await page.goto(root+'#foundations/colors');await page.goto(root+'#icons/feather');
 await expect(page.getByLabel('Icon size')).toHaveValue('32');await expect(page.getByLabel('Icon stroke width')).toHaveValue('2');await expect(page.locator('.ds-icon-tile')).toHaveCount(count);
 await page.getByRole('searchbox',{name:'Search icons'}).fill('activity');await page.goto(root+'#overview');await page.goto(root+'#icons/feather');
 await expect(page.getByRole('searchbox',{name:'Search icons'})).toHaveValue('activity');
});

test('short-height keyboard search keeps the selected result in the visible scroller',async({page})=>{
 await page.setViewportSize({width:375,height:420});await page.goto(root+'#overview');await page.getByRole('button',{name:'Search documentation'}).click();
 const input=page.getByRole('combobox',{name:'Search all docs'});await input.fill('icon');for(let i=0;i<7;i++)await input.press('ArrowDown');
 const item=await page.locator('[role=option][aria-selected=true]').boundingBox(),panel=await page.locator('.docs-command__results').boundingBox();
 expect(item!.y).toBeGreaterThanOrEqual(panel!.y);expect(item!.y+item!.height).toBeLessThanOrEqual(panel!.y+panel!.height+1);
 await input.press('Enter');await expect(page.getByRole('dialog',{name:'Search design system'})).toHaveCount(0);
});

test('static interface previews keep local interaction state when scrolled out of view',async({page})=>{
 await page.setViewportSize({width:1440,height:900});await page.goto(root+'#components/interface');
 const card=page.locator('.lib-card[data-testid="accordion"]');await card.scrollIntoViewIfNeeded();
 const detail=card.locator('details').nth(1);await detail.locator('summary').click();await expect(detail).toHaveAttribute('open','');
 await page.evaluate(()=>scrollTo({top:document.documentElement.scrollHeight,behavior:'instant'}));await page.waitForTimeout(150);
 await card.scrollIntoViewIfNeeded();await expect(detail).toHaveAttribute('open','');
});

test('a later navigation frame cannot steal focus from an already focused field',async({page})=>{
 await page.goto(root+'#overview');await page.getByRole('button',{name:'Search documentation'}).click();const input=page.getByRole('combobox',{name:'Search all docs'});await input.fill('--ds-radius-panel');await input.press('Enter');
 await expect(page).toHaveURL(/#foundations\/spacing$/);
 await expect(page.getByRole('dialog',{name:'Search design system'})).toHaveCount(0);await expect(page.locator('main h1')).toHaveText('Spacing');
 await page.evaluate(()=>{const input=document.createElement('input');input.id='r10-fast-focus';document.querySelector('main')!.append(input);input.focus();});
 await page.waitForTimeout(100);await expect(page.locator('#r10-fast-focus')).toBeFocused();
});
