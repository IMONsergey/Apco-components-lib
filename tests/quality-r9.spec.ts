import {enterDraft} from './support/editing';
import { expect, test, type Locator } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFileSync } from 'node:fs';
import { blank, sanitizeDraft, buildDraftCss, buildDraftJson, draftCount } from '../src/brand/draft-model';
const root='/Apco-components-lib/';

// Normalize fractional placement: an outward-rounded screenshot can include one unrelated
// background row below an otherwise identical component. Do not mask component pixels.
async function alignedScreenshot(locator: Locator) {
 await locator.scrollIntoViewIfNeeded();
 const original=await locator.evaluate(el=>{
  const node=el as HTMLElement, rect=node.getBoundingClientRect(), previous=node.style.transform;
  node.style.transform=`translate(${Math.round(rect.x)-rect.x}px, ${Math.round(rect.y)-rect.y}px)`;
  return previous;
 });
 try { return await locator.screenshot({animations:'disabled'}); }
 finally { await locator.evaluate((el,value)=>{(el as HTMLElement).style.transform=value},original); }
}

test('Escape cancels pending HEX and numeric input rather than committing it',async({page})=>{
 await page.goto(root+'#foundations/colors');
 await enterDraft(page);
 const hex=page.getByRole('textbox',{name:'HEX for Page background'});
 await hex.fill('#AABBCC');await hex.press('Escape');
 await expect(hex).toHaveValue('#F6F6F6');
 await expect(page.getByRole('region',{name:'Your unpublished design draft'})).toContainText('no changes');
 await page.goto(root+'#foundations/spacing');await enterDraft(page);
 const value=page.getByRole('spinbutton',{name:'Spacing token 16 value'});
 await value.fill('28');await value.press('Escape');
 await expect(value).toHaveValue('16');
 await expect(page.getByRole('region',{name:'Your unpublished design draft'})).toContainText('no changes');
});

test('approved color copying never leaks a draft and feedback expires on changes',async({page})=>{
 await page.context().grantPermissions(['clipboard-read','clipboard-write']);
 await page.goto(root+'#foundations/colors');await enterDraft(page);
 const value=page.getByRole('textbox',{name:'HEX for Page background'});
 await value.fill('#AABBCC');await value.press('Enter');
 await page.getByRole('button',{name:'Copy CSS',exact:true}).click();
 await expect(page.getByRole('button',{name:'Copied CSS',exact:true})).toBeVisible();
 await value.fill('#AABBDD');await value.press('Enter');
 await expect(page.getByRole('button',{name:'Copy CSS',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'View reference'}).click();await page.locator('.ds-token-row').first().click();
 await expect.poll(()=>page.evaluate(()=>navigator.clipboard.readText())).toBe('#F6F6F6');
 await page.locator('.docs-header__theme').click();
 await expect(page.locator('.ds-token-copy').filter({hasText:'Copied'})).toHaveCount(0);
});

test('spacing and radii restore exact reference rendering after leaving edit mode',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto(root+'#foundations/spacing');await page.locator('#ds-radii').waitFor();await page.evaluate(()=>document.fonts.ready);
 const sourceSpace=await page.locator('#ds-spacing-values').screenshot({animations:'disabled'});
 const sourceRadii=await alignedScreenshot(page.locator('.ds-radii-grid'));
 await enterDraft(page);
 const space=page.getByRole('spinbutton',{name:'Spacing token 16 value'});await space.fill('28');await space.press('Enter');
 const radius=page.getByRole('spinbutton',{name:'control radius'});await radius.fill('22');await radius.press('Enter');
 await page.getByRole('button',{name:'View reference'}).click();
 await expect(page.locator('.ds-space-row').nth(3).locator('.ds-space-bar')).toHaveCSS('width','16px');
 await expect(page.locator('.ds-radii-grid>div>div').first()).toHaveCSS('border-radius','5px');
 expect((await page.locator('#ds-spacing-values').screenshot({animations:'disabled'})).equals(sourceSpace)).toBe(true);
 expect((await alignedScreenshot(page.locator('.ds-radii-grid'))).equals(sourceRadii)).toBe(true);
});

test('draft reset is recoverable with undo and redo and multi-group reset is atomic',async({page})=>{
 await page.goto(root+'#foundations/spacing');await enterDraft(page);
 const space=page.getByRole('spinbutton',{name:'Spacing token 16 value'});await space.fill('28');await space.press('Enter');
 const radius=page.getByRole('spinbutton',{name:'control radius'});await radius.fill('8');await radius.press('Enter');
 await page.getByRole('button',{name:'Reset spacing & radii'}).click();
 await expect(space).toHaveValue('16');await expect(radius).toHaveValue('5');
 await page.getByRole('button',{name:'Undo',exact:true}).click();
 await expect(space).toHaveValue('28');await expect(radius).toHaveValue('8');
 await page.getByRole('button',{name:'Redo',exact:true}).click();
 await expect(space).toHaveValue('16');await expect(radius).toHaveValue('5');
 await page.getByRole('button',{name:'Undo',exact:true}).click();
 await page.getByRole('button',{name:'Reset all',exact:true}).click();
 await page.getByRole('button',{name:'Undo',exact:true}).click();
 await expect(space).toHaveValue('28');await expect(radius).toHaveValue('8');
});

test('blocked browser storage preserves in-memory edits across non-foundation routes and warns',async({page})=>{
 await page.addInitScript(()=>{Storage.prototype.setItem=()=>{throw new Error('Denied')};});
 await page.goto(root+'#foundations/colors');await enterDraft(page);
 const value=page.getByRole('textbox',{name:'HEX for Page background'});await value.fill('#AABBCC');await value.press('Enter');
 await expect(page.getByText('Browser storage is unavailable.',{exact:false})).toBeVisible();
 await page.goto(root+'#icons');await page.locator('main h1').waitFor();
 await page.goto(root+'#foundations/colors');await enterDraft(page);
 await expect(page.getByRole('textbox',{name:'HEX for Page background'})).toHaveValue('#AABBCC');
});

test('CSS light overrides cannot alter the dark theme and JSON retains stable token identities',async({page})=>{
 const draft=blank();draft.colors.light={action:'#112233'};draft.spacing['16']=28;
 const css=buildDraftCss(draft);
 expect(css).toContain(':root:not([data-theme="dark"])');
 await page.goto(root+'#foundations/colors');
 await page.addStyleTag({content:css});
 await expect.poll(()=>page.locator('html').evaluate(el=>getComputedStyle(el).getPropertyValue('--action-fill').trim())).toBe('#112233');
 await page.getByRole('button',{name:'Dark theme'}).click();
 await expect.poll(()=>page.locator('html').evaluate(el=>getComputedStyle(el).getPropertyValue('--action-fill').trim())).toBe('#04768a');
 const json=buildDraftJson(draft);
 expect(json).not.toHaveProperty('verifiedAgainst');
 expect(json.verificationStatus).toBe('unverified-draft');
 expect(json.draftExtensions.spacingTokens['--ds-space-4']).toEqual({original:'16px',value:'28px'});
 expect(sanitizeDraft(json.overrides)).toEqual(sanitizeDraft(draft));
});

test('untrusted draft values cannot inject arbitrary CSS, keys or invalid scalar ranges',()=>{
 const input={colors:{light:{page:'red; background: url(evil)',action:'#112233',unknown:'#ffffff'}},spacing:{16:28,7:12,4:3},radii:{control:0,unknown:4},typography:{Display:999,Heading:115},layout:{maxWidth:1601},motion:{theme:-40}};
 const safe=sanitizeDraft(input);
 expect(draftCount(safe)).toBe(4);
 expect(safe.colors.light).toEqual({action:'#112233'});
 expect(safe.spacing).toEqual({'16':28});expect(safe.radii).toEqual({control:0});
 expect(buildDraftCss(safe)).not.toContain('evil');
 for(const raw of [null,[],42,'text',{colors:null,spacing:[]},{typography:{Display:NaN}}]) expect(draftCount(sanitizeDraft(raw))).toBe(0);
});

test('mobile navigation traps focus, locks scroll and restores the opener',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto(root+'#foundations/colors');
 const opener=page.getByRole('button',{name:'Open navigation',exact:true});await opener.click();
 const drawer=page.getByRole('dialog',{name:'Documentation navigation'});
 await expect(drawer).toBeVisible();await expect(page.getByRole('button',{name:'Close navigation',exact:true})).toBeFocused();
 await expect(page.locator('body')).toHaveCSS('overflow','hidden');
 for(let i=0;i<16;i++){await page.keyboard.press('Tab');expect(await page.evaluate(()=>!!document.activeElement?.closest('.docs-sidebar'))).toBe(true);}
 await page.keyboard.press('Escape');await expect(opener).toBeFocused();await expect(page.locator('body')).not.toHaveCSS('overflow','hidden');
 await opener.click();await page.getByRole('link',{name:'Typography',exact:true}).click();
 await expect(page).toHaveURL(/#foundations\/typography$/);await expect(page.locator('main')).toBeFocused();
});

test('search Escape restores keyboard origin and Enter on close never navigates',async({page})=>{
 await page.goto(root+'#components');const origin=page.getByRole('searchbox',{name:'Search components'});await origin.focus();
 await page.keyboard.press('Control+k');await expect(page.getByRole('dialog',{name:'Search design system'})).toBeVisible();
 await page.keyboard.press('Escape');await expect(origin).toBeFocused();
 await page.getByRole('button',{name:'Search documentation'}).click();
 const close=page.getByRole('button',{name:'Close search'});await close.focus();await close.press('Enter');
 await expect(page.getByRole('dialog',{name:'Search design system'})).toHaveCount(0);
 await expect(page).toHaveURL(/#components$/);
});

test('skip navigation preserves route and invalid paths render a usable page',async({page})=>{
 await page.goto(root+'#foundations/spacing');await page.locator('main h1').waitFor();
 await page.locator('.docs-skip').focus();await page.locator('.docs-skip').press('Enter');
 await expect(page).toHaveURL(/#foundations\/spacing$/);await expect(page.locator('main')).toBeFocused();
 for(const hash of ['#foundations/invalid','#components/invalid','#%E0%A4%A','#nonsense']){
  await page.goto(root+hash);await expect(page.locator('main h1')).toHaveCount(1);expect((await page.locator('main').innerText()).length).toBeGreaterThan(20);
 }
});

test('search resolves scalar token names and does not hijack editable slash input',async({page})=>{
 await page.goto(root+'#overview');await page.getByRole('button',{name:'Search documentation'}).click();
 const input=page.getByRole('combobox',{name:'Search all docs'});await input.fill('--ds-radius-panel');
 await input.press('Enter');await expect(page).toHaveURL(/#foundations\/spacing$/);
 await expect(page.getByRole('dialog',{name:'Search design system'})).toHaveCount(0);await expect(page.locator('main h1')).toHaveText('Spacing');
 await page.evaluate(()=>{const node=document.createElement('div');node.contentEditable='true';node.id='editor-test';document.querySelector('main')!.append(node);node.focus()});
 await page.keyboard.type('/');await expect(page.getByRole('dialog',{name:'Search design system'})).toHaveCount(0);
});

test('icon copies preserve selected size and stroke, and generated Feather symbols inherit it',async({page})=>{
 await page.context().grantPermissions(['clipboard-read','clipboard-write']);await page.goto(root+'#icons');
 await page.getByLabel('Icon size').selectOption('32');await page.getByLabel('Icon stroke width').selectOption('2');
 await page.getByRole('button',{name:'search',exact:true}).click();
 await expect.poll(()=>page.evaluate(()=>navigator.clipboard.readText())).toContain('strokeWidth={2}');
 await page.getByRole('button',{name:/Feather/}).click();await page.getByRole('button',{name:'activity',exact:true}).click();
 const code=await page.evaluate(()=>navigator.clipboard.readText());expect(code).toContain('size={32}');expect(code).toContain('stroke={2}');
 const sprite=readFileSync('public/icons/feather.svg','utf8');expect(sprite).not.toMatch(/stroke-width=/);
});

test('component code recovers from denied clipboard access',async({page})=>{
 await page.addInitScript(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:()=>Promise.reject(new Error('Denied'))}}));
 await page.goto(root+'#components/button');await page.getByRole('button',{name:'Copy code'}).click();
 await expect(page.getByRole('textbox',{name:'Copy component code manually'})).toContainText('DoubleButton');
 await page.goto(root+'#components/plain');await expect(page.getByRole('textbox',{name:'Copy component code manually'})).toHaveCount(0);
 await page.getByRole('button',{name:'Copy code'}).click();await expect(page.getByRole('textbox',{name:'Copy component code manually'})).toContainText('PlainButton');
});

test('motion previews use both edited timings and honour reduced motion',async({page})=>{
 await page.goto(root+'#foundations/motion');await enterDraft(page);
 const field=page.getByRole('spinbutton',{name:'theme duration'});await field.fill('600');await field.press('Enter');
 await expect(page.locator('.ds-motion-tone')).toHaveCSS('transition-duration','0.6s');
 await page.emulateMedia({reducedMotion:'reduce'});await expect(page.locator('.ds-motion-tone')).toHaveCSS('transition-duration','0s');
 await expect(page.locator('.ds-motion-track>span')).toHaveCSS('transition-duration','0s');
});

for(const theme of ['light','dark'] as const) {
 test('documentation axe audit has no serious violations in '+theme,async({page})=>{
  test.setTimeout(90000);
  for(const [route,action] of [['overview',''],['foundations/colors',''],['foundations/typography','Try type changes'],['foundations/spacing','Try spacing changes'],['icons',''],['guidelines','']]) {
   await page.goto(root+'#'+route);await page.locator('main h1').waitFor();
   if(await page.locator('html').getAttribute('data-theme')!==theme)await page.locator('.docs-header__theme').click();
   if(action)await enterDraft(page);
   await page.evaluate(()=>document.fonts.ready);
   const report=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
   expect(report.violations.filter(v=>v.impact==='serious'||v.impact==='critical'),route).toEqual([]);
  }
 });
}

for(const [section,editName,fieldName,value] of [
 ['colors','Try color changes','HEX for Primary action','#112233'],
 ['typography','Try type changes','Display size scale','130'],
 ['spacing','Try spacing changes','Spacing token 16 value','240'],
 ['layout','Try max width','Maximum content width','2400'],
 ['motion','Try timing changes','theme duration','800'],
]) {
 test('reference and edited '+section+' fit breakpoint edges in both themes',async({page})=>{
  test.setTimeout(60000);
  await page.goto(root+'#foundations/'+section!);await enterDraft(page);
  const field=section==='colors'?page.getByRole('textbox',{name:fieldName!}):page.getByRole('spinbutton',{name:fieldName!});
  await field.fill(value!);await field.press('Enter');
  for(const width of [320,340,375,599,899,1000,1001,1440,1920]) {
   await page.setViewportSize({width,height:800});
   for(const mode of ['light','dark']) {
    if(await page.locator('html').getAttribute('data-theme')!==mode)await page.locator('.docs-header__theme').click();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth),section+' '+width+' '+mode).toBeLessThanOrEqual(2);
    await expect(field).toBeVisible();
   }
  }
  await page.getByRole('button',{name:'View reference'}).click();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(2);
 });
}

test('a failed lazy animation keeps navigation and code available and can recover after reload',async({page})=>{
 await page.route('**/ProductScene.tsx*',route=>route.abort());
 await page.goto(root+'#components/query');
 await expect(page.getByRole('alert')).toContainText('Preview could not be loaded');
 await expect(page.getByRole('heading',{name:'Query Sequence',exact:true})).toBeVisible();
 await expect(page.getByRole('button',{name:'Copy code'})).toBeVisible();
 await page.unroute('**/ProductScene.tsx*');
 await page.getByRole('button',{name:'Reload preview'}).click();
 await expect(page.locator('apcosys-product-demo')).toHaveCount(1);
 await expect(page.getByRole('alert')).toHaveCount(0);
});

test('open documentation dialogs pass structural accessibility checks',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto(root+'#overview');
 await page.getByRole('button',{name:'Open navigation',exact:true}).click();
 let report=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
 expect(report.violations.filter(v=>v.impact==='serious'||v.impact==='critical')).toEqual([]);
 await page.getByRole('button',{name:'Close navigation',exact:true}).click();
 await page.getByRole('button',{name:'Search documentation'}).click();
 report=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
 expect(report.violations.filter(v=>v.impact==='serious'||v.impact==='critical')).toEqual([]);
});

test('collapsed desktop sidebar cannot hide the mobile navigation after resizing',async({page})=>{
 await page.setViewportSize({width:1440,height:900});await page.goto(root+'#foundations/colors');
 await page.getByRole('button',{name:'Collapse navigation'}).click();await expect(page.getByRole('button',{name:'Expand navigation'})).toBeFocused();
 await page.setViewportSize({width:375,height:812});await page.getByRole('button',{name:'Open navigation',exact:true}).click();
 await expect(page.getByRole('dialog',{name:'Documentation navigation'})).toBeVisible();
 await page.getByRole('link',{name:'Typography',exact:true}).click();await expect(page.locator('main h1')).toHaveText('Typography');
});
