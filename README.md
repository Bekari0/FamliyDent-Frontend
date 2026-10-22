# Family Dent

Сайт на React/Vite и отдельный Node.js backend на Express 5, TypeScript и Mongoose.
Весь серверный код, MongoDB, миграции, интеграции и конфигурация прода находятся в
[`backend/`](backend/README.md). Клиническая система `FamilyDent` остаётся отдельной;
сайт использует самостоятельную базу `familydent_web`.

## Запуск

Node.js 22.12+ или 24 LTS, npm и MongoDB replica set / Atlas.

```bash
npm ci
cp .env.example .env
cp backend/.env.example backend/.env
```

Заполните `backend/.env`: URI пользователя приложения с доступом только к базе
сайта и случайный `SESSION_SECRET`. Не заменяйте уже настроенные локальные файлы.
Для нового окружения выполните [подготовку базы](backend/docs/MONGODB_MIGRATION.md).
После инициализации: `npm run dev`.

Фронтенд: `http://localhost:3000`. API: `http://localhost:8787`. Vite проксирует
`/api`; MongoDB URI и ключи интеграций в браузер не передаются. API стартует после
проверки схемы и инициализации контента. Отдельные процессы: `npm run dev:api` и
`npm run dev:web`. `PORT` в backend/.env меняет API-порт; `WEB_PORT` — порт Vite.

## Проверки

```bash
npm run lint
npm test
npm run test:integration
npm run build
npx playwright install --with-deps chromium
npm run test:browser
```

Интеграционные тесты поднимают временный MongoDB replica set; при первом запуске
загружается бинарник MongoDB. Рабочая база сайта не используется.
`npm run db:verify` проверяет настроенную базу; `npm run db:smoke` проверяет API
и все 18 типов публичного контента без создания тестовых заявок.

Полный прогон: `npm run check`. Браузерные тесты используют `dist`, публичные
тестовые данные и отдельный порт 4173, не обращаются к рабочей БД.
Результаты аудита размеров, типографики, доступности и API: [FML-002](docs/PROJECT_AUDIT_FML-002.md).

## UI-kit

Токены, адаптивная типографика и общие компоненты: [`src/ui-kit`](src/ui-kit/README.md).
Каталог в режиме разработки: `http://localhost:3000/ui-kit`. Цвета, семейства шрифтов
и размеры текста для мобильного, планшета и десктопа задаются в одном
[`tokens.css`](src/ui-kit/tokens.css).

## Документация

- [Архитектура и команды backend](backend/README.md).
- [API, авторизация и административные операции](backend/docs/API.md).
- [HTTP-контракт существующего Telegram-бота](backend/docs/BOT_CONTRACT.md).
- [Прод, HTTPS, резервное копирование и откат](backend/docs/PRODUCTION.md).
- [Результаты проверки и её границы](backend/docs/VERIFICATION.md).
- [Схема MongoDB](backend/docs/MONGODB_SCHEMA.md) и [миграция](backend/docs/MONGODB_MIGRATION.md).

Бот и нейросеть отключены до внесения параметров реальных сервисов. Заявки при этом
сохраняются в MongoDB с задачей доставки; после включения бота очередь обрабатывается
автоматически. Подтверждение записи поступает от существующего бота.
