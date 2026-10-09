import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import tokens from '../tokens/apcosys.tokens.json';
import { blank, sanitizeDraft, draftCount, buildDraftCss, buildDraftJson, downloadDraft, storageKey, oldColorKey, scalarSpecs, validScalar,
 type DesignDraft, type Theme, type ColorRole, type ScalarKind, type DraftScope } from './draft-model';
export * from './draft-model';

interface History { present: DesignDraft; past: DesignDraft[]; future: DesignDraft[] }
function readInitial(): DesignDraft {
 try {
  const saved = localStorage.getItem(storageKey);
  if (saved) return sanitizeDraft(JSON.parse(saved));
  const legacy = localStorage.getItem(oldColorKey);
  if (legacy) return sanitizeDraft({ colors: JSON.parse(legacy) });
 } catch { /* The persistence effect reports unavailable storage; editing still works in memory. */ }
 return blank();
}
interface DesignDraftContext {
 editing: Partial<Record<DraftScope, boolean>>; setEditing: (scope: DraftScope, enabled: boolean) => void;
 draft: DesignDraft; count: number; canUndo: boolean; canRedo: boolean; storageAvailable: boolean;
 setColor: (theme: Theme, role: ColorRole, value: string) => void;
 setScalar: (kind: ScalarKind, role: string, value: number) => void;
 reset: (scope?: DraftScope | DraftScope[]) => void;
 undo: () => void; redo: () => void;
 exportCss: () => string; exportJson: () => void;
}
const Context = createContext<DesignDraftContext | null>(null);
export function DesignDraftProvider({children}: {children: ReactNode}) {
 const [history, setHistory] = useState<History>(() => ({present: readInitial(), past: [], future: []}));
 const [storageAvailable, setStorageAvailable] = useState(true);
 const [editing,setEditingState]=useState<Partial<Record<DraftScope,boolean>>>({});
 const draft = history.present;
 useEffect(() => {
  try {
   // Write before deleting the legacy entry: a failed write must not destroy a valid saved draft.
   localStorage.setItem(storageKey, JSON.stringify(draft));
   localStorage.removeItem(oldColorKey);
   setStorageAvailable(true);
  } catch { setStorageAvailable(false); }
 }, [draft]);
 const value = useMemo<DesignDraftContext>(() => {
  const apply = (edit: (current: DesignDraft) => DesignDraft) => setHistory(current => {
   const next = sanitizeDraft(edit(current.present));
   if (JSON.stringify(next) === JSON.stringify(current.present)) return current;
   return {present: next, past: [...current.past, current.present].slice(-30), future: []};
  });
  return {
   editing, setEditing(scope,enabled){setEditingState(current=>({...current,[scope]:enabled}));},
   draft, count: draftCount(draft), canUndo: history.past.length > 0, canRedo: history.future.length > 0, storageAvailable,
   setColor(theme, role, hex) {
    if (!Object.hasOwn(tokens.colors, role) || !/^#[\da-f]{6}$/i.test(hex)) return;
    apply(current => ({...current, colors: {...current.colors, [theme]: {...current.colors[theme], [role]: hex}}}));
   },
   setScalar(kind, role, next) {
    const spec = scalarSpecs[kind]?.[role];
    if (!spec || !Object.hasOwn(scalarSpecs[kind], role) || !validScalar(next, spec)) return;
    apply(current => ({...current, [kind]: {...current[kind], [role]: next}}));
   },
   reset(scope) {
    apply(current => scope ? {...current, ...Object.fromEntries((Array.isArray(scope) ? scope : [scope]).map(key => [key, {}]))} : blank());
   },
   undo() { setHistory(current => current.past.length ? {present: current.past.at(-1)!, past: current.past.slice(0,-1), future: [current.present,...current.future].slice(0,30)} : current); },
   redo() { setHistory(current => current.future.length ? {present: current.future[0]!, past: [...current.past,current.present].slice(-30), future: current.future.slice(1)} : current); },
   exportCss: () => buildDraftCss(draft),
   exportJson: () => downloadDraft(JSON.stringify(buildDraftJson(draft),null,2)+'\n','apcosys.tokens.draft.json','application/json'),
  };
 }, [draft, history, storageAvailable, editing]);
 return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useDesignDraft() {
 const context = useContext(Context);
 if (!context) throw new Error('useDesignDraft requires DesignDraftProvider');
 return context;
}

/** Session-only edit modes: leaving a reference does not throw away the chosen workspace. */
export function useFoundationMode(scope: DraftScope) {
 const context=useDesignDraft();
 return [context.editing[scope]??false, (enabled:boolean)=>context.setEditing(scope,enabled)] as const;
}
