import { useEffect, type KeyboardEvent, type RefObject } from 'react';

export interface FocusTarget {
  focus: () => void;
}

export function createDialogFocusLifecycle(initialFocus: FocusTarget | null, previousFocus: FocusTarget | null) {
  initialFocus?.focus();
  return () => previousFocus?.focus();
}

export function getDialogKeyAction(key: string): 'close' | 'trap' | null {
  if (key === 'Escape') return 'close';
  if (key === 'Tab') return 'trap';
  return null;
}

export function getDialogTrapTarget<T extends FocusTarget>(focusables: T[], active: FocusTarget | null, backwards: boolean): T | null {
  if (focusables.length === 0) return null;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (backwards && (active === first || !focusables.includes(active as T))) return last;
  if (!backwards && (active === last || !focusables.includes(active as T))) return first;
  return null;
}

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export function useAccessibleDialog(
  dialogRef: RefObject<HTMLElement | null>,
  initialFocusRef: RefObject<HTMLElement | null>,
  onClose: () => void,
) {
  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    return createDialogFocusLifecycle(initialFocusRef.current, previousFocus);
  }, [initialFocusRef]);

  return (event: KeyboardEvent<HTMLElement>) => {
    const action = getDialogKeyAction(event.key);
    if (action === 'close') {
      event.preventDefault();
      onClose();
      return;
    }
    if (action !== 'trap') return;

    const focusables = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? []);
    const active = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const target = getDialogTrapTarget(focusables, active, event.shiftKey);
    if (target) {
      event.preventDefault();
      target.focus();
    }
  };
}
