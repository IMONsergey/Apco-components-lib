import { useEffect,useRef } from 'react';
import { gsap } from 'gsap';
import './api-developer-demo.js';
declare global {
  interface Window { ApcosysApiWidget?: {configure(options:{gsap:typeof gsap}):void} }
}
/** Non-interactive, purely illustrative API walkthrough. */
export default function ApiScene({className=''}:{className?:string}) {
  const host=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const parent=host.current;
    if(!parent)return;
    window.ApcosysApiWidget?.configure({gsap});
    const element=document.createElement('api-developer-demo');
    element.setAttribute('fit','contain');
    element.inert=true;
    element.setAttribute('aria-hidden','true');
    parent.appendChild(element);
    return ()=>element.remove();
  },[]);
  return <div ref={host} className={`apco-api-scene ${className}`} aria-hidden="true" inert/>;
}
