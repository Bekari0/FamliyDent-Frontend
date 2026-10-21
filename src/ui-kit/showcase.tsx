import { ArrowRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Button,
  ButtonLink,
  Container,
  Field,
  Heading,
  IconButton,
  Input,
  readCssToken,
  Select,
  Text,
  Textarea,
  textVariants,
} from "./index";
import {
  RevealGroup,
  RevealHeading,
  Reveal as RevealItem,
} from "./motion/reveal";
import "./showcase.css";

const palette = [
  "background",
  "background-subtle",
  "ink",
  "muted",
  "accent",
  "accent-2",
  "brand-strong",
  "trust",
  "error-ink",
  "success",
  "focus",
  "border-default",
] as const;

export default function UiKitShowcase() {
  const [tokens, setTokens] = useState<Record<string, string>>({});
  useEffect(() => {
    const update = () => {
      const names = [
        "--breakpoint-tablet",
        "--breakpoint-desktop",
        ...textVariants.flatMap((variant) =>
          ["mobile", "tablet", "desktop"].map(
            (mode) => `--type-${variant}-${mode}`,
          ),
        ),
      ];
      setTokens(
        Object.fromEntries(
          names.map((name) => [name, readCssToken(name as `--${string}`)]),
        ),
      );
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <Container as="section" className="ui-showcase">
      <Text variant="overline" tone="brand">
        Family Dent · UI-kit
      </Text>
      <Heading level={1}>Дизайн-система</Heading>
      <Text variant="body-lg" tone="secondary">
        Единые токены, адаптивная типографика и семантические компоненты. Эта
        страница доступна только в режиме разработки.
      </Text>
      <Text variant="body-sm">
        Мобильный — базовый режим. Планшет начинается с{" "}
        {tokens["--breakpoint-tablet"]}; десктоп — с{" "}
        {tokens["--breakpoint-desktop"]}.
      </Text>

      <section aria-labelledby="ui-palette">
        <Heading level={2} id="ui-palette">
          Палитра
        </Heading>
        <div className="ui-showcase__palette">
          {palette.map((name) => (
            <div key={name} className="ui-showcase__swatch">
              <div
                style={{ backgroundColor: `var(--color-${name})` }}
                aria-hidden="true"
              />
              <Text as="code" variant="caption">{`--color-${name}`}</Text>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="ui-typography">
        <Heading level={2} id="ui-typography">
          Варианты текста
        </Heading>
        <Text variant="body-sm" tone="secondary">
          Размеры ниже читаются из токенов, а не копируются в каталог. Уровень
          заголовка не определяет его визуальный размер.
        </Text>
        <div className="ui-showcase__type-list">
          {textVariants.map((variant) => (
            <article key={variant} className="ui-showcase__type-row">
              <div>
                <Text as="code" variant="label">
                  {variant}
                </Text>
                <Text variant="caption" tone="secondary">
                  {["mobile", "tablet", "desktop"]
                    .map((mode) => tokens[`--type-${variant}-${mode}`])
                    .join(" / ")}
                </Text>
              </div>
              <Text as="div" variant={variant} data-preview-variant={variant}>
                Забота о вашей улыбке
              </Text>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="ui-controls">
        <Heading level={2} id="ui-controls">
          Кнопки и поля
        </Heading>
        <div className="ui-showcase__actions">
          <Button>
            Основная <ArrowRight aria-hidden="true" />
          </Button>
          <Button variant="secondary">Вторичная</Button>
          <Button variant="outline">С контуром</Button>
          <Button variant="ghost">Без фона</Button>
          <Button variant="danger">Удалить</Button>
          <Button disabled>Недоступна</Button>
          <IconButton aria-label="Закрыть пример">
            <X aria-hidden="true" />
          </IconButton>
          <ButtonLink href="#ui-typography" variant="outline">
            Ссылка
          </ButtonLink>
        </div>
        <form
          className="ui-showcase__fields"
          onSubmit={(event) => event.preventDefault()}
        >
          <Field
            label="Имя"
            hint="Подпись связана с полем автоматически"
            required
          >
            <Input
              name="example-name"
              autoComplete="name"
              placeholder="Ваше имя"
            />
          </Field>
          <Field label="Email" error="Проверьте формат адреса">
            <Input type="email" name="example-email" defaultValue="example" />
          </Field>
          <Field label="Направление">
            <Select name="example-service">
              <option>Консультация</option>
              <option>Диагностика</option>
            </Select>
          </Field>
          <Field label="Комментарий">
            <Textarea
              name="example-comment"
              placeholder="Необязательное поле"
            />
          </Field>
          <Field label="Недоступное поле">
            <Input disabled defaultValue="Сохранённое значение" />
          </Field>
        </form>
      </section>

      <section aria-labelledby="ui-motion">
        <RevealHeading level={2} id="ui-motion">
          Появление и взаимодействие
        </RevealHeading>
        <Text tone="secondary">
          Блоки появляются один раз при прокрутке. Системная настройка
          уменьшения движения отключает появление и смещение.
        </Text>
        <RevealGroup className="ui-showcase__motion-grid">
          {[
            "Заголовки без изменения переносов",
            "Последовательное появление карточек",
            "Мгновенная доступность при фокусе",
          ].map((title) => (
            <RevealItem
              key={title}
              className="ui-showcase__motion-card"
              data-preview-motion
            >
              <Heading level={3} variant="heading-5">
                {title}
              </Heading>
              <Text variant="body-sm">
                Цвета, размеры, шрифты и геометрия остаются прежними.
              </Text>
              <Button variant="outline">
                Пример <ArrowRight aria-hidden="true" />
              </Button>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <section
        className="ui-showcase__inverse"
        data-ui-scheme="inverse"
        aria-labelledby="ui-inverse"
      >
        <Heading level={2} id="ui-inverse" tone="primary">
          На тёмном фоне
        </Heading>
        <Text tone="secondary">
          Семантические цвета текста и границ меняются вместе с контекстом.
        </Text>
        <div className="ui-showcase__actions">
          <Button>Записаться</Button>
          <Button variant="outline">Подробнее</Button>
        </div>
      </section>
    </Container>
  );
}
