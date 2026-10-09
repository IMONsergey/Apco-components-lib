import { useEffect, useId, useRef, useState, type ButtonHTMLAttributes } from 'react';
import { Icon, type IconName } from '../ui/Icon';
import { DoubleButton } from '../ui/DoubleButton';
import { LanguageBadge } from './LanguageBadge';
import { AnimatedPrice } from '../ui/AnimatedPrice';
import { plans } from '../../content/site-plans';
import { calculatePrice, formatPrice, type BillingPeriod } from '../../content/pricing';

/** Exact published class and surface tokens. No app-specific navigation required. */
export function PlainButton({ children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>){
 return <button {...props} type={props.type??'button'} className={['plain-button', props.className].filter(Boolean).join(' ')}>{children}</button>;
}
export function IconAction({name='search',label,disabled=false}:{name?:IconName;label:string;disabled?:boolean}){
 return <button type="button" className="icon-button" aria-label={label} disabled={disabled}><Icon name={name}/></button>;
}
/** Standalone search chrome. Caller supplies the actual query behavior. */
export function SearchField({onSearch,placeholder='Search by IP, domain, host or CVE'}:{
 onSearch?:(value:string)=>void;placeholder?:string;
}){
 const [value,setValue]=useState('');
 return <form className="search-form" role="search" onSubmit={e=>{e.preventDefault();onSearch?.(value)}}>
  <input type="search" aria-label="Search" value={value} placeholder={placeholder} onChange={e=>setValue(e.target.value)}/>
  <button className="search-submit" type="submit" aria-label="Search"><Icon name="search"/></button>
 </form>;
}
export function NavDisclosure({label='Platform'}:{label?:string}){
 const [open,setOpen]=useState(false);
 const ref=useRef<HTMLDivElement>(null),id=useId();
 const links=['Search & Investigation','Monitoring','Data & Methodology'];
 useEffect(()=>{
  if(!open)return;
  function down(e:PointerEvent){if(e.target instanceof Node&&!ref.current?.contains(e.target))setOpen(false)}
  function key(e:globalThis.KeyboardEvent){if(e.key==='Escape'){setOpen(false);ref.current?.querySelector<HTMLButtonElement>('button.nav-trigger')?.focus()}}
  document.addEventListener('pointerdown',down);document.addEventListener('keydown',key);
  return ()=>{document.removeEventListener('pointerdown',down);document.removeEventListener('keydown',key)};
 },[open]);
 return <div className="ds-nav-disclosure nav-group" ref={ref}
  onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget))setOpen(false)}}
  onKeyDown={e=>{
   if(!['ArrowDown','ArrowUp','Home','End'].includes(e.key))return;
   e.preventDefault();
   setOpen(true);
   const anchors=Array.from(e.currentTarget.querySelectorAll<HTMLAnchorElement>('.nav-panel a'));
   const at=anchors.findIndex(x=>x===document.activeElement);
   const next=e.key==='Home'?0:e.key==='End'?anchors.length-1:at<0?0:(at+(e.key==='ArrowUp'?-1:1)+anchors.length)%anchors.length;
   requestAnimationFrame(()=>anchors[next]?.focus());
  }}>
  <button className="nav-trigger" type="button" aria-controls={id} aria-expanded={open}
   onClick={()=>setOpen(v=>!v)}>{label}<Icon name="chevron"/></button>
  <div id={id} className="nav-panel" data-open={open} aria-hidden={!open} inert={!open}>
   {links.map((x,i)=><a key={x} className={i===0?'nav-panel__default':undefined}
     href="#navigation-demo" onClick={e=>{e.preventDefault();setOpen(false)}}>{x}</a>)}
  </div>
 </div>;
}
/** The exact published LanguageBadge is reused; this wrapper owns only local state. */
export function LanguageButton(){
 const [open,setOpen]=useState(false);
 const ref=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  if(!open)return;
  const close=(e:PointerEvent)=>{if(e.target instanceof Node&&!ref.current?.contains(e.target))setOpen(false)};
  document.addEventListener('pointerdown',close);
  return ()=>document.removeEventListener('pointerdown',close);
 },[open]);
 return <div ref={ref} className="ds-language-preview">
  <LanguageBadge open={open} onOpenChange={setOpen}/>
 </div>;
}
export function UseCaseTags({items=['Asset discovery','Exposure','Risk intelligence']}:{items?:string[]}){
 return <ul className="use-case-tags">{items.map(x=><li key={x}>{x}</li>)}</ul>;
}
/** Pricing markup and data follow src/components/sections/PricingSection.tsx. */
export function PlanCard({id='plus',period='monthly'}:{
 id?:typeof plans[number]['id'];period?:BillingPeriod;
}){
 const plan=plans.find(p=>p.id===id)??plans[1];
 const price=calculatePrice(plan.price,period);
 return <article className={`plan-card${plan.id==='plus'?' plan-card--featured':''}`}>
   <div><h3>{plan.name}</h3><p className="plan-description">{plan.description}</p></div>
   <div className="plan-price-block">
    <p className="plan-price"><AnimatedPrice amount={price.monthly}/>{plan.price>0&&<span className="price-unit">/mo</span>}</p>
    <p className="plan-billing-note">{plan.price>0?(period==='annually'?formatPrice(price.total)+' billed annually':'Billed monthly'):'\u00a0'}</p>
   </div>
   <dl>
    <div><dt>Credits</dt><dd>{plan.credits.replace(/ /g,'\u00a0')}</dd></div>
    <div><dt>Users</dt><dd>{plan.users}</dd></div>
   </dl>
   <button type="button" className="plan-button">{plan.action}</button>
 </article>;
}
export function ModalExample(){
 const ref=useRef<HTMLDialogElement>(null);
 return <div className="ds-modal-example">
  <DoubleButton onClick={()=>ref.current?.showModal()} variant="primary">Open modal</DoubleButton>
  <dialog className="modal ds-site-modal" ref={ref} onClick={e=>{if(e.target===e.currentTarget)ref.current?.close()}}>
   <div className="modal__header"><h2>APCOSYS workspace</h2><button className="icon-button" type="button" aria-label="Close" onClick={()=>ref.current?.close()}><Icon name="close"/></button></div>
   <p>Inspect your infrastructure in a unified workspace.</p>
   <DoubleButton onClick={()=>ref.current?.close()}>Continue</DoubleButton>
  </dialog>
 </div>;
}
