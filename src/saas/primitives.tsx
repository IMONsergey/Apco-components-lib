import {
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { Icon } from "../components/ui/Icon";
import OrbCubeLoader from "../visuals/uploads/orb-cube/OrbCubeLoader";

export type DemoState =
  "ready" | "loading" | "empty" | "error" | "limited" | "unknown";
export type PatternProps = { state?: DemoState };
export type SelectOption = { value: string; label: string; disabled?: boolean };

export function SaasButton({
  variant = "primary",
  busy = false,
  children,
  className = "",
  disabled,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  busy?: boolean;
}) {
  return (
    <button
      className={`s-button s-button--${variant} ${className}`}
      type={type}
      disabled={disabled || busy}
      aria-busy={busy || undefined}
      {...props}
    >
      {busy && (
        <span className="s-button-loader" aria-hidden="true">
          <OrbCubeLoader size={20} color="currentColor" />
        </span>
      )}
      {children}
    </button>
  );
}

export function SaasField({
  label,
  hint,
  error,
  id,
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string | undefined;
  error?: string | undefined;
}) {
  const generated = useId();
  const fieldId = id || generated;
  return (
    <div className={`s-field ${className}`}>
      <label htmlFor={fieldId}>{label}</label>
      <input
        id={fieldId}
        aria-invalid={!!error || undefined}
        aria-describedby={
          error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined
        }
        {...props}
      />
      {error ? (
        <small id={`${fieldId}-error`} className="s-field-error" role="alert">
          {error}
        </small>
      ) : (
        hint && <small id={`${fieldId}-hint`}>{hint}</small>
      )}
    </div>
  );
}

export function SaasSelect({
  label,
  value,
  onChange,
  options,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(
    Math.max(
      0,
      options.findIndex((option) => option.value === value),
    ),
  );
  const id = useId();
  const host = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    list.current?.focus({ preventScroll: true });
    const close = (event: PointerEvent) => {
      if (!host.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);
  function choose(index: number) {
    const option = options[index];
    if (!option || option.disabled) return;
    onChange(option.value);
    setOpen(false);
    trigger.current?.focus();
  }
  function next(direction: number) {
    for (let offset = 1; offset <= options.length; offset++) {
      const index =
        (active + direction * offset + options.length) % options.length;
      if (!options[index]?.disabled) {
        setActive(index);
        return;
      }
    }
  }
  return (
    <div className="s-select" ref={host}>
      <span id={`${id}-label`} className="s-select-label">
        {label}
      </span>
      <button
        ref={trigger}
        type="button"
        className="s-select-trigger"
        aria-labelledby={`${id}-label ${id}-value`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? `${id}-list` : undefined}
        disabled={disabled || options.every((option) => option.disabled)}
        onClick={() => {
          setActive(
            Math.max(
              0,
              options.findIndex((option) => option.value === value),
            ),
          );
          setOpen(!open);
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            setOpen(true);
          }
        }}
      >
        <span id={`${id}-value`}>
          {options.find((option) => option.value === value)?.label ||
            "Choose an option"}
        </span>
        <Icon name="chevron" />
      </button>
      {open && (
        <div
          id={`${id}-list`}
          className="s-select-list"
          role="listbox"
          aria-labelledby={`${id}-label`}
          tabIndex={-1}
          ref={list}
          aria-activedescendant={`${id}-option-${active}`}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown" || event.key === "ArrowUp") {
              event.preventDefault();
              next(event.key === "ArrowDown" ? 1 : -1);
            } else if (event.key === "Home" || event.key === "End") {
              event.preventDefault();
              setActive(
                event.key === "Home"
                  ? Math.max(
                      0,
                      options.findIndex((option) => !option.disabled),
                    )
                  : Math.max(
                      0,
                      options
                        .map((option) => !option.disabled)
                        .lastIndexOf(true),
                    ),
              );
            } else if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              choose(active);
            } else if (event.key === "Escape") {
              event.preventDefault();
              setOpen(false);
              trigger.current?.focus();
            } else if (event.key === "Tab") {
              setOpen(false);
              trigger.current?.focus();
            }
          }}
        >
          {options.map((option, index) => (
            <div
              role="option"
              id={`${id}-option-${index}`}
              key={option.value}
              aria-selected={value === option.value}
              aria-disabled={option.disabled || undefined}
              className={index === active ? "is-active" : ""}
              onPointerMove={() => setActive(index)}
              onClick={() => choose(index)}
            >
              <span>{option.label}</span>
              {option.value === value && <span aria-hidden="true">✓</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function SaasTabs({
  label,
  items,
  value,
  onChange,
  children,
}: {
  label: string;
  items: { id: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  const prefix = useId();
  const tablist = useRef<HTMLDivElement>(null);
  return (
    <div className="s-tab-layout">
      <div
        ref={tablist}
        className="s-tabs"
        role="tablist"
        aria-label={label}
        onKeyDown={(event) => {
          const current = items.findIndex((item) => item.id === value);
          const index =
            event.key === "ArrowRight"
              ? (current + 1) % items.length
              : event.key === "ArrowLeft"
                ? (current + items.length - 1) % items.length
                : event.key === "Home"
                  ? 0
                  : event.key === "End"
                    ? items.length - 1
                    : -1;
          const item = items[index];
          if (item) {
            event.preventDefault();
            onChange(item.id);
            (
              tablist.current?.children[index] as HTMLButtonElement | undefined
            )?.focus({ preventScroll: true });
          }
        }}
      >
        {items.map((item) => (
          <button
            type="button"
            key={item.id}
            id={`${prefix}-${item.id}`}
            role="tab"
            aria-controls={`${prefix}-panel`}
            aria-selected={value === item.id}
            tabIndex={value === item.id ? 0 : -1}
            onClick={() => onChange(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div
        className="s-tab-panel"
        role="tabpanel"
        id={`${prefix}-panel`}
        aria-labelledby={`${prefix}-${value}`}
        tabIndex={0}
      >
        {children}
      </div>
    </div>
  );
}

export function SaasBadge({
  tone = "neutral",
  children,
}: {
  tone?: "neutral" | "accent" | "success" | "warning" | "error";
  children: ReactNode;
}) {
  return <span className={`s-badge s-badge--${tone}`}>{children}</span>;
}
export function SaasAlert({
  title,
  children,
  tone = "info",
}: {
  title?: string;
  children: ReactNode;
  tone?: "info" | "success" | "warning" | "error";
}) {
  return (
    <div
      className={`s-alert s-alert--${tone}`}
      role={tone === "error" ? "alert" : "status"}
    >
      {title && <strong>{title}</strong>}
      <div>{children}</div>
    </div>
  );
}
export function SaasEmpty({
  title,
  children,
  action,
}: {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="s-empty">
      <span className="s-empty-symbol">
        <Icon name="search" width={24} height={24} />
      </span>
      <h3>{title}</h3>
      <p>{children}</p>
      {action}
    </div>
  );
}
export function SaasLoading({ label = "Loading results" }: { label?: string }) {
  return (
    <div
      className="s-loading"
      role="status"
      aria-label={label}
      aria-busy="true"
    >
      <div className="s-loading-heading">
        <OrbCubeLoader size={44} color="var(--s-accent)" />
        <span>{label}</span>
      </div>
      {[0, 1, 2].map((row) => (
        <div className="s-skeleton-row" key={row} aria-hidden="true">
          <i />
          <span />
          <b />
        </div>
      ))}
    </div>
  );
}
export function SaasDialog({
  open,
  onClose,
  title,
  children,
  footer,
  className = "",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
    return () => {
      if (dialog.open) dialog.close();
    };
  }, [open]);
  return (
    <dialog
      className={`s-dialog ${className}`}
      ref={ref}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <header>
        <h3 id={titleId}>{title}</h3>
        <SaasButton
          variant="ghost"
          className="s-icon-button"
          aria-label="Close dialog"
          onClick={onClose}
        >
          <Icon name="close" />
        </SaasButton>
      </header>
      <div className="s-dialog-body">{children}</div>
      {footer && <footer>{footer}</footer>}
    </dialog>
  );
}

export function DemoNotice({ children }: { children?: ReactNode }) {
  return (
    <p className="s-demo-notice">
      <span className="s-demo-dot" />
      {children || "Interactive example · sample data · no requests are sent"}
    </p>
  );
}
export function DemoStateNotice({
  state,
  onReset,
}: {
  state: DemoState;
  onReset?: () => void;
}) {
  if (state === "loading") return <SaasLoading />;
  if (state === "error")
    return (
      <SaasAlert tone="error" title="Could not load this view">
        <p>Check your connection and try again. Your query is preserved.</p>
        {onReset && (
          <SaasButton variant="secondary" onClick={onReset}>
            Retry example
          </SaasButton>
        )}
      </SaasAlert>
    );
  if (state === "limited")
    return (
      <SaasAlert tone="warning" title="Plan limit reached">
        <p>
          This action needs additional access. Keep the query and review the
          available plans.
        </p>
        {onReset && (
          <SaasButton variant="secondary" onClick={onReset}>
            Back to example
          </SaasButton>
        )}
      </SaasAlert>
    );
  if (state === "unknown")
    return (
      <SaasAlert tone="warning" title="Outcome not confirmed">
        <p>
          The connection ended before the action was confirmed. Check the
          current status before submitting again.
        </p>
        {onReset && (
          <SaasButton variant="secondary" onClick={onReset}>
            Check demo status
          </SaasButton>
        )}
      </SaasAlert>
    );
  return null;
}
