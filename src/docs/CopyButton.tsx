import { useEffect, useRef, useState } from 'react';
import { Icon } from '../components/ui/Icon';

export function CopyButton({ text, label = 'Копировать код', className = '' }: { text: string; label?: string; className?: string }) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle');
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => { setStatus('idle'); }, [text]);
  async function copy() {
    clearTimeout(timer.current);
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(text);
      setStatus('copied');
      timer.current = setTimeout(() => setStatus('idle'), 2500);
    } catch { setStatus('failed'); }
  }
  return <span className={'docs-copy ' + className}>
    <button type="button" onClick={() => void copy()}><Icon name="copy" />{status === 'copied' ? 'Скопировано' : label}</button>
    <span role="status" className={status === 'failed' ? 'docs-copy__error' : 'sr-only'}>{status === 'copied' ? 'Скопировано в буфер обмена' : status === 'failed' ? 'Буфер обмена недоступен. Выделите текст и скопируйте вручную.' : ''}</span>
  </span>;
}

export function downloadText(text: string, filename: string) {
  const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url; link.download = filename;
  document.body.appendChild(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
