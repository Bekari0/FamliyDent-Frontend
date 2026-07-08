export const section = 'relative overflow-hidden bg-gradient-to-b from-secondary via-secondary to-background pt-24 pb-10 md:pt-28';
export const container = 'container mx-auto px-4 sm:px-6 lg:px-8';

/* Заголовок: тёмная часть слева, светлая справа, кристальный зуб по центру */
export const headlineWrap = 'relative';
export const titleDark = 'relative block max-w-3xl text-[clamp(2.6rem,6.2vw,5.5rem)] font-semibold tracking-tight text-foreground leading-[1.04] text-balance';
export const titleLight = 'relative block text-right text-[clamp(2.2rem,5.2vw,4.5rem)] font-medium tracking-tight text-primary-foreground leading-[1.08] lg:-mt-24';
export const heroImage = 'pointer-events-none relative z-10 mx-auto -mt-6 w-72 select-none mix-blend-multiply [mask-image:radial-gradient(ellipse_58%_58%_at_center,black_40%,transparent_80%)] sm:w-96 lg:absolute lg:left-1/2 lg:top-1/2 lg:mt-0 lg:w-[620px] lg:-translate-x-[46%] lg:-translate-y-[46%] xl:w-[720px]';

/* Нижний ряд */
export const bottomRow = 'mt-10 flex flex-col gap-8 lg:mt-20 lg:flex-row lg:items-end lg:justify-between';
export const bottomLeft = 'max-w-md';
export const desc = 'text-base leading-relaxed text-muted-foreground sm:text-lg text-pretty';
export const actionsRow = 'mt-7 flex flex-wrap items-center gap-4';
export const btnSplit = 'group inline-flex items-stretch';
export const btnSplitMain = 'inline-flex h-12 items-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors group-hover:bg-primary-hover';
export const btnSplitChip = 'ml-1 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors group-hover:bg-primary-hover';
export const socialGroup = 'inline-flex items-center gap-1 rounded-full bg-card p-1 shadow-sm';
export const socialBtn = 'inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary';

/* Правый блок: стат-карточка + фото с play */
export const bottomRight = 'flex items-stretch gap-3';
export const statCard = 'flex w-48 flex-col justify-between gap-8 rounded-xl bg-primary p-5 text-primary-foreground';
export const statCaption = 'text-xs font-medium leading-snug text-primary-foreground/85';
export const statValue = 'text-6xl font-semibold tracking-tight';
export const photoCard = 'relative hidden w-64 overflow-hidden rounded-xl sm:block';
export const photoImg = 'absolute inset-0 h-full w-full object-cover';
export const playBtn = 'absolute left-1/2 top-1/2 z-10 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-card text-foreground shadow-md transition-transform hover:scale-105';

/* Полоса партнёров */
export const partnersStrip = 'mt-16 border-t border-border/60 pt-10 lg:mt-24';
export const partnersGrid = 'flex flex-wrap items-center justify-between gap-x-10 gap-y-6';
export const partnerItem = 'inline-flex items-center gap-2.5 text-sm font-semibold tracking-wide text-primary/70';
