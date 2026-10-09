import { useState } from 'react';
import { useDesignDraft } from './draft-store';
import ManualCopy from './ManualCopy';

export default function DraftToolbar() {
 const {count,reset,exportCss,exportJson}=useDesignDraft();
 const [copied,setCopied]=useState(false);
 const [manual,setManual]=useState<string|null>(null);
 if (!count) return null;
 return <div className="ds-draft-global" role="region" aria-label="Your unpublished design draft">
  <span role="status"><strong>{count} {count===1?'change':'changes'}</strong> in your local draft · approved design untouched</span>
  <div className="ds-draft-global__actions">
   <button type="button" onClick={async()=>{
    try{await navigator.clipboard.writeText(exportCss());setCopied(true);setManual(null)}catch{setCopied(false);setManual(exportCss())}
   }}>{copied?'Copied CSS':'Copy CSS'}</button>
   <button type="button" onClick={exportJson}>Download draft JSON</button>
   <button type="button" onClick={()=>{reset();setCopied(false);setManual(null)}}>Reset all</button>
  </div>
  {manual!==null&&<ManualCopy value={manual} label="Copy draft CSS manually" onClose={()=>setManual(null)}/>}
 </div>;
}
