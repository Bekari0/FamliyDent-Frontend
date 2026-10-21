import {
  createElement,
  useEffect,
  useRef,
  type CSSProperties,
  type HTMLAttributes,
  type ComponentPropsWithoutRef,
  type ElementType,
} from "react";
import { Heading, type HeadingProps } from "../typography";
import { observeReveal } from "./observe-reveal";

type GroupElement = "div" | "section" | "ul" | "ol";
type RevealStyle = CSSProperties & { "--reveal-delay"?: string };

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    if (ref.current) return observeReveal(ref.current);
  }, []);
  return ref;
}

function revealStyle(
  style: CSSProperties | undefined,
  delay: number | undefined,
): RevealStyle | undefined {
  if (delay === undefined) return style;
  return { ...style, "--reveal-delay": `${Math.max(0, delay) * 1000}ms` };
}

type RevealOwnProps<T extends ElementType> = {
  as?: T;
  delay?: number;
  className?: string;
  style?: CSSProperties;
};
export type RevealProps<T extends ElementType = "div"> = RevealOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof RevealOwnProps<T>>;

export function Reveal<T extends ElementType = "div">({
  as,
  delay,
  className = "",
  style,
  ...props
}: RevealProps<T>) {
  const ref = useReveal<HTMLElement>();
  return createElement(as ?? "div", {
    ...props,
    ref,
    className: `ui-reveal ${className}`.trim(),
    style: revealStyle(style, delay),
  });
}

/** Only children reveal; a long collection never waits for a percentage of its full height. */
export function RevealGroup({
  as = "div",
  className = "",
  ...props
}: HTMLAttributes<HTMLElement> & { as?: GroupElement }) {
  return createElement(as, {
    ...props,
    className: `ui-reveal-group ${className}`.trim(),
  });
}

/** Keeps the actual heading, typography and line wrapping; no duplicate or split text. */
export function RevealHeading({
  delay,
  className = "",
  style,
  ...props
}: Omit<HeadingProps, "ref"> & { delay?: number }) {
  const ref = useReveal<HTMLHeadingElement>();
  return (
    <Heading
      {...props}
      ref={ref}
      className={`ui-reveal ${className}`.trim()}
      style={revealStyle(style, delay)}
    />
  );
}
