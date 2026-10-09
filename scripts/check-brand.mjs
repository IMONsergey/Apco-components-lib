import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const read = path => readFileSync(resolve(root, path), 'utf8');
const json = path => JSON.parse(read(path));
const tokens = json('src/tokens/apcosys.tokens.json');
const manifest = json('src/generated/icon-manifest.json');
const lightCSS = read('src/styles/tokens.css');
const darkCSS = read('src/styles/theme-page.css');
for (const [name, color] of Object.entries(tokens.colors)) {
  assert.match(color.light, /^#[0-9a-f]{6}$/i, name + ': invalid light hex');
  assert.match(color.dark, /^#[0-9a-f]{6}$/i, name + ': invalid dark hex');
  const esc = color.css.replace(/[-/\\^$*+?.()|[\\]{}]/g, '\\$&');
  // Exact published variable should appear in both themes.
  const pattern = new RegExp(esc + '\\s*:\\s*(' + color.light + ')', 'i');
  assert.match(lightCSS, pattern, name + ': light CSS/token mismatch');
  const darkPattern = new RegExp(esc + '\\s*:\\s*(' + color.dark + ')', 'i');
  assert.match(color.dark.toLowerCase() === color.light.toLowerCase() ? lightCSS : darkCSS, darkPattern, name + ': dark CSS/token mismatch');
}
assert.deepEqual(json('public/tokens/apcosys.tokens.json'), tokens, 'Downloadable tokens differ from the approved source');
assert(manifest.feather.length >= 270, 'Feather set unexpectedly incomplete');
assert(manifest.phosphor.length >= 1000, 'Phosphor set unexpectedly incomplete');
for (const family of ['feather', 'phosphor']) {
  const sprite = read('public/icons/' + family + '.svg');
  assert(sprite.startsWith('<svg'), family + ' invalid SVG sprite');
  assert(!/<script\b|<foreignObject\b|<image\b/i.test(sprite), family + ' contains unsafe markup');
  if (family === 'feather') assert(!/stroke-width=/.test(sprite), 'Feather child geometry overrides chosen stroke');
  const ids = (sprite.match(/<symbol id=/g) || []).length;
  assert.equal(ids, manifest[family].length, family + ' sprite/manifest count mismatch');
}
const aliases=read('src/styles/system-primitives.css');
for (const n of tokens.spaces) assert(aliases.includes('--ds-space-'+n/4+': '+n+'px;'), 'Spacing alias mismatch: '+n);
for (const filename of ['wordmark-light','wordmark-dark','symbol-light','symbol-dark']) {
  assert(existsSync(resolve(root,'public/assets/brand/'+filename+'.svg')));
}
console.log('Design-system checks passed:', Object.keys(tokens.colors).length,
  'semantic colors × 2 themes,', manifest.feather.length, 'Feather,',
  manifest.phosphor.length, 'Phosphor, 4 brand assets.');
