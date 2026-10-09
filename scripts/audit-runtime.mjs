import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { resolve } from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';
const phase=process.env.AUDIT_PHASE||'after';
const base=process.env.AUDIT_URL||'http://127.0.0.1:5187/Apco-components-lib/';
const destination=resolve(process.env.AUDIT_OUTPUT||'artifacts/audit',phase);
await mkdir(destination,{recursive:true});
const browser=await chromium.launch();
const context=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'});
const page=await context.newPage();
const result={phase,base,complete:false,accessibility:[],screens:[]};
try {
 for(const theme of ['light','dark']) {
  for(const [section,action] of [['overview',null],['foundations/colors',null],['foundations/typography','Try type changes'],['foundations/spacing','Try spacing changes'],['icons',null],['guidelines',null]]) {
   await page.goto(base+'#'+section);await page.locator('main h1').first().waitFor();
   if(await page.locator('html').getAttribute('data-theme')!==theme)await page.locator('.docs-header__theme').click();
   if(action&&await page.getByRole('button',{name:'Edit draft',exact:true}).count())await page.getByRole('button',{name:'Edit draft',exact:true}).click();
   await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(250);
   const report=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
   result.accessibility.push({theme,section,violations:report.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary})).slice(0,8)}))});
  }
 }
 for(const width of [375,1440]) {
  for(const theme of ['light','dark']) {
   for(const id of ['button','plain','searchfield','iconaction','tags','billing','plancard','planbutton']) {
    await page.setViewportSize({width,height:900});await page.goto(base+'#components/'+id);await page.locator('.docs-component__stage').waitFor();
    if(await page.locator('html').getAttribute('data-theme')!==theme)await page.locator('.docs-header__theme').click();
    await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(250);
    const file=`${width}-${theme}-${id}.png`;
    await page.locator('.docs-component__stage').screenshot({path:destination+'/'+file,animations:'disabled'});result.screens.push(file);
   }
  }
 }
 result.complete=true;
} finally {
 await writeFile(destination+'/runtime.json',JSON.stringify(result,null,2));
 console.log(JSON.stringify(result,null,2));await browser.close();
}
