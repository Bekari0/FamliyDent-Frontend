// Базовые контейнеры
export const page = "min-h-screen bg-white";

export const container = "container mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-20";

// Хлебные крошки
export const breadcrumbWrapper = "pt-8 pb-4";
export const breadcrumb = "flex items-center gap-2 text-sm text-slate-500";
export const breadcrumbLink = "hover:text-primary transition-colors flex items-center gap-1";
export const breadcrumbActive = "text-slate-900 font-medium";

// Секция заголовка
export const headerSection = "py-8 sm:py-12";
export const headerInner = "text-center max-w-3xl mx-auto";
export const headerBadge = "mb-4 sm:mb-6 rounded-full px-4 sm:px-6 py-1.5 sm:py-2 bg-primary/10 text-primary text-xs sm:text-sm border-0";
export const headerTitle = "text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-4 sm:mb-6 leading-tight";
export const headerTitleSpan = "text-primary";
export const headerDesc = "text-base sm:text-lg text-slate-600";

// Секция сетки
export const gridSection = "py-12 sm:py-16";
export const grid = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8";

// Карточка
export const card = "group h-full overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-md rounded-xl";
export const cardGradient = "h-1.5 bg-gradient-to-r";
export const cardContent = "p-5 sm:p-6";
export const cardHeader = "flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6";
export const cardIconWrapper = "w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br flex items-center justify-center shrink-0";
export const cardIcon = "w-5 h-5 sm:w-7 sm:h-7 text-white";
export const cardTitle = "text-lg sm:text-xl font-bold text-slate-900 leading-tight";

// Список услуг
export const serviceList = "space-y-2 sm:space-y-3";
export const serviceItem = "flex items-start gap-2 text-slate-600 text-sm sm:text-base";
export const serviceIcon = "w-4 h-4 mt-0.5 text-primary/60 shrink-0";
export const serviceText = "leading-relaxed";

// Кнопки
export const buttonFull = "w-full mt-6 rounded-xl bg-primary hover:bg-primary/90 h-11 sm:h-12";
export const buttonWhite = "bg-white text-primary hover:bg-slate-100 rounded-full px-6 sm:px-8 text-base sm:text-lg w-full sm:w-auto h-11 sm:h-12";

// CTA секция
export const ctaSection = "py-16 sm:py-24";
export const ctaInner = "relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-primary/90 to-accent/90 p-6 sm:p-8 md:p-12 text-center";
export const ctaBlur1 = "absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl";
export const ctaBlur2 = "absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl";
export const ctaContent = "relative z-10";
export const ctaBadge = "inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 mb-4 sm:mb-6";
export const ctaBadgeIcon = "w-4 h-4 text-white";
export const ctaBadgeText = "text-white text-xs sm:text-sm font-medium";
export const ctaTitle = "text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4 px-2";
export const ctaTitleSpan = "text-white/90";
export const ctaDesc = "text-white/90 text-sm sm:text-base mb-6 sm:mb-8 max-w-2xl mx-auto px-4";
export const ctaButtons = "flex flex-col sm:flex-row gap-4 justify-center items-center";
export const ctaPhone = "flex items-center gap-3 group";
export const ctaPhoneIcon = "w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors";
export const ctaPhoneIconInner = "w-5 h-5 sm:w-6 sm:h-6 text-white";
export const ctaPhoneText = "text-left";
export const ctaPhoneLabel = "text-white/70 text-[10px] sm:text-xs font-bold uppercase tracking-widest";
export const ctaPhoneNumber = "text-white text-base sm:text-lg md:text-xl font-bold";

// Лоадер и ошибки
export const loaderWrapper = "text-center py-20 sm:py-32";
export const loader = "inline-block h-10 w-10 sm:h-12 sm:w-12 animate-spin rounded-full border-4 border-primary border-t-transparent";
export const loaderText = "mt-4 text-slate-600 text-sm sm:text-base";
export const errorText = "text-red-500 text-sm sm:text-base";