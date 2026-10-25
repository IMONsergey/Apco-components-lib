import { useEffect, useRef, useState } from "react";
import { Icon } from "../components/ui/Icon";
import "../styles/client-guides.css";

const topics = [
  {
    id: "usage",
    title: "Сборка экрана",
    description: "Контекст, композиция и поведение компонентов",
  },
  {
    id: "states",
    title: "Состояния",
    description: "Что показывать до действия, во время него и после",
  },
  {
    id: "responsive",
    title: "Адаптив и темы",
    description: "Узкие экраны, длинный текст и две темы",
  },
  {
    id: "accessibility",
    title: "Доступность",
    description: "Клавиатура, фокус и понятная обратная связь",
  },
  {
    id: "integration",
    title: "Подключение",
    description: "Исходники, CSS, ассеты и границы компонентов",
  },
  {
    id: "handoff",
    title: "Передача в работу",
    description: "Короткий чек-лист для команды",
  },
] as const;
const checklist = [
  "У экрана есть понятная задача и основное действие.",
  "Использованы готовые компоненты и цветовые роли системы.",
  "Показаны загрузка, пустой результат, ошибка и восстановление.",
  "Длинные названия, адреса и русский текст помещаются в интерфейс.",
  "Светлая и тёмная тема проверены на реальном фоне.",
  "Мобильная ширина и увеличение текста сохраняют доступ к действиям.",
  "Клавиатурный фокус виден, диалог возвращает его к источнику.",
  "Состояния API и правила доступа согласованы с разработчиком.",
  "Переданы ссылки на компоненты и зафиксирована версия исходников.",
] as const;

function CodeExample({ label, code }: { label: string; code: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "manual">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  async function copy() {
    clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(code);
      setStatus("copied");
      timer.current = setTimeout(() => setStatus("idle"), 2400);
    } catch {
      setStatus("manual");
    }
  }
  return (
    <div className="client-code">
      <div className="client-code__heading">
        <strong>{label}</strong>
        <button type="button" onClick={() => void copy()}>
          {status === "copied" ? "Скопировано" : "Копировать"}
          <Icon name="copy" />
        </button>
      </div>
      <pre tabIndex={0} aria-label={label}>
        <code>{code}</code>
      </pre>
      {status !== "idle" && (
        <p className="client-copy-status" role="status">
          {status === "copied"
            ? "Код скопирован в буфер обмена."
            : "Буфер обмена недоступен. Выделите код и скопируйте его вручную."}
        </p>
      )}
    </div>
  );
}

function HandoffChecklist() {
  const [checked, setChecked] = useState<number[]>(() => {
    try {
      const saved: unknown = JSON.parse(
        localStorage.getItem("apcosys-library-handoff") || "[]",
      );
      return Array.isArray(saved)
        ? [
            ...new Set(
              saved.filter(
                (n): n is number =>
                  Number.isInteger(n) && n >= 0 && n < checklist.length,
              ),
            ),
          ]
        : [];
    } catch {
      return [];
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem("apcosys-library-handoff", JSON.stringify(checked));
    } catch {
      /* Optional local persistence. */
    }
  }, [checked]);
  return (
    <div className="client-checklist">
      <div className="client-checklist__summary">
        <span role="status">
          Отмечено {checked.length} из {checklist.length}
        </span>
        <button
          type="button"
          disabled={!checked.length}
          onClick={() => setChecked([])}
        >
          Сбросить отметки
        </button>
      </div>
      <div className="client-checklist__items">
        {checklist.map((label, index) => (
          <label key={label}>
            <input
              type="checkbox"
              checked={checked.includes(index)}
              onChange={(event) =>
                setChecked((previous) =>
                  event.target.checked
                    ? [...previous, index]
                    : previous.filter((n) => n !== index),
                )
              }
            />
            <span>{label}</span>
          </label>
        ))}
      </div>
      <p className="client-note">
        Отметки сохраняются в этом браузере. Этот список помогает провести
        проверку; итоговую приёмку фиксирует команда проекта.
      </p>
    </div>
  );
}

function Usage() {
  return (
    <>
      <p>
        Определите, что человек хочет сделать на экране. Выберите компонент по
        задаче и контексту, затем добавьте реальные данные и состояния.
      </p>
      <ol className="client-step-list">
        <li>
          <span className="client-step-number">01</span>
          <div>
            <h3>Выберите тип экрана</h3>
            <p>
              Публичная страница объясняет продукт и ведёт к действию. Рабочий
              кабинет помогает искать, сравнивать и управлять данными.
              Используйте соответствующий раздел библиотеки.
            </p>
          </div>
        </li>
        <li>
          <span className="client-step-number">02</span>
          <div>
            <h3>Постройте иерархию</h3>
            <p>
              Сначала заголовок и главное действие. Затем контекст, фильтры и
              данные. История и вспомогательные функции должны оставаться
              доступными и не перетягивать внимание с задачи.
            </p>
          </div>
        </li>
        <li>
          <span className="client-step-number">03</span>
          <div>
            <h3>Задайте поведение</h3>
            <p>
              Для каждого действия опишите входные данные, ожидание, успешный
              результат и способ исправить ошибку. Одинаковые действия должны
              выглядеть и называться одинаково.
            </p>
          </div>
        </li>
      </ol>
      <div className="client-example-note">
        <span className="client-eyebrow">Рецепт / Поиск</span>
        <h3>Запрос → фильтры → результаты → объект</h3>
        <p>
          Строка поиска сохраняет запрос. Фильтры располагаются слева на широком
          экране. Выбранные условия видны рядом с выдачей. Строка таблицы
          открывает объект, возврат сохраняет контекст.
        </p>
        <div className="client-actions">
          <a className="client-text-link" href="#saas/search">
            Поиск и фильтры <Icon name="arrow" />
          </a>
          <a className="client-text-link" href="#saas/results">
            Таблица результатов <Icon name="arrow" />
          </a>
        </div>
      </div>
      <div className="client-table-wrap" tabIndex={0}>
        <table className="client-table">
          <caption>Выбор формы для данных</caption>
          <thead>
            <tr>
              <th scope="col">Задача</th>
              <th scope="col">Решение</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Сравнить много однородных объектов</th>
              <td>
                Таблица с согласованными колонками, сортировкой и пагинацией.
              </td>
            </tr>
            <tr>
              <th scope="row">Выбрать план или сценарий</th>
              <td>
                Карточки с одинаковой структурой и выровненными действиями.
              </td>
            </tr>
            <tr>
              <th scope="row">Прочитать подробности объекта</th>
              <td>
                Разделы и списки свойств; вкладки объединяют связанные данные.
              </td>
            </tr>
            <tr>
              <th scope="row">Подтвердить важное действие</th>
              <td>
                Короткий диалог с названием объекта, последствием, отменой и
                подтверждением.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

function States() {
  return (
    <>
      <p>
        Состояние объясняет, что произошло и что можно сделать дальше.
        Зарезервируйте место под сообщение, чтобы интерфейс не прыгал при
        обновлении данных.
      </p>
      <div className="client-table-wrap" tabIndex={0}>
        <table className="client-table">
          <caption>Состояния данных и действия пользователя</caption>
          <thead>
            <tr>
              <th scope="col">Состояние</th>
              <th scope="col">Что показать</th>
              <th scope="col">Следующий шаг</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Начало работы</th>
              <td>Назначение раздела, доступный ввод и пример запроса.</td>
              <td>Ввести данные или выбрать пример.</td>
            </tr>
            <tr>
              <th scope="row">Загрузка</th>
              <td>
                Подпись ожидания и индикатор; текущий контекст остаётся на
                месте.
              </td>
              <td>
                Дождаться ответа; отменить, если операция поддерживает отмену.
              </td>
            </tr>
            <tr>
              <th scope="row">Результат</th>
              <td>Данные, применённые условия и доступные действия.</td>
              <td>Открыть объект, уточнить запрос или продолжить работу.</td>
            </tr>
            <tr>
              <th scope="row">Ничего не найдено</th>
              <td>Запрос и пояснение, что подходящих результатов нет.</td>
              <td>Изменить запрос или сбросить фильтры.</td>
            </tr>
            <tr>
              <th scope="row">Ошибка запроса</th>
              <td>
                Понятная причина, сохранённый ввод, возможность повторить.
              </td>
              <td>Исправить поле или повторить загрузку.</td>
            </tr>
            <tr>
              <th scope="row">Недостаточно доступа</th>
              <td>Название ограничения и доступный путь решения.</td>
              <td>
                Войти, выбрать доступный тариф или обратиться к владельцу.
              </td>
            </tr>
            <tr>
              <th scope="row">Неизвестный итог операции</th>
              <td>
                Сообщение о том, что ответ не получен и результат ещё нужно
                проверить.
              </td>
              <td>Обновить статус перед повтором операции.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="client-info-grid client-info-grid--two">
        <div>
          <h3>Состояния элемента</h3>
          <p>
            Обычное, наведение, фокус клавиатуры, нажатие, выбрано, недоступно.
            Для действия с ожиданием добавьте loading и защиту от повторного
            нажатия.
          </p>
        </div>
        <div>
          <h3>Цвет + смысл</h3>
          <p>
            Статус сопровождается подписью или значком. Ошибка поля связана с
            полем; успешное сохранение подтверждается сообщением.
          </p>
        </div>
      </div>
      <p className="client-note">
        Количество страниц показывайте, когда общее число известно. При
        неизвестном общем числе используйте текущую страницу и доступность
        перехода вперёд из ответа источника данных.
      </p>
      <a className="client-text-link" href="#saas/feedback">
        Посмотреть состояния интерфейса <Icon name="arrow" />
      </a>
    </>
  );
}

function Responsive() {
  return (
    <>
      <p>
        Компонент должен работать в доступной ширине и сохранять смысл при смене
        темы. Проверяйте целый сценарий, включая открытый список, ошибку и
        длинные данные.
      </p>
      <div className="client-table-wrap" tabIndex={0}>
        <table className="client-table">
          <caption>Контрольные размеры для ручной проверки</caption>
          <thead>
            <tr>
              <th scope="col">Размер</th>
              <th scope="col">Что проверить</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">360 и 390 px</th>
              <td>
                Одноколоночный поток, доступ к меню и фильтрам, перенос кнопок,
                поля при экранной клавиатуре.
              </td>
            </tr>
            <tr>
              <th scope="row">768 и 1024 px</th>
              <td>
                Переход навигации, ширина панелей, ориентация планшета и работа
                касанием.
              </td>
            </tr>
            <tr>
              <th scope="row">1280 × 720</th>
              <td>
                Низкое окно ноутбука, видимость действий диалога и отсутствие
                обрезанных списков.
              </td>
            </tr>
            <tr>
              <th scope="row">1440 и 1920 px</th>
              <td>
                Иерархия, плотность таблиц и ограниченная ширина текстовых
                колонок.
              </td>
            </tr>
            <tr>
              <th scope="row">Увеличение 200%</th>
              <td>
                Читаемость, переносы и доступ к основному действию без
                наложений.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="client-note">
        Это размеры для проверки, а не новые breakpoint-токены. Точки
        перестроения берите из компонентов; дополнительные размеры проверяйте
        там, где меняется композиция.
      </p>
      <div className="client-info-grid client-info-grid--two">
        <div>
          <h3>Данные на узком экране</h3>
          <p>
            Сохраняйте ключевые свойства и переход к объекту. Широкую таблицу
            прокручивайте внутри её области; сама страница остаётся в ширине
            окна.
          </p>
        </div>
        <div>
          <h3>Текст и локализация</h3>
          <p>
            Проверяйте русские и английские подписи, домены, IPv6 и длинные
            названия. Текст не должен перекрывать стрелку, значок или соседнее
            действие.
          </p>
        </div>
        <div>
          <h3>Две темы</h3>
          <p>
            Используйте семантические роли фона, текста, границы и действия. Для
            логотипа выбирайте подготовленную версию; проверьте всплывающие
            панели и состояние disabled.
          </p>
        </div>
        <div>
          <h3>Стабильная композиция</h3>
          <p>
            Согласуйте высоту соседних вариантов, зарезервируйте место под
            индикаторы и короткие сообщения. Пользователь должен сохранять
            позицию и контекст.
          </p>
        </div>
      </div>
      <div className="client-actions">
        <a className="client-text-link" href="#foundations/layout">
          Размеры и сетка <Icon name="arrow" />
        </a>
        <a className="client-text-link" href="#foundations/colors">
          Цветовые роли <Icon name="arrow" />
        </a>
      </div>
    </>
  );
}

function Accessibility() {
  return (
    <>
      <p>
        Пройдите сценарий с клавиатуры от первого поля до результата. Порядок
        фокуса должен совпадать с порядком действий, а каждое состояние —
        объясняться текстом.
      </p>
      <div className="client-table-wrap" tabIndex={0}>
        <table className="client-table">
          <caption>Поведение с клавиатуры</caption>
          <thead>
            <tr>
              <th scope="col">Элемент</th>
              <th scope="col">Ожидаемое поведение</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Кнопка</th>
              <td>
                <kbd>Tab</kbd> переводит фокус, <kbd>Enter</kbd> или{" "}
                <kbd>Space</kbd> запускает действие. У кнопки с иконкой есть
                доступное название.
              </td>
            </tr>
            <tr>
              <th scope="row">Поле</th>
              <td>
                Видимая подпись связана с вводом. Подсказка и ошибка доступны
                вместе с полем. Placeholder дополняет подпись.
              </td>
            </tr>
            <tr>
              <th scope="row">Выпадающий список</th>
              <td>
                Открывается с клавиатуры, позволяет выбрать вариант стрелками;{" "}
                <kbd>Esc</kbd> закрывает список и сохраняет понятную позицию
                фокуса.
              </td>
            </tr>
            <tr>
              <th scope="row">Диалог</th>
              <td>
                Фокус переходит внутрь, остаётся в диалоге и после закрытия
                возвращается к открывшему его элементу.
              </td>
            </tr>
            <tr>
              <th scope="row">Таблица</th>
              <td>
                Колонки имеют заголовки; действия и направление сортировки
                названы. Порядок чтения соответствует данным.
              </td>
            </tr>
            <tr>
              <th scope="row">Уведомление</th>
              <td>
                Краткий результат доступен для скринридера. Уведомление не
                перехватывает фокус без необходимости.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="client-info-grid client-info-grid--two">
        <div>
          <h3>Фокус остаётся видимым</h3>
          <p>
            Для функциональных контролов сохраняйте focus-visible. Декоративные
            анимационные сцены не должны добавлять лишние остановки клавиатуры.
          </p>
        </div>
        <div>
          <h3>Движение по предпочтению</h3>
          <p>
            Учитывайте prefers-reduced-motion, останавливайте тяжёлую анимацию
            вне экрана. Важная информация остаётся понятной при отключённом
            движении.
          </p>
        </div>
        <div>
          <h3>Контраст на реальном фоне</h3>
          <p>
            Проверьте текст, значки, границы полей и состояния в обеих темах.
            Для мелкого текста ориентир WCAG AA — 4.5:1, для крупного — 3:1.
          </p>
        </div>
        <div>
          <h3>Удобное касание</h3>
          <p>
            Оставляйте достаточную область действия и расстояние между соседними
            контролами. В библиотеке рекомендуемая цель для касания — 44 × 44
            px.
          </p>
        </div>
      </div>
      <p className="client-note">
        Эти правила — критерии проверки конкретного экрана. Подробные
        требования:{" "}
        <a
          href="https://www.w3.org/WAI/WCAG22/quickref/"
          target="_blank"
          rel="noreferrer"
        >
          WCAG 2.2 Quick Reference
        </a>{" "}
        и{" "}
        <a
          href="https://www.w3.org/WAI/ARIA/apg/patterns/"
          target="_blank"
          rel="noreferrer"
        >
          WAI-ARIA Authoring Practices
        </a>
        .
      </p>
    </>
  );
}

function Integration() {
  const install =
    "git clone https://github.com/IMONsergey/Apco-components-lib.git\ncd Apco-components-lib\nnpm ci\nnpm run dev";
  const example =
    "import { DoubleButton } from './components/ui/DoubleButton';\nimport './styles/instrument-sans.css';\nimport './styles/tokens.css';\nimport './styles/theme-page.css';\nimport './styles/source-components.css';\n\nexport function ActionExample() {\n  return <DoubleButton href='/search'>\n    Перейти к поиску\n  </DoubleButton>;\n}";
  return (
    <>
      <p>
        Библиотека распространяется как исходный код React + TypeScript.
        Установите зависимости репозитория, затем перенесите выбранные
        компоненты в проект с их стилями и ассетами.
      </p>
      <h3 className="client-subheading">1. Запустите библиотеку</h3>
      <p>
        Используйте версию Node.js из файла <code>.nvmrc</code>; минимальная
        версия указана в <code>package.json</code>. Команда <code>npm ci</code>{" "}
        устанавливает закреплённые версии и генерирует каталог иконок.
      </p>
      <CodeExample label="Локальный запуск" code={install} />
      <h3 className="client-subheading">2. Выберите способ переноса</h3>
      <div className="client-table-wrap" tabIndex={0}>
        <table className="client-table">
          <caption>Что переносить вместе с компонентом</caption>
          <thead>
            <tr>
              <th scope="col">Часть</th>
              <th scope="col">Расположение и назначение</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Компонент</th>
              <td>
                <code>src/components/</code> и связанные импорты. Указывайте
                исходный путь со страницы примера.
              </td>
            </tr>
            <tr>
              <th scope="row">Анимация</th>
              <td>
                <code>src/visuals/</code>, связанные CSS и runtime-зависимости.
                Для потребителей useMotion нужен MotionProvider.
              </td>
            </tr>
            <tr>
              <th scope="row">Стили</th>
              <td>
                <code>src/styles/</code>: шрифты → базовые токены → тема →
                правила выбранного компонента. Стили оболочки документации
                оставьте в библиотеке.
              </td>
            </tr>
            <tr>
              <th scope="row">Статические файлы</th>
              <td>
                <code>public/fonts</code>, <code>public/assets</code>,{" "}
                <code>public/icons</code>. Проверьте пути при размещении
                приложения во вложенном каталоге.
              </td>
            </tr>
            <tr>
              <th scope="row">Лицензии</th>
              <td>
                <code>THIRD_PARTY_NOTICES.md</code> и уведомления лицензий
                использованных пакетов.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Базовый пример ниже размещается внутри <code>src</code> библиотеки. В
        другом проекте адаптируйте пути, целевой адрес и CSS-слой под его
        структуру.
      </p>
      <CodeExample label="Кнопка и её стили" code={example} />
      <h3 className="client-subheading">3. Подключите окружение</h3>
      <ul className="client-bullet-list">
        <li>
          Тема задаётся атрибутом <code>data-theme="light"</code> или{" "}
          <code>data-theme="dark"</code> на <code>html</code>. Если компонент
          использует собственные SaaS-токены, сохраните область их применения.
        </li>
        <li>
          Проверьте шрифты для каждого языка. Наборы с суффиксом{" "}
          <code>latin</code> покрывают латиницу; для кириллицы нужен
          соответствующий шрифт или согласованный fallback.
        </li>
        <li>
          Для LibraryIcon укажите <code>spriteBaseUrl</code>, если спрайты
          доступны по другому пути. Копирование JSX не переносит SVG-файлы
          автоматически.
        </li>
        <li>
          Обработчики запросов, маршрутизация, права и сохранение данных
          принадлежат приложению. Примеры SaaS в библиотеке используют локальные
          демонстрационные данные.
        </li>
      </ul>
      <h3 className="client-subheading">4. Проверьте сборку</h3>
      <CodeExample
        label="Проверки репозитория"
        code={
          "npm run build\nnpm run test:design-system\n# После установки браузеров Playwright:\nnpm run test:ux"
        }
      />
      <p>
        После переноса повторно проверьте компонент в целевом приложении: его
        глобальные стили, маршруты и данные могут влиять на поведение.
      </p>
    </>
  );
}

function Handoff() {
  return (
    <>
      <p>
        Пройдите список вместе с макетом или реализованным экраном. Отметки
        помогают подготовить конкретное решение к обсуждению и передаче.
      </p>
      <HandoffChecklist />
      <div className="client-example-note">
        <span className="client-eyebrow">Что приложить к задаче</span>
        <p>
          Ссылка на экран · ссылка на компонент · тема и размер окна · сценарий
          пользователя · состояния · ожидаемые действия · версия исходников.
        </p>
      </div>
      <div className="client-actions">
        <a className="client-button" href="#resources">
          Скачать комплект <Icon name="down" />
        </a>
        <a className="client-text-link" href="#saas">
          Открыть SaaS-компоненты <Icon name="arrow" />
        </a>
      </div>
    </>
  );
}

const content = {
  usage: Usage,
  states: States,
  responsive: Responsive,
  accessibility: Accessibility,
  integration: Integration,
  handoff: Handoff,
};

export default function GuidePage({ focus }: { focus?: string }) {
  const selected = topics.find((topic) => topic.id === focus);
  const visible = selected ? [selected] : topics;
  return (
    <article className="client-guide">
      <header className="client-page-heading">
        <span className="client-eyebrow">Правила работы</span>
        <h1>{selected?.title || "От компонента к готовому экрану"}</h1>
        <p>
          {selected?.description ||
            "Практические рекомендации для дизайна, разработки и проверки интерфейсов APCOSYS."}
        </p>
      </header>
      <nav className="client-topic-nav" aria-label="Разделы руководства">
        {topics.map((topic) => (
          <a
            key={topic.id}
            href={"#guide/" + topic.id}
            aria-current={selected?.id === topic.id ? "page" : undefined}
          >
            {topic.title}
          </a>
        ))}
      </nav>
      {visible.map((topic) => {
        const Content = content[topic.id];
        return (
          <section
            className="client-section"
            id={"guide-" + topic.id}
            key={topic.id}
          >
            {!selected && <h2>{topic.title}</h2>}
            <Content />
          </section>
        );
      })}
    </article>
  );
}
