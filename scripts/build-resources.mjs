import { readFileSync, writeFileSync, readdirSync, mkdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { deflateRawSync } from 'node:zlib';
import { createHash } from 'node:crypto';

const root = process.cwd();
const output = join(root, 'public/downloads');
mkdirSync(output, { recursive: true });
const packageInfo = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const instructions = `# APCOSYS — начало работы с дизайн-системой

Версия ${packageInfo.version}. Библиотека: https://imonsergey.github.io/Apco-components-lib/

## Найти нужный элемент

1. Откройте «С чего начать» и выберите задачу.
2. Для публичных страниц используйте «Компоненты сайта», для приложения — «SaaS-платформа».
3. Поиск по всей библиотеке открывается кнопкой в шапке, Ctrl+K / Cmd+K или клавишей /.
4. В карточке компонента проверьте назначение, тему, ширину и состояния.
5. Скопируйте пример кода или передайте разработчику прямую ссылку на него.

## Запустить исходники из архива

Нужен Node.js 22.12 или новее. Архив содержит исходники, стили, локальные шрифты, SVG и файл блокировки зависимостей.

\`\`\`sh
npm ci
npm run dev
\`\`\`

Откройте адрес, который напечатает Vite, с путём /Apco-components-lib/.
Сборка: npm run build. Проверка токенов и ассетов: npm run test:design-system.
Браузерные проверки: npx playwright install chromium, затем npm run test:ux.

## Подключить компонент

- Точки входа: src/index.ts и src/saas/index.ts.
- Переносите компонент вместе с зависимостями и CSS, указанными в его карточке.
- Подключайте общие токены перед стилями компонентов. Не копируйте стили оболочки документации в продукт.
- Website и SaaS используют разные масштабы интерфейса. Значения SaaS находятся в public/tokens/saas.tokens.json, стили изолированы в src/styles/saas-library.css.
- Примеры handleSearch / handleContinue / handlePlanSelect — обработчики вашего приложения.
- JSON является справочником токенов. Это не готовый файл Figma; импорт зависит от выбранного инструмента.
- Примеры с демонстрационными данными не обращаются к API, не создают заказ и не меняют аккаунт.

## Проверить экран перед передачей

Светлая и тёмная тема; мобильный, планшетный и широкий экран; клавиатура и Escape; длинные подписи и значения; loading / empty / error / limited / unknown, если применимо; возврат после диалога; понятная полная сумма платежа.

Тарифы: Monthly $0 / $50 / $300 / $900. Annual: $0 / $480 / $2,880 / $8,640 за год (эквивалент $0 / $40 / $240 / $720 за месяц).

## Источники

- Библиотека: https://github.com/IMONsergey/Apco-components-lib
- SaaS: https://github.com/IMONsergey/Assaasdev
- Маркетинговый сайт: https://github.com/IMONsergey/APCOCLEAR2

Сохраните RELEASE.json из архива: он фиксирует версию и исходный commit сборки. Лицензии шрифтов и иконок — в THIRD_PARTY_NOTICES.md и локальных файлах лицензий.
`;
writeFileSync(join(output, 'apcosys-quick-start.md'), instructions);
const release = {
  name: 'APCOSYS Design System', version: packageInfo.version,
  repository: 'https://github.com/IMONsergey/Apco-components-lib',
  sourceCommit: process.env.GITHUB_SHA || 'working-copy',
  saasSource: '7cb2bcfef00acf17cd02f3110fa8cdd1108861e2',
  websiteSource: '92cb513',
};
const entries = [];
function collect(path) {
  const absolute = join(root, path);
  for (const name of readdirSync(absolute).sort()) {
    const file = join(absolute, name);
    const rel = relative(root, file).replaceAll('\\', '/');
    if (rel.startsWith('public/downloads/')) continue;
    if (statSync(file).isDirectory()) collect(rel);
    else entries.push({ name: rel, data: readFileSync(file) });
  }
}
for (const directory of ['src', 'public', 'scripts', 'tests']) collect(directory);
for (const name of ['package.json', 'package-lock.json', 'README.md', 'THIRD_PARTY_NOTICES.md', 'index.html', 'vite.config.ts', 'playwright.config.ts', 'tsconfig.json', 'tsconfig.app.json', 'tsconfig.node.json', '.nvmrc', '.gitignore']) entries.push({ name, data: readFileSync(join(root, name)) });
entries.push({ name: 'QUICK_START.md', data: Buffer.from(instructions) });
entries.push({ name: 'RELEASE.json', data: Buffer.from(JSON.stringify(release, null, 2) + '\n') });
const crcTable = Array.from({ length: 256 }, (_, index) => {
  let crc = index;
  for (let bit = 0; bit < 8; bit++) crc = (crc & 1) ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1;
  return crc >>> 0;
});
function crc32(data) {
  let crc = 0xffffffff;
  for (const byte of data) crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}
const records = [], directory = [];
let offset = 0;
for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
  const filename = Buffer.from('apcosys-design-system/' + entry.name);
  const data = deflateRawSync(entry.data, { level: 9 });
  const crc = crc32(entry.data);
  const local = Buffer.alloc(30);
  local.writeUInt32LE(0x04034b50, 0); local.writeUInt16LE(20, 4); local.writeUInt16LE(0x800, 6); local.writeUInt16LE(8, 8);
  local.writeUInt16LE((46 << 9) | (10 << 5) | 25, 12);
  local.writeUInt32LE(crc, 14); local.writeUInt32LE(data.length, 18); local.writeUInt32LE(entry.data.length, 22); local.writeUInt16LE(filename.length, 26);
  const central = Buffer.alloc(46);
  central.writeUInt32LE(0x02014b50, 0); central.writeUInt16LE(20, 4); central.writeUInt16LE(20, 6); central.writeUInt16LE(0x800, 8); central.writeUInt16LE(8, 10);
  central.writeUInt16LE((46 << 9) | (10 << 5) | 25, 14);
  central.writeUInt32LE(crc, 16); central.writeUInt32LE(data.length, 20); central.writeUInt32LE(entry.data.length, 24); central.writeUInt16LE(filename.length, 28); central.writeUInt32LE(offset, 42);
  records.push(local, filename, data); directory.push(central, filename);
  offset += local.length + filename.length + data.length;
}
const centralDirectory = Buffer.concat(directory);
const end = Buffer.alloc(22);
end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(entries.length, 8); end.writeUInt16LE(entries.length, 10); end.writeUInt32LE(centralDirectory.length, 12); end.writeUInt32LE(offset, 16);
const archive = Buffer.concat([...records, centralDirectory, end]);
writeFileSync(join(output, 'apcosys-design-system.zip'), archive);
writeFileSync(join(output, 'manifest.json'), JSON.stringify({ ...release, files: entries.length, bytes: archive.length, sha256: createHash('sha256').update(archive).digest('hex') }, null, 2) + '\n');
console.log(`Client resources: ${entries.length} files, ${(archive.length / 1024).toFixed(0)} KB source archive.`);
