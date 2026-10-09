import { useState } from 'react';
import { Logo } from '../components/ui/Logo';
import tokens from '../tokens/apcosys.tokens.json';

type Mode='light'|'dark';
const pairs=Object.entries(tokens.colors);
const base=import.meta.env.BASE_URL;
const dimensions=[
 ['Container max',tokens.layout.maxWidth],
 ['Side gutters',tokens.layout.baseGutter],
 ['Large screens',tokens.layout.desktopWideGutter],
 ['Compact screens',tokens.layout.mobileGutter],
 ['Header height',tokens.layout.header],
 ['Section spacing',tokens.layout.sectionSpace],
];
const sampleStyles=[
 {label:'Display / Hero',className:'ds-type-display',sample:'Internet, understood.',css:'clamp(72px, 7.3611vw, 106px) · −0.04em'},
 {label:'Heading / H2',className:'ds-type-heading',sample:'One query. Full context.',css:'clamp(48px, 5.9722vw, 86px) · −0.05em'},
 {label:'Body',className:'ds-type-body',sample:'Explore the technology behind every host, network and service.',css:'18px / 1.4 · 16px on mobile'},
 {label:'Control',className:'ds-type-control',sample:'Get started',css:'14px / 20px · weight 500'},
 {label:'Metadata / Mono',className:'ds-type-mono',sample:'103.45.21.0 · API 200 OK',css:'IBM Plex Mono · 13px'},
];
function Copy({value}:{value:string}){
 const [copied,setCopied]=useState(false);
 return <button className="ds-copy" type="button" onClick={()=>{void navigator.clipboard?.writeText(value).then(()=>setCopied(true)).catch(()=>setCopied(false))}}>
 {copied?'Copied':'Copy'}</button>;
}
function hexLuminance(hex:string){
 const rgb=hex.replace('#','').match(/.{2}/g);
 if(!rgb)return 0;
 const values=rgb.map(chunk=>{const c=parseInt(chunk,16)/255;return c<=0.04045?c/12.92:Math.pow((c+0.055)/1.055,2.4)});
 return .2126*(values[0]??0)+.7152*(values[1]??0)+.0722*(values[2]??0);
}
function contrast(a:string,b:string){
 const one=hexLuminance(a),two=hexLuminance(b);
 return ((Math.max(one,two)+.05)/(Math.min(one,two)+.05)).toFixed(1);
}
export default function FoundationsPage(){
 const [colorMode,setColorMode]=useState<Mode>('light');
 return <div className="ds-foundations">
   <section className="ds-section" id="foundation-brand">
    <div className="ds-section-bar"><div><h2>Identity</h2><p>Approved brand marks · supplied clear assets and website geometry</p></div><span className="ds-label">APCOSYS</span></div>
    <div className="ds-brand-grid">
      <div className="ds-brand-sample ds-brand-sample--light">
        <img src={base+'assets/brand/wordmark-light.svg'} alt="APCOSYS logotype light background"/>
        <span>Light / #12212A + #50A9B7</span>
      </div>
      <div className="ds-brand-sample ds-brand-sample--dark">
        <img src={base+'assets/brand/wordmark-dark.svg'} alt="APCOSYS logotype dark background"/>
        <span>Dark / #FFFFFF + #52BFD0</span>
      </div>
    </div>
    <div className="ds-brand-meta">
      <div><span className="ds-label">Native responsive mark</span><div className="ds-logo-inline"><Logo/></div></div>
      <div><span className="ds-label">Symbol</span><div className="ds-symbols"><img src={base+'assets/brand/symbol-light.svg'} alt="APCOSYS light symbol" /><img src={base+'assets/brand/symbol-dark.svg'} alt="APCOSYS dark symbol"/></div></div>
      <div><span className="ds-label">Assets</span><a href={base+'assets/brand/wordmark-light.svg'} target="_blank" rel="noreferrer">Light SVG ↗</a><a href={base+'assets/brand/wordmark-dark.svg'} target="_blank" rel="noreferrer">Dark SVG ↗</a></div>
    </div>
    <p className="ds-caption">The logotype geometry is immutable. Theme variants preserve the approved light/dark brand colors. UI action colors follow semantic tokens and must not be substituted for logo colors.</p>
   </section>
   <section className="ds-section" id="foundation-colors">
    <div className="ds-section-bar"><div><h2>Color tokens</h2><p>17 semantic roles · values taken from published CSS</p></div>
      <div className="ds-toggle-row">{(['light','dark'] as const).map(mode=>
        <button key={mode} type="button" data-active={colorMode===mode} onClick={()=>setColorMode(mode)}>{mode}</button>)}</div>
    </div>
    <div className="ds-color-grid">{pairs.map(([key,entry])=>{
      const color=entry[colorMode] as string;
      return <div className="ds-color-cell" key={key}>
        <div className="ds-color-chip" style={{background:color}}/>
        <div className="ds-color-meta"><span>{key}</span><code>{entry.css}</code><strong>{color.toUpperCase()}</strong><small>{entry.usage}</small><Copy value={entry.css}/></div>
      </div>;
    })}</div>
    <div className="ds-contrast-pair">
      <div className="ds-contrast-sample" style={{background:tokens.colors.card[colorMode],color:tokens.colors.primary[colorMode]}}>
        <span>Text on card</span><strong>Aa</strong><small>{contrast(tokens.colors.primary[colorMode],tokens.colors.card[colorMode])}:1 contrast</small>
      </div>
      <div className="ds-contrast-sample" style={{background:tokens.colors.action[colorMode],color:tokens.colors.onAction[colorMode]}}>
        <span>On action</span><strong>Aa</strong><small>{contrast(tokens.colors.onAction[colorMode],tokens.colors.action[colorMode])}:1 contrast</small>
      </div>
    </div>
   </section>
   <section className="ds-section" id="foundation-type">
    <div className="ds-section-bar"><div><h2>Typography</h2><p>Instrument Sans / IBM Plex Mono · self-hosted</p></div><a href={base+'tokens/apcosys.tokens.json'} target="_blank" rel="noreferrer">Token JSON ↗</a></div>
    <div className="ds-type-list">{sampleStyles.map(item=>
      <div key={item.label} className="ds-type-row">
        <div><span className="ds-label">{item.label}</span><code>{item.css}</code></div>
        <div className={item.className}>{item.sample}</div>
      </div>)}</div>
    <p className="ds-caption">Use responsive clamps only where published. Body size is 18px on desktop, 16px at ≤599px. Headings use weight 500 and negative tracking. No faux bold, nonbrand fonts or arbitrary uppercase transformations.</p>
   </section>
   <section className="ds-section" id="foundation-spacing">
    <div className="ds-section-bar"><div><h2>Spacing & radii</h2><p>Normalized spacing scale · exact values used throughout the source site</p></div><span className="ds-label">4px basis</span></div>
    <div className="ds-spacing-grid">{tokens.spaces.map(px=><div className="ds-space-row" key={px}>
      <code>{px}px</code><div className="ds-space-bar" style={{width:'min(100%, '+px+'px)'}}/><span>--ds-space-{px===100?'25':px===160?'40':px/4===Math.floor(px/4)?px/4:px}</span>
    </div>)}</div>
    <div className="ds-radii-grid">{Object.entries(tokens.radii).map(([name,size])=><div key={name}>
      <div style={{borderRadius:size}}/><strong>{name}</strong><code>{size}</code></div>)}</div>
    <p className="ds-caption">Spacing aliases are the library's normalized layer; the published site did not define a universal numeric spacing variable for each value. Do not change approved component geometry to enforce a scale mechanically.</p>
   </section>
   <section className="ds-section" id="foundation-layout">
    <div className="ds-section-bar"><div><h2>Layout</h2><p>Fluid container, gutters, column behavior, breakpoints</p></div></div>
    <div className="ds-layout-metrics">{dimensions.map(([name,value])=><div key={name}><span>{name}</span><code>{value}</code></div>)}</div>
    <div className="ds-grid-visual" aria-label="Twelve-column layout reference">
      {Array.from({length:12},(_,i)=><span key={i}>{String(i+1).padStart(2,'0')}</span>)}
    </div>
    <p className="ds-caption">12 columns here are a visual alignment reference, not a fixed production contract. The published page uses section-specific grids (2, 3, 4 and 6 columns); the system rule is fluid containers + intentional collapse.</p>
    <div className="ds-breakpoint-list">{tokens.breakpoints.map(b=><div key={b.label}>
      <strong>{b.label}</strong><code>{b.max===null?b.min+'px+':b.min+'–'+b.max+'px'}</code><span>{b.notes}</span></div>)}</div>
   </section>
   <section className="ds-section" id="foundation-motion">
    <div className="ds-section-bar"><div><h2>Motion</h2><p>Functional, interruptible, reduced-motion aware</p></div></div>
    <div className="ds-motion-grid">{Object.entries(tokens.motions).map(([key,value])=><div key={key}>
      <span>{key}</span><code>{value}</code><div className="ds-motion-rule" /></div>)}</div>
    <p className="ds-caption">Hover changes paint, not geometry. Stateful disclosure uses Web Animations API; narrative product sequences remain isolated GSAP scenes. No autoplay for controls requiring user intent. Reduce-motion mode disables nonessential movement.</p>
   </section>
 </div>;
}
