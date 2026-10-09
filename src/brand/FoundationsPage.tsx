import { useEffect, useState } from 'react';
import { Logo } from '../components/ui/Logo';
import { Icon } from '../components/ui/Icon';
import tokens from '../tokens/apcosys.tokens.json';

type Theme = 'light' | 'dark';
const base=import.meta.env.BASE_URL;
const groups=[
  {name:'Surfaces',keys:['page','card','elevated','strong','tint']},
  {name:'Typography',keys:['primary','body','muted','visualInk']},
  {name:'Brand & actions',keys:['mark','accent','action','actionHover','onAction','api']},
  {name:'Borders',keys:['subtle','strongBorder']},
] as const;
const typeSamples=[
  {title:'Display',spec:'72–106 · 500',cls:'ds-type-display',text:'Internet, understood.'},
  {title:'Heading',spec:'48–86 · 500',cls:'ds-type-heading',text:'One query. Full context.'},
  {title:'Body',spec:'18 / 16 mobile',cls:'ds-type-body',text:'Explore every host, network and service.'},
  {title:'Interface',spec:'14 · 500',cls:'ds-type-control',text:'Get started'},
  {title:'Data',spec:'13 · Mono',cls:'ds-type-mono',text:'93.184.216.34 · 200 OK'},
];
const colorLabels:Record<string,string>={"page":"Page background","card":"Cards & panels","elevated":"Raised surfaces","strong":"Emphasis","tint":"Accent background","primary":"Headings","body":"Body text","muted":"Secondary text","visualInk":"Illustration lines","mark":"Logo accent","accent":"Links","action":"Primary action","actionHover":"Action hover","onAction":"Text on buttons","api":"API visuals","subtle":"Dividers","strongBorder":"Strong borders"};
const spaces=tokens.spaces;
const metrics=[
  ['Container',tokens.layout.maxWidth],
  ['Gutter',tokens.layout.baseGutter],
  ['Header',tokens.layout.header],
  ['Section gap',tokens.layout.sectionSpace],
];
const anchors=[['Identity','ds-identity'],['Colors','ds-colors'],['Type','ds-type'],['Spacing','ds-spacing'],['Layout','ds-layout'],['Motion','ds-motion']] as const;
const pxVar=(px:number)=>'--ds-space-'+px/4;
const luminance=(hex:string)=>{
  const values=(hex.match(/[a-f0-9]{2}/gi)||[]).map(part=>{const n=parseInt(part,16)/255;return n<=.04045?n/12.92:((n+.055)/1.055)**2.4;});
  return .2126*(values[0]||0)+.7152*(values[1]||0)+.0722*(values[2]||0);
};
const ratio=(a:string,b:string)=>((Math.max(luminance(a),luminance(b))+.05)/(Math.min(luminance(a),luminance(b))+.05)).toFixed(1);

export default function FoundationsPage({tone,jumpTo}:{tone:Theme;jumpTo?:string}){
  useEffect(()=>{
   if(!jumpTo)return;
   const key:Record<string,string>={
    identity:'ds-identity',colors:'ds-colors',typography:'ds-type',spacing:'ds-spacing',
    layout:'ds-layout',motion:'ds-motion'
   };
   const id=key[jumpTo];
   if(id)requestAnimationFrame(()=>document.getElementById(id)?.scrollIntoView({block:'start',behavior:'instant'}));
  },[jumpTo]);
  const heading=(title:string,slug:string)=>jumpTo===slug?<h1 className="ds-focused-title">{title}</h1>:<h2>{title}</h2>;
  const [copied,setCopied]=useState<string|null>(null);
  const [copyFormat,setCopyFormat]=useState<'css'|'hex'>('hex');
  const copy=async(value:string,key:string)=>{
    try{await navigator.clipboard.writeText(value);setCopied(key);}catch{setCopied(null);}
  };
  return <div className="ds-foundations ds-foundations--compact" data-focus={jumpTo||undefined}>
    <nav className="ds-local-nav" aria-label="Foundation sections">
      {anchors.map(([label,id])=><button type="button" key={id} onClick={()=>document.getElementById(id)?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'})}>{label}</button>)}
    </nav>

    {(!jumpTo||jumpTo==='identity')&&<section className="ds-section" id="ds-identity">
      <div className="ds-section-bar">{heading('Logo','identity')}</div>
      <div className="ds-brand-grid">
        <a className="ds-brand-sample ds-brand-sample--light" href={base+'assets/brand/wordmark-light.svg'} target="_blank" rel="noreferrer" title="Open light logo SVG">
          <img src={base+'assets/brand/wordmark-light.svg'} alt="APCOSYS light wordmark"/><span>Light SVG <Icon name="external"/></span>
        </a>
        <a className="ds-brand-sample ds-brand-sample--dark" href={base+'assets/brand/wordmark-dark.svg'} target="_blank" rel="noreferrer" title="Open dark logo SVG">
          <img src={base+'assets/brand/wordmark-dark.svg'} alt="APCOSYS dark wordmark"/><span>Dark SVG <Icon name="external"/></span>
        </a>
      </div>
      <details className="ds-native-details ds-identity-details">
        <summary>Symbols and logo usage <span>+</span></summary>
        <div className="ds-identity-extra">
          <div><span>Responsive website mark</span><Logo/></div>
          <a href={base+'assets/brand/symbol-light.svg'} target="_blank" rel="noreferrer"><img src={base+'assets/brand/symbol-light.svg'} alt="Light symbol"/>Light symbol <Icon name="external"/></a>
          <a href={base+'assets/brand/symbol-dark.svg'} target="_blank" rel="noreferrer"><img src={base+'assets/brand/symbol-dark.svg'} alt="Dark symbol"/>Dark symbol <Icon name="external"/></a>
        </div>
        <p className="ds-caption">Use the supplied SVG geometry without distortion. Select the appropriate variant for the background.</p>
      </details>
    </section>}

    {(!jumpTo||jumpTo==='colors')&&<section className="ds-section" id="ds-colors">
      <div className="ds-section-bar">{heading('Colors','colors')}<div className="ds-color-actions">
        <span className="ds-muted-note">{tone==='dark'?'Dark':'Light'} theme · click to copy</span>
        <div className="ds-copy-format" role="group" aria-label="Copy color format">
          {(['css','hex'] as const).map(mode=><button key={mode} type="button" aria-pressed={copyFormat===mode} onClick={()=>setCopyFormat(mode)}>{mode==='css'?'CSS variable':'HEX'}</button>)}
        </div>
      </div></div>
      {groups.map(group=><div key={group.name} className="ds-token-group" id={'ds-color-'+group.name.toLowerCase().replace(/[^a-z]+/g,'-')}>
        <h3>{group.name}</h3>
        <div className="ds-token-list">
          {group.keys.map(key=>{
            const entry=tokens.colors[key] as {css:string;light:string;dark:string;usage:string};
            const value=entry[tone];
            const copyValue=copyFormat==='css'?'var('+entry.css+')':value.toUpperCase();
            return <button className="ds-token-row" type="button" key={key} title={entry.usage+' · Click to copy '+(copyFormat==='css'?'CSS variable':'HEX value')}
              onClick={()=>void copy(copyValue,key)}>
              <span className="ds-token-swatch" style={{backgroundColor:value}}/>
              <span className="ds-token-name">{colorLabels[key]||key}</span>
              <code>{entry.css}</code><span className="ds-token-hex">{value.toUpperCase()}</span>
              <span className="ds-token-copy">{copied===key?'Copied':<Icon name="copy"/>}</span>
            </button>;
          })}
        </div>
      </div>)}
      <a className="ds-token-download" href={base+'tokens/apcosys.tokens.json'} download="apcosys.tokens.json">Download design tokens <Icon name="down"/></a>
      <details className="ds-native-details">
        <summary>Contrast reference <span>+</span></summary>
        <div className="ds-contrast-pair">
          <div className="ds-contrast-sample" style={{background:tokens.colors.card[tone],color:tokens.colors.primary[tone]}}>
            <span>Text / Card</span><strong>Aa</strong><small>{ratio(tokens.colors.primary[tone],tokens.colors.card[tone])}:1</small>
          </div>
          <div className="ds-contrast-sample" style={{background:tokens.colors.action[tone],color:tokens.colors.onAction[tone]}}>
            <span>Text / Action</span><strong>Aa</strong><small>{ratio(tokens.colors.onAction[tone],tokens.colors.action[tone])}:1</small>
          </div>
        </div>
      </details>
    </section>}

    {(!jumpTo||jumpTo==='typography')&&<section className="ds-section" id="ds-type">
      <div className="ds-section-bar">{heading('Typography','typography')}</div>
      <p className="ds-muted-note ds-section-subtitle">Instrument Sans · IBM Plex Mono</p>
      <div className="ds-type-list">{typeSamples.map(t=><div className="ds-type-row" key={t.title}>
        <div><span className="ds-label">{t.title}</span><code>{t.spec}</code></div>
        <div className={t.cls}>{t.text}</div>
      </div>)}</div>
    </section>}

    {(!jumpTo||jumpTo==='spacing')&&<section className="ds-section" id="ds-spacing">
      <div className="ds-section-bar">{heading('Spacing','spacing')}<span className="ds-muted-note">4px base</span></div>
      <div className="ds-spacing-grid">{spaces.map(n=><div className="ds-space-row" key={n}>
        <code>{n}px</code><span className="ds-space-bar" style={{width:n}}/><code>{pxVar(n)}</code>
      </div>)}</div>
      <details className="ds-native-details">
        <summary>Border radii <span>+</span></summary>
        <div className="ds-radii-grid">{Object.entries(tokens.radii).map(([name,size])=><div key={name}>
          <div style={{borderRadius:size}}/><strong>{name}</strong><code>{size}</code>
        </div>)}</div>
      </details>
    </section>}

    {(!jumpTo||jumpTo==='layout')&&<section className="ds-section" id="ds-layout">
      <div className="ds-section-bar">{heading('Layout','layout')}</div>
      <div className="ds-layout-metrics">{metrics.map(([name,value])=><div key={name}><span>{name}</span><code>{value}</code></div>)}</div>
      <details className="ds-native-details">
        <summary>Responsive breakpoints <span>+</span></summary>
        <div className="ds-breakpoint-list">{tokens.breakpoints.map(b=><div key={b.label}>
          <strong>{b.label}</strong><code>{b.max===null?b.min+'px+':b.min+'–'+b.max+'px'}</code><span>{b.notes}</span>
        </div>)}</div>
      </details>
    </section>}

    {(!jumpTo||jumpTo==='motion')&&<section className="ds-section" id="ds-motion">
      <div className="ds-section-bar">{heading('Animations','motion')}</div>
      <div className="ds-motion-simple">{Object.entries(tokens.motions).map(([name,value])=><div key={name}>
        <span>{name}</span><code>{value}</code>
      </div>)}</div>
    </section>}
  </div>;
}
