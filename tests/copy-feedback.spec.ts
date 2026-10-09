import {expect,test} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {enterDraft} from './support/editing';
const root='/Apco-components-lib/';

test('icon-family labels and counts have explicit spacing at every relevant width',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto(root+'#icons');
 for(const width of [320,340,375,599,899,1001,1440,1920]){
  await page.setViewportSize({width,height:900});await page.evaluate(()=>document.fonts.ready);
  for(const button of await page.locator('.ds-icon-families>button').all()){
   const {label,count,rect}=await button.evaluate(el=>({label:el.querySelector('.ds-icon-family-name')!.getBoundingClientRect().toJSON(),count:el.querySelector('.ds-icon-family-count')!.getBoundingClientRect().toJSON(),rect:el.getBoundingClientRect().toJSON()}));
   expect(count!.x-label!.x-label!.width,width+'px label/count gap').toBeGreaterThanOrEqual(5.9);
   expect(count!.x+count!.width,width+'px count within tab').toBeLessThanOrEqual(rect!.x+rect!.width);
   expect(label!.x,width+'px label within tab').toBeGreaterThanOrEqual(rect!.x);
  }
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth),width+'px').toBeLessThanOrEqual(2);
 }
});

for(const theme of ['light','dark'])test('copy toast is centered, nonblocking and does not move the '+theme+' interface',async({page})=>{
 await page.context().grantPermissions(['clipboard-read','clipboard-write']);
 await page.setViewportSize({width:375,height:812});await page.goto(root+'#icons');
 await page.getByRole('button',{name:/Feather/}).click();
 if(theme==='dark')await page.locator('.docs-header__theme').click();
 await page.evaluate(()=>document.fonts.ready);
 const tile=page.getByRole('button',{name:'activity',exact:true});const before=await tile.boundingBox();
 await tile.click();const toast=page.getByTestId('copy-toast');
 await expect(toast).toHaveText('Code copied');await expect(tile).toBeFocused();
 await expect.poll(()=>page.evaluate(()=>navigator.clipboard.readText())).toContain('name="activity"');
 await page.waitForTimeout(200);
 const rect=await toast.boundingBox(),after=await tile.boundingBox();
 expect(Math.abs(rect!.x+rect!.width/2-375/2)).toBeLessThanOrEqual(1);
 expect(Math.abs(812-rect!.y-rect!.height-24)).toBeLessThanOrEqual(1);
 expect(after).toEqual(before);
 await expect(toast).toHaveCSS('pointer-events','none');
 await expect(tile).toHaveAttribute('data-selected','false');
 await expect(page.locator('#docs-icon-library')).not.toContainText('copied');
 await expect(page.locator('.docs-copy-toast-region')).toHaveCount(1);
 const report=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
 expect(report.violations.filter(v=>v.impact==='critical'||v.impact==='serious')).toEqual([]);
});

test('toast lasts two seconds and rapid copies replace it instead of stacking',async({page})=>{
 await page.context().grantPermissions(['clipboard-read','clipboard-write']);
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto(root+'#icons');
 await page.getByRole('button',{name:'search',exact:true}).click();
 const toast=page.getByTestId('copy-toast');await expect(toast).toHaveText('Code copied');
 await page.waitForTimeout(1000);
 await page.getByRole('button',{name:'previous',exact:true}).click();
 await expect(toast).toHaveCount(1);await expect.poll(()=>page.evaluate(()=>navigator.clipboard.readText())).toContain('name="previous"');
 await page.waitForTimeout(1100);await expect(toast).toBeVisible();
 await expect(toast).toHaveCount(0,{timeout:1800});
});

test('pending or denied clipboard writes never produce a success toast',async({page})=>{
 await page.addInitScript(()=>{
  const queue:Array<{resolve:()=>void;reject:()=>void}>=[];
  Object.assign(window,{testCopyQueue:queue});
  Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:()=>new Promise<void>((resolve,reject)=>queue.push({resolve,reject:()=>reject(Error('denied'))}))}});
 });
 await page.goto(root+'#icons');
 await page.getByRole('button',{name:'previous',exact:true}).click();
 await expect(page.getByTestId('copy-toast')).toHaveCount(0);
 await page.evaluate(()=>{(window as unknown as {testCopyQueue:Array<{reject:()=>void}>}).testCopyQueue[0]!.reject();});
 await expect(page.getByRole('textbox',{name:'Icon JSX code'})).toHaveValue(/previous/);
 await expect(page.getByTestId('copy-toast')).toHaveCount(0);
 await page.getByRole('button',{name:'search',exact:true}).click();
 await page.evaluate(()=>{(window as unknown as {testCopyQueue:Array<{resolve:()=>void}>}).testCopyQueue[1]!.resolve();});
 await expect(page.getByTestId('copy-toast')).toHaveText('Code copied');
});

test('reduced motion disables toast movement but keeps the confirmation and timeout',async({page})=>{
 await page.context().grantPermissions(['clipboard-read','clipboard-write']);
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto(root+'#icons');
 await page.getByRole('button',{name:'previous',exact:true}).click();
 const toast=page.getByTestId('copy-toast');await expect(toast).toHaveText('Code copied');
 await expect(toast).toHaveCSS('animation-name','none');
 await expect(toast).toHaveCSS('transform','none');
 await expect(toast).toHaveCount(0,{timeout:3000});
});

test('copy feedback is shared by component code, token values and CSS exports',async({page})=>{
 await page.context().grantPermissions(['clipboard-read','clipboard-write']);
 await page.goto(root+'#components/button');await page.getByRole('button',{name:'Copy code'}).click();
 await expect(page.getByTestId('copy-toast')).toHaveText('Code copied');
 await page.goto(root+'#foundations/colors');await page.locator('.ds-token-row').first().click();
 await expect(page.getByTestId('copy-toast')).toHaveText('Color copied');
 await enterDraft(page);const value=page.getByRole('textbox',{name:'HEX for Page background'});await value.fill('#AABBCC');await value.press('Enter');
 await page.getByRole('button',{name:'Copy CSS',exact:true}).click();
 await expect(page.getByTestId('copy-toast')).toHaveText('CSS copied');
 await expect(page.locator('.docs-copy-toast-region')).toHaveCount(1);
});
