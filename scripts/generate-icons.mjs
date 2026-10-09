import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const destination = resolve(root, 'public/icons');
const metadataPath = resolve(root, 'src/generated');
mkdirSync(destination, { recursive: true });
mkdirSync(metadataPath, { recursive: true });

/**
 * Build-time extraction avoids shipping two icon registries in runtime JS.
 * It is generated from maintained MIT Iconify packs.
 * Original APCOSYS icons remain a separate native set.
 */
function buildPack(packageName, prefix, filter) {
  const set = JSON.parse(readFileSync(resolve(root, 'node_modules/@iconify-json', packageName, 'icons.json'), 'utf8'));
  const baseWidth = set.width || 24;
  const baseHeight = set.height || baseWidth;
  const names = Object.keys(set.icons)
    .filter(name => filter(name, set.icons[name]))
    .sort((a,b) => a.localeCompare(b));
  const symbols = names.map(name => {
    const icon = set.icons[name];
    const viewWidth = icon.width || baseWidth;
    const viewHeight = icon.height || baseHeight;
    let body = icon.body;
    // Both sets are used through currentColor; Feather's published
    // 2px strokes are normalized to the APCOSYS 1.5px icon policy.
    if (prefix === 'feather') {
      body = body.replace(/\\sstroke-width="[^"]*"/g, '');
    }
    return '<symbol id="' + prefix + '-' + name + '" viewBox="0 0 ' +
      viewWidth + ' ' + viewHeight + '">' + body + '</symbol>';
  });
  const sprite = '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    symbols.join('') + '</svg>\n';
  writeFileSync(resolve(destination, prefix + '.svg'), sprite);
  return names;
}

const feather = buildPack('feather', 'feather', () => true);
const phosphor = buildPack('ph', 'phosphor', name =>
  !/-(bold|thin|light|fill|duotone)$/.test(name)
);
const data = {
  feather,
  phosphor,
  note: 'Generated from @iconify-json/feather and @iconify-json/ph at npm install time. SVGs ship locally.'
};
writeFileSync(resolve(metadataPath, 'icon-manifest.json'), JSON.stringify(data));
process.stdout.write('Icon assets: ' + feather.length + ' Feather, ' + phosphor.length + ' Phosphor (regular).\n');
