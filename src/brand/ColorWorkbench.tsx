import { useEffect, useRef, useState } from 'react';
import { useDesignDraft, useFoundationMode, draftCount, type ColorRole, type Theme } from './draft-store';
import { useClipboard } from '../hooks/useClipboard';
import FoundationHeader from './FoundationHeader';
import ManualCopy from './ManualCopy';
import { Icon } from '../components/ui/Icon';
import tokens from '../tokens/apcosys.tokens.json';

const groups: {name:string;keys:ColorRole[]}[]=[
 {name:'Surfaces',keys:['page','card','elevated','strong','tint']},
 {name:'Typography',keys:['primary','body','muted','visualInk']},
 {name:'Brand & actions',keys:['mark','accent','action','actionHover','onAction','api']},
 {name:'Borders',keys:['subtle','strongBorder']},
];
const labels:Record<ColorRole,string>={page:'Page background',card:'Cards & panels',elevated:'Raised surfaces',strong:'Emphasis',tint:'Accent background',primary:'Headings',body:'Body text',muted:'Secondary text',visualInk:'Illustration lines',mark:'Logo accent',accent:'Links',action:'Primary action',actionHover:'Action hover',onAction:'Text on buttons',api:'API visuals',subtle:'Dividers',strongBorder:'Strong borders'};

export function normalizeHex(raw:string):string|null {
 const match=raw.trim().match(/^#?([\da-f]{3}|[\da-f]{6})$/i);
 if(!match)return null;
 const value=match[1]!;
 return '#'+(value.length===3?value.split('').map(c=>c+c).join(''):value).toUpperCase();
}
function contrast(a:string,b:string) {
 const luminance=(s:string)=>{
  const rgb=(s.match(/[\da-f]{2}/gi)||[]).map(part=>{
   const n=parseInt(part,16)/255;return n<=.04045?n/12.92:((n+.055)/1.055)**2.4;
  });
  return .2126*(rgb[0]||0)+.7152*(rgb[1]||0)+.0722*(rgb[2]||0);
 };
 const x=luminance(a),y=luminance(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05);
}
function HexEditor({value,label,onCommit}:{value:string;label:string;onCommit:(value:string)=>void}) {
 const [raw,setRaw]=useState(value.toUpperCase());
 const cancelled=useRef(false);
 useEffect(()=>setRaw(value.toUpperCase()),[value]);
 const commit=()=>{
  if(cancelled.current){cancelled.current=false;setRaw(value.toUpperCase());return;}
  const normalized=normalizeHex(raw);setRaw(normalized||value.toUpperCase());if(normalized)onCommit(normalized);
 };
 return <input className="ds-token-hex-input" type="text" spellCheck={false} autoComplete="off" maxLength={24}
  aria-label={'HEX for '+label} aria-invalid={normalizeHex(raw)===null} title="HEX with or without #. Enter applies; Escape cancels."
  value={raw} onFocus={event=>{cancelled.current=false;event.currentTarget.select();}} onChange={event=>setRaw(event.target.value)} onBlur={commit}
  onKeyDown={event=>{
   if(event.nativeEvent.isComposing)return;
   if(event.key==='Enter'){event.preventDefault();event.currentTarget.blur();}
   if(event.key==='Escape'){event.preventDefault();event.stopPropagation();cancelled.current=true;setRaw(value.toUpperCase());event.currentTarget.blur();}
  }}/>;
}
export default function ColorWorkbench({tone,focused=false}:{tone:Theme;focused?:boolean}) {
 const {draft,setColor,reset}=useDesignDraft();
 const [editing,setEditing]=useFoundationMode('colors');
 const [copyFormat,setCopyFormat]=useState<'css'|'hex'>('hex');
 const [selected,setSelected]=useState<ColorRole|null>(null);
 const clipboard=useClipboard(tone+':'+editing+':'+copyFormat+':'+JSON.stringify(draft.colors));
 const changed=draftCount(draft,'colors');
 const value=(role:ColorRole)=>editing?(draft.colors[tone]?.[role]||tokens.colors[role][tone]):tokens.colors[role][tone];
 const copy=(role:ColorRole,text:string)=>{setSelected(role);void clipboard.copy(text,role);};
 return <>
  <FoundationHeader title="Colors" focused={focused} editing={editing} onEditing={setEditing} tone={tone}/>
  <p className="ds-workbench__explanation">{editing?'Edit a local draft. Approved colors remain unchanged.':'Click a color to copy its value.'}</p>
  {editing&&<div className="ds-workbench" id="ds-palette-preview">
   <div className="ds-workbench__preview" aria-label="Draft preview" style={{background:value('page')}}>
    <div className="ds-workbench__demo" style={{background:value('card'),color:value('primary'),borderColor:value('subtle')}}>
     <div className="ds-workbench__demo-copy"><span className="ds-workbench__preview-caption" style={{color:value('muted')}}>Preview</span><strong>Explore your data</strong><p style={{color:value('body')}}>One query. Full context.</p></div>
     <span className="ds-workbench__demo-cta" style={{background:value('action'),color:value('onAction')}}>Start search <Icon name="arrow"/></span>
    </div>
   </div>
  </div>}
  {!editing&&<div className="ds-color-actions ds-workbench__copy-settings">
   <div className="ds-copy-format" role="group" aria-label="Copy color format">
    {(['css','hex'] as const).map(mode=><button key={mode} type="button" aria-pressed={copyFormat===mode} onClick={()=>setCopyFormat(mode)}>{mode==='css'?'CSS variable':'HEX'}</button>)}
   </div>
  </div>}
  {groups.map(group=><div key={group.name} className="ds-token-group" id={'ds-color-'+group.name.toLowerCase().replace(/[^a-z]+/g,'-')}>
   <h3>{group.name}</h3><div className="ds-token-list">
    {group.keys.map(role=>{
     const entry=tokens.colors[role],hex=value(role).toUpperCase(),changedHere=editing&&!!draft.colors[tone]?.[role];
     const label=<span className="ds-token-label"><strong className="ds-token-name">{labels[role]}</strong><code>{entry.css}</code>{editing&&<small className="ds-value-origin" data-changed={changedHere}>Approved {entry[tone].toUpperCase()}</small>}</span>;
     return <div className="ds-token-cell" key={role}>
      {editing?<div className="ds-token-row ds-token-editor" data-token={role} data-changed={changedHere}>
       <label className="ds-token-swatch-picker" title={'Pick color for '+labels[role]}><span className="ds-token-swatch" style={{backgroundColor:hex}}/><input type="color" aria-label={'Pick color for '+labels[role]} value={hex} onChange={event=>setColor(tone,role,event.target.value)}/></label>
       {label}<HexEditor key={tone+role} value={hex} label={labels[role]} onCommit={next=>setColor(tone,role,next)}/>
       <button className="ds-token-copy-button" type="button" aria-label={'Copy HEX for '+labels[role]} data-copied={clipboard.copiedId===role} onClick={()=>copy(role,hex)}><Icon name="copy"/></button>
      </div>:<button className="ds-token-row" type="button" title={entry.usage+' · Copy '+(copyFormat==='css'?'CSS variable':'HEX')} onClick={()=>copy(role,copyFormat==='css'?'var('+entry.css+')':hex)}>
       <span className="ds-token-swatch" style={{backgroundColor:hex}}/>{label}<span className="ds-token-hex">{hex}</span><span className="ds-token-copy">{clipboard.copiedId===role?'Copied':<Icon name="copy"/>}</span>
      </button>}
      {clipboard.manualValue!==null&&selected===role&&<ManualCopy value={clipboard.manualValue} label="Copy color token manually" onClose={clipboard.clear}/>}
     </div>;
    })}
   </div>
  </div>)}
  <span className="ds-sr-only" role="status">{clipboard.copiedId?'Color copied':''}</span>
  <div className="ds-foundation-footer">
   <a className="ds-token-download" href={import.meta.env.BASE_URL+'tokens/apcosys.tokens.json'} download="apcosys.tokens.json">Download design tokens (approved) <Icon name="down"/></a>
   {changed>0&&<button type="button" className="ds-edit-reset" onClick={()=>reset('colors')}>Reset colors</button>}
  </div>
  <div className="ds-reference-block" id="ds-contrast"><h3>Contrast</h3><p className="ds-caption">{editing?'Draft':'Approved'} pairs · 4.5:1 for normal text. These samples do not assess the entire interface.</p>
   <div className="ds-contrast-pair">{([['Text / Card','primary','card'],['Text / Action','onAction','action']] as const).map(([name,fg,bg])=>{
    const ratio=contrast(value(fg),value(bg));return <div className="ds-contrast-check" key={name}><div className="ds-contrast-sample" style={{background:value(bg),color:value(fg)}}><span>{name}</span><strong>Aa</strong></div><small>{ratio.toFixed(1)}:1 · {ratio>=4.5?'AA':'Low contrast'}</small></div>;
   })}</div>
  </div>
 </>;
}
