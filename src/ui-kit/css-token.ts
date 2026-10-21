/** Read the canonical CSS token when a browser API (canvas/matchMedia) needs a value. */
export function readCssToken(name: `--${string}`, element?: Element): string {
  if (typeof document === "undefined") return "";
  return getComputedStyle(element ?? document.documentElement)
    .getPropertyValue(name)
    .trim();
}
