import { useEffect, useMemo, useRef, useState } from "react";
import {
  Menu,
  X,
  Search,
  Check,
  Plus,
  Minus,
  ArrowRight,
  ArrowDown,
} from "lucide";
import { MorphIcon } from "morphicons/react";
import { Icon, type IconName } from "../components/ui/Icon";
import { LibraryIcon } from "../components/system/LibraryIcon";
import registry from "../generated/icon-manifest.json";
import "../styles/client-guides.css";

type Family = "apcosys" | "feather" | "phosphor";
type IconChoice = { family: Family; name: string };
const native: IconName[] = [
  "arrow",
  "down",
  "chevron",
  "search",
  "plus",
  "minus",
  "close",
  "menu",
  "previous",
  "external",
  "focus",
  "database",
  "scanner",
  "cube",
  "book",
  "bookmark",
  "appearance",
  "play",
  "pause",
  "copy",
];
const families: { key: Family; label: string; notes: string }[] = [
  {
    key: "apcosys",
    label: "APCOSYS",
    notes: "Сетка 16 px · линия 1.5 px · исходные иконки сайта",
  },
  {
    key: "feather",
    label: "Feather",
    notes: "Сетка 24 px · контурные иконки · настраиваемая линия",
  },
  {
    key: "phosphor",
    label: "Phosphor",
    notes: "Исходная сетка 256 px · Regular · геометрия с заливкой",
  },
];
const spriteBaseUrl = import.meta.env.BASE_URL + "icons/";
const all: Record<Family, readonly string[]> = {
  apcosys: native,
  feather: registry.feather,
  phosphor: registry.phosphor,
};
const aliases: Record<string, string[]> = {
  поиск: ["search", "magnifying-glass"],
  стрелка: ["arrow", "chevron", "caret"],
  закрыть: ["close", "x"],
  меню: ["menu", "list"],
  пользователь: ["user", "users", "person"],
  аккаунт: ["user", "person"],
  настройки: ["settings", "gear", "sliders"],
  фильтр: ["filter", "funnel", "sliders"],
  загрузка: ["download", "upload", "loader"],
  скачать: ["download"],
  добавить: ["plus"],
  удалить: ["trash", "delete", "x"],
  копировать: ["copy", "clipboard"],
  время: ["clock", "timer", "hourglass"],
  календарь: ["calendar"],
  файл: ["file", "document"],
  папка: ["folder"],
  безопасность: ["shield", "lock", "key"],
  письмо: ["mail", "envelope"],
  уведомление: ["bell"],
  ссылка: ["link", "external"],
  тема: ["sun", "moon", "appearance"],
  данные: ["database", "server", "hard-drive"],
  сеть: ["network", "globe", "wifi"],
  избранное: ["star", "heart", "bookmark"],
};
const spriteCache = new Map<Family, Promise<Document>>();
function defaultIcon(family: Family): IconChoice {
  return {
    family,
    name: family === "phosphor" ? "magnifying-glass" : "search",
  };
}

async function standaloneSvg(rendered: SVGSVGElement, choice: IconChoice) {
  const clone = rendered.cloneNode(true) as SVGSVGElement;
  if (choice.family !== "apcosys") {
    let sprite = spriteCache.get(choice.family);
    if (!sprite) {
      sprite = fetch(spriteBaseUrl + choice.family + ".svg")
        .then((response) => {
          if (!response.ok) throw new Error("SVG sprite is unavailable");
          return response.text();
        })
        .then((source) =>
          new DOMParser().parseFromString(source, "image/svg+xml"),
        );
      spriteCache.set(choice.family, sprite);
    }
    let document: Document;
    try {
      document = await sprite;
    } catch (error) {
      spriteCache.delete(choice.family);
      throw error;
    }
    const symbol = document.getElementById(choice.family + "-" + choice.name);
    if (!symbol) throw new Error("Icon is missing from its sprite");
    clone.replaceChildren(
      ...Array.from(symbol.childNodes, (node) => node.cloneNode(true)),
    );
    clone.setAttribute(
      "viewBox",
      symbol.getAttribute("viewBox") ||
        clone.getAttribute("viewBox") ||
        "0 0 24 24",
    );
  }
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clone.setAttribute("color", "#121314");
  clone.removeAttribute("aria-hidden");
  clone.removeAttribute("focusable");
  clone.removeAttribute("class");
  return new XMLSerializer().serializeToString(clone);
}

function MorphPairs() {
  const pairs = [
    { name: "Меню / закрыть", a: Menu, b: X },
    { name: "Поиск / готово", a: Search, b: Check },
    { name: "Развернуть / свернуть", a: Plus, b: Minus },
    { name: "Направление", a: ArrowRight, b: ArrowDown },
  ] as const;
  const [states, setStates] = useState([false, false, false, false]);
  const [spring, setSpring] = useState<"smooth" | "snappy" | "bouncy">(
    "smooth",
  );
  const [status, setStatus] = useState("");
  const [manual, setManual] = useState(false);
  const code =
    'import { MorphIcon } from "morphicons/react";\nimport { Menu, X } from "lucide";\n\n<MorphIcon icon={open ? X : Menu} size={24} strokeWidth={1.5} reducedMotion="user" />';
  return (
    <section className="ds-morph-panel">
      <div className="ds-section-bar">
        <div>
          <h2>Morphicons</h2>
          <p>Переход между состояниями иконки. Нажмите на пример.</p>
        </div>
        <a href="https://www.morphicons.com/" target="_blank" rel="noreferrer">
          morphicons.com <Icon name="external" />
        </a>
      </div>
      <div className="ds-morph-top">
        <span className="ds-label">Характер движения</span>
        <div className="ds-toggle-row">
          {(["smooth", "snappy", "bouncy"] as const).map((p) => (
            <button
              type="button"
              key={p}
              data-active={spring === p}
              aria-pressed={spring === p}
              onClick={() => setSpring(p)}
            >
              {{ smooth: "Плавный", snappy: "Быстрый", bouncy: "Пружинный" }[p]}
            </button>
          ))}
        </div>
      </div>
      <div className="ds-morph-grid">
        {pairs.map((pair, i) => (
          <button
            type="button"
            className="ds-morph-card"
            key={pair.name}
            aria-pressed={states[i] ?? false}
            onClick={() =>
              setStates((s) => s.map((v, j) => (j === i ? !v : v)))
            }
          >
            <MorphIcon
              icon={(states[i] ?? false) ? pair.b : pair.a}
              spring={spring}
              strokeWidth={1.5}
              size={32}
              reducedMotion="user"
            />
            <span>{pair.name}</span>
          </button>
        ))}
      </div>
      <div className="ds-code-line">
        <code>{'import { MorphIcon } from "morphicons/react";'}</code>
        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(code);
              setStatus("Код скопирован");
              setManual(false);
            } catch {
              setStatus("Выделите и скопируйте код вручную");
              setManual(true);
            }
          }}
        >
          Копировать
        </button>
      </div>
      <p className="ds-copy-feedback" role="status">
        {status}
      </p>
      {manual && (
        <textarea
          className="ds-icon-export-text"
          readOnly
          aria-label="Код Morphicons"
          value={code}
          onFocus={(e) => e.currentTarget.select()}
        />
      )}
      <p className="ds-caption">
        Morphicons анимирует смену геометрии; исходные формы в примере даёт
        Lucide. Используйте переход для понятной смены состояния и учитывайте
        системное уменьшение движения.
      </p>
    </section>
  );
}

export default function IconsPage({
  initialFamily,
}: {
  initialFamily?: string;
}) {
  const [family, setFamily] = useState<Family>("apcosys");
  const [search, setSearch] = useState("");
  const [size, setSize] = useState(24);
  const [stroke, setStroke] = useState(1.5);
  const [limit, setLimit] = useState(72);
  const [selected, setSelected] = useState<IconChoice>(defaultIcon("apcosys"));
  const [copied, setCopied] = useState<string | null>(null);
  const [copyFallback, setCopyFallback] = useState<IconChoice | null>(null);
  const [exportStatus, setExportStatus] = useState("");
  const [manualSource, setManualSource] = useState("");
  const [exporting, setExporting] = useState(false);
  const selectedPreview = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const [requestedFamily, requestedIcon] = initialFamily?.split("/") ?? [];
    const nextFamily: Family =
      requestedFamily === "feather" ||
      requestedFamily === "phosphor" ||
      requestedFamily === "apcosys"
        ? requestedFamily
        : "apcosys";
    const valid = Boolean(
      requestedIcon && all[nextFamily].includes(requestedIcon),
    );
    setFamily(nextFamily);
    setLimit(72);
    setSelected(
      valid
        ? { family: nextFamily, name: requestedIcon! }
        : defaultIcon(nextFamily),
    );
    setCopied(null);
    setCopyFallback(null);
    setExportStatus("");
    setManualSource("");
    setSearch(valid ? requestedIcon! : "");
  }, [initialFamily]);
  const names = useMemo(() => {
    const query = search.trim().toLowerCase();
    const alternatives =
      query.length > 1
        ? Object.entries(aliases)
            .filter(([word]) => word.includes(query) || query.includes(word))
            .flatMap(([, terms]) => terms)
        : [];
    return all[family].filter(
      (name) =>
        name.toLowerCase().includes(query) ||
        alternatives.some((term) => name.includes(term)),
    );
  }, [family, search]);
  const visible = names.slice(0, limit);
  const sourceCode = (item: IconChoice) =>
    item.family === "apcosys"
      ? `<Icon name="${item.name}" width={${size}} height={${size}} strokeWidth={${stroke}} />`
      : `<LibraryIcon family="${item.family}" name="${item.name}" size={${size}}${item.family === "feather" ? ` stroke={${stroke}}` : ""} />`;
  async function exportIcon(action: "copy" | "download") {
    const svg = selectedPreview.current?.querySelector("svg");
    if (!svg || exporting) return;
    setExporting(true);
    setExportStatus("");
    setManualSource("");
    try {
      const source = await standaloneSvg(svg, selected);
      if (action === "download") {
        const url = URL.createObjectURL(
          new Blob([source], { type: "image/svg+xml" }),
        );
        const link = document.createElement("a");
        link.href = url;
        link.download = `${selected.family}-${selected.name}.svg`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        setExportStatus("SVG подготовлен для скачивания.");
      } else {
        try {
          await navigator.clipboard.writeText(source);
          setExportStatus("SVG скопирован.");
        } catch {
          setManualSource(source);
          setExportStatus(
            "Буфер обмена недоступен. Скопируйте SVG из поля ниже или скачайте файл.",
          );
        }
      }
    } catch {
      setExportStatus(
        "Не удалось получить SVG. Повторите загрузку или используйте JSX.",
      );
    } finally {
      setExporting(false);
    }
  }
  return (
    <div className="ds-icons-page">
      <div id="docs-icon-library" className="ds-section-bar">
        <h2>Каталог иконок</h2>
        <span className="ds-label" role="status" aria-live="polite">
          {copied
            ? "Код скопирован · " + copied.split("/")[1]
            : "Нажмите на иконку, чтобы скопировать JSX"}
        </span>
      </div>
      <div className="ds-icon-toolbar">
        <div className="ds-toggle-row">
          {families.map((f) => (
            <button
              key={f.key}
              type="button"
              data-active={family === f.key}
              aria-pressed={family === f.key}
              onClick={() => {
                setFamily(f.key);
                setSelected(defaultIcon(f.key));
                setCopied(null);
                setCopyFallback(null);
                setExportStatus("");
                setManualSource("");
                setSearch("");
                setLimit(72);
              }}
            >
              {f.label}
              <small>{all[f.key].length}</small>
            </button>
          ))}
        </div>
        <input
          type="search"
          aria-label="Поиск иконок"
          placeholder="Поиск, стрелка, filter…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setLimit(72);
          }}
        />
      </div>
      <div id="docs-icon-options" className="ds-icon-settings">
        <div className="ds-icon-options">
          <span>{families.find((f) => f.key === family)?.notes}</span>
          <div
            className="ds-icon-option-group"
            role="group"
            aria-label="Размер иконки"
          >
            <span>Размер</span>
            {[16, 20, 24, 32].map((value) => (
              <button
                type="button"
                key={value}
                aria-pressed={size === value}
                onClick={() => setSize(value)}
              >
                {value}
              </button>
            ))}
          </div>
          <div
            className="ds-icon-option-group"
            role="group"
            aria-label="Толщина линии иконки"
          >
            <span>Линия</span>
            {[1, 1.5, 2].map((value) => (
              <button
                type="button"
                key={value}
                aria-pressed={stroke === value}
                disabled={family === "phosphor"}
                onClick={() => setStroke(value)}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      </div>
      <section
        className="ds-icon-export"
        aria-labelledby="docs-icon-selected-heading"
      >
        <div ref={selectedPreview} className="ds-icon-export__preview">
          <LibraryIcon
            family={selected.family}
            name={selected.name}
            size={size}
            stroke={stroke}
            spriteBaseUrl={spriteBaseUrl}
          />
        </div>
        <div className="ds-icon-export__body">
          <h3 id="docs-icon-selected-heading">
            {selected.name}
            <span>{selected.family}</span>
          </h3>
          <pre tabIndex={0}>
            <code>{sourceCode(selected)}</code>
          </pre>
          <div className="ds-icon-export__actions">
            <button
              type="button"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(sourceCode(selected));
                  setCopied(selected.family + "/" + selected.name);
                  setExportStatus("JSX скопирован.");
                  setManualSource("");
                } catch {
                  setManualSource(sourceCode(selected));
                  setExportStatus("Выделите код и скопируйте вручную.");
                }
              }}
            >
              Копировать JSX <Icon name="copy" />
            </button>
            <button
              type="button"
              disabled={exporting}
              onClick={() => void exportIcon("copy")}
            >
              Копировать SVG <Icon name="copy" />
            </button>
            <button
              type="button"
              disabled={exporting}
              onClick={() => void exportIcon("download")}
            >
              Скачать SVG <Icon name="down" />
            </button>
          </div>
          <p className="ds-icon-export__status" role="status">
            {exportStatus ||
              "SVG содержит самостоятельную геометрию на прозрачном фоне. JSX использует компонент библиотеки."}
          </p>
          {manualSource && (
            <textarea
              className="ds-icon-export-text"
              readOnly
              aria-label="Код выбранной иконки для копирования"
              value={manualSource}
              onFocus={(e) => e.currentTarget.select()}
            />
          )}
        </div>
      </section>
      <div
        className="ds-icon-catalog"
        role="group"
        aria-label={"Иконки " + family}
      >
        {visible.map((name) => (
          <div className="ds-icon-cell" key={name}>
            <button
              type="button"
              className="ds-icon-tile"
              data-selected={
                selected.family === family && selected.name === name
              }
              data-copied={copied === family + "/" + name}
              aria-label={name}
              title={"Скопировать код " + name}
              onClick={async () => {
                setSelected({ family, name });
                setExportStatus("");
                setManualSource("");
                try {
                  await navigator.clipboard.writeText(
                    sourceCode({ family, name }),
                  );
                  setCopied(family + "/" + name);
                  setCopyFallback(null);
                } catch {
                  setCopied(null);
                  setCopyFallback({ family, name });
                }
              }}
            >
              <LibraryIcon
                family={family}
                name={name}
                size={size}
                stroke={stroke}
                spriteBaseUrl={spriteBaseUrl}
              />
              <span>{name}</span>
            </button>
            {copyFallback?.family === family && copyFallback.name === name && (
              <div className="ds-icon-copy-fallback" role="status">
                <span>Буфер недоступен. Выделите код:</span>
                <input
                  readOnly
                  aria-label="JSX-код иконки"
                  value={sourceCode({ family, name })}
                  onFocus={(e) => e.currentTarget.select()}
                  onClick={(e) => e.currentTarget.select()}
                />
                <button
                  type="button"
                  onClick={() => setCopyFallback(null)}
                  aria-label="Закрыть поле копирования"
                >
                  <Icon name="close" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      {names.length === 0 && (
        <div className="ds-caption ds-empty">
          Иконки не найдены.
          <button type="button" onClick={() => setSearch("")}>
            Очистить поиск
          </button>
        </div>
      )}
      {names.length > limit && (
        <button
          className="ds-load-more"
          type="button"
          onClick={() => setLimit((v) => v + 72)}
        >
          Показать ещё · осталось {names.length - limit}
        </button>
      )}
      <p className="ds-caption ds-icons-source-note">
        Для разработки импортируйте Icon или LibraryIcon из исходников. Для
        Feather и Phosphor также нужны локальные SVG-спрайты —{" "}
        <a href="#guide/integration">инструкция по подключению</a>.
      </p>
      <section className="ds-icon-reference" id="docs-icon-states">
        <div className="ds-icon-states">
          <div className="ds-section-bar">
            <div>
              <h2>Состояния</h2>
              <p>
                Цвет связан с назначением. Геометрия и толщина линии остаются
                согласованными.
              </p>
            </div>
          </div>
          <div className="ds-state-grid">
            {(
              ["Default", "Hover", "Active", "Disabled", "Inverse"] as const
            ).map((state, i) => (
              <div
                className={
                  "ds-icon-state ds-icon-state--" + state.toLowerCase()
                }
                key={state}
              >
                <LibraryIcon
                  family={family}
                  name={family === "phosphor" ? "magnifying-glass" : "search"}
                  size={24}
                  stroke={1.5}
                  spriteBaseUrl={spriteBaseUrl}
                />
                <span>
                  {
                    [
                      "Обычное",
                      "Наведение",
                      "Активное",
                      "Недоступно",
                      "На тёмном",
                    ][i]
                  }
                </span>
                <code>
                  {
                    [
                      "--ink",
                      "--action-hover",
                      "--action",
                      "--muted",
                      "--white",
                    ][i]
                  }
                </code>
              </div>
            ))}
          </div>
          <p className="ds-caption">
            Phosphor Regular использует готовую геометрию с заливкой — настройка
            линии к нему не применяется. В одной панели действий сохраняйте
            единое семейство, размер и визуальный вес. Состояние недоступности
            задаёт сам контрол, а не иконка.
          </p>
        </div>
      </section>
      <section
        className="ds-icon-reference ds-icon-reference--morph"
        id="docs-icon-morph"
      >
        <MorphPairs />
      </section>
    </div>
  );
}
