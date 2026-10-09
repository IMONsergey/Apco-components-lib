import { useCallback, useEffect, useRef, useState } from 'react';

import {useCopyToast,type CopyNotice} from '../docs/CopyToast';

/** Feedback belongs to a specific value and context, never to a stale route or theme. */
export function useClipboard(contextKey = '', message:CopyNotice = 'Code copied') {
 const {begin,confirm}=useCopyToast();
 const [copiedId, setCopiedId] = useState<string | null>(null);
 const [manualValue, setManualValue] = useState<string | null>(null);
 const epoch = useRef(0);
 const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
 const clear = useCallback(() => {
  epoch.current += 1;
  clearTimeout(timer.current);
  setCopiedId(null);
  setManualValue(null);
 }, []);
 useEffect(() => {
  clear();
  return () => { epoch.current += 1; clearTimeout(timer.current); };
 }, [contextKey, clear]);
 const copy = useCallback(async (value: string, id = value) => {
  const request = ++epoch.current;
  const noticeRequest=begin();
  clearTimeout(timer.current);
  setCopiedId(null);
  setManualValue(null);
  try {
   if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
   await navigator.clipboard.writeText(value);
   if (request !== epoch.current) return;
   setCopiedId(id);
   confirm(noticeRequest,message);
   timer.current = setTimeout(() => setCopiedId(null), 2400);
  } catch {
   if (request === epoch.current) setManualValue(value);
  }
 }, [begin,confirm,message]);
 return {copiedId, manualValue, copy, clear};
}
