/** Read the canonical CSS token when a browser API (canvas/matchMedia) needs a value. */
export function readCssToken(name: `--${string}`, element?: Element): string {
  if (typeof document === "undefined") return "";
  return getComputedStyle(element ?? document.documentElement)
    .getPropertyValue(name)
    .trim();
}

/** Read a CSS duration in milliseconds, accepting either CSS time unit. */
export function readCssMilliseconds(
  name: `--${string}`,
  element?: Element,
): number {
  const value = readCssToken(name, element);
  const match = value.match(/^([\d.]+)(ms|s)$/);
  if (!match) return 0;
  const amount = Number(match[1]);
  return Number.isFinite(amount) ? amount * (match[2] === "s" ? 1000 : 1) : 0;
}
