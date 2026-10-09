export default function ManualCopy({value,label,onClose}:{value:string;label:string;onClose:()=>void}) {
 return <div className="ds-manual-copy" role="status">
  <div><span>Clipboard access unavailable. Select and copy the value below.</span>
   <button type="button" onClick={onClose} aria-label="Close manual copy">Close</button></div>
  <textarea aria-label={label} readOnly spellCheck={false} value={value}
   onFocus={event=>event.currentTarget.select()} onClick={event=>event.currentTarget.select()}/>
 </div>;
}
