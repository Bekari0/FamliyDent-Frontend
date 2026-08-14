import assert from 'node:assert/strict';
import test from 'node:test';
import {
  clampComparisonPosition,
  createInitialReviewsState,
  createReviewsErrorState,
  createReviewsSuccessState,
  getAfterRevealPercent,
  getHorizontalWheelDecision,
  getHomeMotionProps,
  getReviewsFallback,
  openDoctorBooking,
  shouldMountClinicVideo,
  submitUrgentRequest,
  validateUrgentRequest,
} from './home-behavior';
import {
  createDialogFocusLifecycle,
  getDialogKeyAction,
  getDialogTrapTarget,
} from './use-accessible-dialog';

test('urgent request validation rejects missing required fields', () => {
  assert.equal(validateUrgentRequest({ name: ' ', phone: '+992', branch: '', reason: 'Боль', preferredTime: '' }), 'Укажите имя, телефон и причину обращения');
  assert.equal(validateUrgentRequest({ name: 'Али', phone: '+992', branch: '', reason: 'Боль', preferredTime: '' }), null);
});

test('urgent request submission preserves endpoint, payload identity, and callback order', async () => {
  const form = { name: 'Али', phone: '+992', branch: 'Айни', reason: 'Боль', preferredTime: '15:00' };
  const events: string[] = [];
  let postedPayload: unknown;

  await submitUrgentRequest(form, {
    post: async (endpoint, payload) => { events.push(`post:${endpoint}`); postedPayload = payload; },
    track: (goal) => events.push(`track:${goal}`),
    notifySuccess: () => events.push('success'),
    close: () => events.push('close'),
  });

  assert.equal(postedPayload, form);
  assert.deepEqual(events, ['post:/api/urgent-requests', 'track:urgent_request_submit', 'success', 'close']);
});

test('doctor booking closes detail before opening the selected doctor workflow', () => {
  const events: string[] = [];
  openDoctorBooking('doctor-7', { closeDetail: () => events.push('close'), openBooking: (id) => events.push(`book:${id}`) });
  assert.deepEqual(events, ['close', 'book:doctor-7']);
});

test('review request states distinguish loading, error, empty, and content', () => {
  assert.deepEqual(createInitialReviewsState(), { status: 'loading', reviews: [] });
  assert.deepEqual(createReviewsErrorState(), { status: 'error', reviews: [] });
  assert.deepEqual(createReviewsSuccessState('invalid'), { status: 'empty', reviews: [] });
  const reviews = [{ id: 'review-1' }];
  assert.deepEqual(createReviewsSuccessState(reviews), { status: 'content', reviews });
});

test('review render decisions expose distinct accessible fallbacks', () => {
  assert.deepEqual(getReviewsFallback({ status: 'loading', reviews: [] }), { role: 'status', tone: 'muted', message: 'Загружаем отзывы пациентов…' });
  assert.deepEqual(getReviewsFallback({ status: 'error', reviews: [] }), { role: 'alert', tone: 'error', message: 'Не удалось загрузить отзывы. Пожалуйста, попробуйте обновить страницу позже.' });
  assert.deepEqual(getReviewsFallback({ status: 'empty', reviews: [] }), { role: 'status', tone: 'muted', message: 'Пока нет опубликованных отзывов.' });
  assert.equal(getReviewsFallback({ status: 'content', reviews: [{ id: 'review-1' }] }), null);
});

test('clinic video gating honors visibility, reduced motion, save-data, and failure', () => {
  assert.equal(shouldMountClinicVideo({ isInView: true, reduceMotion: false, saveData: false, mediaFailed: false }), true);
  for (const blocked of [
    { isInView: false, reduceMotion: false, saveData: false, mediaFailed: false },
    { isInView: true, reduceMotion: true, saveData: false, mediaFailed: false },
    { isInView: true, reduceMotion: false, saveData: true, mediaFailed: false },
    { isInView: true, reduceMotion: false, saveData: false, mediaFailed: true },
  ]) assert.equal(shouldMountClinicVideo(blocked), false);
});

test('treatment comparison clamps the control and derives the after reveal', () => {
  assert.equal(clampComparisonPosition(-4), 0);
  assert.equal(clampComparisonPosition(44), 44);
  assert.equal(clampComparisonPosition(120), 100);
  assert.equal(getAfterRevealPercent(25), 75);
});

test('horizontal wheel consumes only movement the review rail can use', () => {
  assert.deepEqual(getHorizontalWheelDecision({ scrollLeft: 0, maxScrollLeft: 400, deltaX: 0, deltaY: -50 }), { consumed: false, nextScrollLeft: 0 });
  assert.deepEqual(getHorizontalWheelDecision({ scrollLeft: 400, maxScrollLeft: 400, deltaX: 0, deltaY: 50 }), { consumed: false, nextScrollLeft: 400 });
  assert.deepEqual(getHorizontalWheelDecision({ scrollLeft: 100, maxScrollLeft: 400, deltaX: 0, deltaY: 50 }), { consumed: true, nextScrollLeft: 150 });
});

test('home motion props eliminate JS entrance motion when reduced motion is requested', () => {
  const initial = { opacity: 0, y: 20 };
  const transition = { duration: 0.6, delay: 0.2 };
  assert.deepEqual(getHomeMotionProps(false, initial, transition), { initial, transition });
  assert.deepEqual(getHomeMotionProps(true, initial, transition), { initial: false, transition: { duration: 0, delay: 0 } });
});

test('dialog focus lifecycle focuses initially and restores the opener', () => {
  const events: string[] = [];
  const restore = createDialogFocusLifecycle({ focus: () => events.push('initial') }, { focus: () => events.push('restore') });
  restore();
  assert.deepEqual(events, ['initial', 'restore']);
});

test('dialog keyboard decisions close on Escape and wrap focus at both edges', () => {
  const first = { focus() {} };
  const middle = { focus() {} };
  const last = { focus() {} };
  const focusables = [first, middle, last];
  assert.equal(getDialogKeyAction('Escape'), 'close');
  assert.equal(getDialogKeyAction('Tab'), 'trap');
  assert.equal(getDialogTrapTarget(focusables, last, false), first);
  assert.equal(getDialogTrapTarget(focusables, first, true), last);
  assert.equal(getDialogTrapTarget(focusables, middle, false), null);
});
