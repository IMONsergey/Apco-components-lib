import { useEffect, useId, useRef, useState, type ButtonHTMLAttributes } from 'react';
import { Icon, type IconName } from '../ui/Icon';
import { DoubleButton } from '../ui/DoubleButton';
import { LanguageBadge, type LanguageCode } from './LanguageBadge';
import { AnimatedPrice } from '../ui/AnimatedPrice';
import { SiteModal } from './SiteModal';
import { plans } from '../../content/site-plans';
import { calculatePrice, formatPrice, type BillingPeriod } from '../../content/pricing';

/** Exact published class and surface tokens. No app-specific navigation required. */
export function PlainButton({ children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>){
 return <button {...props} type={props.type??'button'} className={['plain-button', props.className].filter(Boolean).join(' ')}>{children}</button>;
}
export function IconAction({name='search',label,className,...props}:ButtonHTMLAttributes<HTMLButtonElement>&{name?:IconName;label:string}){
 return <button {...props} type={props.type??'button'} className={['icon-button',className].filter(Boolean).join(' ')} aria-label={label}><Icon name={name}/></button>;
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
export type NavigationLink={label:string;href:string};
const defaultNavigationLinks:readonly NavigationLink[]=[
 {label:'Search & Investigation',href:'#navigation-demo'},
 {label:'Monitoring',href:'#navigation-demo'},
 {label:'Data & Methodology',href:'#navigation-demo'},
];
export function NavDisclosure({label='Platform',items=defaultNavigationLinks}:{label?:string;items?:readonly NavigationLink[]}){
 const [open,setOpen]=useState(false);
 const ref=useRef<HTMLDivElement>(null),id=useId();
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
   if(anchors.length===0)return;
   const next=e.key==='Home'?0:e.key==='End'?anchors.length-1:at<0?0:(at+(e.key==='ArrowUp'?-1:1)+anchors.length)%anchors.length;
   requestAnimationFrame(()=>anchors[next]?.focus());
  }}>
  <button className="nav-trigger" type="button" aria-controls={id} aria-expanded={open}
   onClick={()=>setOpen(v=>!v)}>{label}<Icon name="chevron"/></button>
  <div id={id} className="nav-panel" data-open={open} aria-hidden={!open} inert={!open}>
   {items.map((item,i)=><a key={item.label+item.href} className={i===0?'nav-panel__default':undefined}
     href={item.href} onClick={e=>{if(item.href==='#navigation-demo')e.preventDefault();setOpen(false)}}>{item.label}</a>)}
  </div>
 </div>;
}
/** Demonstrates locale selection; the host app supplies translation catalogs. */
export function LanguageButton(){
 const [open,setOpen]=useState(false);
 const [locale,setLocale]=useState<LanguageCode>('en');
 const ref=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  if(!open)return;
  const close=(e:PointerEvent)=>{if(e.target instanceof Node&&!ref.current?.contains(e.target))setOpen(false)};
  const onKey=(e:globalThis.KeyboardEvent)=>{
    if(e.key!=='Escape')return;
    setOpen(false);
    ref.current?.querySelector<HTMLButtonElement>('.language')?.focus({preventScroll:true});
  };
  document.addEventListener('pointerdown',close);
  document.addEventListener('keydown',onKey);
  return ()=>{document.removeEventListener('pointerdown',close);document.removeEventListener('keydown',onKey)};

 },[open]);
 return <div ref={ref} className="ds-language-preview">
  <LanguageBadge open={open} onOpenChange={setOpen} value={locale} onChange={setLocale}/>
 </div>;
}
export function UseCaseTags({items=['Asset discovery','Exposure','Risk intelligence']}:{items?:string[]}){
 return <ul className="use-case-tags">{items.map(x=><li key={x}>{x}</li>)}</ul>;
}
/** Pricing markup and data follow src/components/sections/PricingSection.tsx. */
export function PlanCard({id='plus',period='monthly',onSelect}:{
 id?:typeof plans[number]['id'];period?:BillingPeriod;onSelect?:(id:typeof plans[number]['id'])=>void;
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
   <button type="button" className="plan-button" onClick={()=>onSelect?.(plan.id)}>{plan.action}</button>
 </article>;
}
/** Native focus-trapping modal with the same source animation and cancel behavior. */
export function ModalExample(){
 const [open,setOpen]=useState(false);
 return <div className="ds-modal-example">
  <DoubleButton onClick={()=>setOpen(true)} variant="primary">Open modal</DoubleButton>
  <SiteModal open={open} onClose={()=>setOpen(false)} title="APCOSYS workspace">
   <p>Inspect your infrastructure in a unified workspace.</p>
   <DoubleButton onClick={()=>setOpen(false)}>Continue</DoubleButton>
  </SiteModal>
 </div>;
}
