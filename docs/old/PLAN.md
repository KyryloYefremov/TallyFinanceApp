# PLAN.md

## Статус

План одобрен пользователем 2026-05-30.

Разработка идет поэтапно: каждый этап выполняется в отдельной ветке, проверяется тестами/сборкой и закрывается pull request.

## Цель первой версии

Собрать MVP iOS-приложения TallyFinanceApp:

- локальный учет счетов;
- категории внутри счетов;
- быстрый ввод расходов, доходов и переводов;
- история операций;
- настройки валют и ручных курсов;
- Shortcut для открытия Quick Add.

## Принципы разработки

- Сначала работающая простая версия, потом расширения.
- Все финансовые расчеты должны быть централизованы и покрыты тестами.
- SwiftData хранит основные данные, UserDefaults хранит только легкие настройки.
- Никакого сервера, сети, аналитики, авторизации и облака.
- Не добавлять сторонние зависимости без отдельного решения.
- Не делать графики и сложную аналитику в MVP.
- Каждая задача разработки выполняется в отдельной Git-ветке.
- Каждый этап из `PLAN.md` выполняется в своей отдельной ветке, указанной в разделе этапа.
- Каждый набор изменений должен оформляться как pull request, когда будет доступен remote.
- Документация, тесты и описание PR являются частью задачи, а не отдельной необязательной работой.
- Кодовые комментарии, doc comments, module descriptions, commit messages, branch names и PR descriptions пишутся на английском языке.
- Финансовая логика должна иметь тесты и отслеживаемое coverage.

## Этап 0. Git и процесс разработки

Задачи:

- Зафиксировать, что `PLAN.md` одобрен пользователем.
- Проверить текущий `git status`.
- Не трогать пользовательские изменения, если они появились параллельно.
- Проверить, инициализирован ли Git-репозиторий и есть ли remote.
- Если remote отсутствует, подготовить проект так, чтобы его можно было сразу опубликовать на GitHub или другой Git-платформе.
- Добавить `.gitignore` для Xcode/Swift-проекта.
- Исключить из Git generated/user-specific файлы вроде `xcuserdata`.
- Добавить `.github/pull_request_template.md`.
- Опционально добавить `.github/ISSUE_TEMPLATE/` для задач, багов и technical debt.
- Согласовать branch naming:
  - `feature/<short-task-name>`;
  - `fix/<short-bug-name>`;
  - `test/<short-area-name>`;
  - `docs/<short-topic>`;
  - `chore/<short-topic>`.
- Определить базовую ветку:
  - `main` для раннего MVP;
  - `develop` добавить позже, если параллельных задач станет много.
- Зафиксировать правило: каждый этап ниже выполняется в отдельной ветке и закрывается PR summary.

Результат:

- Репозиторий готов к аккуратной разработке через ветки и PR.
- Служебные Xcode-файлы не загрязняют историю.
- Есть шаблон PR с обязательными секциями.

Deliverables:

- `.gitignore` с правилами для Xcode/Swift и `xcuserdata`.
- `.github/pull_request_template.md`.
- Remote repository подключен к локальному проекту, если доступен.
- Первый baseline commit запушен в `main`.
- В документации зафиксировано правило: одна ветка на один этап плана.

Проверка:

- `git status` показывает только ожидаемые изменения.
- `.gitignore` покрывает Xcode user data.
- PR template содержит секции `Summary`, `Why`, `Tests`, `Screenshots/Notes`, `Risks`.
- `git remote -v` показывает ожидаемый `origin`.
- `main` отслеживает `origin/main` после первого push.

## Этап 1. Подготовка Xcode-проекта (готово)

Ветка:

- `chore/project-setup`

Задачи:

- Привести deployment target к iOS `17.0`.
- Проверить, есть ли test target. Если нет, решить, добавлять его сразу или после базовой модели.
- Включить или подготовить code coverage для test scheme.
- Проверить, что проект собирается после изменения deployment target.

Результат:

- Проект готов к реализации под iOS 17+.
- Документация отражает старт работ и выбранные настройки тестирования.

Deliverables:

- Xcode deployment target установлен на `17.0`.
- Test target создан или явно задокументировано, почему он будет добавлен следующим этапом.
- Scheme настроена или подготовлена для test coverage.
- Проект собирается после изменения настроек.
- PR `chore/project-setup` содержит summary, проверки и notes по Xcode-настройкам.

PR requirements:

- Короткое описание изменения проекта.
- Проверки сборки.
- Обновление `CLAUDE.md`, если обнаружены особенности Xcode-проекта.

## Этап 2. Базовая структура проекта (готово)

Ветка:

- `feature/app-shell`

Задачи:

- Создать папки/группы для будущих модулей:
  - `Models`
  - `Services`
  - `Views`
  - `Views/Shared`
  - `Views/Dashboard`
  - `Views/Accounts`
  - `Views/Transactions`
  - `Views/Settings`
  - `Persistence`
  - `Intents`
- Настроить SwiftData container в app entry point.
- Заменить placeholder `ContentView` на корневую структуру приложения.

Результат:

- Приложение запускается.
- Есть корневой `TabView` или подготовленный app shell.
- SwiftData подключена, но бизнес-функции еще могут быть пустыми.
- Новые Swift-файлы имеют английские file/module comments.
- Новые типы имеют Swift doc comments (`///`).

Deliverables:

- Базовая структура папок/групп создана в проекте.
- Root app shell заменяет placeholder `Hello, world!`.
- SwiftData model container подключен на уровне приложения.
- Корневая навигация готова для Dashboard, History и Settings.
- Новые файлы имеют английские module/file comments и doc comments для ключевых типов.
- PR `feature/app-shell` показывает, что приложение запускается без бизнес-функций.

Проверка:

- Сборка проекта в Xcode или через `xcodebuild`.
- Приложение открывается без crash.

PR requirements:

- Описание новой структуры проекта.
- Список проверок.
- Скриншот или краткая заметка, что UI пока является shell.

## Этап 3. Доменные модели и типы (готово)

Ветка:

- `feature/domain-models`

Задачи:

- Создать enum валют:
  - `CZK`
  - `EUR`
  - `USD`
- Создать enum типа транзакции:
  - `expense`
  - `income`
  - `transfer`
- Создать SwiftData-модели:
  - `Account`
  - `Bucket`
  - `Transaction`
  - при необходимости `ExchangeRate`
- Определить хранение денежных сумм в minor units (`Int64`).
- Добавить helper для форматирования денег.
- Добавить doc comments для каждой модели, enum и helper.

Результат:

- Есть стабильная модель данных.
- Модели не завязаны напрямую на UI.

Deliverables:

- `CurrencyCode`, `TransactionType` и связанные доменные enum-типы реализованы.
- SwiftData-модели `Account`, `Bucket`, `Transaction` и при необходимости `ExchangeRate` добавлены.
- Денежные суммы хранятся в minor units (`Int64`).
- Добавлен helper для money formatting/parsing.
- Для моделей, enum и helper добавлены английские doc comments.
- Добавлены первые unit tests для money/currency helpers.
- PR `feature/domain-models` описывает схему данных и решения по хранению денег.

Проверка:

- Unit-тесты или минимальные compile checks для enum/helper.
- Сборка проекта.

PR requirements:

- Описание схемы данных и решений по хранению денег.
- Тесты для money/currency helpers.
- Обновление `DESIGN.md` или `CLAUDE.md`, если модель отличается от плана.

## Этап 4. Финансовые сервисы (готово)

Ветка:

- `feature/financial-services`

Задачи:

- Реализовать расчет баланса счета.
- Реализовать расчет spent/remaining для категории.
- Реализовать конвертацию валют по ручным курсам.
- Реализовать применение правил для:
  - расхода;
  - дохода;
  - перевода;
  - удаления транзакции.
- Определить поведение при отсутствующем курсе валют.
- Добавить doc comments к сервисам, методам и edge cases.

Результат:

- Все важные финансовые правила находятся в одном месте.
- UI сможет использовать готовые расчетные методы.

Deliverables:

- Сервис или набор helpers для account balance calculation.
- Сервис или набор helpers для bucket spent/remaining.
- Currency conversion по ручным курсам.
- Правила применения расхода, дохода, перевода и удаления транзакции.
- Обработка отсутствующих exchange rates.
- Unit tests на основные и edge-case финансовые сценарии.
- Coverage notes для core financial services с целью 90%+.
- PR `feature/financial-services` содержит список финансовых правил и тестовых сценариев.

Проверка:

- Unit-тесты:
  - расход уменьшает счет;
  - доход увеличивает счет;
  - перевод меняет два счета;
  - конвертация CZK/EUR/USD работает через ручные курсы;
  - удаление транзакции меняет расчетный баланс корректно;
  - категория считает spent/remaining.
- Code coverage для core financial services стремится к 90%+.
- Stage 4 verification: 21 unit tests passed via `xcodebuild test` on iPhone 17 Pro simulator.
- Stage 4 coverage: app target `91.14%`; `CurrencyConverter` `98.98%`, `FinancialCalculationService` `95.89%`, `BucketCalculationService` `95.45%`.

PR requirements:

- Описание финансовых правил.
- Таблица или список тестовых сценариев.
- Coverage summary, если доступен.

## Этап 5. Dashboard (готово)

Ветка:

- `feature/dashboard`

Задачи:

- Реализовать главный экран со списком счетов.
- Показать общий баланс в основной валюте.
- Показать состояние, когда счетов нет.
- Добавить большую кнопку `+ Транзакция` внизу экрана.
- Добавить переход в Account Detail по нажатию на счет.

Результат:

- Пользователь видит счета и может начать Quick Add.

Deliverables:

- Dashboard screen со списком счетов.
- Converted total balance в основной валюте или понятное состояние при отсутствующих курсах.
- Empty state для отсутствующих счетов.
- Большая нижняя кнопка `+ Транзакция`.
- Переход в Account Detail по tap на счет.
- Light/dark screenshots или manual verification notes.
- PR `feature/dashboard` с описанием UI-состояний.

Проверка:

- Light/dark mode.
- Маленький экран iPhone SE.
- Список не перекрывается кнопкой Quick Add.
- Stage 5 verification: 25 unit tests passed via `xcodebuild test` on iPhone 17 Pro simulator.
- Stage 5 manual verification: Dashboard launched in light and dark mode on iPhone 17 Pro; iPhone SE (3rd generation) layout checked with no text/button overlap after compact empty-state adjustment.

PR requirements:

- Скриншоты или заметки по light/dark mode.
- Список ручных проверок.
- Документация обновлена, если UX изменился.

## Этап 6. Settings: счета и валюта (готово)

Ветка:

- `feature/settings-accounts-rates`

Задачи:

- Реализовать экран настроек.
- Добавить создание счета:
  - название;
  - валюта;
  - начальный баланс.
- Добавить переименование счета.
- Добавить удаление или архивирование счета.
- Добавить выбор основной валюты.
- Добавить ручной ввод курсов:
  - `1 EUR = X CZK`;
  - `1 USD = Y CZK`.

Результат:

- Пользователь может самостоятельно подготовить данные для учета.

Deliverables:

- Settings screen с секциями Accounts, Base Currency и Exchange Rates.
- Создание счета с name, currency и initial balance.
- Переименование счета.
- Безопасное удаление или архивирование счета.
- Выбор base currency.
- Ручной ввод курсов `EUR -> CZK` и `USD -> CZK`.
- Persistence check после перезапуска.
- PR `feature/settings-accounts-rates` с screenshots и описанием delete/archive поведения.

Проверка:

- Созданные счета сохраняются после перезапуска.
- Основная валюта сохраняется.
- Курсы сохраняются.
- Нельзя удалить счет с историей без безопасного поведения.
- Stage 6 verification: 30 unit tests passed via `xcodebuild test` on iPhone 17 Pro simulator.
- Stage 6 coverage: app target `40.08%`; `SettingsAccountService` `94.83%`; core financial services remain above 90%.
- Stage 6 build: Release build passed on iPhone 17 Pro simulator.

PR requirements:

- Тесты для persistence/validation, если применимо.
- Скриншоты Settings.
- Описание безопасного удаления/архивирования.

## Этап 7. Account Detail и категории (готово)

Ветка:

- `feature/account-detail-buckets`

Задачи:

- Реализовать детальный экран счета.
- Показать баланс счета.
- Показать список категорий.
- Добавить создание категории:
  - название;
  - бюджет;
  - опциональный лимит/цель, если не перегружает MVP.
- Добавить переименование категории.
- Добавить удаление или архивирование категории.
- Показать последние транзакции по счету.

Результат:

- Пользователь может управлять категориями внутри каждого счета.

Deliverables:

- Account Detail screen с балансом выбранного счета.
- Список categories/buckets с budget, spent и remaining.
- Создание категории.
- Переименование категории.
- Безопасное удаление или архивирование категории.
- Список последних транзакций по счету.
- Тесты или проверочные сценарии для bucket spent/remaining.
- PR `feature/account-detail-buckets` с screenshots и описанием category lifecycle.

Проверка:

- Категории сохраняются.
- Категория с транзакциями не ломает историю при удалении/архивации.
- Остаток категории считается корректно.
- Stage 7 verification: 35 unit tests passed via `xcodebuild test` on iPhone 17 Pro simulator.
- Stage 7 coverage: app target `32.20%`; `AccountDetailBucketService` `95.24%`; core financial services remain above 90%.
- Stage 7 build: Release build passed on iPhone 17 Pro simulator.
- Stage 7 runtime: Release app installed, launched, and terminated successfully on iPhone 17 Pro simulator.

PR requirements:

- Тесты расчетов bucket spent/remaining.
- Скриншоты Account Detail.
- Описание поведения удаления/архивирования категории.

## Этап 8. Quick Add (готово)

Ветка:

- `feature/quick-add`

Задачи:

- Реализовать экран быстрого ввода.
- Добавить выбор типа:
  - расход;
  - доход;
  - перевод.
- Добавить крупный ввод суммы.
- Добавить выбор валюты.
- Добавить выбор счета горизонтальными карточками.
- Для перевода добавить выбор счета-получателя.
- Добавить выбор категории chips/tags.
- Добавить комментарий одной строкой.
- Добавить кнопку `Сохранить`.
- Добавить валидацию.
- Добавить запоминание последнего счета и категории.
- Добавить haptic feedback при сохранении.

Результат:

- Основной пользовательский сценарий работает end-to-end.

Deliverables:

- Quick Add screen/sheet с выбором expense/income/transfer.
- Крупный amount input с цифровой клавиатурой.
- Currency selector для `CZK`, `EUR`, `USD`.
- Горизонтальный выбор source account.
- Destination account selector для transfer.
- Category chips/tags для выбранного счета.
- Однострочный comment input.
- Save action с validation, persistence и haptic feedback.
- Remembered defaults для последнего счета и категории.
- Tests для validation rules.
- PR `feature/quick-add` с ручной проверкой скорости ввода и screenshots/notes.

Проверка:

- Расход можно добавить быстро.
- Доход сохраняется.
- Перевод сохраняется.
- Нельзя сохранить сумму `0`.
- Нельзя перевести на тот же счет.
- После сохранения Quick Add закрывается.
- Следующий Quick Add подставляет последний счет и категорию.
- Stage 8 verification: 43 unit tests passed via `xcodebuild test` on iPhone 17 Pro simulator.
- Stage 8 coverage: app target `26.78%`; `QuickAddValidationService` `95.77%`; core financial services remain above 90%.
- Stage 8 build: Release build passed on iPhone 17 Pro simulator.
- Stage 8 runtime: Release app installed, launched, screenshot captured, and terminated successfully on iPhone 17 Pro simulator.

PR requirements:

- Тесты validation rules.
- Ручная проверка скорости ввода.
- Скриншоты или screen recording notes для Quick Add.
- Документация обновлена, если поток ввода отличается от `DESIGN.md`.

## Этап 9. History (готово)

Ветка:

- `feature/transaction-history`

Задачи:

- Реализовать список транзакций.
- Сгруппировать транзакции по датам.
- Добавить фильтр по счету.
- Добавить swipe delete.
- Добавить подтверждение или безопасное удаление.

Результат:

- Пользователь видит историю и может удалить ошибочную транзакцию.

Deliverables:

- History screen со списком всех транзакций.
- Группировка по датам.
- Account filter.
- Swipe delete с подтверждением или другим безопасным поведением.
- Пересчет балансов после удаления транзакции.
- Unit tests для delete/reversal поведения.
- PR `feature/transaction-history` с screenshots и risk notes по удалению.

Проверка:

- История обновляется после добавления транзакции.
- Фильтр по счету работает.
- Удаление транзакции меняет расчетные балансы.
- Stage 9 verification: 49 unit tests passed via `xcodebuild test` on dedicated iPhone 17 Pro simulator `TallyFinance Tests`.
- Stage 9 coverage: app target `20.01%`; `TransactionHistoryService` `97.67%`; core financial services remain above 90%.
- Stage 9 build: Release build passed on the dedicated iPhone 17 Pro simulator.
- Stage 9 runtime: Release app installed, launched, screenshot captured, and terminated successfully.

PR requirements:

- Тесты удаления транзакций и пересчета балансов.
- Скриншоты History.
- Описание риска удаления и поведения подтверждения.

## Этап 10. Shortcut / Siri Shortcut

Ветка:

- `feature/quick-add-shortcut`

Задачи:

- Добавить App Intent `Добавить транзакцию`.
- Сделать так, чтобы запуск через shortcut открывал приложение сразу в Quick Add.
- Проверить, что обычный запуск открывает Dashboard.

Результат:

- Пользователь может назначить Shortcut на Action Button или запускать через Shortcuts.

Deliverables:

- App Intent для действия `Добавить транзакцию`.
- App-level routing/state для открытия Quick Add напрямую.
- Обычный запуск приложения продолжает открывать стандартную навигацию.
- Документированные ограничения первой версии Shortcut.
- Manual verification notes для Shortcuts/App Intents.
- PR `feature/quick-add-shortcut` с инструкцией проверки.

Проверка:

- Shortcut появляется в приложении Shortcuts.
- При запуске shortcut открывается Quick Add.
- При обычном запуске открывается нормальная навигация.

PR requirements:

- Ручные шаги проверки Shortcuts/App Intents.
- Документация ограничений Shortcut.
- Обновление `README.md`, если запуск/настройка требует пояснений.

## Этап 11. Полировка UX

Ветка:

- `feature/ux-polish`

Задачи:

- Проверить dark/light mode.
- Проверить Dynamic Type на разумных размерах.
- Проверить iPhone SE и большой iPhone.
- Убедиться, что важные кнопки не перекрываются клавиатурой.
- Привести тексты, пустые состояния и ошибки к единому стилю.
- Проверить SF Symbols и labels.

Результат:

- Приложение выглядит как нативный iOS-инструмент, а не как черновик.

Deliverables:

- Проверенные и поправленные light/dark layouts.
- Проверенные размеры iPhone SE и большого iPhone.
- Проверка Dynamic Type на разумных размерах.
- Единый стиль ошибок, empty states и labels.
- Проверка keyboard-safe поведения для Quick Add.
- Screenshots или visual verification notes для ключевых экранов.
- PR `feature/ux-polish` с перечнем проверенных экранов.

Проверка:

- Ручной проход по основным сценариям.
- Скриншоты/визуальная проверка ключевых экранов, если доступен simulator.

PR requirements:

- Скриншоты ключевых экранов.
- Список проверенных устройств/simulators.
- Обновление UI notes в документации при необходимости.

## Этап 12. Финальная проверка MVP

Ветка:

- `chore/mvp-hardening`

Задачи:

- Запустить все тесты.
- Запустить тесты с code coverage, если доступно.
- Собрать приложение.
- Проверить сценарии acceptance criteria из `DESIGN.md`.
- Обновить `README.md` по фактическому состоянию.
- Обновить `CLAUDE.md` с выученными уроками и техническими решениями.
- Проверить, что все новые Swift-файлы имеют module/file comments.
- Проверить, что модели, сервисы, reusable views и нетривиальные методы имеют doc comments.
- Проверить, что открытые technical debt пункты записаны в документации или issues.

Результат:

- MVP готов к ручному использованию и дальнейшему расширению.

Deliverables:

- Полный test run завершен успешно.
- Coverage report или documented coverage notes.
- Финальная сборка приложения проходит.
- Acceptance criteria из `DESIGN.md` проверены.
- `README.md` обновлен под фактический запуск и текущее состояние.
- `CLAUDE.md` обновлен выученными решениями и lessons learned.
- Список известных ограничений и follow-up задач зафиксирован.
- PR `chore/mvp-hardening` содержит итоговый MVP summary.

Проверка:

- Сборка проходит.
- Тесты проходят.
- Coverage по core financial services близок к 90%+ или есть documented follow-up.
- Overall coverage близок к 70%+ после стабилизации MVP или есть documented follow-up.
- Нет незадокументированных архитектурных решений.

PR requirements:

- Итоговый MVP summary.
- Полный список тестов и coverage notes.
- Список известных ограничений.
- Финальное обновление `README.md`, `DESIGN.md`, `PLAN.md`, `CLAUDE.md` при необходимости.

## Предлагаемый порядок первых рабочих PR/изменений

После одобрения плана лучше двигаться небольшими изменениями:

1. Git infrastructure + `.gitignore` + PR template.
2. Project setup + deployment target + SwiftData container.
3. Models + money/currency helpers.
4. Calculation services + unit tests + coverage.
5. Dashboard shell + Settings account creation.
6. Account Detail + categories.
7. Quick Add end-to-end.
8. History + deletion.
9. Shortcuts integration.
10. UX polish + final README update.

## Что не делать без отдельного подтверждения

- Не добавлять сервер.
- Не добавлять сетевые запросы.
- Не добавлять аналитику.
- Не подключать сторонние SDK.
- Не добавлять авторизацию.
- Не добавлять экспорт.
- Не делать графики.
- Не менять продуктовую область за пределы MVP.

## Критерий одобрения плана

Пользователь должен явно написать, что план одобрен. После этого можно начинать Этап 0 и переходить к коду.
