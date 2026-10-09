import {expect,type Page} from '@playwright/test';

export async function enterDraft(page:Page){
 const slug=new URL(page.url()).hash.replace('#foundations/','');
 if(new URL(page.url()).hash.startsWith('#foundations/'))await expect(page.locator('.ds-foundations')).toHaveAttribute('data-focus',slug);
 const entry=page.getByRole('button',{name:'Edit draft',exact:true});
 if(await entry.count())await entry.first().click();
 await expect(page.getByRole('button',{name:'View reference',exact:true}).first()).toBeVisible();
}
