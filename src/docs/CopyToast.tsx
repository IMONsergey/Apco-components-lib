import {createContext,useCallback,useContext,useEffect,useMemo,useRef,useState,type ReactNode} from 'react';
import {createPortal} from 'react-dom';

export type CopyNotice = 'Code copied' | 'Color copied' | 'CSS copied';
const duration = 2000;
type CopyToastContext = {begin:()=>number;confirm:(request:number,message:CopyNotice)=>void};
const Context=createContext<CopyToastContext|null>(null);

/** One nonblocking confirmation, shared by every documentation copy action. */
export function CopyToastProvider({children}:{children:ReactNode}){
 const [toast,setToast]=useState<{request:number;message:CopyNotice}|null>(null);
 const latest=useRef(0);
 const timer=useRef<ReturnType<typeof setTimeout>|undefined>(undefined);
 const begin=useCallback(()=>{
  clearTimeout(timer.current);
  setToast(null);
  return ++latest.current;
 },[]);
 const confirm=useCallback((request:number,message:CopyNotice)=>{
  // A slower earlier request must not replace the latest action's confirmation.
  if(request!==latest.current)return;
  clearTimeout(timer.current);
  setToast({request,message});
  timer.current=setTimeout(()=>setToast(null),duration);
 },[]);
 useEffect(()=>()=>{clearTimeout(timer.current);latest.current+=1;},[]);
 const context=useMemo(()=>({begin,confirm}),[begin,confirm]);
 return <Context.Provider value={context}>
  {children}
  {createPortal(<div className="docs-copy-toast-region" role="status" aria-live="polite" aria-atomic="true">
   {toast&&<div key={toast.request} className="docs-copy-toast" data-testid="copy-toast">
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="m3 8 3 3 7-7"/></svg>
    <span>{toast.message}</span>
   </div>}
  </div>,document.body)}
 </Context.Provider>;
}
export function useCopyToast(){
 const context=useContext(Context);
 if(!context)throw new Error('useCopyToast requires CopyToastProvider');
 return context;
}
