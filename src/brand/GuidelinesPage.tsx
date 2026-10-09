import { useEffect, useState } from 'react';
const rules=[
 {id:'01',name:'Choose colors by purpose',source:'src/styles/tokens.css · src/styles/theme-page.css',required:'Use --page, --white, --ink, --muted, --action, --line. Resolve through the active HTML data-theme.',avoid:'Do not hardcode a teal hex in components or invert logo assets with a general-purpose filter.'},
 {id:'02',name:'Keep typography consistent',source:'src/styles/instrument-sans.css · src/styles/ibm-plex-mono.css',required:'Instrument Sans for interface and headings; IBM Plex Mono for numeric/data metadata. 500 headings, 400 body.',avoid:'No substitute fonts, fabricated weights, global all-caps, or arbitrary tracking.'},
 {id:'03',name:'Keep layouts flexible',source:'src/styles/tokens.css · src/styles/interface-layout.css',required:'Use width:calc(100% - 2*var(--gutter)); max-width:1760px. Let components be responsive inside it.',avoid:'Do not use fixed desktop widths or blanket viewport scaling of content.'},
 {id:'04',name:'Design for every screen',source:'src/styles/tokens.css · section CSS',required:'Audit 340, 375, 599, 899, 1199, 1399 and 1600px. Respect short desktop ≤800px.',avoid:'No one universal mobile breakpoint and no changes to published layout when extracting components.'},
 {id:'05',name:'Use consistent icons',source:'src/components/ui/Icon.tsx · brand/IconsPage.tsx',required:'Native 16/1.5 for published controls. Feather on 24px grid with 1.5px strokes for extensions; currentColor always.',avoid:'Do not mix filled Phosphor and stroke Feather within the same toolbar.'},
 {id:'06',name:'Make interactions clear',source:'src/styles/source-components.css · src/styles/micro-motion.css',required:'Default, hover, focus-visible, pressed, selected, disabled. Icon and label must form one semantic action.',avoid:'Do not replace the published DoubleButton with two separate hit targets.'},
 {id:'07',name:'Animate with purpose',source:'src/styles/micro-motion.css · src/visuals/',required:'160–220ms paint transitions, 280ms disclosure. Pause heavy scenes offscreen; honor reduced motion.',avoid:'No infinite animation in functional controls; do not animate layout unnecessarily.'},
 {id:'08',name:'Make it accessible',source:'Site components · React primitives',required:'Name every icon-only control, use native input/summary/dialog, maintain keyboard and focus states.',avoid:'No clickable span or hidden keyboard focus. Never convey a state only by color.'},
 {id:'09',name:'Protect the logo',source:'src/components/ui/Logo.tsx · public/assets/brand/',required:'Select supplied light/dark wordmark variant; preserve proportions and negative space.',avoid:'Do not redraw glyphs, stretch the mark, or use UI action color as a logo replacement.'},
 {id:'10',name:'Build for reuse',source:'src/components/system/ · src/visuals/',required:'Separate rendering from backend, forward events/props, store tokens in CSS, avoid remote icon CDNs.',avoid:'No product API call inside a demo component or duplicate animation runtime.'},
];
const snippets=[
 {label:'Use semantic color',code:'.panel {\n  color: var(--ink);\n  background: var(--white);\n  border: 1px solid var(--line);\n}'},
 {label:'Reuse source CTA',code:"import { DoubleButton } from './components/ui/DoubleButton';\n\n<DoubleButton variant='primary'>Start free</DoubleButton>"},
 {label:'Theme-aware asset',code:"const src = theme === 'dark'\n  ? '/assets/brand/wordmark-dark.svg'\n  : '/assets/brand/wordmark-light.svg';"},
 {label:'Morph a state change',code:'import { MorphIcon } from "morphicons/react";\nimport { Menu, X } from "lucide";\n\n<MorphIcon icon={open ? X : Menu} strokeWidth={1.5} reducedMotion="user" />'},
];
function Copy({code}:{code:string}){
 const [copied,setCopied]=useState(false);
 return <button type="button" onClick={()=>{void navigator.clipboard?.writeText(code).then(()=>setCopied(true)).catch(()=>setCopied(false))}}>{copied?'Copied':'Copy'}</button>;
}
export default function GuidelinesPage({focus}:{focus?:string}){
 useEffect(()=>{
  if(focus==='usage'||focus==='integration'){
   const target=document.getElementById(focus==='usage'?'docs-guideline-patterns':'docs-guideline-integration') as HTMLDetailsElement|null;
   if(target){target.open=true;requestAnimationFrame(()=>target.scrollIntoView({block:'start',behavior:'instant'}))}
  }
 },[focus]);
 return <div className="ds-guidelines">
  <div className="ds-section-bar"><div><h2>Best practices</h2><p>Keep every screen consistent</p></div><span className="ds-label">10 rules</span></div>
  <div id="docs-guideline-rules" className="ds-guideline-list">{rules.map(rule=>
   <details key={rule.id} className="ds-guideline">
    <summary className="ds-guideline__heading"><span>{rule.id}</span><h3>{rule.name}</h3><span className="ds-rule-caret">+</span></summary>
    <div className="ds-guideline__content">
     <p><strong>Use</strong>{rule.required}</p>
     <p><strong>Avoid</strong>{rule.avoid}</p>
     <code>{rule.source}</code>
    </div>
   </details>)}</div>
  <details id="docs-guideline-patterns" className="ds-native-details ds-doc-details"><summary>Examples <span>+</span></summary>
  <section className="ds-section">
   <div className="ds-section-bar"><h2>Usage</h2></div>
   <div className="ds-recipes">{snippets.map(s=><div key={s.label}><div><span>{s.label}</span><Copy code={s.code}/></div><pre><code>{s.code}</code></pre></div>)}</div>
  </section></details>
  <details id="docs-guideline-integration" className="ds-native-details ds-doc-details"><summary>For developers <span>+</span></summary>
  <section className="ds-section">
   <div className="ds-section-bar"><h2>Adoption</h2></div>
   <div className="ds-adoption"><div><span className="ds-label">01 / Install</span><code>npm ci</code><code>npm run build</code></div>
    <div><span className="ds-label">02 / Reuse</span><code>src/components/ui</code><code>src/components/system</code><code>src/visuals</code></div>
    <div><span className="ds-label">03 / Theme</span><code>src/styles/tokens.css</code><code>src/styles/theme-page.css</code><code>src/styles/system-primitives.css</code></div>
   </div>
   <p className="ds-caption">Core APCOSYS icons are proprietary artwork from the site; Feather (MIT) and Phosphor (MIT) come from maintained Iconify JSON packages. Morphicons is MIT; Lucide is ISC. Preserve upstream license notices when distributing the library. Product GSAP scenes are inert previews, not finished product workflows.</p>
  </section></details>
 </div>;
}
