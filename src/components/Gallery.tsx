const PHOTOS = [
  {
    src: '/images/gallery-chair.png',
    alt: 'Современная стоматологическая установка в кабинете FamilyDent',
    className: 'col-span-2 row-span-2',
  },
  {
    src: '/images/gallery-smile.png',
    alt: 'Пациентка с красивой улыбкой в кресле клиники',
    className: 'col-span-2 row-span-3',
  },
  {
    src: '/images/gallery-doctor.png',
    alt: 'Врач изучает панорамный снимок зубов',
    className: 'col-span-2 row-span-2',
  },
  {
    src: '/images/tech-aligner.png',
    alt: 'Прозрачные элайнеры для выравнивания зубов',
    className: 'col-span-1 row-span-1',
  },
  {
    src: '/images/clinic-room.png',
    alt: 'Интерьер кабинета клиники FamilyDent',
    className: 'col-span-1 row-span-1',
  },
  {
    src: '/offerImage.jpg',
    alt: 'Ресепшн клиники FamilyDent',
    className: 'col-span-2 row-span-1',
  },
];

export function Gallery() {
  return (
    <section className="bg-background pb-16 lg:pb-24" aria-label="Фотографии клиники">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid auto-rows-[110px] grid-cols-2 gap-3 sm:auto-rows-[130px] md:grid-cols-6 lg:auto-rows-[150px]">
          {PHOTOS.map((photo) => (
            <div key={photo.src} className={`overflow-hidden rounded-lg bg-secondary ${photo.className}`}>
              <img
                src={photo.src || "/placeholder.svg"}
                alt={photo.alt}
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                loading="lazy"
                decoding="async"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
