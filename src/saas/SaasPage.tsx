import { useEffect, useState, type ComponentType } from "react";
import { Icon } from "../components/ui/Icon";
import {
  saasCatalog,
  saasSourceBase,
  saasSourceRevision,
  saasStates,
} from "./catalog";
import { AccountPattern, AuthPattern, BillingPattern } from "./AccountPatterns";
import {
  FeedbackPattern,
  ObjectPattern,
  ResultsPattern,
  UsagePattern,
} from "./DataPatterns";
import {
  ControlsPattern,
  HistoryPattern,
  ScannerPattern,
  SearchPattern,
  WorkspacePattern,
} from "./WorkflowPatterns";
import { SaasButton, type DemoState, type PatternProps } from "./primitives";
import "../styles/inter.css";
import "../styles/saas-library.css";

const patterns: Record<string, ComponentType<PatternProps>> = {
  workspace: WorkspacePattern,
  controls: ControlsPattern,
  search: SearchPattern,
  results: ResultsPattern,
  object: ObjectPattern,
  scanner: ScannerPattern,
  auth: AuthPattern,
  account: AccountPattern,
  billing: BillingPattern,
  feedback: FeedbackPattern,
  usage: UsagePattern,
  history: HistoryPattern,
};
const patternIcons: Record<
  string,
  | "menu"
  | "plus"
  | "search"
  | "database"
  | "cube"
  | "scanner"
  | "book"
  | "bookmark"
> = {
  workspace: "menu",
  controls: "plus",
  search: "search",
  results: "database",
  object: "cube",
  scanner: "scanner",
  auth: "book",
  account: "book",
  billing: "book",
  feedback: "plus",
  usage: "database",
  history: "bookmark",
};

export function SaasOverview() {
  return (
    <div className="s-library-overview">
      <div className="s-library-intro">
        <span className="s-library-kicker">APCOSYS / PRODUCT INTERFACE</span>
        <h1>
          SaaS: от элемента
          <br />к рабочему сценарию
        </h1>
        <p>
          Найдите нужный паттерн, проверьте его поведение и используйте готовые
          правила. Примеры повторяют логику интерфейса платформы и работают на
          локальных данных.
        </p>
        <div className="s-library-links">
          <a href="#saas/search">
            Поиск и фильтры
            <Icon name="arrow" />
          </a>
          <a href="#saas/controls">
            Базовые контролы
            <Icon name="arrow" />
          </a>
        </div>
      </div>
      <div className="s-overview-principles">
        <article>
          <span>01</span>
          <h3>Выберите задачу</h3>
          <p>
            Поиск, данные, аккаунт или оплата — у каждого сценария свой набор
            элементов.
          </p>
        </article>
        <article>
          <span>02</span>
          <h3>Проверьте состояния</h3>
          <p>Переключите загрузку, ошибку, пустую выдачу и мобильную ширину.</p>
        </article>
        <article>
          <span>03</span>
          <h3>Передайте в работу</h3>
          <p>Скопируйте пример, ссылку на паттерн и правила использования.</p>
        </article>
      </div>
      <section id="saas-patterns">
        <div className="s-library-section-heading">
          <h3>Паттерны платформы</h3>
          <span>{saasCatalog.length - 1} интерактивных примеров</span>
        </div>
        <div className="s-pattern-directory">
          {saasCatalog
            .filter((entry) => entry.id !== "overview")
            .map((entry) => (
              <a key={entry.id} href={`#saas/${entry.id}`}>
                <span className="s-directory-icon">
                  <Icon
                    name={patternIcons[entry.id] || "cube"}
                    width={20}
                    height={20}
                  />
                </span>
                <div>
                  <h4>{entry.title}</h4>
                  <p>{entry.description}</p>
                  <span>
                    {entry.states.length > 1
                      ? `${entry.states.length} состояний`
                      : "Интерактивный пример"}
                  </span>
                </div>
                <Icon name="arrow" />
              </a>
            ))}
        </div>
      </section>
      <section id="saas-foundations" className="s-overview-foundations">
        <div className="s-library-section-heading">
          <h3>Основа SaaS-интерфейса</h3>
          <a
            href={`${import.meta.env.BASE_URL}tokens/saas.tokens.json`}
            download
          >
            Скачать токены JSON
            <Icon name="down" />
          </a>
        </div>
        <div className="s-foundation-summary">
          <div>
            <span className="s-library-kicker">ШРИФТЫ</span>
            <strong>Inter · Instrument Sans</strong>
            <p>
              Inter — элементы интерфейса. Instrument Sans — заголовки. IBM Plex
              Mono — адреса, код и технические значения.
            </p>
          </div>
          <div>
            <span className="s-library-kicker">ГЕОМЕТРИЯ</span>
            <strong>44 px / 24 px / 8 px</strong>
            <p>
              Основной контрол / базовый промежуток / радиус контрола. Для
              мобильных полей шрифт не меньше 16 px.
            </p>
          </div>
          <div>
            <span className="s-library-kicker">ЦВЕТ</span>
            <strong>Нейтральная база, один акцент</strong>
            <div className="s-token-swatches">
              <span style={{ background: "#121314" }} title="Text · #121314" />
              <span
                style={{ background: "#f5f6f7" }}
                title="Surface · #f5f6f7"
              />
              <span
                style={{ background: "#03879f" }}
                title="Accent · #03879f"
              />
              <span style={{ background: "#e3f4f7" }} title="Tint · #e3f4f7" />
            </div>
            <p>
              Бирюзовый обозначает действие или выбор; семантические цвета —
              состояние.
            </p>
          </div>
        </div>
      </section>
      <aside className="s-library-boundary">
        <h3>Как использовать эти примеры</h3>
        <p>
          Паттерны показывают интерфейс и его локальное поведение. Авторизация,
          поиск, платежи, сканирование и права доступа подключаются к API
          отдельно. В примерах нет действующих ключей или серверных операций.
        </p>
        <p>
          Основа сверена с{" "}
          <a
            href={`https://github.com/IMONsergey/Assaasdev/tree/${saasSourceRevision}`}
            target="_blank"
            rel="noreferrer"
          >
            Assaasdev · 7cb2bcf · 25.10.2026
            <Icon name="external" />
          </a>
          . Маркетинговая библиотека и SaaS имеют общую фирменную основу и
          разные роли типографики и плотности.
        </p>
      </aside>
    </div>
  );
}

export default function SaasPage({
  slug,
  tone,
}: {
  slug: string;
  tone: "light" | "dark";
}) {
  const entry = saasCatalog.find((item) => item.id === slug) || saasCatalog[0]!;
  const [state, setState] = useState<DemoState>("ready"),
    [width, setWidth] = useState<"wide" | "tablet" | "mobile">("wide"),
    [previewTone, setPreviewTone] = useState(tone),
    [codeOpen, setCodeOpen] = useState(false),
    [copyStatus, setCopyStatus] = useState(""),
    [reset, setReset] = useState(0);
  useEffect(() => {
    setState("ready");
    setCopyStatus("");
    setCodeOpen(false);
    setReset(0);
  }, [slug]);
  useEffect(() => setPreviewTone(tone), [tone]);
  if (entry.id === "overview") return <SaasOverview />;
  const Pattern = patterns[entry.id];
  if (!Pattern) return <SaasOverview />;
  const displayState = entry.states.includes(state) ? state : "ready";
  const code = `import { ${entry.component} } from './saas';\n\n// Example file is inside src/. Styles ship with the source archive.\n<div className="saas-scope" data-tone="${previewTone}">\n  <${entry.component}${entry.states.length > 1 ? ` state="${displayState}"` : ""} />\n</div>`;
  async function copy(text: string, success: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus(success);
    } catch {
      setCopyStatus(
        "Буфер обмена недоступен. Выделите код и скопируйте вручную.",
      );
      setCodeOpen(true);
    }
  }
  return (
    <article className="s-library-page">
      <header className="s-library-page-heading">
        <a className="s-library-back" href="#saas/overview">
          <Icon name="previous" />
          Все SaaS-паттерны
        </a>
        <span className="s-library-kicker">
          SAAS / {entry.id.toUpperCase()}
        </span>
        <h1>{entry.title}</h1>
        <p>{entry.purpose}</p>
      </header>
      <section id="saas-preview" className="s-preview-section">
        <div className="s-preview-toolbar">
          <div
            className="s-preview-tabs"
            role="group"
            aria-label="Ширина SaaS-примера"
          >
            {(
              [
                { id: "wide", label: "Десктоп" },
                { id: "tablet", label: "Планшет" },
                { id: "mobile", label: "Телефон" },
              ] as const
            ).map((view) => (
              <button
                key={view.id}
                type="button"
                aria-pressed={width === view.id}
                onClick={() => setWidth(view.id)}
              >
                {view.label}
              </button>
            ))}
          </div>
          <div className="s-preview-actions">
            <div
              className="s-tone-switch"
              role="group"
              aria-label="Тема SaaS-примера"
            >
              <button
                type="button"
                aria-pressed={previewTone === "light"}
                onClick={() => setPreviewTone("light")}
              >
                Light
              </button>
              <button
                type="button"
                aria-pressed={previewTone === "dark"}
                onClick={() => setPreviewTone("dark")}
              >
                Dark
              </button>
            </div>
            <button
              type="button"
              className="s-reset-preview"
              onClick={() => {
                setState("ready");
                setReset(reset + 1);
                setCopyStatus("");
              }}
              title="Сбросить локальные данные примера"
            >
              Сбросить
            </button>
          </div>
        </div>
        {entry.states.length > 1 && (
          <div
            className="s-preview-states"
            role="group"
            aria-label="Состояние SaaS-примера"
          >
            {entry.states.map((value) => (
              <button
                type="button"
                key={value}
                aria-pressed={displayState === value}
                onClick={() => setState(value)}
              >
                {saasStates[value]}
              </button>
            ))}
          </div>
        )}
        <div className="s-preview-canvas">
          <div className="s-preview-device" data-width={width}>
            <div className="saas-scope" data-tone={previewTone}>
              <Pattern
                key={`${entry.id}-${displayState}-${reset}`}
                state={displayState}
              />
            </div>
          </div>
        </div>
        <div className="s-preview-tip">
          <strong>Попробуйте</strong>
          <p>{entry.tryIt}</p>
        </div>
      </section>
      <section id="saas-usage" className="s-usage-documentation">
        <div>
          <h3>Правила использования</h3>
          <ul>
            {entry.rules.map((rule) => (
              <li key={rule}>
                <span aria-hidden="true">✓</span>
                {rule}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Не допускайте</h3>
          <ul>
            {entry.avoid.map((rule) => (
              <li key={rule}>
                <span aria-hidden="true">−</span>
                {rule}
              </li>
            ))}
          </ul>
          <div className="s-doc-note">
            Демо использует английские подписи продукта. При локализации
            сохраняйте смысл действий и проверяйте длинные строки.
          </div>
        </div>
      </section>
      <section id="saas-code" className="s-code-documentation">
        <header>
          <div>
            <h3>Код и передача</h3>
            <p>
              Готовый автономный пример. Путь импорта указан относительно папки
              src/.
            </p>
          </div>
          <button
            type="button"
            aria-expanded={codeOpen}
            onClick={() => setCodeOpen(!codeOpen)}
          >
            {codeOpen ? "Скрыть код" : "Показать код"}
            <Icon name="chevron" />
          </button>
        </header>
        {codeOpen && (
          <pre>
            <code>{code}</code>
          </pre>
        )}
        <div className="s-code-actions">
          <button
            type="button"
            onClick={() => void copy(code, "Код примера скопирован.")}
          >
            <Icon name="copy" />
            Скопировать код
          </button>
          <button
            type="button"
            onClick={() =>
              void copy(
                `${window.location.origin}${window.location.pathname}#saas/${entry.id}`,
                "Ссылка на паттерн скопирована.",
              )
            }
          >
            <Icon name="external" />
            Скопировать ссылку
          </button>
        </div>
        {copyStatus && (
          <p className="s-copy-status" role="status">
            {copyStatus}
          </p>
        )}
        <p className="s-code-explanation">
          Пример содержит локальные данные и состояния. Для продукта используйте
          общие контролы из <code>src/saas/primitives.tsx</code> и подключайте
          данные через слой приложения. Стили ограничены классом{" "}
          <code>saas-scope</code>.
        </p>
      </section>
      <section id="saas-source" className="s-source-documentation">
        <div>
          <span className="s-library-kicker">ИСТОЧНИК В ПРОДУКТЕ</span>
          <a
            href={`${saasSourceBase}${entry.source}`}
            target="_blank"
            rel="noreferrer"
          >
            <code>{entry.source}</code>
            <Icon name="external" />
          </a>
          <p>Сверено с Assaasdev · 7cb2bcf · 25 октября 2026.</p>
        </div>
        <a
          href={`${import.meta.env.BASE_URL}tokens/saas.tokens.json`}
          download
          className="s-token-download"
        >
          Токены SaaS
          <Icon name="down" />
        </a>
      </section>
      <nav className="s-related-patterns" aria-label="Другие SaaS-паттерны">
        {saasCatalog
          .filter((item) => item.id !== "overview" && item.id !== entry.id)
          .slice(0, 4)
          .map((item) => (
            <a href={`#saas/${item.id}`} key={item.id}>
              {item.title}
              <Icon name="arrow" />
            </a>
          ))}
      </nav>
      <div className="saas-scope s-integration-small" data-tone={tone}>
        <SaasButton
          variant="ghost"
          onClick={() => {
            window.location.hash = "#saas/overview";
          }}
        >
          К обзору SaaS
          <Icon name="arrow" />
        </SaasButton>
      </div>
    </article>
  );
}
