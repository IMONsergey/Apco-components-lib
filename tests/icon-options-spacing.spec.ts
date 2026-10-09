import { expect, test } from '@playwright/test';

const root = '/Apco-components-lib/';

test('Size and Stroke labels, selects, and groups have a compact consistent rhythm', async ({ page }) => {
  await page.goto(root + '#icons');
  for (const width of [320, 375, 390, 599, 600, 700, 899, 1001, 1440, 1920]) {
    await page.setViewportSize({ width, height: 820 });
    const geometry = await page.locator('.ds-icon-options').evaluate(node => {
      const controls = Array.from(node.querySelectorAll<HTMLLabelElement>('.ds-icon-options__control'));
      const measurements = controls.map(control => {
        const labelNode = control.querySelector<HTMLElement>(':scope > span:first-child');
        if (!labelNode) throw new Error('Missing Size/Stroke label');
        const text = labelNode.getBoundingClientRect();
        const select = control.querySelector('select')!.getBoundingClientRect();
        const wrapper = control.getBoundingClientRect();
        return {
          textRight: text.right,
          textCenterY: text.top + text.height / 2,
          selectLeft: select.left,
          selectCenterY: select.top + select.height / 2,
          selectWidth: select.width,
          selectHeight: select.height,
          wrapperLeft: wrapper.left,
          wrapperRight: wrapper.right
        };
      });
      const note = node.querySelector(':scope > span')!.getBoundingClientRect();
      return {
        measurements,
        groupGap: measurements[1]!.wrapperLeft - measurements[0]!.wrapperRight,
        noteTop: note.top,
        fieldsBottom: Math.max(...measurements.map(x => x.selectCenterY + x.selectHeight / 2)),
        documentOverflow: document.documentElement.scrollWidth - innerWidth,
      };
    });
    const label = width + 'px';
    expect(geometry.measurements, label + ' has two controls').toHaveLength(2);
    expect(geometry.groupGap, label + ' between Size/Stroke groups').toBeCloseTo(width <= 599 ? 10 : 12, 1);
    for (const [i, control] of geometry.measurements.entries()) {
      expect(control.selectLeft - control.textRight, label + ' text/select gap ' + i).toBeCloseTo(6, 1);
      expect(control.selectWidth, label + ' select width ' + i).toBeCloseTo(width <= 599 ? 88 : 92, 1);
      expect(control.selectHeight, label + ' select height ' + i).toBeCloseTo(36, 1);
      expect(Math.abs(control.textCenterY - control.selectCenterY), label + ' vertical alignment ' + i).toBeLessThanOrEqual(1);
    }
    if (width <= 599) expect(geometry.noteTop, label + ' notes below controls').toBeGreaterThanOrEqual(geometry.fieldsBottom);
    expect(geometry.documentOverflow, label + ' horizontal overflow').toBeLessThanOrEqual(2);
  }
  await expect(page.getByLabel('Icon size')).toHaveValue('24');
  await expect(page.getByLabel('Icon stroke width')).toHaveValue('1.5');
  await page.getByLabel('Icon size').selectOption('32');
  await page.getByLabel('Icon stroke width').selectOption('2');
  await expect(page.getByLabel('Icon size')).toHaveValue('32');
  await expect(page.getByLabel('Icon stroke width')).toHaveValue('2');
});
