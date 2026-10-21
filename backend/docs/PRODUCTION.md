# Запуск на проде

## Подготовка

Нужны домен с DNS на сервер, открытые 80/443, Docker Engine + Compose v2 и MongoDB
Atlas / replica set. Standalone MongoDB не поддерживает нужные транзакции.
Atlas ограничьте IP сервера. Приложению выдайте readWrite только на familydent_web,
без прав на клиническую БД. Миграционные credentials хранятся отдельно и не
передаются работающему контейнеру.

```bash
npm ci
cp backend/.env.example backend/.env
cp backend/deploy/.env.example backend/deploy/.env
chmod 600 backend/.env backend/deploy/.env
```

Настроенные файлы не заменяйте шаблоном. Укажите:

- backend/deploy/.env: реальный SITE_DOMAIN и версию IMAGE_TAG.
- backend/.env: MongoDB URI, MONGODB_DATABASE, случайный SESSION_SECRET,
  APP_ORIGINS=https://ваш-домен, NODE_ENV=production.
- Бот и AI остаются отключены до готовности реальных endpoint и секретов.

Переменные перечислены в [шаблоне](../.env.example). Генерация секрета:
`openssl rand -hex 48`; используйте отдельный результат для каждого назначения.
Process env имеет приоритет. VITE_API_URL оставьте пустым для одного origin.

Подготовьте backend/.env.migration.local и выполните npm run db:setup.
Для новой БД — npm run content:seed; для переноса website-источника — db:migrate
однократно. Затем npm run db:verify. Уже инициализированной базе нужен только
db:setup без повторного seed/переноса старого снимка. Клиническая БД не меняется.

Администратор создаётся `npm run admin:create` с ADMIN_EMAIL, ADMIN_NAME и
ADMIN_PASSWORD через защищённое окружение. Пароль можно ввести без эха в bash:

```bash
read -r -s -p 'Admin password: ' ADMIN_PASSWORD
export ADMIN_PASSWORD
npm run admin:create
unset ADMIN_PASSWORD
```

Email и имя задайте отдельно. Пароль не попадает в аргументы или историю команд.
Постоянные ADMIN-переменные не нужны runtime-контейнеру.

## Docker и HTTPS

```bash
docker compose --env-file backend/deploy/.env -f backend/deploy/compose.yml config --quiet
docker compose --env-file backend/deploy/.env -f backend/deploy/compose.yml up -d --build
docker compose --env-file backend/deploy/.env -f backend/deploy/compose.yml ps
```

Контекст сборки — корень. .dockerignore исключает env-файлы, Git, ключи, бэкапы
и node_modules. Multi-stage image собирает сайт и API, оставляет production-
зависимости и запускает скомпилированный Node под пользователем node. API имеет
read-only filesystem, ограничения ресурсов и отключённые дополнительные capabilities.
MongoDB и API-порт наружу не публикуются; доступен Caddy на 80/443. Caddy получает
и обновляет TLS-сертификат автоматически.

TRUST_PROXY доверяет только Caddy 172.30.0.2/32. При конфликте сети согласованно
измените subnet, адреса и TRUST_PROXY. Дополнительный CDN требует настройки trusted
proxies в Caddy; не ставьте TRUST_PROXY=true или число hop. Не добавляйте
недоверенные контейнеры в сеть прокси.

```bash
SMOKE_BASE_URL=https://ваш-домен npm run db:smoke
```

/api/health/live проверяет процесс; /api/health/ready — MongoDB. При старте
проверяются также схема и инициализация контента. SIGTERM останавливает HTTP
и воркер с ожиданием текущей задачи; после аварии аренда задачи истекает и доставка
восстанавливается.

Без Docker: `npm run build`, затем
`NODE_ENV=production SERVE_FRONTEND=true npm start` за HTTPS-прокси.
Нужны Node 22.12+ и production-зависимости workspace; FRONTEND_DIST=../dist
считается относительно backend/. Прямой HTTP не подходит для production cookie.

## Интеграции и наблюдаемость

Согласуйте [HTTP-контракт](BOT_CONTRACT.md), внесите адрес и отдельные секреты,
включите BOT_ENABLED=true и пересоздайте контейнер. Накопленные заявки отправятся
автоматически: предварительно проверьте очередь и готовность оператора.
Telegram webhook существующего бота не меняется.

AI настраивается по [backend README](../README.md). Приватный HTTP требует
INTEGRATIONS_ALLOW_HTTP=true; AI-сервер не должен быть публичным. URL контролирует
оператор, клиентские адреса не принимаются.

JSON-логи содержат request ID, путь, статус, время и безопасный код ошибки.
Не включайте запись тел, cookie и Authorization в стороннем прокси. Следите за
readiness, 5xx/429, числом и возрастом pending/dead-задач, местом в MongoDB,
сертификатами и лимитами AI.

Отдельный воркер: та же сборка, `node backend/dist/worker.js`; у API
WORKER_ENABLED=false. Экземпляры используют общую MongoDB-очередь. Дедупликация
на стороне бота обязательна и с одним воркером.

## Обновление, бэкапы и откат

1. Снимите защищённый бэкап familydent*web и проверьте восстановление в отдельную
   familydent_web_restore*\* базу. Используйте Atlas backups при доступном тарифе
   или MongoDB Database Tools с отдельными правами резервирования. Экспорты не
   кладите в Git, public/ или образ.
2. Выполните npm ci, lint, test, test:integration, build и
   `npm audit --omit=dev --audit-level=high`.
3. Примените схему migration-пользователем и выполните db:verify. Текущая схема
   добавляет поля и коллекции без удаления контента.
4. Сохраните образ с новым IMAGE_TAG, пересоздайте сервисы, проверьте readiness
   и smoke. После подключения реального бота проверьте весь путь реальной заявки.
5. Откат: предыдущий сохранённый IMAGE_TAG и Compose up -d --no-build. Данные
   и очередь не удаляются. Не восстанавливайте старый снимок поверх новых заявок
   без плана переноса изменений.

Смена SESSION_SECRET меняет CSRF, ключи идемпотентности и лимитов, но сама не
отзывает cookie-сессии. Для отзыва отдельно удалите сессии нужного аккаунта или базы
сайта в согласованное окно. Ротацию планируйте при отключённом приёме заявок,
чтобы повтор со старым ключом не создал новую заявку.

Подготовка не создаёт DNS, TLS-сертификат, сервер и реальный bot/AI endpoint.
Для фактической публикации нужны указанные параметры инфраструктуры.
