# Контракт с существующим Telegram-ботом, v1

Сайт отправляет заявки вашему существующему боту по HTTP; бот обрабатывает их
и ведёт запись пациентов. Новый Telegram-бот не создаётся; Bot API не вызывается;
существующий Telegram webhook не меняется. HTTP-приёмник нужно реализовать на
стороне вашей системы перед включением `BOT_ENABLED=true`.

## Сайт → бот

`POST {BOT_API_URL}`, `Content-Type: application/json`. Опционально
`Authorization: Bearer {BOT_API_TOKEN}`. Адрес фиксирован в env, HTTPS по умолчанию.

```json
{
  "eventId": "76605690-5731-45f3-8505-2002d857b0df",
  "type": "booking.created",
  "occurredAt": "2026-10-21T10:00:00.000Z",
  "data": {
    "id": "68f74b80123abc4567890123",
    "name": "Имя пациента",
    "phone": "+992 000 000000",
    "service": "Консультация",
    "preferredDate": "2026-12-01T00:00:00.000Z",
    "createdAt": "2026-10-21T10:00:00.000Z"
  }
}
```

Типы: booking.created, tourism_consultation.created. Контактные поля соответствуют
заявке; отсутствующие необязательные поля не передаются. Tourism включает email,
country, telegram, message. requestIp, userId, пароли и сессии не передаются.

```text
Idempotency-Key: <eventId>
X-Bot-Timestamp: <целые секунды Unix>
X-Bot-Signature: <64 символа lowercase hex HMAC-SHA256>
```

Подпись: `HMAC-SHA256(secret, timestamp + "." + rawBody)` над точными байтами тела,
а не повторно сериализованным JSON. Для исходящих запросов — BOT_SIGNING_SECRET.
Бот проверяет подпись constant-time сравнением и окно ±300 секунд; часы серверов
должны быть синхронизированы.

Бот **надёжно сохраняет событие и уникальный eventId до подтверждения**, затем
возвращает 200/202 с `{ "accepted": true }`. Повтор eventId должен вернуть тот же
успешный ответ без новой заявки, сообщения или записи. Не подтверждайте получение
до сохранения задачи в вашей системе.

Доставка at least once: таймаут после обработки или падение воркера может повторить
событие. Подпись и timestamp пересчитываются, eventId и тело сохраняются.
HTTP 408/429/5xx, сеть и неверный ACK повторяются с экспоненциальной задержкой
и jitter до BOT_MAX_ATTEMPTS; другие 4xx — постоянная ошибка. Аренда задачи
60 секунд восстанавливается после падения. Оператор видит dead-задачи в
`/api/admin/outbox` и может повторить их после исправления.

## Бот → сайт

`POST https://ваш-домен/api/integrations/bot/events`. Те же заголовки подписи,
но отдельный BOT_WEBHOOK_SECRET. Origin, сессия и CSRF не нужны. Idempotency-Key
не нужен: дедупликация по eventId в JSON.

```json
{
  "eventId": "6c22da50-1734-4b7f-9d2c-b445341c67c9",
  "type": "booking.status_changed",
  "applicationId": "68f74b80123abc4567890123",
  "status": "confirmed",
  "occurredAt": "2026-10-21T10:05:00.000Z"
}
```

type: booking.status_changed / tourism_consultation.status_changed.
applicationId — исходный data.id, eventId — новый UUID для каждого изменения.
status: confirmed/completed/cancelled. occurredAt — ISO UTC, не более 5 минут
в будущем. Ответ `{ok:true}`; неизменённый повтор — `{ok:true,duplicate:true}`.
Изменённое тело со старым eventId — 409. Дедупликация хранится не менее 7 дней;
после очистки TTL состояние защищено временем и терминальными статусами.

Из new допустим любой из трёх статусов: completed может прийти раньше предыдущего
подтверждения. Из confirmed — completed/cancelled. completed и cancelled не
откатываются. Устаревшие и недопустимые переходы подтверждаются без изменения.

При 401 проверьте секрет, байты тела и часы; 404 — соответствие ID и типа;
409 — повторное использование eventId. Сеть и 5xx повторяйте с тем же телом/eventId,
но свежим timestamp и подписью. Исправление содержимого требует нового eventId.

## Подпись на Node.js

```js
import { createHmac } from "node:crypto";
const rawBody = JSON.stringify(event);
const timestamp = String(Math.floor(Date.now() / 1000));
const signature = createHmac("sha256", process.env.BOT_WEBHOOK_SECRET)
  .update(timestamp + ".")
  .update(rawBody)
  .digest("hex");
// Отправьте rawBody без изменения, timestamp и signature в указанных заголовках.
```

Эти секреты не являются Telegram bot token. Создайте два разных случайных значения
минимум по 32 символа; храните в секретах окружения обеих сторон. Payload содержит
контактные данные: не выводите его в общедоступные логи.
