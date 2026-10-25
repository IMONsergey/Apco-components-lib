import { useState } from "react";
import { Icon } from "../components/ui/Icon";
import "../styles/client-guides.css";

const paths = {
  designer: {
    label: "Дизайнеру",
    title: "Соберите экран из готовых решений",
    steps: [
      [
        "Начните с контекста",
        "Для рабочего кабинета используйте SaaS-паттерны; для публичных страниц — компоненты сайта.",
      ],
      [
        "Выберите основу",
        "Задайте тему, роли цветов, типографику и сетку. Сохраните геометрию выбранных компонентов.",
      ],
      [
        "Покажите поведение",
        "Подготовьте основные состояния и мобильный вариант, подпишите действия и ограничения.",
      ],
    ],
    link: "#guide/usage",
    action: "Как собрать экран",
  },
  developer: {
    label: "Разработчику",
    title: "Возьмите компонент вместе с его зависимостями",
    steps: [
      [
        "Запустите исходники",
        "Скачайте репозиторий, установите зависимости и откройте библиотеку локально.",
      ],
      [
        "Проверьте контракт",
        "Посмотрите код, параметры, обработчики и требуемые стили на странице компонента.",
      ],
      [
        "Подключите данные",
        "Управляйте состояниями из приложения и проверьте клавиатуру, тему и адаптив.",
      ],
    ],
    link: "#guide/integration",
    action: "Инструкция по подключению",
  },
  reviewer: {
    label: "Менеджеру",
    title: "Согласуйте решение по конкретным примерам",
    steps: [
      [
        "Найдите нужный сценарий",
        "Откройте поиск, выдачу, вход или тарифы и попробуйте доступные действия.",
      ],
      [
        "Проверьте весь путь",
        "Посмотрите, что пользователь увидит до действия, во время ожидания и после ошибки.",
      ],
      [
        "Передайте точную ссылку",
        "Скопируйте адрес страницы компонента и опишите состояние, размер экрана и ожидаемое действие.",
      ],
    ],
    link: "#guide/handoff",
    action: "Проверка перед передачей",
  },
} as const;
type Role = keyof typeof paths;

export default function StartPage() {
  const [role, setRole] = useState<Role>("designer");
  return (
    <article className="client-guide">
      <header className="client-page-heading">
        <span className="client-eyebrow">Начало работы</span>
        <h1>Как пользоваться библиотекой</h1>
        <p>
          Начните с задачи. В каждом разделе есть примеры, которые помогают
          выбрать компонент и договориться о его поведении.
        </p>
      </header>
      <section className="client-section" id="start-route">
        <h2>Ваш маршрут</h2>
        <div
          className="client-role-switch"
          role="group"
          aria-label="Выберите свою роль"
        >
          {(Object.keys(paths) as Role[]).map((key) => (
            <button
              type="button"
              key={key}
              aria-pressed={role === key}
              onClick={() => setRole(key)}
            >
              {paths[key].label}
            </button>
          ))}
        </div>
        <div className="client-role-content" aria-live="polite">
          {(Object.keys(paths) as Role[]).map((key) => (
            <div
              className="client-role-panel"
              key={key}
              data-active={role === key}
              aria-hidden={role !== key}
              inert={role !== key}
            >
              <h3>{paths[key].title}</h3>
              <ol className="client-step-list">
                {paths[key].steps.map(([title, text], index) => (
                  <li key={title}>
                    <span className="client-step-number">0{index + 1}</span>
                    <div>
                      <h4>{title}</h4>
                      <p>{text}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <a className="client-text-link" href={paths[key].link}>
                {paths[key].action} <Icon name="arrow" />
              </a>
            </div>
          ))}
        </div>
      </section>
      <section className="client-section" id="start-find">
        <h2>Найдите нужный элемент</h2>
        <p>
          Глобальный поиск в шапке ищет страницы и компоненты. Откройте его
          через <kbd>⌘ K</kbd> или <kbd>Ctrl K</kbd>. В результатах используйте
          стрелки, <kbd>Enter</kbd> и <kbd>Esc</kbd>.
        </p>
        <div className="client-link-list">
          <a href="#saas/search">
            <strong>Строка поиска и фильтры</strong>
            <span>От запроса к рабочей выдаче</span>
            <Icon name="arrow" />
          </a>
          <a href="#saas/results">
            <strong>Таблица и пагинация</strong>
            <span>Навигация по большому набору данных</span>
            <Icon name="arrow" />
          </a>
          <a href="#components/button">
            <strong>Кнопки сайта</strong>
            <span>Главное и вторичное действие</span>
            <Icon name="arrow" />
          </a>
          <a href="#foundations/colors">
            <strong>Цвета и темы</strong>
            <span>Скопировать HEX или CSS-переменную</span>
            <Icon name="arrow" />
          </a>
        </div>
      </section>
      <section className="client-section" id="start-preview">
        <h2>Попробуйте пример</h2>
        <div className="client-info-grid">
          <div>
            <span className="client-eyebrow">01 / Состояние</span>
            <h3>Проверьте действие</h3>
            <p>
              Введите запрос, переключите вариант, откройте список или измените
              страницу. Рядом с примером описано, что он демонстрирует.
            </p>
          </div>
          <div>
            <span className="client-eyebrow">02 / Контекст</span>
            <h3>Поменяйте условия</h3>
            <p>
              Переключите тему в шапке, посмотрите узкий экран и длинные
              значения. Компактная область предпросмотра помогает оценить
              композицию.
            </p>
          </div>
          <div>
            <span className="client-eyebrow">03 / Использование</span>
            <h3>Возьмите решение</h3>
            <p>
              Скопируйте код и проверьте ссылку на исходник. Сохраните зависимые
              стили, ассеты и параметры компонента.
            </p>
          </div>
        </div>
        <p className="client-note">
          Ширина предпросмотра показывает поведение контейнера. Проверка
          настоящего мобильного окна также нужна: медиазапросы могут зависеть от
          ширины всего браузера.
        </p>
      </section>
      <section className="client-section" id="start-share">
        <h2>Передайте решение команде</h2>
        <p>
          Для обсуждения достаточно ссылки на страницу и короткого описания.
          Укажите тему, устройство, состояние и нужный результат — так решение
          можно воспроизвести.
        </p>
        <div className="client-example-note">
          <span className="client-eyebrow">Пример задачи</span>
          <p>
            «На экране поиска используем{" "}
            <a href="#saas/results">таблицу результатов</a>. Нужны загрузка,
            пустая выдача и ошибка с повтором. На телефоне сохраняем IP, статус
            и переход к объекту. Тема — светлая и тёмная».
          </p>
        </div>
        <div className="client-actions">
          <a className="client-button" href="#guide/handoff">
            Открыть чек-лист <Icon name="arrow" />
          </a>
          <a className="client-text-link" href="#resources">
            Материалы для передачи <Icon name="down" />
          </a>
        </div>
      </section>
    </article>
  );
}
