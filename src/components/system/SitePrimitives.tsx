import { useEffect, useId, useRef, useState, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Icon, type IconName } from '../ui/Icon';
import { DoubleButton } from '../ui/DoubleButton';

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
export function NavDisclosure({label='Explore',children}:{label?:string;children?:ReactNode}){
 const [open,setOpen]=useState(false);
 const ref=useRef<HTMLDivElement>(null),id=useId();
 useEffect(()=>{
  function down(e:PointerEvent){if(e.target instanceof Node&&!ref.current?.contains(e.target))setOpen(false)}
  function key(e:KeyboardEvent){if(e.key==='Escape')setOpen(false)}
  document.addEventListener('pointerdown',down);
  document.addEventListener('keydown',key);
  return ()=>{document.removeEventListener('pointerdown',down);document.removeEventListener('keydown',key)};
 },[]);
 return <div className="ds-nav-disclosure" ref={ref}>
  <button className="nav-trigger" type="button" aria-controls={id} aria-expanded={open} onClick={()=>setOpen(v=>!v)}>{label}<Icon name="chevron"/></button>
  <div id={id} className="nav-panel" data-open={open} inert={!open}>
   {children??['Platform','Developers','Pricing'].map(x=><button key={x} className="ds-nav-item" type="button" onClick={()=>setOpen(false)}>{x}</button>)}
  </div>
 </div>;
}
export function LanguageButton(){
 const [open,setOpen]=useState(false);
 return <div className="ds-language-container">
  <button type="button" className="language" aria-expanded={open} onClick={()=>setOpen(v=>!v)}>EN <Icon name="chevron"/></button>
  {open&&<div className="ds-language-menu"><button type="button" onClick={()=>setOpen(false)}>English</button><button type="button" disabled>Russian · soon</button></div>}
 </div>;
}
export function UseCaseTags({items=['Asset discovery','Exposure','Risk intelligence']}:{items?:string[]}){
 return <ul className="use-case-tags">{items.map(x=><li key={x}>{x}</li>)}</ul>;
}
export function PlanCard(){
 return <div className="plan-card ds-plan-card">
  <div><h3>Plus</h3><p className="plan-description">For deeper investigations</p></div>
  <div className="plan-price-block"><p className="plan-price">$89 <span className="price-unit">/ mo</span></p></div>
  <dl><div><dt>API access</dt><dd>Included</dd></div><div><dt>Search history</dt><dd>Available</dd></div></dl>
  <button type="button" className="plan-button">Get started</button>
 </div>;
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
