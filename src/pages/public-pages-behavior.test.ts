import assert from 'node:assert/strict';
import test from 'node:test';
import {
  bookDoctorDetail,
  buildArticleEndpoint,
  buildArticleShareUrls,
  buildDoctorEndpoint,
  copyArticleUrl,
  getReviewSubmissionError,
  resolveAvailableReviewAppointments,
  resolveFailedServices,
  resolveSuccessfulServices,
  submitContactRequest,
  submitReviewForModeration,
} from './public-pages-behavior';

test('successful empty services response stays empty while failure uses fallback', () => {
  const fallback = [{ _id: 'fallback', category: 'Fallback', services: ['Fallback'] }];
  assert.deepEqual(resolveSuccessfulServices([], fallback), []);
  assert.deepEqual(resolveSuccessfulServices('invalid', fallback), []);
  assert.equal(resolveFailedServices(fallback), fallback);
});

test('detail endpoint builders preserve the selected route parameter', () => {
  assert.equal(buildDoctorEndpoint('doctor 7'), '/api/doctors/doctor%207');
  assert.equal(buildArticleEndpoint('care/tips'), '/api/articles/care%2Ftips');
});

test('doctor detail booking delegates the selected doctor to openBooking', () => {
  const calls: string[] = [];
  bookDoctorDetail('doctor-7', (doctorId) => calls.push(doctorId));
  assert.deepEqual(calls, ['doctor-7']);
});

test('contact validation blocks incomplete payloads without posting', async () => {
  let posted = false;
  const result = await submitContactRequest(
    { name: ' ', phone: '+992', branch: '', reason: 'Боль', preferredTime: '' },
    { post: async () => { posted = true; }, track: () => {} },
  );
  assert.equal(posted, false);
  assert.equal(result.status, 'validation-error');
});

test('contact submission preserves endpoint, payload identity, analytics, and success state', async () => {
  const form = { name: 'Али', phone: '+992', branch: 'Айни', reason: 'Боль', preferredTime: '15:00' };
  const events: string[] = [];
  let postedPayload: unknown;
  const result = await submitContactRequest(form, {
    post: async (endpoint, payload) => { events.push(`post:${endpoint}`); postedPayload = payload; },
    track: (goal) => events.push(`track:${goal}`),
  });
  assert.equal(postedPayload, form);
  assert.deepEqual(events, ['post:/api/urgent-requests', 'track:urgent_request_submit']);
  assert.equal(result.status, 'success');
});

test('contact submission exposes the backend error state', async () => {
  const result = await submitContactRequest(
    { name: 'Али', phone: '+992', branch: '', reason: 'Боль', preferredTime: '' },
    { post: async () => { throw { response: { data: { error: 'Прием заявок временно недоступен' } } }; }, track: () => {} },
  );
  assert.deepEqual(result, { status: 'error', message: 'Прием заявок временно недоступен' });
});

test('review eligibility selects only returned appointments and preserves the existing choice', () => {
  assert.deepEqual(resolveAvailableReviewAppointments('invalid', ''), { appointments: [], appointmentId: '' });
  const appointments = [{ _id: 'visit-1' }, { id: 'visit-2' }];
  assert.deepEqual(resolveAvailableReviewAppointments(appointments, ''), { appointments, appointmentId: 'visit-1' });
  assert.deepEqual(resolveAvailableReviewAppointments(appointments, 'visit-2'), { appointments, appointmentId: 'visit-2' });
});

test('review moderation validation and action preserve the eligibility rules and payload', async () => {
  assert.equal(getReviewSubmissionError({ appointmentId: '', text: 'Отличный прием', rating: 5 }), 'Выберите завершенный прием');
  assert.equal(getReviewSubmissionError({ appointmentId: 'visit-1', text: 'Коротко', rating: 5 }), 'Напишите отзыв не короче 10 символов');
  const form = { appointmentId: 'visit-1', text: 'Очень внимательный врач', rating: 5 };
  let postedPayload: unknown;
  await submitReviewForModeration(form, async (endpoint, payload) => {
    assert.equal(endpoint, '/api/reviews');
    postedPayload = payload;
  });
  assert.equal(postedPayload, form);
});

test('article sharing builds encoded provider URLs and copy chooses the supported mechanism', async () => {
  assert.deepEqual(buildArticleShareUrls('https://familydent.tj/blog/a b', 'Уход & здоровье'), {
    facebook: 'https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Ffamilydent.tj%2Fblog%2Fa%20b',
    twitter: 'https://twitter.com/intent/tweet?url=https%3A%2F%2Ffamilydent.tj%2Fblog%2Fa%20b&text=%D0%A3%D1%85%D0%BE%D0%B4%20%26%20%D0%B7%D0%B4%D0%BE%D1%80%D0%BE%D0%B2%D1%8C%D0%B5',
  });
  const events: string[] = [];
  await copyArticleUrl('secure-url', { secureContext: true, writeClipboard: async (value) => { events.push(`clipboard:${value}`); }, fallbackCopy: (value) => events.push(`fallback:${value}`) });
  await copyArticleUrl('fallback-url', { secureContext: false, writeClipboard: async (value) => { events.push(`clipboard:${value}`); }, fallbackCopy: (value) => events.push(`fallback:${value}`) });
  assert.deepEqual(events, ['clipboard:secure-url', 'fallback:fallback-url']);
});
