import { useEffect, useState } from "react";

export function ContentStatusNotice() {
  const [unavailable, setUnavailable] = useState(false);
  useEffect(() => {
    const show = () => setUnavailable(true);
    window.addEventListener("familydent:content-unavailable", show);
    return () => window.removeEventListener("familydent:content-unavailable", show);
  }, []);
  if (!unavailable) return null;
  return (
    <div role="status" className="border-b border-rule bg-paper-2 px-5 py-3 text-center text-sm text-ink">
      Часть данных временно недоступна.{" "}
      <button type="button" className="underline underline-offset-4" onClick={() => window.location.reload()}>Обновить страницу</button>
      {" "}или <a href="tel:+992446606600" className="underline underline-offset-4">связаться с клиникой</a>.
    </div>
  );
}
