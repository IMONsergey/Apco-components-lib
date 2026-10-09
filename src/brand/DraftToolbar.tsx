import {useLayoutEffect,useRef} from 'react';
import { useDesignDraft } from './draft-store';
import { useClipboard } from '../hooks/useClipboard';
import ManualCopy from './ManualCopy';

export default function DraftToolbar({editing=false}:{editing?:boolean}) {
 const {count,reset,exportCss,exportJson,canUndo,canRedo,undo,redo,storageAvailable}=useDesignDraft();
 const css=exportCss();
 const clipboard=useClipboard(css);
 const root=useRef<HTMLDivElement>(null);
 const lastAction=useRef<'undo'|'redo'|'reset'|null>(null);
 useLayoutEffect(()=>{
  const action=lastAction.current;lastAction.current=null;
  if(action==='undo'&&!canUndo)root.current?.querySelector<HTMLButtonElement>('[data-action=redo]')?.focus({preventScroll:true});
  if((action==='redo'&&!canRedo)||action==='reset')root.current?.querySelector<HTMLButtonElement>('[data-action=undo]')?.focus({preventScroll:true});
 },[css,canUndo,canRedo]);
 const hasHistory=canUndo||canRedo;
 if(!editing&&!count&&!hasHistory&&storageAvailable)return null;
 return <div ref={root} className="ds-draft-global" role="region" aria-label="Your unpublished design draft">
  <span className="ds-draft-global__status" role="status">{count?<><strong>Draft</strong> · {count} {count===1?'change':'changes'}</>:hasHistory?'All values match the reference':'Draft · no changes'}</span>
  <div className="ds-draft-global__actions" data-empty={!count&&!hasHistory} inert={!count&&!hasHistory} aria-hidden={!count&&!hasHistory||undefined}>
   <button type="button" data-action="undo" onClick={()=>{lastAction.current='undo';undo();}} disabled={!canUndo} title="Undo last draft change">Undo</button>
   <button type="button" data-action="redo" onClick={()=>{lastAction.current='redo';redo();}} disabled={!canRedo} title="Redo draft change">Redo</button>
   <button type="button" className="ds-draft-copy" disabled={!count} onClick={()=>void clipboard.copy(exportCss(),'css')}>{clipboard.copiedId?'Copied CSS':'Copy CSS'}</button>
   <button type="button" onClick={exportJson} disabled={!count} aria-label="Download draft JSON" title="Download all draft changes as JSON">JSON</button>
   <button type="button" onClick={()=>{lastAction.current='reset';reset();}} disabled={!count} aria-label="Reset all" title="Reset the draft; Undo can restore it">Reset</button>
  </div>
  {!storageAvailable&&<p className="ds-storage-warning" role="status">Browser storage is unavailable. Download the draft before reloading this page.</p>}
  {clipboard.manualValue!==null&&<ManualCopy value={clipboard.manualValue} label="Copy draft CSS manually" onClose={clipboard.clear}/>}
 </div>;
}
