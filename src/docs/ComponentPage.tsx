import { useState } from 'react';
import type { Item } from '../catalog';
import { Icon } from '../components/ui/Icon';
import Preview, { type PreviewConfiguration } from '../gallery/Preview';
import { componentReference } from './component-reference';
import { CopyButton, downloadText } from './CopyButton';
import { href } from './navigation';

type Tone = 'light' | 'dark';
const websiteSources = 'https://github.com/IMONsergey/Apco-components-lib/blob/main/';
function snippet(item: Item, config: PreviewConfiguration, tone: Tone) {
  if (item.id === 'button') return `import { DoubleButton } from './components/ui/DoubleButton';\n\n<DoubleButton variant="${config.variant ?? 'primary'}"${config.disabled ? ' disabled' : ''} onClick={handleContinue}>\n  Продолжить\n</DoubleButton>`;
  if (item.id === 'plancard') return `import { PlanCard } from './components/system/SitePrimitives';\n\n<PlanCard id="${config.plan ?? 'plus'}" period="${config.period ?? 'monthly'}" onSelect={handlePlanSelect} />`;
  if (item.id === 'billing') return `import { useState } from 'react';\nimport { BillingSwitch } from './components/ui/BillingSwitch';\nimport type { BillingPeriod } from './content/pricing';\n\nexport function PeriodField() {\n  const [period, setPeriod] = useState<BillingPeriod>('${config.period ?? 'monthly'}');\n  return <BillingSwitch value={period} onChange={setPeriod} />;\n}`;
  if (item.id === 'price') return `import { AnimatedPrice } from './components/ui/AnimatedPrice';\n\n<AnimatedPrice amount={${config.amount ?? 50}} />`;
  if (item.id === 'searchfield') return `import { SearchField } from './components/system/SitePrimitives';\n\n<SearchField placeholder="IP, домен или запрос" onSearch={handleSearch} />`;
  if (item.id === 'plain') return `import { PlainButton } from './components/system/SitePrimitives';\n\n<PlainButton${config.disabled ? ' disabled' : ''} onClick={handleCancel}>Отмена</PlainButton>`;
  if (item.id === 'iconaction') return `import { IconAction } from './components/system/SitePrimitives';\n\n<IconAction name="search" label="Найти"${config.disabled ? ' disabled' : ''} onClick={handleSearch} />`;
  if (item.id === 'flow' || item.id === 'waves') return item.code.replace(/theme='(light|dark)'/, `theme='${tone}'`);
  return item.code;
}
function Options<T extends string | number>({ label, items, value, onChange }: { label: string; items: readonly T[]; value: T; onChange: (value: T) => void }) {
  return <div className="docs-options" role="group" aria-label={label}><span>{label}</span><div>{items.map(option => <button type="button" key={option} aria-pressed={value === option} onClick={() => onChange(option)}>{option}</button>)}</div></div>;
}
export default function ComponentPage({ item, tone }: { item: Item; tone: Tone }) {
  const reference = componentReference[item.id];
  const [previewTone, setPreviewTone] = useState<Tone | 'inherit'>('inherit');
  const [size, setSize] = useState<'wide' | 'mobile'>('wide');
  const [config, setConfig] = useState<PreviewConfiguration>({ variant: 'primary', period: 'monthly', plan: 'plus', amount: 50, disabled: false });
  const [reset, setReset] = useState(0);
  const activeTone = previewTone === 'inherit' ? tone : previewTone;
  const code = snippet(item, config, activeTone);
  const update = (change: Partial<PreviewConfiguration>) => setConfig(previous => ({ ...previous, ...change }));
  const motion = item.group === 'Product motion';
  return <article className="docs-component">
    <div className="docs-component__heading">
      <a href={href('components')} className="docs-component__back">← Компоненты сайта</a>
      <div className="docs-component__title-row"><h1>{reference.title}</h1><CopyButton text={window.location.href} label="Ссылка" /></div>
      <p>{reference.purpose}</p>
      <div className="docs-component__tags"><span>{item.name}</span><span>{item.tech}</span><span>{motion ? 'Иллюстрация продукта' : item.group === 'Visual engines' ? 'Фирменная графика' : 'Компонент интерфейса'}</span></div>
    </div>
    <section className="docs-component__example" id="docs-component-preview" aria-label="Интерактивный пример">
      <div className="docs-component__example-head"><strong>Попробуйте компонент</strong><button type="button" className="docs-text-button" onClick={() => { setReset(value => value + 1); setConfig({ variant: 'primary', period: 'monthly', plan: 'plus', amount: 50, disabled: false }); }}>Сбросить пример</button></div>
      <div className="docs-playground-toolbar">
        <div role="group" aria-label="Тема примера">{(['inherit', 'light', 'dark'] as const).map(value => <button type="button" key={value} aria-pressed={previewTone === value} onClick={() => setPreviewTone(value)}>{value === 'inherit' ? 'Как на странице' : value === 'light' ? 'Светлая' : 'Тёмная'}</button>)}</div>
        <div role="group" aria-label="Ширина примера">{(['wide', 'mobile'] as const).map(value => <button type="button" key={value} aria-pressed={size === value} onClick={() => setSize(value)}>{value === 'wide' ? 'На всю ширину' : 'Контейнер 390 px'}</button>)}</div>
      </div>
      <div className="docs-playground-background"><div className="docs-component__stage lib-surface" data-tone={activeTone} data-preview-size={size}>
        <Preview key={item.id + reset} id={item.id} tone={activeTone} speed={1} active large configuration={config} onConfigurationChange={update} />
      </div></div>
      {['button', 'plain', 'iconaction', 'plancard', 'billing', 'price'].includes(item.id) && <div className="docs-playground-controls">
        {item.id === 'button' && <Options label="Вариант" items={['primary', 'secondary', 'inverse', 'dark'] as const} value={config.variant!} onChange={variant => update({ variant })} />}
        {['button', 'plain', 'iconaction'].includes(item.id) && <label className="docs-checkbox"><input type="checkbox" checked={config.disabled} onChange={e => update({ disabled: e.target.checked })} />Недоступное действие</label>}
        {item.id === 'plancard' && <Options label="Тариф" items={['free', 'plus', 'expert', 'business'] as const} value={config.plan!} onChange={plan => update({ plan })} />}
        {['plancard', 'billing'].includes(item.id) && <Options label="Период" items={['monthly', 'annually'] as const} value={config.period!} onChange={period => update({ period })} />}
        {item.id === 'price' && <Options label="Сумма" items={[0, 40, 50, 240, 300, 720, 900]} value={config.amount!} onChange={amount => update({ amount })} />}
      </div>}
      <p className="docs-preview-note">{motion ? 'Сцена объясняет продукт. Рабочие формы и состояния доступны в разделе SaaS.' : 'Действия в примере выполняются локально. Данные и обработчики приложения подключаются отдельно.'}</p>
    </section>
    <section className="docs-component__section" id="docs-component-rules">
      <div className="docs-component__section-head"><h2>Как использовать</h2></div>
      <div className="docs-reference-grid"><div className="docs-reference-panel"><h3>Применение</h3><ul>{reference.use.map(rule => <li key={rule}>{rule}</li>)}</ul></div><div className="docs-reference-panel"><h3>На что обратить внимание</h3><p>{reference.avoid}</p>{reference.related && <a className="docs-inline-link" href={reference.related}>Открыть связанный SaaS-паттерн <Icon name="arrow" /></a>}</div></div>
      <div className="docs-state-list"><span>Проверьте состояния</span>{reference.states.map(state => <span key={state}>{state}</span>)}</div>
    </section>
    <section className="docs-component__section" id="docs-component-usage">
      <div className="docs-component__code"><div className="docs-component__code-heading"><h2>Пример подключения</h2><div className="docs-code-actions"><CopyButton text={code} /><button type="button" className="docs-text-button" onClick={() => downloadText(code, item.id + '.example.tsx')}>Скачать .tsx</button></div></div><pre className="lib-code" tabIndex={0} aria-label="Код примера"><code>{code}</code></pre></div>
      <p className="docs-code-help">Пути указаны относительно папки <code>src</code>. Обработчики <code>handle…</code> принадлежат вашему приложению. <a href="#guide/integration">Инструкция подключения</a></p>
      {reference.props.length > 0 && <div className="docs-props-table" role="region" aria-label="Параметры компонента" tabIndex={0}><table><caption>Основные параметры</caption><thead><tr><th scope="col">Параметр</th><th scope="col">Значение</th><th scope="col">Назначение</th></tr></thead><tbody>{reference.props.map(([name, type, meaning]) => <tr key={name}><th scope="row"><code>{name}</code></th><td><code>{type}</code></td><td>{meaning}</td></tr>)}</tbody></table></div>}
    </section>
    <section className="docs-component__section" id="docs-component-source"><div className="docs-component__section-head"><h2>Исходник и зависимости</h2></div>
      <a className="docs-component__source" href={websiteSources + item.source} target="_blank" rel="noreferrer">{item.source}<Icon name="external" /></a>
      <ul className="docs-dependencies">{reference.dependencies.map(path => <li key={path}><code>{path}</code></li>)}</ul>
      <a className="docs-inline-link" href="#resources">Скачать библиотеку с файлами и стилями <Icon name="arrow" /></a>
    </section>
  </article>;
}
