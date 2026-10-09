import { useEffect, useRef, useState, type CSSProperties } from 'react';
import FoundationHeader from './FoundationHeader';
import tokens from '../tokens/apcosys.tokens.json';
import { useDesignDraft, useFoundationMode, draftCount, scalarSpecs, type ScalarKind, type TypeRole } from './draft-store';

const samples: Record<TypeRole, { cls:string; text:string; spec:string }> = {
 'Display': {cls:'ds-type-display', text:'Internet, understood.', spec:'72–106 · 500'},
 'Heading': {cls:'ds-type-heading', text:'One query. Full context.', spec:'48–86 · 500'},
 'Section body': {cls:'ds-type-body', text:'Explore every host, network and service.', spec:'18 / 16 mobile'},
 'Controls': {cls:'ds-type-control', text:'Get started', spec:'14 · 500'},
 'Eyebrow': {cls:'ds-type-mono', text:'93.184.216.34 · 200 OK', spec:'13 · Mono'},
};
const typeNames=Object.keys(samples) as TypeRole[];
const radii=Object.keys(tokens.radii) as (keyof typeof tokens.radii)[];
const spacingVar=(n:number)=>'--ds-space-'+n/4;
const originalValue=(kind:ScalarKind,id:string)=>scalarSpecs[kind][id]!.original;

export function ScalarInput({kind,id,name,min,max,step,unit}:{
 kind:ScalarKind;id:string;name:string;min:number;max:number;step:number;unit:string;
}){
 const {draft,setScalar}=useDesignDraft();
 const value=(draft[kind] as Record<string,number>)[id] ?? originalValue(kind,id);
 const [raw,setRaw]=useState(String(value));
 useEffect(()=>setRaw(String(value)),[value]);
 const cancelled=useRef(false);
 const parsed=Number(raw);
 const valid=raw.trim()!=='' && Number.isFinite(parsed) && parsed>=min && parsed<=max &&
  Math.abs(parsed/step-Math.round(parsed/step))<0.00001;
 const commit=()=>{if(cancelled.current){cancelled.current=false;setRaw(String(value));return;}if(valid)setScalar(kind,id,parsed);else setRaw(String(value));};
 return <label className="ds-scalar-control">
  <span className="ds-sr-only">{name}</span>
  <input type="number" inputMode="numeric" aria-label={name} aria-invalid={!valid}
   value={raw} min={min} max={max} step={step}
   title={min+'–'+max+' '+unit+'; step '+step+'. Enter to apply, Escape to cancel.'} onFocus={e=>{cancelled.current=false;e.currentTarget.select();}} onChange={e=>setRaw(e.target.value)} onBlur={commit} onKeyDown={e=>{
    if(e.key==='Enter')e.currentTarget.blur();
    if(e.key==='Escape'){e.preventDefault();e.stopPropagation();cancelled.current=true;setRaw(String(value));e.currentTarget.blur();}
   }}/>
  <span aria-hidden="true">{unit}</span>
 </label>;
}

export function TypographyReference({focused}:{focused:boolean}){
 const {draft,reset}=useDesignDraft();
 const [editing,setEditing]=useFoundationMode('typography');
 return <>
  <FoundationHeader title="Typography" focused={focused} editing={editing} onEditing={setEditing}/>
  <p className="ds-muted-note ds-section-subtitle">Instrument Sans · IBM Plex Mono. Samples fit the available width.</p>
  {editing&&<p className="ds-edit-description">Adjust the sample size. Source font rules stay unchanged.</p>}
  <div className="ds-type-list">
   {typeNames.map(id=>{
    const spec=samples[id], percent=draft.typography[id]??100;
    return <div className="ds-type-row ds-edit-type-row" key={id} data-editing={editing} data-changed={percent!==100}
      style={{'--ds-preview-scale':percent/100} as CSSProperties}>
     <div>
      <span className="ds-label">{id==='Eyebrow'?'Data / Eyebrow':id==='Section body'?'Body':id}</span>
      <code>{spec.spec}</code>{editing && <small className="ds-value-origin" data-changed={percent!==100}>Approved scale 100%</small>}
      {editing&&<ScalarInput kind="typography" id={id} name={id+' size scale'} min={70} max={130} step={5} unit="%"/>}
     </div>
     <div className={spec.cls}>{spec.text}</div>
    </div>;
   })}
  </div>
  {draftCount(draft,'typography')>0&&<div className="ds-foundation-footer"><button type="button" className="ds-edit-reset" onClick={()=>reset('typography')}>Reset type</button></div>}
 </>;
}

export function SpacingReference({focused}:{focused:boolean}){
 const [editing,setEditing]=useFoundationMode('spacing');
 const {draft,reset}=useDesignDraft();
 return <>
  <FoundationHeader title="Spacing" focused={focused} editing={editing} onEditing={setEditing}/>
  {editing&&<p className="ds-edit-description">Spacing uses a 4px grid. Enter applies; Escape cancels.</p>}
  <div className="ds-spacing-grid ds-edit-spacing-grid" data-editing={editing} id="ds-spacing-values">
   {tokens.spaces.map(n=>{
    const px=editing?(draft.spacing[String(n)]??n):n;
    return <div className="ds-space-row ds-edit-space-row" key={n} title={'Approved '+n+'px'} data-changed={Boolean(draft.spacing[String(n)])}>
     {editing?<ScalarInput kind="spacing" id={String(n)} name={'Spacing token '+n+' value'} min={4} max={240} step={4} unit="px"/>:<code>{n}px</code>}
     <span className="ds-space-bar" style={{width:Math.min(px,240)}}/>
     <code>{spacingVar(n)}{editing&&<small className="ds-value-origin" data-changed={px!==n}>Approved {n}px</small>}</code>
    </div>;
   })}
  </div>
  <div className="ds-reference-block" id="ds-radii">
   <div className="ds-section-bar ds-edit-inner-heading">
    <h3>Border radii</h3>
   </div>
   <div className="ds-radii-grid ds-edit-radii-grid">
    {radii.map(id=>{
     const px=editing?(draft.radii[id]??parseInt(tokens.radii[id],10)):parseInt(tokens.radii[id],10);
     return <div key={id} data-changed={editing&&draft.radii[id]!==undefined}>
      <div style={{borderRadius:px+'px'}}/><strong>{id.replace(/([A-Z])/g,' $1').replace(/^./, c=>c.toUpperCase())}</strong>
      {editing?<ScalarInput kind="radii" id={id} name={id+' radius'} min={0} max={32} step={1} unit="px"/>:<code>{tokens.radii[id]}</code>}
     </div>;
    })}
   </div>
  </div>
  {draftCount(draft,'spacing')+draftCount(draft,'radii')>0&&<div className="ds-foundation-footer"><button type="button" className="ds-edit-reset" onClick={()=>reset(['spacing','radii'])}>Reset spacing & radii</button></div>}
 </>;
}

export function LayoutReference({focused}:{focused:boolean}){
 const {draft,reset}=useDesignDraft();
 const [editing,setEditing]=useFoundationMode('layout');
 const metrics=[
  {name:'Content width',value:tokens.layout.maxWidth,usage:'Maximum width'},
  {name:'Desktop gutter',value:tokens.layout.baseGutter,usage:'Standard screens'},
  {name:'Large-screen gutter',value:tokens.layout.desktopWideGutter,usage:'1600px and wider'},
  {name:'Mobile gutter',value:tokens.layout.mobileGutter,usage:'Phones and compact screens'},
  {name:'Header height',value:tokens.layout.header,usage:'Responsive height'},
  {name:'Section spacing',value:tokens.layout.sectionSpace,usage:'Vertical rhythm'},
 ];
 return <>
  <FoundationHeader title="Layout" focused={focused} editing={editing} onEditing={setEditing}/>
  {editing&&<p className="ds-edit-description">Try a maximum width. Responsive gutters and breakpoints stay fixed.</p>}
  <div className="ds-layout-metrics" id="ds-layout-values">
   {metrics.map((item,index)=><div key={item.name}>
    <span>{item.name}</span>
    {index===0&&editing?<ScalarInput kind="layout" id="maxWidth" name="Maximum content width" min={960} max={2400} step={8} unit="px"/>:
     <code>{item.value}</code>}
    <small>{item.usage}</small>
   </div>)}
  </div>
  {editing&&<div className="ds-max-width-preview" aria-label="Maximum content width preview">
   <span>Relative width on a 2400px canvas</span>
   <div><i style={{width:((draft.layout.maxWidth??1760)/2400*100)+'%'}}/></div>
   <code>{draft.layout.maxWidth??1760}px</code>
  </div>}
  <div className="ds-reference-block" id="ds-breakpoints">
   <h3>Responsive breakpoints</h3>
   <div className="ds-breakpoint-list">{tokens.breakpoints.map(b=><div key={b.label}>
    <strong>{b.label}</strong><code>{b.max===null?b.min+'px+':b.min+'–'+b.max+'px'}</code><span>{b.notes}</span>
   </div>)}</div>
  </div>
  {draftCount(draft,'layout')>0&&<div className="ds-foundation-footer"><button type="button" className="ds-edit-reset" onClick={()=>reset('layout')}>Reset layout</button></div>}
 </>;
}

export function MotionReference({focused}:{focused:boolean}){
 const [editing,setEditing]=useFoundationMode('motion');
 const [toggle,setToggle]=useState(false);
 const {draft,reset}=useDesignDraft();
 return <>
  <FoundationHeader title="Animations" focused={focused} editing={editing} onEditing={setEditing}/>
  {editing&&<p className="ds-edit-description">Try disclosure and theme timings below. Reduced-motion preferences are respected.</p>}
  <div className="ds-motion-simple ds-edit-motion-list">
   {Object.entries(tokens.motions).map(([name,value])=><div key={name}>
    <span>{name}</span>
    {editing&&(name==='disclosure'||name==='theme')?
      <ScalarInput kind="motion" id={name} name={name+' duration'} min={80} max={800} step={20} unit="ms"/>:<code>{value}</code>}
   </div>)}
  </div>
  {editing&&<div className="ds-motion-live">
   <button type="button" aria-pressed={toggle} onClick={()=>setToggle(v=>!v)}>Toggle motion preview</button>
   <div className="ds-motion-preview-grid">
    <div><div className="ds-motion-track"><span data-active={toggle} style={{transitionDuration:(draft.motion.disclosure??280)+'ms'}}/></div><code>{draft.motion.disclosure??280}ms · disclosure</code></div>
    <div><div className="ds-motion-tone" data-active={toggle} style={{transitionDuration:(draft.motion.theme??220)+'ms'}}/><code>{draft.motion.theme??220}ms · theme</code></div>
   </div>
  </div>}
  {draftCount(draft,'motion')>0&&<div className="ds-foundation-footer"><button type="button" className="ds-edit-reset" onClick={()=>reset('motion')}>Reset motion</button></div>}
 </>;
}
