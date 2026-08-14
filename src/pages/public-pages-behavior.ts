import { validateUrgentRequest } from '@/components/home/home-behavior';

export interface PublicServiceCategory {
  _id: string;
  category: string;
  services: string[];
}

export interface ContactRequestForm {
  name: string;
  phone: string;
  branch: string;
  reason: string;
  preferredTime: string;
}

export interface ReviewSubmissionForm {
  appointmentId: string;
  text: string;
  rating: number;
}

export type PublicCollectionResource = 'doctors' | 'services' | 'reviews' | 'articles';
export type CollectionRenderState = 'loading' | 'error' | 'empty' | 'content';
export type DetailRenderState = 'loading' | 'not-found' | 'content';

const PUBLIC_COLLECTION_ENDPOINTS: Record<PublicCollectionResource, string> = {
  doctors: '/api/doctors',
  services: '/api/services',
  reviews: '/api/reviews/public',
  articles: '/api/articles',
};

export async function fetchPublicCollection<T>(
  resource: PublicCollectionResource,
  get: (endpoint: string) => Promise<{ data: T }>,
) {
  const response = await get(PUBLIC_COLLECTION_ENDPOINTS[resource]);
  return response.data;
}

export function getCollectionRenderState<T>({
  loading,
  error,
  items,
}: {
  loading: boolean;
  error: boolean;
  items: T[];
}): CollectionRenderState {
  if (loading) return 'loading';
  if (items.length > 0) return 'content';
  if (error) return 'error';
  return 'empty';
}

export function findServiceById<T extends { id: string }>(services: T[], id: string | undefined) {
  if (!id) return null;
  return services.find((service) => service.id === id) ?? null;
}

export function getDetailRenderState<T>({
  loading,
  item,
}: {
  loading: boolean;
  item: T | null | undefined;
}): DetailRenderState {
  if (loading) return 'loading';
  return item ? 'content' : 'not-found';
}

export function resolveSuccessfulServices(data: unknown, _fallback: PublicServiceCategory[]) {
  return Array.isArray(data) ? data as PublicServiceCategory[] : [];
}

export function resolveFailedServices(fallback: PublicServiceCategory[]) {
  return fallback;
}

export function buildDoctorEndpoint(id: string) {
  return `/api/doctors/${encodeURIComponent(id)}`;
}

export function buildArticleEndpoint(id: string) {
  return `/api/articles/${encodeURIComponent(id)}`;
}

export function bookDoctorDetail(doctorId: string, openBooking: (doctorId: string) => void) {
  openBooking(doctorId);
}

type ContactSubmissionResult =
  | { status: 'validation-error'; message: string }
  | { status: 'success' }
  | { status: 'error'; message: string };

export async function submitContactRequest(
  form: ContactRequestForm,
  dependencies: {
    post: (endpoint: string, payload: ContactRequestForm) => Promise<unknown>;
    track: (goal: string) => void;
  },
): Promise<ContactSubmissionResult> {
  const validationError = validateUrgentRequest(form);
  if (validationError) return { status: 'validation-error', message: validationError };

  try {
    await dependencies.post('/api/urgent-requests', form);
    dependencies.track('urgent_request_submit');
    return { status: 'success' };
  } catch (error: any) {
    return {
      status: 'error',
      message: error?.response?.data?.error || 'Не удалось отправить заявку',
    };
  }
}

export function resolveAvailableReviewAppointments(data: unknown, currentAppointmentId: string) {
  const appointments = Array.isArray(data) ? data : [];
  const first = appointments[0];
  return {
    appointments,
    appointmentId: currentAppointmentId || first?._id || first?.id || '',
  };
}

export function getReviewSubmissionError(form: ReviewSubmissionForm) {
  if (!form.appointmentId) return 'Выберите завершенный прием';
  if (form.text.trim().length < 10) return 'Напишите отзыв не короче 10 символов';
  return null;
}

export async function submitReviewForModeration(
  form: ReviewSubmissionForm,
  post: (endpoint: string, payload: ReviewSubmissionForm) => Promise<unknown>,
) {
  await post('/api/reviews', form);
}

export function buildArticleShareUrls(articleUrl: string, shareTitle: string) {
  return {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(shareTitle)}`,
  };
}

export async function copyArticleUrl(
  articleUrl: string,
  dependencies: {
    secureContext: boolean;
    writeClipboard: (value: string) => Promise<void>;
    fallbackCopy: (value: string) => void;
  },
) {
  if (dependencies.secureContext) {
    await dependencies.writeClipboard(articleUrl);
    return;
  }
  dependencies.fallbackCopy(articleUrl);
}
