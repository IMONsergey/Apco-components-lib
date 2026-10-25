import { Icon } from "../components/ui/Icon";
import "../styles/client-guides.css";

const base = import.meta.env.BASE_URL;
const resources = [
  {
    title: "Комплект дизайн-системы",
    format: "ZIP",
    path: "downloads/apcosys-design-system.zip",
    description:
      "Исходники компонентов, стили, токены и материалы для передачи в одном архиве.",
    name: "apcosys-design-system.zip",
  },
  {
    title: "Токены сайта",
    format: "JSON",
    path: "tokens/apcosys.tokens.json",
    description: "Цветовые роли для двух тем, типографика, отступы и размеры.",
    name: "apcosys.tokens.json",
  },
  {
    title: "Токены SaaS",
    format: "JSON",
    path: "tokens/saas.tokens.json",
    description: "Семантические роли и значения рабочего интерфейса SaaS.",
    name: "saas.tokens.json",
  },
  {
    title: "Краткая инструкция",
    format: "MD",
    path: "downloads/apcosys-quick-start.md",
    description:
      "Как найти компонент, использовать исходники и проверить экран перед передачей.",
    name: "apcosys-quick-start.md",
  },
] as const;
const assets = [
  { title: "Логотип на светлом", path: "wordmark-light.svg", tone: "light" },
  { title: "Логотип на тёмном", path: "wordmark-dark.svg", tone: "dark" },
  { title: "Знак на светлом", path: "symbol-light.svg", tone: "light" },
  { title: "Знак на тёмном", path: "symbol-dark.svg", tone: "dark" },
] as const;

export default function ResourcesPage() {
  return (
    <article className="client-guide">
      <header className="client-page-heading">
        <span className="client-eyebrow">Материалы</span>
        <h1>Всё для следующего экрана</h1>
        <p>
          Скачайте комплект или отдельные файлы. Для работы с кодом используйте
          репозиторий и инструкцию по подключению.
        </p>
      </header>
      <section className="client-section" id="resources-downloads">
        <h2>Скачать</h2>
        <div className="client-download-list">
          {resources.map((resource) => (
            <a
              className="client-download"
              href={base + resource.path}
              download={resource.name}
              key={resource.path}
            >
              <span className="client-file-format">{resource.format}</span>
              <div>
                <h3>{resource.title}</h3>
                <p>{resource.description}</p>
              </div>
              <Icon name="down" />
            </a>
          ))}
        </div>
        <p className="client-note">
          JSON хранит значения и их назначение. Для оформления интерфейса
          подключите CSS из комплекта; способ импорта JSON в графический
          редактор зависит от используемого инструмента.
        </p>
      </section>
      <section className="client-section" id="resources-brand">
        <div className="client-section-heading">
          <h2>Логотип и знак</h2>
          <a className="client-text-link" href="#foundations/identity">
            Правила использования <Icon name="arrow" />
          </a>
        </div>
        <div className="client-asset-grid">
          {assets.map((asset) => (
            <a
              className="client-asset"
              href={base + "assets/brand/" + asset.path}
              download={asset.path}
              key={asset.path}
            >
              <div
                className={
                  "client-asset__preview client-asset__preview--" + asset.tone
                }
              >
                <img
                  src={base + "assets/brand/" + asset.path}
                  alt={asset.title}
                />
              </div>
              <span>
                {asset.title}
                <small>SVG</small>
                <Icon name="down" />
              </span>
            </a>
          ))}
        </div>
        <p>
          Выбирайте версию под фон, сохраняйте пропорции и оставляйте свободное
          место вокруг знака. Геометрия логотипа хранится в готовых SVG.
        </p>
      </section>
      <section className="client-section" id="resources-sources">
        <h2>Исходники и проекты</h2>
        <div className="client-link-list">
          <a
            href="https://github.com/IMONsergey/Apco-components-lib"
            target="_blank"
            rel="noreferrer"
          >
            <strong>Библиотека компонентов</strong>
            <span>Код, история изменений и инструкция запуска</span>
            <Icon name="external" />
          </a>
          <a
            href="https://github.com/IMONsergey/Assaasdev"
            target="_blank"
            rel="noreferrer"
          >
            <strong>Исходники SaaS</strong>
            <span>Продуктовые страницы и интеграция с данными</span>
            <Icon name="external" />
          </a>
          <a
            href="https://assaasdev.vercel.app/"
            target="_blank"
            rel="noreferrer"
          >
            <strong>Прототип SaaS</strong>
            <span>Полные сценарии в рабочем окружении интерфейса</span>
            <Icon name="external" />
          </a>
          <a
            href="https://imonsergey.github.io/APCOCLEAR2/"
            target="_blank"
            rel="noreferrer"
          >
            <strong>Маркетинговый сайт</strong>
            <span>Публичные страницы в контексте продукта</span>
            <Icon name="external" />
          </a>
        </div>
      </section>
      <section className="client-section" id="resources-adoption">
        <h2>Как использовать комплект</h2>
        <ol className="client-step-list">
          <li>
            <span className="client-step-number">01</span>
            <div>
              <h3>Сохраните версию</h3>
              <p>
                Для передачи в разработку зафиксируйте commit репозитория и дату
                выгрузки. Это поможет воспроизвести нужный вариант.
              </p>
            </div>
          </li>
          <li>
            <span className="client-step-number">02</span>
            <div>
              <h3>Выберите компоненты</h3>
              <p>
                Переносите компонент вместе со связанными стилями, ассетами и
                лицензиями. Точки входа и зависимости указаны в коде и
                инструкции.
              </p>
            </div>
          </li>
          <li>
            <span className="client-step-number">03</span>
            <div>
              <h3>Проверьте в своём окружении</h3>
              <p>
                Подключите данные приложения, затем проверьте темы, клавиатуру,
                длинные значения и мобильную ширину.
              </p>
            </div>
          </li>
        </ol>
        <a className="client-text-link" href="#guide/integration">
          Полная инструкция по подключению <Icon name="arrow" />
        </a>
      </section>
    </article>
  );
}
