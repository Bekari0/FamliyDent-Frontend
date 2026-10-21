import assert from "node:assert/strict";
import test from "node:test";
import { observeReveal } from "./observe-reveal";

function fixture({
  top = 1500,
  height = 500,
  reduce = false,
  supported = true,
} = {}) {
  const observers: TestObserver[] = [];
  class TestObserver {
    disconnected = false;
    constructor(
      public callback: (
        entries: { target: HTMLElement; isIntersecting: boolean }[],
      ) => void,
    ) {
      observers.push(this);
    }
    observe() {}
    disconnect() {
      this.disconnected = true;
    }
  }
  const preference = Object.assign(new EventTarget(), { matches: reduce });
  const view = {
    innerHeight: 800,
    matchMedia: () => preference,
    ...(supported ? { IntersectionObserver: TestObserver } : {}),
  };
  class TestElement extends EventTarget {
    dataset: Record<string, string> = {};
    ownerDocument = { defaultView: view, activeElement: null };
    getBoundingClientRect() {
      return { top, bottom: top + height, height, width: 300 };
    }
    contains() {
      return false;
    }
  }
  const element = new TestElement() as unknown as HTMLElement;
  return {
    element,
    observers,
    preference,
    enter: () =>
      observers[0].callback([{ target: element, isIntersecting: true }]),
  };
}

test("the first screen, reduced motion and browsers without observers never hide content", () => {
  for (const options of [
    { top: 100 },
    { reduce: true },
    { supported: false },
  ]) {
    const f = fixture(options);
    const cleanup = observeReveal(f.element);
    assert.equal(f.element.dataset.revealState, undefined);
    assert.equal(f.observers.length, 0);
    cleanup();
  }
});

test("an offscreen block reveals once, including blocks taller than the viewport", () => {
  const f = fixture({ height: 12000 });
  const cleanup = observeReveal(f.element);
  assert.equal(f.element.dataset.revealState, "pending");
  f.enter();
  assert.equal(f.element.dataset.revealState, "entering");
  assert.ok(f.observers[0].disconnected);
  f.observers[0].callback([{ target: f.element, isIntersecting: false }]);
  assert.equal(f.element.dataset.revealState, "entering");
  f.element.dispatchEvent(
    Object.assign(new Event("animationend"), { animationName: "unrelated" }),
  );
  assert.equal(f.element.dataset.revealState, "entering");
  f.element.dispatchEvent(
    Object.assign(new Event("animationend"), {
      animationName: "ui-reveal-enter",
    }),
  );
  assert.equal(f.element.dataset.revealState, "done");
  cleanup();
});

test("keyboard focus and a changed motion preference immediately expose pending content", () => {
  const focused = fixture();
  const cleanupFocus = observeReveal(focused.element);
  focused.element.dispatchEvent(new Event("focusin"));
  assert.equal(focused.element.dataset.revealState, "done");
  assert.ok(focused.observers[0].disconnected);
  cleanupFocus();

  const changed = fixture();
  const cleanupPreference = observeReveal(changed.element);
  changed.preference.matches = true;
  changed.preference.dispatchEvent(new Event("change"));
  assert.equal(changed.element.dataset.revealState, "done");
  cleanupPreference();
});

test("unmounting disconnects observation and ignores callbacks already queued by the browser", () => {
  const f = fixture();
  const cleanup = observeReveal(f.element);
  cleanup();
  f.enter();
  f.element.dispatchEvent(new Event("focusin"));
  assert.equal(f.element.dataset.revealState, undefined);
  assert.ok(f.observers[0].disconnected);
});
