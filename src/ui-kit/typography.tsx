import {
  createElement,
  type ComponentPropsWithoutRef,
  type HTMLAttributes,
} from "react";

export const textVariants = [
  "display",
  "hero",
  "heading-1",
  "heading-2",
  "heading-3",
  "heading-4",
  "heading-5",
  "heading-6",
  "body-lg",
  "body",
  "body-sm",
  "caption",
  "label",
  "overline",
  "button",
  "input",
  "stat",
  "wordmark",
] as const;
export type TextVariant = (typeof textVariants)[number];
export type TextTone =
  | "primary"
  | "secondary"
  | "brand"
  | "inverse"
  | "error"
  | "success";
type TextElement =
  | "p"
  | "span"
  | "div"
  | "small"
  | "label"
  | "legend"
  | "figcaption"
  | "dt"
  | "dd"
  | "strong"
  | "em"
  | "code";

// Complete class names keep the recipes discoverable by Tailwind's source scanner.
const variantClasses: Record<TextVariant, string> = {
  display: "type-display",
  hero: "type-hero",
  "heading-1": "type-heading-1",
  "heading-2": "type-heading-2",
  "heading-3": "type-heading-3",
  "heading-4": "type-heading-4",
  "heading-5": "type-heading-5",
  "heading-6": "type-heading-6",
  "body-lg": "type-body-lg",
  body: "type-body",
  "body-sm": "type-body-sm",
  caption: "type-caption",
  label: "type-label",
  overline: "type-overline",
  button: "type-button",
  input: "type-input",
  stat: "type-stat",
  wordmark: "type-wordmark",
};
const toneClasses: Record<TextTone, string> = {
  primary: "ui-tone-primary",
  secondary: "ui-tone-secondary",
  brand: "ui-tone-brand",
  inverse: "ui-tone-inverse",
  error: "ui-tone-error",
  success: "ui-tone-success",
};

export function typographyClass(variant: TextVariant, tone?: TextTone): string {
  return `ui-text ${variantClasses[variant]}${tone ? ` ${toneClasses[tone]}` : ""}`;
}

export type TextProps<T extends TextElement = "p"> = {
  as?: T;
  variant?: TextVariant;
  tone?: TextTone;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "color">;

export function Text<T extends TextElement = "p">({
  as,
  variant = "body",
  tone,
  className = "",
  ...props
}: TextProps<T>) {
  return createElement(as ?? "p", {
    ...props,
    className: `${typographyClass(variant, tone)} ${className}`.trim(),
  });
}

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  variant?: TextVariant;
  tone?: TextTone;
}

export function Heading({
  level,
  variant = `heading-${level}`,
  tone,
  className = "",
  ...props
}: HeadingProps) {
  return createElement(`h${level}`, {
    ...props,
    className:
      `${typographyClass(variant, tone)} ui-heading ${className}`.trim(),
  });
}
