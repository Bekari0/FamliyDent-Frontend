import { useEffect, useRef } from 'react';

interface Location {
  center: [number, number];
  address: string;
  title: string;
  phone: string;
}

interface YandexMapProps {
  locations: Location[];
  defaultCenter?: [number, number];
  defaultZoom?: number;
  className?: string;
}

export function YandexMap({ 
  locations, 
  defaultCenter = [38.553205, 68.791215],
  defaultZoom = 12,
  className = "w-full h-full"
}: YandexMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    const initMap = () => {
      if (!mapRef.current || !window.ymaps) return;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
      }

      const map = new window.ymaps.Map(mapRef.current, {
        center: defaultCenter,
        zoom: defaultZoom,
        controls: ['zoomControl', 'fullscreenControl']
      });

      locations.forEach((loc) => {
        const placemark = new window.ymaps.Placemark(
          loc.center,
          {
            balloonContentHeader: `<div class="font-bold text-primary p-1">${loc.title}</div>`,
            balloonContentBody: `<div class="text-slate-600 text-sm px-1 pb-1">${loc.address}</div>`,
            balloonContentFooter: `<div class="font-bold text-slate-900 px-1 pb-1">${loc.phone}</div>`,
            hintContent: loc.title
          },
          {
            preset: 'islands#blueMedicalIcon',
            iconColor: '#C6A15B',
            hideIconOnBalloonOpen: false,
            balloonOffset: [3, -40]
          }
        );
        map.geoObjects.add(placemark);
      });

      mapInstanceRef.current = map;
    };
    const loadYandexMaps = () => {
      if (window.ymaps) {
        window.ymaps.ready(initMap);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://api-maps.yandex.ru/2.1/?apikey=${import.meta.env.VITE_YANDEX_MAPS_API_KEY}&lang=ru_RU`;
      script.async = true;
      script.onload = () => {
        window.ymaps.ready(initMap);
      };
      document.head.appendChild(script);
    };

    loadYandexMaps();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
      }
    };
  }, [locations, defaultCenter, defaultZoom]);

  return <div ref={mapRef} className={className} />;
}