export const section = 'relative overflow-hidden bg-[radial-gradient(ellipse_90%_70%_at_50%_30%,#DCEEF8_0%,#CFE5F1_100%)] pt-28 pb-10 md:pt-32';
export const container = 'container mx-auto px-4 sm:px-6 lg:px-8';

/* Заголовок: тёмная часть слева, светлая справа, кристальный зуб по центру */
export const headlineWrap = 'relative';
export const titleDark = 'relative block max-w-3xl text-[clamp(2.6rem,6.4vw,6rem)] font-light tracking-[-0.04em] text-foreground leading-[1.05] text-balance';
export const titleLight = 'relative block text-right text-[clamp(2.2rem,5.4vw,5.25rem)] font-light tracking-[-0.03em] text-white/80 leading-[1.05] lg:-mt-24';
export const heroImage = 'pointer-events-none relative z-10 mx-auto -mt-6 w-72 select-none mix-blend-multiply [mask-image:radial-gradient(ellipse_58%_58%_at_center,black_40%,transparent_80%)] sm:w-96 lg:absolute lg:left-1/2 lg:top-1/2 lg:mt-0 lg:w-[620px] lg:-translate-x-[46%] lg:-translate-y-[46%] xl:w-[720px]';

/* Нижний ряд */
export const bottomRow = 'mt-10 flex flex-col gap-10 lg:mt-24 lg:flex-row lg:items-end lg:justify-between';
export const bottomLeft = 'max-w-xl';
export const desc = 'text-lg font-normal leading-[1.55] text-foreground text-pretty sm:text-[22px]';
export const actionsRow = 'mt-10 flex flex-wrap items-center gap-[18px]';
export const btnSplit = 'group inline-flex items-stretch';
export const btnSplitMain = 'inline-flex h-14 items-center rounded-l-[7px] bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors group-hover:bg-primary-hover';
export const btnSplitChip = 'ml-px inline-flex h-14 w-14 items-center justify-center rounded-r-[7px] bg-primary text-primary-foreground transition-colors group-hover:bg-primary-hover';
export const socialGroup = 'inline-flex items-center gap-1';
export const socialBtn = 'inline-flex h-14 w-14 items-center justify-center rounded-[7px] bg-card text-foreground shadow-sm transition-colors hover:bg-secondary';

/* Правый блок: стат-карточка + фото с play */
export const bottomRight = 'flex items-stretch gap-3.5';
export const statCard = 'flex h-[275px] w-56 flex-col justify-between rounded-[14px] bg-primary p-6 text-primary-foreground sm:w-[275px]';
export const statCaption = 'text-[15px] font-normal leading-[1.45] text-primary-foreground/95';
export const statValue = 'text-[clamp(4rem,6vw,6rem)] font-light leading-[0.9] tracking-[-0.04em]';
export const photoCard = 'relative hidden h-[275px] w-[375px] overflow-hidden rounded-[14px] sm:block';
export const photoImg = 'absolute inset-0 h-full w-full object-cover';
export const playBtn = 'absolute left-9 top-12 z-10 flex h-[72px] w-[72px] items-center justify-center rounded-full bg-card text-primary shadow-md transition-transform hover:scale-105';

/* Полоса партнёров */
export const partnersStrip = 'mt-16 pt-10 lg:mt-24';
export const partnersGrid = 'flex flex-wrap items-center justify-between gap-x-10 gap-y-6';
export const partnerItem = 'inline-flex items-center gap-2.5 text-sm font-semibold tracking-wide text-primary/80';
