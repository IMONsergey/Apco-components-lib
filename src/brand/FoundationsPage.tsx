import { useEffect } from 'react';
import { Logo } from '../components/ui/Logo';
import { Icon } from '../components/ui/Icon';
import tokens from '../tokens/apcosys.tokens.json';
import ColorWorkbench from './ColorWorkbench';

type Theme = 'light' | 'dark';
const base=import.meta.env.BASE_URL;
const typeSamples=[
  {title:'Display',spec:'72–106 · 500',cls:'ds-type-display',text:'Internet, understood.'},
  {title:'Heading',spec:'48–86 · 500',cls:'ds-type-heading',text:'One query. Full context.'},
  {title:'Body',spec:'18 / 16 mobile',cls:'ds-type-body',text:'Explore every host, network and service.'},
  {title:'Interface',spec:'14 · 500',cls:'ds-type-control',text:'Get started'},
  {title:'Data',spec:'13 · Mono',cls:'ds-type-mono',text:'93.184.216.34 · 200 OK'},
];
const spaces=tokens.spaces;
const metrics=[
  {name:'Content width',value:tokens.layout.maxWidth,usage:'Maximum width'},
  {name:'Desktop gutter',value:tokens.layout.baseGutter,usage:'Standard screens'},
  {name:'Large-screen gutter',value:tokens.layout.desktopWideGutter,usage:'1600px and wider'},
  {name:'Mobile gutter',value:tokens.layout.mobileGutter,usage:'Phones and compact screens'},
  {name:'Header height',value:tokens.layout.header,usage:'Responsive height'},
  {name:'Section spacing',value:tokens.layout.sectionSpace,usage:'Vertical rhythm'},
];
const anchors=[['Identity','ds-identity'],['Colors','ds-colors'],['Type','ds-type'],['Spacing','ds-spacing'],['Layout','ds-layout'],['Motion','ds-motion']] as const;
const pxVar=(px:number)=>'--ds-space-'+px/4;
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
      <div className="ds-reference-block ds-identity-details" id="ds-symbols">
        <h3>Symbols & logo usage</h3>
        <div className="ds-identity-extra">
          <div><span>Responsive website mark</span><Logo/></div>
          <a href={base+'assets/brand/symbol-light.svg'} target="_blank" rel="noreferrer"><img src={base+'assets/brand/symbol-light.svg'} alt="Light symbol"/>Light symbol <Icon name="external"/></a>
          <a href={base+'assets/brand/symbol-dark.svg'} target="_blank" rel="noreferrer"><img src={base+'assets/brand/symbol-dark.svg'} alt="Dark symbol"/>Dark symbol <Icon name="external"/></a>
        </div>
        <p className="ds-caption">Use the supplied SVG geometry without distortion. Select the appropriate variant for the background.</p>
      </div>
    </section>}

    {(!jumpTo||jumpTo==='colors')&&<section className="ds-section" id="ds-colors">
      <ColorWorkbench tone={tone} focused={jumpTo==='colors'}/>
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
      <div className="ds-spacing-grid" id="ds-spacing-values">{spaces.map(n=><div className="ds-space-row" key={n}>
        <code>{n}px</code><span className="ds-space-bar" style={{width:n}}/><code>{pxVar(n)}</code>
      </div>)}</div>
      <div className="ds-reference-block" id="ds-radii">
        <h3>Border radii</h3>
        <div className="ds-radii-grid">{Object.entries(tokens.radii).map(([name,size])=><div key={name}>
          <div style={{borderRadius:size}}/><strong>{name}</strong><code>{size}</code>
        </div>)}</div>
      </div>
    </section>}

    {(!jumpTo||jumpTo==='layout')&&<section className="ds-section" id="ds-layout">
      <div className="ds-section-bar">{heading('Layout','layout')}</div>
      <div className="ds-layout-metrics" id="ds-layout-values">{metrics.map(item=><div key={item.name}>
        <span>{item.name}</span><code>{item.value}</code><small>{item.usage}</small>
       </div>)}</div>
      <div className="ds-reference-block" id="ds-breakpoints">
        <h3>Responsive breakpoints</h3>
        <div className="ds-breakpoint-list">{tokens.breakpoints.map(b=><div key={b.label}>
          <strong>{b.label}</strong><code>{b.max===null?b.min+'px+':b.min+'–'+b.max+'px'}</code><span>{b.notes}</span>
        </div>)}</div>
      </div>
    </section>}

    {(!jumpTo||jumpTo==='motion')&&<section className="ds-section" id="ds-motion">
      <div className="ds-section-bar">{heading('Animations','motion')}</div>
      <div className="ds-motion-simple">{Object.entries(tokens.motions).map(([name,value])=><div key={name}>
        <span>{name}</span><code>{value}</code>
      </div>)}</div>
    </section>}
  </div>;
}
