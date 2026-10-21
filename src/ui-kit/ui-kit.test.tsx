import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import {
  Button,
  ButtonLink,
  Field,
  Heading,
  IconButton,
  Input,
  Select,
  Text,
  Textarea,
} from "./index";

test("a heading keeps its document level when its visual variant changes", () => {
  const markup = renderToStaticMarkup(
    <Heading level={2} variant="display" id="section-title">
      Раздел
    </Heading>,
  );
  assert.match(markup, /^<h2 id="section-title"/);
  assert.match(markup, /type-display/);
  assert.doesNotMatch(markup, /role=|<h1/);
});

test("text preserves the requested semantic element and native attributes", () => {
  const markup = renderToStaticMarkup(
    <Text as="label" htmlFor="patient" variant="label">
      Пациент
    </Text>,
  );
  assert.match(markup, /^<label for="patient"/);
});

test("buttons avoid accidental form submission and support explicit submit and disabled states", () => {
  assert.match(
    renderToStaticMarkup(<Button>Отмена</Button>),
    /^<button type="button"/,
  );
  const submit = renderToStaticMarkup(
    <Button type="submit" disabled>
      Отправить
    </Button>,
  );
  assert.match(submit, /^<button type="submit"/);
  assert.match(submit, /disabled=""/);
  const link = renderToStaticMarkup(
    <ButtonLink href="/services">Услуги</ButtonLink>,
  );
  assert.match(link, /^<a /);
  assert.match(link, /href="\/services"/);
  assert.doesNotMatch(link, /role="button"/);
  assert.match(
    renderToStaticMarkup(<IconButton aria-label="Закрыть">×</IconButton>),
    /aria-label="Закрыть"/,
  );
});

test("fields associate the label, hint and validation error with their input", () => {
  const markup = renderToStaticMarkup(
    <Field
      id="email"
      label="Email"
      hint="Рабочий адрес"
      error="Проверьте адрес"
      required
    >
      <Input type="email" name="email" aria-describedby="privacy" />
    </Field>,
  );
  assert.match(markup, /<label for="email"/);
  assert.match(markup, /<input[^>]*id="email"/);
  assert.match(markup, /<input[^>]*required=""/);
  assert.match(markup, /aria-describedby="privacy email-hint email-error"/);
  assert.match(markup, /aria-invalid="true"/);
  assert.match(markup, /<p id="email-error"[^>]*role="alert"/);
});

test("generated field identifiers are unique and all controls retain native form behavior", () => {
  const markup = renderToStaticMarkup(
    <form>
      <Field label="Имя">
        <Input name="name" defaultValue="Анна" />
      </Field>
      <Field label="Комментарий">
        <Textarea name="message" defaultValue="Текст" />
      </Field>
      <Field label="Услуга">
        <Select name="service" defaultValue="care">
          <option value="care">Гигиена</option>
        </Select>
      </Field>
    </form>,
  );
  const labels = [...markup.matchAll(/<label for="([^"]+)"/g)].map(
    (match) => match[1],
  );
  assert.equal(labels.length, 3);
  assert.equal(new Set(labels).size, 3);
  for (const id of labels) assert.ok(markup.includes(`id="${id}"`));
  assert.match(markup, /<textarea[^>]*name="message"[^>]*>Текст<\/textarea>/);
  assert.match(markup, /<option value="care" selected=""/);
  assert.doesNotMatch(markup, /aria-invalid=/);
});
