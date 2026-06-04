import { useEffect } from "react";
import { useLocation } from "react-router-dom";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    ym?: (...args: unknown[]) => void;
  }
}

function appendScript(id: string, src: string, inline?: string) {
  if (document.getElementById(id)) return;

  const script = document.createElement("script");
  script.id = id;

  if (src) {
    script.src = src;
    script.async = true;
  }

  if (inline) script.text = inline;
  document.head.appendChild(script);
}

export function trackGoal(goal: string, params?: Record<string, unknown>) {
  const ymId = import.meta.env.VITE_YANDEX_METRIKA_ID;

  if (window.gtag) {
    window.gtag("event", goal, params || {});
  }

  if (window.ym && ymId) {
    window.ym(Number(ymId), "reachGoal", goal, params);
  }
}

export function Analytics() {
  const location = useLocation();

  useEffect(() => {
    const gaId = import.meta.env.VITE_GA_ID;
    const ymId = import.meta.env.VITE_YANDEX_METRIKA_ID;

    if (gaId) {
      appendScript(
        "ga-script",
        `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`,
      );
      appendScript(
        "ga-inline",
        "",
        `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('js',new Date());gtag('config','${gaId}',{send_page_view:false});`,
      );
    }

    if (ymId) {
      appendScript(
        "ym-inline",
        "",
        `(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
(window,document,'script','https://mc.yandex.ru/metrika/tag.js','ym');
ym(${Number(ymId)},'init',{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true});`,
      );
    }
  }, []);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const link = target?.closest?.("a[href]") as HTMLAnchorElement | null;
      const href = link?.getAttribute("href") || "";

      if (href.startsWith("tel:")) trackGoal("phone_click", { href });
      if (href.startsWith("mailto:")) trackGoal("email_click", { href });
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    const url = `${location.pathname}${location.search}`;

    if (window.gtag && import.meta.env.VITE_GA_ID) {
      window.gtag("config", import.meta.env.VITE_GA_ID, {
        page_path: url,
      });
    }

    if (window.ym && import.meta.env.VITE_YANDEX_METRIKA_ID) {
      window.ym(Number(import.meta.env.VITE_YANDEX_METRIKA_ID), "hit", url);
    }
  }, [location.pathname, location.search]);

  return null;
}
