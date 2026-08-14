export interface UrgentRequestForm {
  name: string;
  phone: string;
  branch: string;
  reason: string;
  preferredTime: string;
}

export function validateUrgentRequest(form: UrgentRequestForm): string | null {
  return !form.name.trim() || !form.phone.trim() || !form.reason.trim()
    ? 'Укажите имя, телефон и причину обращения'
    : null;
}

interface UrgentRequestDependencies {
  post: (endpoint: string, payload: UrgentRequestForm) => Promise<unknown>;
  track: (goal: string) => void;
  notifySuccess: () => void;
  close: () => void;
}

export async function submitUrgentRequest(form: UrgentRequestForm, dependencies: UrgentRequestDependencies) {
  await dependencies.post('/api/urgent-requests', form);
  dependencies.track('urgent_request_submit');
  dependencies.notifySuccess();
  dependencies.close();
}

export function openDoctorBooking(
  doctorId: string,
  dependencies: { closeDetail: () => void; openBooking: (doctorId: string) => void },
) {
  dependencies.closeDetail();
  dependencies.openBooking(doctorId);
}

export type ReviewsRequestState<T = any> =
  | { status: 'loading'; reviews: T[] }
  | { status: 'error'; reviews: T[] }
  | { status: 'empty'; reviews: T[] }
  | { status: 'content'; reviews: T[] };

export function createInitialReviewsState<T = any>(): ReviewsRequestState<T> {
  return { status: 'loading', reviews: [] };
}

export function createReviewsErrorState<T = any>(): ReviewsRequestState<T> {
  return { status: 'error', reviews: [] };
}

export function createReviewsSuccessState<T = any>(data: unknown): ReviewsRequestState<T> {
  const reviews = Array.isArray(data) ? data as T[] : [];
  return reviews.length === 0 ? { status: 'empty', reviews } : { status: 'content', reviews };
}

export function getReviewsFallback<T>(state: ReviewsRequestState<T>) {
  if (state.status === 'loading') return { role: 'status' as const, tone: 'muted' as const, message: 'Загружаем отзывы пациентов…' };
  if (state.status === 'error') return { role: 'alert' as const, tone: 'error' as const, message: 'Не удалось загрузить отзывы. Пожалуйста, попробуйте обновить страницу позже.' };
  if (state.status === 'empty') return { role: 'status' as const, tone: 'muted' as const, message: 'Пока нет опубликованных отзывов.' };
  return null;
}

export function shouldMountClinicVideo(state: { isInView: boolean; reduceMotion: boolean; saveData: boolean; mediaFailed: boolean }) {
  return state.isInView && !state.reduceMotion && !state.saveData && !state.mediaFailed;
}

export function clampComparisonPosition(position: number) {
  return Math.min(100, Math.max(0, position));
}

export function getAfterRevealPercent(position: number) {
  return 100 - clampComparisonPosition(position);
}

export function getHorizontalWheelDecision(input: { scrollLeft: number; maxScrollLeft: number; deltaX: number; deltaY: number }) {
  const delta = Math.abs(input.deltaX) > Math.abs(input.deltaY) ? input.deltaX : input.deltaY;
  const nextScrollLeft = Math.max(0, Math.min(input.maxScrollLeft, input.scrollLeft + delta));
  return { consumed: nextScrollLeft !== input.scrollLeft, nextScrollLeft };
}

export function getHomeMotionProps<TInitial extends object, TTransition extends object>(
  reduceMotion: boolean,
  initial: TInitial,
  transition: TTransition,
) {
  return reduceMotion
    ? { initial: false as const, transition: { duration: 0, delay: 0 } }
    : { initial, transition };
}
