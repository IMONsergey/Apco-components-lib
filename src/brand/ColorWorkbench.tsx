import { useEffect, useRef, useState } from 'react';
import { useDesignDraft, draftCount } from './draft-store';
import ManualCopy from './ManualCopy';
import { useClipboard } from '../hooks/useClipboard';
import { Icon } from '../components/ui/Icon';
import tokens from '../tokens/apcosys.tokens.json';

type Theme = 'light' | 'dark';
type Colors = typeof tokens.colors;
type Role = keyof Colors;
type Draft = Partial<Record<Theme, Partial<Record<Role, string>>>>;

const roles = Object.keys(tokens.colors) as Role[];
const groups: { name: string; keys: Role[] }[] = [
  { name: 'Surfaces', keys: ['page', 'card', 'elevated', 'strong', 'tint'] },
  { name: 'Typography', keys: ['primary', 'body', 'muted', 'visualInk'] },
  { name: 'Brand & actions', keys: ['mark', 'accent', 'action', 'actionHover', 'onAction', 'api'] },
  { name: 'Borders', keys: ['subtle', 'strongBorder'] },
];
const labels: Record<Role, string> = {
  page: 'Page background', card: 'Cards & panels', elevated: 'Raised surfaces',
  strong: 'Emphasis', tint: 'Accent background', primary: 'Headings',
  body: 'Body text', muted: 'Secondary text', visualInk: 'Illustration lines',
  mark: 'Logo accent', accent: 'Links', action: 'Primary action',
  actionHover: 'Action hover', onAction: 'Text on buttons',
  api: 'API visuals', subtle: 'Dividers', strongBorder: 'Strong borders',
};

function isHex(value: unknown): value is string {
  return typeof value === 'string' && /^#[\da-f]{6}$/i.test(value);
}

function contrast(a: string, b: string) {
  const lightness = (s: string) => {
    const parts = s.match(/[\da-f]{2}/gi) || [];
    const rgb = parts.map(piece => {
      const v = parseInt(piece, 16) / 255;
      return v <= .04045 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4);
    });
    return .2126 * (rgb[0] || 0) + .7152 * (rgb[1] || 0) + .0722 * (rgb[2] || 0);
  };
  const x = lightness(a), y = lightness(b);
  return (Math.max(x, y) + .05) / (Math.min(x, y) + .05);
}

function HexEditor({ value, label, onCommit }: { value: string; label: string; onCommit: (next: string) => void }) {
  const [text, setText] = useState(value.toUpperCase());
  useEffect(() => setText(value.toUpperCase()), [value]);
  const cancelled = useRef(false);
  const valid = isHex(text);
  const commit = () => {
    if (cancelled.current) { cancelled.current = false; setText(value.toUpperCase()); return; }
    if (valid) onCommit(text.toUpperCase());
    else setText(value.toUpperCase());
  };
  return <input className="ds-token-hex-input" type="text" spellCheck={false} autoComplete="off"
    maxLength={7} onFocus={() => {cancelled.current = false;}} aria-label={'HEX for ' + label} aria-invalid={!valid} title="6-digit HEX: #RRGGBB"
    value={text} onChange={e => setText(e.target.value.toUpperCase())}
    onBlur={commit} onKeyDown={e => {
      if (e.key === 'Enter') e.currentTarget.blur();
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); cancelled.current = true; setText(value.toUpperCase()); e.currentTarget.blur(); }
    }} />;
}

function MiniPreview({ theme, draft, reference, name }: {
  theme: Theme; draft: Draft; reference: boolean; name: string;
}) {
  const color = (role: Role) => reference ? tokens.colors[role][theme] : (draft[theme]?.[role] || tokens.colors[role][theme]);
  const textRatio = contrast(color('body'), color('card'));
  const buttonRatio = contrast(color('onAction'), color('action'));
  return <div className="ds-workbench__preview" aria-label={name + ' preview'}
    style={{ background: tokens.colors.page[theme], borderColor: tokens.colors.subtle[theme], color: tokens.colors.primary[theme] }}>
    <span className="ds-workbench__preview-caption" style={{ color: tokens.colors.muted[theme] }}>{name}</span>
    <div className="ds-workbench__demo" style={{ background: color('card'), borderColor: color('subtle'), color: color('primary') }}>
      <span className="ds-workbench__eyebrow" style={{ color: color('accent') }}>APCOSYS / INTERFACE</span>
      <strong>Explore your data</strong>
      <p style={{ color: color('body') }}>One query. Full context.</p>
      <span className="ds-workbench__demo-cta" style={{ background: color('action'), color: color('onAction') }}>Start search <span aria-hidden="true">↗</span></span>
      <div className="ds-workbench__demo-detail" style={{ color: color('muted'), borderColor: color('subtle') }}>
        <span style={{ background: color('tint'), color: color('accent') }}>LIVE DATA</span>
        <span>Sample interface</span>
      </div>
    </div>
    <div className="ds-workbench__ratios">
      <span>Body / card <strong data-pass={textRatio >= 4.5}>{textRatio.toFixed(1)}:1 · {textRatio >= 4.5 ? 'AA' : 'Low'}</strong></span>
      <span>Button text <strong data-pass={buttonRatio >= 4.5}>{buttonRatio.toFixed(1)}:1 · {buttonRatio >= 4.5 ? 'AA' : 'Low'}</strong></span>
    </div>
  </div>;
}

export default function ColorWorkbench({ tone, focused = false }: { tone: Theme; focused?: boolean }) {
  const {draft:allDraft,setColor,reset} = useDesignDraft();
  const draft:Draft=allDraft.colors;
  const [editing, setEditing] = useState(false);
  const [copyFormat, setCopyFormat] = useState<'css' | 'hex'>('hex');
  const {copiedId: copied, manualValue: manual, copy, clear} = useClipboard(tone + ':' + editing + ':' + copyFormat + ':' + JSON.stringify(draft));
  const changed = draftCount(allDraft, 'colors');
  const activeChanges = roles.filter(role => draft[tone]?.[role]).length;
  const setValue=(role:Role,value:string)=>setColor(tone,role,value);
  const value = (role: Role) => draft[tone]?.[role] || tokens.colors[role][tone];
  return <>
    <div className="ds-section-bar ds-workbench__heading">
      {focused ? <h1 className="ds-focused-title">Colors</h1> : <h2>Colors</h2>}
      <div className="ds-color-actions">
        <span className="ds-muted-note">{tone === 'dark' ? 'Dark' : 'Light'} theme</span>
        {changed>0&&<button type="button" className="ds-edit-reset" onClick={()=>reset('colors')}>Reset colors</button>}
        <button type="button" className="ds-workbench__mode" aria-pressed={editing} onClick={() => setEditing(!editing)}>
          {editing ? 'View reference' : 'Try color changes'}
        </button>
      </div>
    </div>
    <p className="ds-workbench__explanation">
      {editing ? 'You are editing a separate draft, not the approved APCOSYS palette. Changes stay in this browser.' :
        'Approved semantic colors. Copy a HEX value or CSS variable, or try a separate draft without changing the source.'}
    </p>
    {editing && <div className="ds-workbench" id="ds-palette-preview">
      <div className="ds-workbench__toolbar">
        <span role="status">{changed ? changed + ' changed ' + (changed === 1 ? 'value' : 'values') : 'No color edits'}</span>
      </div>
      <div className="ds-workbench__previews" data-single={activeChanges === 0}>
        {activeChanges > 0 && <MiniPreview name="Approved" theme={tone} draft={draft} reference />}
        <MiniPreview name={activeChanges ? 'Your draft' : 'Preview · matches approved palette'} theme={tone} draft={draft} reference={false}/>
      </div>
      <p className="ds-workbench__note">Edit the HEX fields or pick a swatch below. Both themes are stored separately. Contrast indicators measure the pairs shown, not the whole product. Draft CSS includes only edited variables and portable aliases.</p>
      <span className="ds-workbench__change-count">{activeChanges} {tone} theme edits</span>
    </div>}
    {!editing && <div className="ds-color-actions ds-workbench__copy-settings">
      <span className="ds-muted-note">Click a row to copy</span>
      <div className="ds-copy-format" role="group" aria-label="Copy color format">
        {(['css', 'hex'] as const).map(mode => <button key={mode} type="button" aria-pressed={copyFormat === mode}
          onClick={() => setCopyFormat(mode)}>{mode === 'css' ? 'CSS variable' : 'HEX'}</button>)}
      </div>
    </div>}
    {manual!==null&&<ManualCopy value={manual} label="Copy color token manually" onClose={clear}/>}
    {groups.map(group => <div key={group.name} className="ds-token-group"
      id={'ds-color-' + group.name.toLowerCase().replace(/[^a-z]+/g, '-')}>
      <h3>{group.name}</h3>
      <div className="ds-token-list">
        {group.keys.map(role => {
          const entry = tokens.colors[role];
          const hex = value(role);
          const selectedCopy = copyFormat === 'css' ? 'var(' + entry.css + ')' : entry[tone].toUpperCase();
          if (!editing) return <button className="ds-token-row" type="button" key={role}
            title={entry.usage + ' · Copy ' + (copyFormat === 'css' ? 'CSS variable' : 'HEX')}
            onClick={() => void copy(selectedCopy, role)}>
            <span className="ds-token-swatch" style={{ backgroundColor: entry[tone] }}/>
            <span className="ds-token-label"><strong className="ds-token-name">{labels[role]}</strong><code>{entry.css}</code></span>
            <span className="ds-token-hex">{entry[tone].toUpperCase()}</span>
            <span className="ds-token-copy">{copied === role ? 'Copied' : <Icon name="copy"/>}</span>
          </button>;
          return <div className="ds-token-row ds-token-editor" key={role} data-token={role} data-changed={Boolean(draft[tone]?.[role])}>
            <label className="ds-token-swatch-picker" title={'Pick color for ' + labels[role]}>
              <span className="ds-token-swatch" style={{ backgroundColor: hex }}/>
              <input type="color" aria-label={'Pick color for ' + labels[role]}
                value={hex} onChange={e => setValue(role, e.target.value)} />
            </label>
            <span className="ds-token-label"><strong className="ds-token-name">{labels[role]}</strong><code>{entry.css}</code>{draft[tone]?.[role] && <small className="ds-value-origin">Approved {entry[tone].toUpperCase()}</small>}</span>
            <HexEditor key={tone+role} value={hex} label={labels[role]} onCommit={v => setValue(role, v)}/>
            <button className="ds-token-copy-button" type="button" aria-label={'Copy HEX for ' + labels[role]}
              onClick={() => void copy(hex, 'edit-' + role)}>{copied === 'edit-' + role ? 'Done' : <Icon name="copy"/>}</button>
          </div>;
        })}
      </div>
    </div>)}
    <a className="ds-token-download" href={import.meta.env.BASE_URL + 'tokens/apcosys.tokens.json'}
      download="apcosys.tokens.json">Download design tokens (approved) <Icon name="down"/></a>
    <div className="ds-reference-block" id="ds-contrast">
      <h3>Contrast</h3>
      <div className="ds-contrast-pair">
        {([['Text / Card', 'primary', 'card'], ['Text / Action', 'onAction', 'action']] as const).map(([name, fg, bg]) => {
          const foreground = editing ? value(fg) : tokens.colors[fg][tone];
          const background = editing ? value(bg) : tokens.colors[bg][tone];
          return <div className="ds-contrast-sample" key={name} style={{ background, color: foreground }}>
            <span>{name}</span><strong>Aa</strong><small>{contrast(foreground, background).toFixed(1)}:1</small>
          </div>;
        })}
      </div>
    </div>
  </>;
}
