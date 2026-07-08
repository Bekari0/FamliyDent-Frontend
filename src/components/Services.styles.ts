export const section = 'overflow-hidden bg-card py-16 lg:py-24';
export const container = 'container relative mx-auto px-4 sm:px-6 lg:px-8';

/* Центральный блок */
export const centerCircle = 'pointer-events-none absolute left-1/2 top-1/2 -z-0 hidden h-[720px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary lg:block';
export const layout = 'relative grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-8';
export const centerCol = 'order-first flex flex-col items-center justify-center gap-8 py-6 text-center lg:order-none lg:py-20';
export const kicker = 'inline-flex items-center rounded-full border border-foreground/25 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground';
export const title = 'max-w-full text-[clamp(1.8rem,3.1vw,3rem)] font-semibold leading-[1.1] tracking-tight text-primary text-balance';
export const btnSplit = 'group inline-flex items-stretch';
export const btnSplitMain = 'inline-flex h-12 items-center rounded-l-lg bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors group-hover:bg-primary-hover';
export const btnSplitChip = 'ml-px inline-flex h-12 w-12 items-center justify-center rounded-r-lg bg-primary text-primary-foreground transition-colors group-hover:bg-primary-hover';

/* Колонки карточек */
export const sideCol = 'flex flex-col gap-8 lg:gap-12';
export const sideColRight = 'flex flex-col gap-8 lg:gap-12 lg:pt-0';

export const card = 'group relative z-10 flex flex-col overflow-hidden rounded-xl border border-primary/30 bg-card p-3 transition-shadow hover:shadow-md';
export const cardActive = 'group relative z-10 flex flex-col overflow-hidden rounded-xl bg-[#A8CBE4] p-3 transition-shadow hover:shadow-md';
export const cardImage = 'aspect-[4/3] w-full rounded-lg object-cover';
export const cardBody = 'flex flex-col gap-1 px-2 pb-2 pt-4';
export const cardTitle = 'text-lg font-semibold text-foreground';
export const cardSub = 'text-sm text-muted-foreground';

/* Смещения для «живой» раскладки как в макете */
export const offsetNone = '';
export const offsetMd = 'lg:mt-10';
export const offsetLg = 'lg:mt-20';
