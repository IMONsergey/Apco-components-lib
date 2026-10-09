import {chromium,firefox,webkit,expect} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
const base=process.env.AUDIT_URL||'http://127.0.0.1:5187/Apco-components-lib/';
const output=resolve(process.env.AUDIT_OUTPUT||'artifacts/r10');await mkdir(output,{recursive:true});
const results=[];
for(const [name,type] of Object.entries({chromium,firefox,webkit})){
 let browser;
 try{
  browser=await type.launch();
  for(const width of [375,1440]){
   const context=await browser.newContext({viewport:{width,height:812},reducedMotion:'reduce'});
   const page=await context.newPage();page.setDefaultTimeout(8000);const errors=[];page.on('pageerror',error=>errors.push(error.message));
   const row={engine:name,width,checks:{},errors};results.push(row);
   const check=async(label,run)=>{try{await run();row.checks[label]='passed';}catch(error){row.checks[label]=String(error).slice(0,500);}};
   await check('edit-reference-undo',async()=>{
    await page.goto(base+'#foundations/colors');await page.getByRole('button',{name:'Edit draft',exact:true}).click();await page.evaluate(()=>document.fonts.ready);
    const field=page.getByRole('textbox',{name:'HEX for Page background'});await field.focus();const before=await field.boundingBox();
    await field.fill('09f');await field.press('Enter');await expect(field).toHaveValue('#0099FF');const after=await field.boundingBox();
    row.firstEditShift=Math.abs(after.y-before.y);expect(row.firstEditShift).toBeLessThanOrEqual(1);
    await page.getByRole('button',{name:'Undo',exact:true}).click();await expect(field).toHaveValue('#F6F6F6');
    await page.getByRole('button',{name:'Redo',exact:true}).click();await expect(field).toHaveValue('#0099FF');
    await page.getByRole('button',{name:'View reference'}).click();await expect(page.locator('.ds-token-row').first()).toContainText('#F6F6F6');
   });
   await check('theme-layout',async()=>{
    await page.locator('.docs-header__theme').click();expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(2);
    await expect(page.locator('.ds-token-row').first()).toContainText('#0D1113');
   });
   await check('navigation',async()=>{
    if(width<1001){await page.getByRole('button',{name:'Open navigation',exact:true}).click();await expect(page.getByRole('button',{name:'Close navigation',exact:true})).toBeFocused();await page.getByRole('link',{name:'Typography',exact:true}).click();}
    else await page.getByRole('link',{name:'Typography',exact:true}).click();
    await expect(page.locator('main h1')).toHaveText('Typography');
   });
   await check('short-search',async()=>{
    await page.setViewportSize({width:375,height:420});await page.getByRole('button',{name:'Search documentation'}).click();
    const field=page.getByRole('combobox',{name:'Search all docs'});await field.fill('icon');for(let i=0;i<7;i++)await field.press('ArrowDown');
    const item=await page.locator('[role=option][aria-selected=true]').boundingBox(),panel=await page.locator('.docs-command__results').boundingBox();
    expect(item.y).toBeGreaterThanOrEqual(panel.y);expect(item.y+item.height).toBeLessThanOrEqual(panel.y+panel.height+1);await field.press('Escape');
   });
   await check('catalog-return',async()=>{
    await page.setViewportSize({width,height:812});await page.goto(base+'#components/interface');const card=page.locator('.lib-card[data-testid="plancard"] .lib-card__name');
    await card.scrollIntoViewIfNeeded();const y=await page.evaluate(()=>scrollY);await card.click();await page.locator('.docs-component__back').click();await expect(page).toHaveURL(/#components\/interface$/);
    await expect.poll(()=>page.evaluate(()=>scrollY)).toBe(y);await expect(card).toBeFocused();
   });
   await context.close();
  }
 }catch(error){results.push({engine:name,launchError:String(error)});}finally{await browser?.close();}
}
await writeFile(resolve(output,'cross-browser.json'),JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));
if(results.some(result=>result.launchError||result.errors?.length||Object.values(result.checks||{}).some(value=>value!=='passed')))process.exitCode=1;
