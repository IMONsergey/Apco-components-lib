import { Icon } from "../components/ui/Icon";
import "../styles/client-guides.css";

const foundations = [
  {
    title: "Цвета",
    description: "Роли цветов в двух темах",
    route: "#foundations/colors",
    symbol: "color",
  },
  {
    title: "Типографика",
    description: "Заголовки, интерфейс и данные",
    route: "#foundations/typography",
    symbol: "type",
  },
  {
    title: "Иконки",
    description: "Поиск, размеры и копирование",
    route: "#icons",
    symbol: "icon",
  },
  {
    title: "Материалы",
    description: "Логотипы, токены и исходники",
    route: "#resources",
    symbol: "asset",
  },
] as const;

export default function Overview() {
  return (
    <div className="client-home">
      <header className="client-home__intro">
        <span className="client-eyebrow">APCOSYS / Сайт + SaaS</span>
        <h1>
          Одна система.
          <br />
          Все детали интерфейса.
        </h1>
        <p>
          Компоненты, состояния и правила для работы над APCOSYS. Найдите нужный
          элемент, попробуйте его в действии и используйте в своём экране.
        </p>
        <div className="client-actions">
          <a className="client-button client-button--primary" href="#start">
            Как пользоваться <Icon name="arrow" />
          </a>
          <a className="client-text-link" href="#resources">
            Скачать материалы <Icon name="down" />
          </a>
        </div>
      </header>
      <section
        className="client-home__products"
        aria-labelledby="home-products"
      >
        <div className="client-section-heading">
          <h2 id="home-products">Выберите контекст</h2>
          <span>Компоненты и живые примеры</span>
        </div>
        <div className="client-product-grid">
          <a className="client-product-card" href="#saas">
            <div className="client-product-card__top">
              <span className="client-eyebrow">Рабочий интерфейс</span>
              <Icon name="arrow" />
            </div>
            <h3>SaaS</h3>
            <p>Поиск, фильтры, таблицы, вход, тарифы и состояния данных.</p>
            <div className="client-product-card__tags">
              <span>Поиск и выдача</span>
              <span>Аккаунт</span>
              <span>Оплата</span>
            </div>
          </a>
          <a className="client-product-card" href="#components">
            <div className="client-product-card__top">
              <span className="client-eyebrow">Маркетинговый сайт</span>
              <Icon name="arrow" />
            </div>
            <h3>Сайт</h3>
            <p>Кнопки, навигация, карточки, анимации и продуктовые сцены.</p>
            <div className="client-product-card__tags">
              <span>Интерфейс</span>
              <span>Анимации</span>
              <span>Иллюстрации</span>
            </div>
          </a>
        </div>
      </section>
      <section className="client-section" aria-labelledby="home-foundations">
        <div className="client-section-heading">
          <h2 id="home-foundations">Основа системы</h2>
          <a className="client-text-link" href="#foundations">
            Все основы <Icon name="arrow" />
          </a>
        </div>
        <div className="client-foundation-grid">
          {foundations.map((item) => (
            <a
              className="client-foundation-link"
              key={item.title}
              href={item.route}
            >
              <span
                className={
                  "client-foundation-mark client-foundation-mark--" +
                  item.symbol
                }
                aria-hidden="true"
              >
                {item.symbol === "type" ? (
                  "Aa"
                ) : item.symbol === "icon" ? (
                  <Icon name="search" />
                ) : item.symbol === "asset" ? (
                  <Icon name="cube" />
                ) : (
                  <>
                    <i />
                    <i />
                    <i />
                  </>
                )}
              </span>
              <strong>{item.title}</strong>
              <span>{item.description}</span>
              <Icon name="arrow" />
            </a>
          ))}
        </div>
      </section>
      <section className="client-section" aria-labelledby="home-tasks">
        <div className="client-section-heading">
          <h2 id="home-tasks">От задачи — к решению</h2>
        </div>
        <div className="client-link-list">
          <a href="#guide/usage">
            <strong>Собрать новый экран</strong>
            <span>Выбрать компоненты и согласовать их поведение</span>
            <Icon name="arrow" />
          </a>
          <a href="#guide/states">
            <strong>Проработать состояния</strong>
            <span>Загрузка, пустой результат, ошибка и ограничение</span>
            <Icon name="arrow" />
          </a>
          <a href="#guide/responsive">
            <strong>Проверить адаптив</strong>
            <span>Десктоп, планшет, телефон и длинный текст</span>
            <Icon name="arrow" />
          </a>
          <a href="#guide/integration">
            <strong>Подключить в проект</strong>
            <span>Исходники, стили, зависимости и структура</span>
            <Icon name="arrow" />
          </a>
        </div>
      </section>
      <p className="client-note client-home__note">
        В библиотеке — примеры интерфейса и взаимодействий на демонстрационных
        данных. Подключение к API, авторизация и обработка платежей выполняются
        в продуктовом приложении.
      </p>
    </div>
  );
}
