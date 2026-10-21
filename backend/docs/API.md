# HTTP API

Все тела запросов — JSON-объекты до 64 KiB. Неизвестные поля входных схем
отклоняются. Ошибка: `{ "error": "...", "code": "...", "requestId": "..." }`.
Для невалидных полей возможен массив `fields`; содержимое запроса не отражается.
`400` — формат, `401` — сессия/подпись, `403` — CSRF/роль/Origin, `409` — конфликт,
`413` — размер, `429` — лимит, `502` — ошибка AI, `503` — интеграция отключена.

## Сессия и CSRF

1. `GET /api/auth/me` с cookie: `{user:null,csrfToken:null}` или пользователь
   `{id,name,email,role}` и CSRF-токен.
2. Для POST/PATCH с активной сессией нужен `X-CSRF-Token` из `/me` или ответа входа.
   После входа и смены пароля токен меняется.
3. В проде нужен `Origin`, точно совпадающий с `APP_ORIGINS`. Для операторских
   скриптов действуют те же cookie, CSRF и Origin. Подписанный bot endpoint исключён.
4. Для браузерного fetch задайте `credentials:"include"`. Разворачивайте сайт и API
   на одном origin; при отдельных поддоменах используйте общий site и точный CORS.
   Сторонние cross-site cookies при `SameSite=Lax` не поддерживаются.

| Метод и путь                             | Доступ             | Тело / результат                                                 |
| ---------------------------------------- | ------------------ | ---------------------------------------------------------------- |
| `GET /api/health/live`                   | Публичный          | Процесс работает: `{ok:true}`                                    |
| `GET /api/health/ready`, `/api/health`   | Публичный          | MongoDB доступна; иначе 503                                      |
| `GET /api/content/:type`                 | Публичный          | `{data:[...]}`, до 500 опубликованных документов                 |
| `POST /api/auth/register`                | Публичный          | `{name,email,password}`; 201, пользователь, cookie, csrfToken    |
| `POST /api/auth/login`                   | Публичный          | `{email,password}`; пользователь, новая сессия, csrfToken        |
| `GET /api/auth/me`                       | Публичный          | Пользователь / null и csrfToken                                  |
| `POST /api/auth/logout`                  | Сессия / анонимный | `{}`; удаляет текущую сессию                                     |
| `POST /api/auth/logout-all`              | Пользователь       | `{}`; отзывает все сессии                                        |
| `POST /api/auth/password`                | Пользователь       | `{currentPassword,newPassword}`; отзывает сессии и выдаёт новую  |
| `POST /api/bookings`                     | Публичный          | Заявка; 201, `{ok,id,status:"new",delivery}`                     |
| `POST /api/tourism-consultations`        | Публичный          | Заявка туриста; аналогичный ответ                                |
| `GET /api/bookings/mine`                 | Пользователь       | До 100 своих заявок, новые первыми                               |
| `POST /api/ai/chat`                      | Пользователь       | `{message,history?:[{role,content}]}` → `{answer}`               |
| `POST /api/integrations/bot/events`      | Подпись бота       | Статус заявки; см. контракт                                      |
| `GET /api/admin/applications`            | Staff/admin        | `?kind=booking&status=new&page=1&limit=25`                       |
| `GET /api/admin/outbox`                  | Staff/admin        | `?status=dead&page=1&limit=25`                                   |
| `POST /api/admin/outbox/:objectId/retry` | Staff/admin        | `{}`; повторить только dead, с аудитом                           |
| `GET /api/admin/content/:type`           | Admin              | Все статусы; `?page=1&limit=25`                                  |
| `POST /api/admin/content/:type`          | Admin              | Доменные поля; по умолчанию draft, revision=0                    |
| `PATCH /api/admin/content/:type/:id`     | Admin              | `{expectedRevision:0,...изменяемыеПоля}`; 409 при старой ревизии |
| `GET /api/admin/audit`                   | Admin              | `?page=1&limit=25`; метаданные изменений                         |

Административный `limit` до 100, `page` до 10000. `kind`: booking или
tourism_consultation. Статусы outbox: pending, delivering, sent, dead.
`:type` — один из 18 [типов контента](MONGODB_SCHEMA.md). Публичные ответы не содержат
`_id`, ревизию, даты изменения, статусы публикации и произвольные поля.

Регистрация: имя 1–120, email до 200, пароль 12–200 символов. Старые пароли при входе
не требуют новой минимальной длины. Сессия по умолчанию 7 дней. Лимит auth —
15/15 минут на IP, заявок — 10/15 минут, общий — 300/мин.

## Заявки

```json
{
  "name": "Имя пациента",
  "phone": "+992 000 000000",
  "doctor": "Врач",
  "service": "Консультация",
  "preferredDate": "2026-12-01"
}
```

Обязательны name и phone. Телефон: 5–40 символов, цифры, пробелы, `+()-`.
Дата — существующая дата YYYY-MM-DD; необязательна. doctor до 160, service до 120.
Статус, источник и userId задаёт сервер. Tourism требует name, phone, email, country,
service; необязательны telegram до 100 и message до 2000. doctor и preferredDate
в tourism не передаются.

Рекомендуемый `Idempotency-Key`: UUID либо 16–128 букв/цифр/`_`/`-`.
Повтор того же тела и пользователя с тем же ключом в течение суток возвращает тот
же ID; изменение тела — 409. Повторяйте ключ при сетевом сбое. Другой IP при тех же
пользователе и теле не создаёт новую заявку. Виды заявок имеют разные пространства ключей.

`delivery="queued"` — очередь настроенного бота; `pending_configuration` — заявка
сохранена, интеграция ещё отключена. Ответ 201 означает приём заявки, а не
подтверждённый приём у врача.

## Нейросеть

Сообщение до 2000 символов, история до 8 сообщений, роли только user/assistant,
содержимое каждого до 2000. Лимит 10/мин на IP и по умолчанию 30/сутки на пользователя
хранится в MongoDB и действует после перезапуска. Провайдер и лимиты задаёт сервер.
AI не подтверждает записи и не имеет инструментов записи в БД.
