import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './product-scenes.js';

declare global {
  interface Window {
    ApcosysProductScenes?: { configure(options: {gsap: typeof gsap}):void };
  }
}
export type ProductSceneName = 'query' | 'results' | 'host' | 'evidence' | 'suggestions';
/** Reusable, inert product animation, preserving the upstream web component. */
export default function ProductScene({scene,className=''}:{scene:ProductSceneName;className?:string}) {
  const host=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const parent=host.current;
    if (!parent) return;
    window.ApcosysProductScenes?.configure({gsap});
    const element=document.createElement('apcosys-product-demo');
    element.setAttribute('scene',scene);
    element.setAttribute('fit','contain');
    element.inert=true;
    element.setAttribute('aria-hidden','true');
    parent.appendChild(element);
    return ()=>element.remove();
  },[scene]);
  return <div ref={host} className={`apco-product-scene ${className}`} aria-hidden="true" inert/>;
}
