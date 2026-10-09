import { useDesignDraft } from './draft-store';
import { useClipboard } from '../hooks/useClipboard';
import ManualCopy from './ManualCopy';

export default function DraftToolbar() {
 const {count, reset, exportCss, exportJson, canUndo, canRedo, undo, redo, storageAvailable} = useDesignDraft();
 const css = exportCss();
 const clipboard = useClipboard(css);
 if (!count && !canUndo && !canRedo && storageAvailable) return null;
 return <div className="ds-draft-global" role="region" aria-label="Your unpublished design draft">
  <span role="status">{count ? <><strong>{count} {count===1?'change':'changes'}</strong> in your local draft</> : 'All values match the approved reference'} · approved design untouched</span>
  <div className="ds-draft-global__actions">
   {canUndo && <button type="button" onClick={undo}>Undo</button>}
   {canRedo && <button type="button" onClick={redo}>Redo</button>}
   {count > 0 && <>
    <button type="button" onClick={() => void clipboard.copy(css, 'css')}>{clipboard.copiedId ? 'Copied CSS' : 'Copy CSS'}</button>
    <button type="button" onClick={exportJson}>Download draft JSON</button>
    <button type="button" onClick={() => reset()}>Reset all</button>
   </>}
  </div>
  {!storageAvailable && <p className="ds-storage-warning" role="status">Browser storage is unavailable. Your draft works in this tab but will be lost on reload. Download the JSON to keep it.</p>}
  {clipboard.manualValue !== null && <ManualCopy value={clipboard.manualValue} label="Copy draft CSS manually" onClose={clipboard.clear}/>}
 </div>;
}
