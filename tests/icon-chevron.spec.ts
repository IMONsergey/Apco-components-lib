import {expect,test} from '@playwright/test';

const root='/Apco-components-lib/#icons';

for(const width of [320,375,390,599,600,768,1001,1440,1920]){
 test(`Size and Stroke custom chevrons center precisely at ${width}px`,async({page})=>{
  await page.setViewportSize({width,height:812});
  await page.goto(root);
  const selects=[page.getByRole('combobox',{name:'Icon size'}),page.getByRole('combobox',{name:'Icon stroke width'})];
  for(const theme of ['light','dark']){
   if(theme==='dark')await page.getByRole('button',{name:'Dark theme'}).click();
   const snapshots=[];
   for(const select of selects){
    const details=await select.evaluate(element=>{
     const shell=element.parentElement!;
     const arrow=shell.querySelector<SVGSVGElement>('.ds-icon-select__chevron')!;
     const s=element.getBoundingClientRect(),a=arrow.getBoundingClientRect(),b=shell.getBoundingClientRect();
     return {appearance:getComputedStyle(element).appearance,
      arrowCenterDelta:Math.abs((a.top+a.height/2)-(s.top+s.height/2)),
      rightInset:s.right-a.right,
      arrowCount:shell.querySelectorAll('.ds-icon-select__chevron').length,
      pointerEvents:getComputedStyle(arrow).pointerEvents,
      overflow:a.right> s.right||a.left<s.left,
      height:s.height,shellHeight:b.height,
      arrowVisible:getComputedStyle(arrow).visibility,
     };
    });
    expect(details.appearance).toBe('none');
    expect(details.arrowCenterDelta).toBeLessThanOrEqual(.5);
    expect(details.rightInset).toBeGreaterThanOrEqual(8);
    expect(details.rightInset).toBeLessThanOrEqual(12);
    expect(details.arrowCount).toBe(1);
    expect(details.pointerEvents).toBe('none');
    expect(details.overflow).toBe(false);
    expect(details.arrowVisible).toBe('visible');
    expect(details.height).toBe(36);
    expect(details.shellHeight).toBe(36);
    snapshots.push(details);
   }
   expect(snapshots[0]!.arrowCenterDelta).toBe(snapshots[1]!.arrowCenterDelta);
   expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(2);
  }
 });
}

test('native select remains focusable and selectable; disabled state has correct chevron',async({page})=>{
 await page.goto(root);
 const size=page.getByRole('combobox',{name:'Icon size'});
 await size.focus();await expect(size).toBeFocused();
 // Playwright on headless macOS does not reliably move a system-native select with ArrowDown.
 // Preserve the native element; verify selection and accessible focus through the browser API.
 await size.selectOption('32');await expect(size).toHaveValue('32');
 const stroke=page.getByRole('combobox',{name:'Icon stroke width'});
 await stroke.selectOption('2');await expect(stroke).toHaveValue('2');
 await page.getByRole('button',{name:/Phosphor/}).click();
 await expect(stroke).toBeDisabled();
 await expect(stroke.locator('..').locator('.ds-icon-select__chevron')).toBeVisible();
 await size.selectOption('16');await expect(size).toHaveValue('16');
});
