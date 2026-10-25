import { useEffect, useRef, useState } from "react";
import { Logo } from "../components/ui/Logo";
import { Icon } from "../components/ui/Icon";
import tokens from "../tokens/apcosys.tokens.json";
import { saasSourceBase } from "../saas/catalog";
import "../styles/client-guides.css";
import "../styles/onest.css";

type Theme = "light" | "dark";
const base = import.meta.env.BASE_URL;
const groups = [
  {
    id: "surfaces",
    name: "Поверхности",
    keys: ["page", "card", "elevated", "strong", "tint"],
  },
  {
    id: "typography",
    name: "Текст и графика",
    keys: ["primary", "body", "muted", "visualInk"],
  },
  {
    id: "brand-actions",
    name: "Бренд и действия",
    keys: ["mark", "accent", "action", "actionHover", "onAction", "api"],
  },
  { id: "borders", name: "Границы", keys: ["subtle", "strongBorder"] },
] as const;
const typeSamples = [
  {
    title: "Крупный заголовок",
    spec: "72–106 px · 500",
    cls: "ds-type-display",
    text: "Internet, understood.",
  },
  {
    title: "Заголовок раздела",
    spec: "48–86 px · 500",
    cls: "ds-type-heading",
    text: "One query. Full context.",
  },
  {
    title: "Основной текст",
    spec: "18 px · 400",
    cls: "ds-type-body",
    text: "Explore every host, network and service.",
  },
  {
    title: "Элементы управления",
    spec: "14 px · 500",
    cls: "ds-type-control",
    text: "Get started",
  },
  {
    title: "Технические данные",
    spec: "14 px · Mono",
    cls: "ds-type-mono",
    text: "93.184.216.34 · 200 OK",
  },
];
const colorLabels: Record<string, string> = {
  page: "Фон страницы",
  card: "Карточки и панели",
  elevated: "Вторичные контролы",
  strong: "Выделенная поверхность",
  tint: "Акцентный фон",
  primary: "Основной текст",
  body: "Текст описаний",
  muted: "Подписи и подсказки",
  visualInk: "Линии иллюстраций",
  mark: "Акцент логотипа",
  accent: "Ссылки",
  action: "Основное действие",
  actionHover: "Наведение на действие",
  onAction: "Текст на кнопках",
  api: "Фон API-иллюстраций",
  subtle: "Разделители",
  strongBorder: "Контрастные границы",
};
const breakpointLabels: Record<string, [string, string]> = {
  "Small mobile": ["Маленький телефон", "Отступ 16 px; базовый H2 36 px"],
  "Compact mobile": ["Компактный телефон", "Отступ 20 px; базовый H2 38 px"],
  Mobile: ["Телефон", "Отступ 24 px; базовый H2 40 px"],
  Tablet: [
    "Планшет",
    "Компактная навигация; число колонок зависит от содержимого",
  ],
  "Small desktop": [
    "Небольшой десктоп",
    "Отступ 32 px; компоненты перестраиваются по ширине",
  ],
  Desktop: ["Десктоп", "Полная навигация и многоколоночные блоки"],
  "Wide desktop": [
    "Широкий десктоп",
    "Согласованная ширина блоков и вертикальный ритм",
  ],
  "Large screens": ["Большой экран", "Плавающий внешний отступ до 80 px"],
};
const radiusLabels: Record<string, string> = {
  control: "Контрол",
  panel: "Панель",
  navigationPanel: "Меню",
};
const motionLabels: Record<string, string> = {
  ease: "Кривая движения",
  hover: "Наведение",
  disclosure: "Раскрытие",
  theme: "Смена темы",
  reducedMotion: "Уменьшение движения",
};
const spaces = tokens.spaces;
const metrics = [
  {
    name: "Ширина контента",
    value: tokens.layout.maxWidth,
    usage: "Максимум основного контейнера сайта",
  },
  {
    name: "Отступы десктопа",
    value: tokens.layout.baseGutter,
    usage: "Стандартное широкое окно",
  },
  {
    name: "Большой экран",
    value: tokens.layout.desktopWideGutter,
    usage: "Ширина окна от 1600 px",
  },
  {
    name: "Отступы телефона",
    value: tokens.layout.mobileGutter,
    usage: "Зависят от ширины окна",
  },
  {
    name: "Высота шапки",
    value: tokens.layout.header,
    usage: "Значение для сайта; SaaS использует свой каркас",
  },
  {
    name: "Между разделами",
    value: tokens.layout.sectionSpace,
    usage: "Вертикальный ритм страницы",
  },
];
const anchors = [
  ["Логотип", "ds-identity"],
  ["Цвета", "ds-colors"],
  ["Шрифты", "ds-type"],
  ["Отступы", "ds-spacing"],
  ["Сетка", "ds-layout"],
  ["Движение", "ds-motion"],
] as const;
const pxVar = (px: number) => "--ds-space-" + px / 4;
const luminance = (hex: string) => {
  const values = (hex.match(/[a-f0-9]{2}/gi) || []).map((part) => {
    const n = parseInt(part, 16) / 255;
    return n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4;
  });
  return (
    0.2126 * (values[0] || 0) +
    0.7152 * (values[1] || 0) +
    0.0722 * (values[2] || 0)
  );
};
const ratio = (a: string, b: string) =>
  (
    (Math.max(luminance(a), luminance(b)) + 0.05) /
    (Math.min(luminance(a), luminance(b)) + 0.05)
  ).toFixed(1);

export default function FoundationsPage({
  tone,
  jumpTo,
}: {
  tone: Theme;
  jumpTo?: string;
}) {
  useEffect(() => {
    if (!jumpTo) return;
    const key: Record<string, string> = {
      identity: "ds-identity",
      colors: "ds-colors",
      typography: "ds-type",
      spacing: "ds-spacing",
      layout: "ds-layout",
      motion: "ds-motion",
    };
    const id = key[jumpTo];
    if (id)
      requestAnimationFrame(() =>
        document
          .getElementById(id)
          ?.scrollIntoView({ block: "start", behavior: "instant" }),
      );
  }, [jumpTo]);
  const heading = (title: string, slug: string) =>
    jumpTo === slug ? (
      <h1 className="ds-focused-title">{title}</h1>
    ) : (
      <h2>{title}</h2>
    );
  const [copied, setCopied] = useState<string | null>(null);
  const [copyFormat, setCopyFormat] = useState<"css" | "hex">("hex");
  const [copyFallback, setCopyFallback] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const copy = async (value: string, key: string) => {
    clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      setCopyFallback("");
      timer.current = setTimeout(() => setCopied(null), 2500);
    } catch {
      setCopied(null);
      setCopyFallback(value);
    }
  };
  return (
    <div
      className="ds-foundations ds-foundations--compact"
      data-focus={jumpTo || undefined}
    >
      <p className="ds-context-note">
        Основа маркетингового сайта. У рабочего интерфейса свои роли цвета,
        плотность и типографика — <a href="#saas">открыть систему SaaS</a>.
      </p>
      <nav className="ds-local-nav" aria-label="Разделы основ">
        {anchors.map(([label, id]) => (
          <button
            type="button"
            key={id}
            onClick={() =>
              document
                .getElementById(id)
                ?.scrollIntoView({
                  behavior: window.matchMedia(
                    "(prefers-reduced-motion: reduce)",
                  ).matches
                    ? "auto"
                    : "smooth",
                  block: "start",
                })
            }
          >
            {label}
          </button>
        ))}
      </nav>

      {(!jumpTo || jumpTo === "identity") && (
        <section className="ds-section" id="ds-identity">
          <div className="ds-section-bar">{heading("Логотип", "identity")}</div>
          <div className="ds-brand-grid">
            <a
              className="ds-brand-sample ds-brand-sample--light"
              href={base + "assets/brand/wordmark-light.svg"}
              target="_blank"
              rel="noreferrer"
              title="Открыть SVG для светлого фона"
            >
              <img
                src={base + "assets/brand/wordmark-light.svg"}
                alt="Логотип APCOSYS для светлого фона"
              />
              <span>
                Светлый фон · SVG <Icon name="external" />
              </span>
            </a>
            <a
              className="ds-brand-sample ds-brand-sample--dark"
              href={base + "assets/brand/wordmark-dark.svg"}
              target="_blank"
              rel="noreferrer"
              title="Открыть SVG для тёмного фона"
            >
              <img
                src={base + "assets/brand/wordmark-dark.svg"}
                alt="Логотип APCOSYS для тёмного фона"
              />
              <span>
                Тёмный фон · SVG <Icon name="external" />
              </span>
            </a>
          </div>
          <div
            className="ds-reference-block ds-identity-details"
            id="ds-symbols"
          >
            <h3>Знак и применение логотипа</h3>
            <div className="ds-identity-extra">
              <div>
                <span>Логотип в интерфейсе</span>
                <Logo />
              </div>
              <a
                href={base + "assets/brand/symbol-light.svg"}
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src={base + "assets/brand/symbol-light.svg"}
                  alt="Знак для светлого фона"
                />
                Светлый фон <Icon name="external" />
              </a>
              <a
                href={base + "assets/brand/symbol-dark.svg"}
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src={base + "assets/brand/symbol-dark.svg"}
                  alt="Знак для тёмного фона"
                />
                Тёмный фон <Icon name="external" />
              </a>
            </div>
            <p className="ds-caption">
              Сохраняйте пропорции SVG и выбирайте версию под фон. Все варианты
              можно скачать в <a href="#resources">материалах</a>.
            </p>
          </div>
        </section>
      )}

      {(!jumpTo || jumpTo === "colors") && (
        <section className="ds-section" id="ds-colors">
          <div className="ds-section-bar">
            {heading("Цвета", "colors")}
            <div className="ds-color-actions">
              <span className="ds-muted-note">
                {tone === "dark" ? "Тёмная" : "Светлая"} тема · нажмите, чтобы
                скопировать
              </span>
              <div
                className="ds-copy-format"
                role="group"
                aria-label="Формат копирования цвета"
              >
                {(["css", "hex"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    aria-pressed={copyFormat === mode}
                    onClick={() => setCopyFormat(mode)}
                  >
                    {mode === "css" ? "CSS-переменная" : "HEX"}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <p className="ds-copy-feedback" role="status" aria-live="polite">
            {copied
              ? `${colorLabels[copied] || copied}: значение скопировано.`
              : "Для интерфейса используйте CSS-переменную; HEX подходит для работы с цветом в макете."}
          </p>
          {copyFallback && (
            <div className="ds-foundation-copy-fallback" role="status">
              <span>Выделите значение и скопируйте вручную:</span>
              <input
                aria-label="Значение цвета для копирования"
                readOnly
                value={copyFallback}
                onFocus={(e) => e.currentTarget.select()}
                onClick={(e) => e.currentTarget.select()}
              />
            </div>
          )}
          {groups.map((group) => (
            <div
              key={group.name}
              className="ds-token-group"
              id={"ds-color-" + group.id}
            >
              <h3>{group.name}</h3>
              <div className="ds-token-list">
                {group.keys.map((key) => {
                  const entry = tokens.colors[key] as {
                    css: string;
                    light: string;
                    dark: string;
                    usage: string;
                  };
                  const value = entry[tone];
                  const copyValue =
                    copyFormat === "css"
                      ? "var(" + entry.css + ")"
                      : value.toUpperCase();
                  return (
                    <button
                      className="ds-token-row"
                      type="button"
                      key={key}
                      title={
                        (colorLabels[key] || key) +
                        " · скопировать " +
                        (copyFormat === "css" ? "CSS-переменную" : "HEX")
                      }
                      onClick={() => void copy(copyValue, key)}
                    >
                      <span
                        className="ds-token-swatch"
                        style={{ backgroundColor: value }}
                      />
                      <span className="ds-token-label">
                        <strong className="ds-token-name">
                          {colorLabels[key] || key}
                        </strong>
                        <code>{entry.css}</code>
                      </span>
                      <span className="ds-token-hex">
                        {value.toUpperCase()}
                      </span>
                      <span className="ds-token-copy">
                        {copied === key ? (
                          <span aria-label="Скопировано">✓</span>
                        ) : (
                          <Icon name="copy" />
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          <a
            className="ds-token-download"
            href={base + "tokens/apcosys.tokens.json"}
            download="apcosys.tokens.json"
          >
            Скачать токены сайта <Icon name="down" />
          </a>
          <div className="ds-reference-block" id="ds-contrast">
            <h3>Контраст</h3>
            <div className="ds-contrast-pair">
              <div
                className="ds-contrast-sample"
                style={{
                  background: tokens.colors.card[tone],
                  color: tokens.colors.primary[tone],
                }}
              >
                <span>Текст / карточка</span>
                <strong>Aa</strong>
                <small>
                  {ratio(tokens.colors.primary[tone], tokens.colors.card[tone])}
                  :1
                </small>
              </div>
              <div
                className="ds-contrast-sample"
                style={{
                  background: tokens.colors.action[tone],
                  color: tokens.colors.onAction[tone],
                }}
              >
                <span>Текст / действие</span>
                <strong>Aa</strong>
                <small>
                  {ratio(
                    tokens.colors.onAction[tone],
                    tokens.colors.action[tone],
                  )}
                  :1
                </small>
              </div>
            </div>
            <p className="ds-caption">
              Расчёт для указанных непрозрачных цветов. Для обычного текста
              ориентир WCAG AA — 4.5:1. Проверьте также подписи, поля и
              состояния — <a href="#guide/accessibility">правила доступности</a>
              .
            </p>
          </div>
        </section>
      )}

      {(!jumpTo || jumpTo === "typography") && (
        <section className="ds-section" id="ds-type">
          <div className="ds-section-bar">
            {heading("Типографика", "typography")}
          </div>
          <p className="ds-muted-note ds-section-subtitle">
            Instrument Sans · IBM Plex Mono
          </p>
          <p className="ds-context-note">
            Базовые роли английской версии сайта. Диапазоны указаны слева;
            образцы уменьшены под ширину документации. Русская версия и SaaS
            используют отдельные правила ниже.
          </p>
          <div className="ds-type-list">
            {typeSamples.map((t) => (
              <div className="ds-type-row" key={t.title}>
                <div>
                  <span className="ds-label">{t.title}</span>
                  <code>{t.spec}</code>
                </div>
                <div className={t.cls}>{t.text}</div>
              </div>
            ))}
          </div>
          <div className="ds-reference-block" id="ds-type-contexts">
            <h3>Шрифты по контексту</h3>
            <div className="client-table-wrap" tabIndex={0}>
              <table className="client-table">
                <caption>
                  Проверено по исходникам проекта, 25 октября 2026
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Контекст</th>
                    <th scope="col">Шрифты</th>
                    <th scope="col">Основные размеры</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">Сайт / EN</th>
                    <td>
                      Instrument Sans — текст и заголовки. IBM Plex Mono — код и
                      технические значения.
                    </td>
                    <td>
                      Крупный заголовок 72–106 px; раздел 48–86 px; текстовая
                      роль 18 px; контрол 14 px.{" "}
                      <a
                        href="https://github.com/IMONsergey/APCOCLEAR2/blob/main/src/styles/type-scale.css"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Роли в CSS
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Сайт / RU</th>
                    <td>
                      Onest — кириллица и заголовки. IBM Plex Mono с
                      кириллическим набором — технические значения.
                    </td>
                    <td>
                      Базовый крупный заголовок 52–82 px; раздел 36–66 px. Для
                      телефона и внутренних страниц есть отдельные размеры.{" "}
                      <a
                        href="https://github.com/IMONsergey/APCOCLEAR2/blob/main/src/styles/russian-type.css"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Правила RU
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">SaaS</th>
                    <td>
                      Inter Variable — интерфейс. Instrument Sans Variable —
                      заголовки с Inter в качестве fallback. IBM Plex Mono —
                      данные.
                    </td>
                    <td>
                      При базовом масштабе: текст и контролы 14 px на десктопе,
                      15 px на телефоне; мобильный ввод от 16 px.{" "}
                      <a
                        href={saasSourceBase + "src/styles.css"}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Типографика SaaS
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="ds-type-locales">
              <div>
                <span>Onest / RU</span>
                <p>Один запрос. Полный контекст.</p>
              </div>
              <div>
                <span>Inter / SaaS</span>
                <p>Поиск по хостам и сервисам</p>
              </div>
              <div>
                <span>IBM Plex Mono / данные</span>
                <p>Записей: 1 248 · 200 OK</p>
              </div>
            </div>
            <p className="ds-caption">
              При переносе подключайте наборы Latin и Cyrillic. Instrument Sans
              сам по себе не покрывает кириллицу: русские строки сайта
              используют Onest, а заголовки SaaS — Inter из цепочки fallback.
              Для длинных переводов проверяйте переносы и ширину кнопок.
            </p>
          </div>
        </section>
      )}

      {(!jumpTo || jumpTo === "spacing") && (
        <section className="ds-section" id="ds-spacing">
          <div className="ds-section-bar">
            {heading("Отступы", "spacing")}
            <span className="ds-muted-note">Шаг 4 px</span>
          </div>
          <div className="ds-spacing-grid" id="ds-spacing-values">
            {spaces.map((n) => (
              <div className="ds-space-row" key={n}>
                <code>{n}px</code>
                <span className="ds-space-bar" style={{ width: n }} />
                <code>{pxVar(n)}</code>
              </div>
            ))}
          </div>
          <div className="ds-reference-block" id="ds-radii">
            <h3>Скругления</h3>
            <div className="ds-radii-grid">
              {Object.entries(tokens.radii).map(([name, size]) => (
                <div key={name}>
                  <div style={{ borderRadius: size }} />
                  <strong>{radiusLabels[name] || name}</strong>
                  <code>{size}</code>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {(!jumpTo || jumpTo === "layout") && (
        <section className="ds-section" id="ds-layout">
          <div className="ds-section-bar">
            {heading("Сетка и размеры", "layout")}
          </div>
          <p className="ds-context-note">
            Основной контейнер маркетингового сайта ограничен 1440 px.
            Внутренние сетки и ширина текста подчиняются задаче раздела; рабочее
            пространство SaaS использует собственную боковую навигацию.
          </p>
          <div className="ds-layout-metrics" id="ds-layout-values">
            {metrics.map((item) => (
              <div key={item.name}>
                <span>{item.name}</span>
                <code>{item.value}</code>
                <small>{item.usage}</small>
              </div>
            ))}
          </div>
          <div className="ds-reference-block" id="ds-breakpoints">
            <h3>Диапазоны ширины</h3>
            <div className="ds-breakpoint-list">
              {tokens.breakpoints.map((b) => (
                <div key={b.label}>
                  <strong>{breakpointLabels[b.label]?.[0] || b.label}</strong>
                  <code>
                    {b.max === null
                      ? b.min + "px+"
                      : b.min + "–" + b.max + "px"}
                  </code>
                  <span>{breakpointLabels[b.label]?.[1] || b.notes}</span>
                </div>
              ))}
            </div>
            <p className="ds-caption">
              Диапазоны помогают проверить исходные правила сайта. Точки
              перестроения конкретного блока могут отличаться. Дополнительно
              проверьте низкое окно 1280 × 720 и масштаб 200% —{" "}
              <a href="#guide/responsive">порядок проверки адаптива</a>.
            </p>
          </div>
        </section>
      )}

      {(!jumpTo || jumpTo === "motion") && (
        <section className="ds-section" id="ds-motion">
          <div className="ds-section-bar">{heading("Движение", "motion")}</div>
          <div className="ds-motion-simple">
            {Object.entries(tokens.motions).map(([name, value]) => (
              <div key={name}>
                <span>{motionLabels[name] || name}</span>
                <code>
                  {name === "reducedMotion"
                    ? "Убирать необязательные переходы и анимацию"
                    : value}
                </code>
              </div>
            ))}
          </div>
          <p className="ds-caption">
            Движение объясняет смену состояния. Сохраняйте геометрию экрана при
            загрузке и смене вкладок; останавливайте тяжёлые сцены вне видимой
            области. Для запроса reduced motion оставляйте статичное понятное
            состояние.
          </p>
          <a className="client-text-link" href="#components/visual">
            Открыть анимационные компоненты <Icon name="arrow" />
          </a>
        </section>
      )}
    </div>
  );
}
