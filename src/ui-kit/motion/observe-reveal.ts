/** Progressive enhancement: content is visible until a supported browser observes it. */
export function observeReveal(element: HTMLElement): () => void {
  const view = element.ownerDocument.defaultView;
  if (!view || !("IntersectionObserver" in view) || !view.matchMedia)
    return () => {};

  const preference = view.matchMedia("(prefers-reduced-motion: reduce)");
  if (preference.matches) return () => {};

  const bounds = element.getBoundingClientRect();
  // Keep the first screen, restored scroll positions and initial focus immediately readable.
  if (
    (bounds.width > 0 && bounds.top < view.innerHeight) ||
    element.contains(element.ownerDocument.activeElement)
  ) {
    return () => {};
  }

  let finished = false;
  const observer = new view.IntersectionObserver(
    (entries) => {
      if (
        entries.some(
          (entry) => entry.target === element && entry.isIntersecting,
        )
      )
        reveal();
    },
    { threshold: 0 },
  );

  function reveal() {
    if (finished) return;
    finished = true;
    element.dataset.revealState = preference.matches ? "done" : "entering";
    observer.disconnect();
  }
  function finish() {
    finished = true;
    element.dataset.revealState = "done";
    observer.disconnect();
  }
  function onPreferenceChange() {
    if (preference.matches) finish();
  }
  function onAnimationEnd(event: AnimationEvent) {
    if (event.target === element && event.animationName === "ui-reveal-enter")
      finish();
  }

  element.dataset.revealState = "pending";
  element.addEventListener("focusin", finish);
  element.addEventListener("animationend", onAnimationEnd);
  preference.addEventListener("change", onPreferenceChange);
  observer.observe(element);

  return () => {
    finished = true;
    observer.disconnect();
    element.removeEventListener("focusin", finish);
    element.removeEventListener("animationend", onAnimationEnd);
    preference.removeEventListener("change", onPreferenceChange);
    delete element.dataset.revealState;
  };
}
