const REVIEW_SOURCE_LABELS: Record<string, string> = {
 site: 'FamilyDent',
 google: 'Google Maps',
 yandex: 'Яндекс Карты',
};

const REVIEW_SOURCE_CLASSES: Record<string, string> = {
 site: 'bg-primary/10 text-primary border-primary/20',
 google: 'bg-blue-50 text-blue-700 border-blue-100',
 yandex: 'bg-red-50 text-red-700 border-red-100',
};

export function getReviewSourceLabel(source?: string) {
 return REVIEW_SOURCE_LABELS[source || 'site'] || REVIEW_SOURCE_LABELS.site;
}

export function getReviewSourceClassName(source?: string) {
 return REVIEW_SOURCE_CLASSES[source || 'site'] || REVIEW_SOURCE_CLASSES.site;
}
