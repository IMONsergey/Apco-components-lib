import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { brotliDecompressSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url));
const raw=await readFile(join(root,'vendor/uploaded-components.br.base64'),'utf8');
const decoded=brotliDecompressSync(Buffer.from(raw.trim(),'base64'));
const sha=createHash('sha256').update(decoded).digest('hex');
const expected='ff1f5d926fe0b61e1e5cb6f1f2f89b5386059315ba2c6cddf494427d39000f34';
if(sha!==expected)throw new Error('Uploaded archive source integrity verification failed: '+sha);
const files=JSON.parse(decoded.toString('utf8'));
const paths={
  'AIChatOrb.jsx':'src/visuals/uploads/ai-chat/AIChatOrb.jsx',
  'OrbCubeLoader.tsx':'src/visuals/uploads/orb-cube/OrbCubeLoader.tsx',
  'OrbCubeLoader.css':'src/visuals/uploads/orb-cube/OrbCubeLoader.css'
};
const names=Object.keys(paths);
if(Object.keys(files).length!==names.length||names.some(name=>typeof files[name]!=='string'))throw new Error('Unexpected vendor source manifest');
for(const name of names){
  const target=join(root,paths[name]);
  await mkdir(dirname(target),{recursive:true});
  await writeFile(target,files[name],'utf8');
}
console.log('Restored 3 uploaded source files; SHA256 verified:',sha);
