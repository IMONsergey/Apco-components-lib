import {useEffect,useLayoutEffect,useRef,useState} from 'react';
import {catalog} from '../catalog';
import {href,parseRoute,type DocRoute} from '../docs/navigation';
const isDetail=(route:DocRoute)=>route.section==='components'&&catalog.some(item=>item.id===route.slug);
const isCatalog=(route:DocRoute)=>route.section==='components'&&!isDetail(route);

/** Preserve the user's catalog context without introducing another route or toolbar. */
export function useLibraryNavigation(){
 const [route,setRoute]=useState<DocRoute>(()=>parseRoute(location.hash));
 const current=useRef(route);
 const catalogue=useRef({href:href('components'),y:0,id:''});
 const pending=useRef<{y:number;id?:string;focus?:boolean}|null>(null);
 useEffect(()=>{
  const previousRestoration=history.scrollRestoration;history.scrollRestoration='manual';
  const onHash=()=>{
   const from=current.current,to=parseRoute(location.hash);
   if(isCatalog(from))catalogue.current={href:href('components',from.slug),y:scrollY,id:isDetail(to)?to.slug:''};
   const backToCatalog=isCatalog(to)&&isDetail(from)&&href('components',to.slug)===catalogue.current.href;
   const familySwitch=from.section==='icons'&&to.section==='icons'&&!to.slug.includes('/');
   pending.current=backToCatalog?{y:catalogue.current.y,id:catalogue.current.id}:familySwitch?{y:scrollY,focus:false}:{y:0};
   current.current=to;setRoute(to);
  };
  window.addEventListener('hashchange',onHash);
  return()=>{history.scrollRestoration=previousRestoration;window.removeEventListener('hashchange',onHash);};
 },[]);
 useLayoutEffect(()=>{
  const target=pending.current;if(!target)return;
  pending.current=null;
  const restore=()=>{
   window.scrollTo({top:target.y,behavior:'instant'});
   const element=target.id?document.querySelector<HTMLElement>('.lib-card[data-testid="'+target.id+'"] .lib-card__name'):document.getElementById('docs-content');
   const active=document.activeElement;
   const userAlreadyEditing=active instanceof HTMLElement&&active.isConnected&&!!active.closest('input,textarea,select,[contenteditable=true]')&&!active.closest('[role=dialog]');
   if(target.focus!==false&&!userAlreadyEditing)element?.focus({preventScroll:true});
  };
  restore();
  // A second focus call can steal focus from a field the user has already selected.
  const frame=requestAnimationFrame(()=>{if(document.activeElement===document.body||document.activeElement?.id==='docs-content')window.scrollTo({top:target.y,behavior:'instant'});});
  return()=>cancelAnimationFrame(frame);
 },[route]);
 return {route,catalogReturnHref:catalogue.current.href};
}
