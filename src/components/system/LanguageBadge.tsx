import { useId, useRef, type KeyboardEvent } from 'react';
import { Icon } from '../ui/Icon';

const languages = [
  { value: 'en', label: 'English' },
  { value: 'ru', label: '\u0420\u0443\u0441\u0441\u043a\u0438\u0439' },
  { value: 'zh', label: '\u4e2d\u6587' },
] as const;

export type LanguageCode = (typeof languages)[number]['value'];

function focusInPlace(node?: HTMLElement) {
  if (!node) return;
  const position = { left: scrollX, top: scrollY };
  node.focus({ preventScroll: true });
  window.scrollTo({ ...position, behavior: 'instant' });
}

function LanguageFlag({ locale }: { locale: LanguageCode }) {
  const clip = useId();
  return (
    <svg
      className="language-flag"
      viewBox="0 0 24 24"
      width="16"
      height="16"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <clipPath id={clip}>
          <circle cx="12" cy="12" r="12" />
        </clipPath>
      </defs>
      <g clipPath={'url(#' + clip + ')'}>
        {locale === 'en' ? (
          <>
            <path fill="#012169" d="M0 0h24v24H0z" />
            <path stroke="#fff" strokeWidth="5" d="m0 0 24 24M24 0 0 24" />
            <path stroke="#c8102e" strokeWidth="2" d="m0 0 24 24M24 0 0 24" />
            <path stroke="#fff" strokeWidth="8" d="M12 0v24M0 12h24" />
            <path stroke="#c8102e" strokeWidth="4.5" d="M12 0v24M0 12h24" />
          </>
        ) : locale === 'ru' ? (
          <>
            <path fill="#fff" d="M0 0h24v8H0z" />
            <path fill="#0039a6" d="M0 8h24v8H0z" />
            <path fill="#d52b1e" d="M0 16h24v8H0z" />
          </>
        ) : (
          <>
            <path fill="#de2910" d="M0 0h24v24H0z" />
            <path
              fill="#ffde00"
              d="m6.2 4.1.9 2.1 2.3.2-1.8 1.5.6 2.2-2-1.2-2 1.2.6-2.2-1.8-1.5 2.3-.2z"
            />
            <path fill="#ffde00" d="m11.1 3.3.3.7.8.1-.6.5.2.8-.7-.4-.7.4.2-.8-.6-.5.8-.1zM13.2 5.4l.3.7.8.1-.6.5.2.8-.7-.4-.7.4.2-.8-.6-.5.8-.1zM13.2 8.3l.3.7.8.1-.6.5.2.8-.7-.4-.7.4.2-.8-.6-.5.8-.1zM11.1 10.5l.3.7.8.1-.6.5.2.8-.7-.4-.7.4.2-.8-.6-.5.8-.1z" />
          </>
        )}
      </g>
    </svg>
  );
}

export function LanguageBadge({
  open,
  onOpenChange,
  value = 'en',
  onChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value?: LanguageCode;
  onChange?: (value: LanguageCode) => void;
}) {
  const id = useId();
  const panelId = id + '-languages';
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  const close = () => {
    onOpenChange(false);
    focusInPlace(trigger.current ?? undefined);
  };
  const focusOption = (index?: number) => {
    requestAnimationFrame(() =>
      focusInPlace(
        panel.current?.querySelectorAll<HTMLButtonElement>('button')[index ?? languages.findIndex(language => language.value === value)],
      ),
    );
  };
  const openMenu = (fromKeyboard = false, index?: number) => {
    onOpenChange(true);
    if (fromKeyboard) focusOption(index);
  };
  const onMenuKey = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      close();
    } else if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      const buttons = Array.from(panel.current?.querySelectorAll<HTMLButtonElement>('button') ?? []);
      const current = buttons.findIndex(button => button === document.activeElement);
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? languages.length - 1 :
        (current + (event.key === 'ArrowUp' ? -1 : 1) + languages.length) % languages.length;
      focusOption(next);
    }
  };

  return (
    <div
      className="language-control"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) onOpenChange(false);
      }}
    >
      <button
        ref={trigger}
        type="button"
        className="language"
        data-language-selector=""
        aria-label={value.toUpperCase() + ' — Language'}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={(event) => {
          const fromKeyboard = event.detail === 0;
          // Mouse/touch activation focuses after the pointer event instead of
          // forcing a focus-visible ring during mousedown.
          if (!fromKeyboard) focusInPlace(event.currentTarget);
          if (open) close();
          else openMenu(fromKeyboard);
        }}
        onKeyDown={(event) => {
          if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
            event.preventDefault();
            openMenu(true, event.key === 'End' || event.key === 'ArrowUp' ? languages.length - 1 : 0);
          } else if (event.key === 'Tab' && open) {
            onOpenChange(false);
          }
        }}
      >
        <LanguageFlag locale={value} />
        <span className="locale-text" lang="en">
          {value.toUpperCase()}
        </span>
        <Icon name="chevron" />
      </button>

      <div
        ref={panel}
        id={panelId}
        role="menu"
        aria-label="Language"
        className="nav-panel language-panel"
        data-open={open}
        aria-hidden={!open}
        inert={!open}
        onKeyDown={onMenuKey}
      >
        {languages.map((language) => (
          <button
            key={language.value}
            type="button"
            role="menuitemradio"
            aria-checked={language.value === value}
            tabIndex={open ? 0 : -1}
            lang={language.value === 'zh' ? 'zh-Hans' : language.value}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              onChange?.(language.value);
              close();
            }}
          >
            <LanguageFlag locale={language.value} />
            <span>{language.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
