import { motion } from 'motion/react';
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';
import { MapPin, Phone, Mail, Sparkles } from 'lucide-react';

export function Contact() {
  const CLINIC_LOCATIONS = [
    {
      center: [38.563467, 68.804442],
      address: 'ул. Айни, 45',
      title: 'FamilyDent - Айни',
      phone: '+992 446 60 66 00'
    },
    {
      center: [38.548990, 68.761355],
      address: 'проспект Негмата Карабаева, 29',
      title: 'FamilyDent - Карабаева',
      phone: '+992 446 60 66 00'
    }
  ];

  const contactInfo = [
    {
      icon: Phone,
      title: 'Телефоны',
      value: '+992 446 60 66 00',
      description: 'Ежедневно с 08:00 до 20:00',
      href: 'tel:+992446606600'
    },
    {
      icon: Mail,
      title: 'Email',
      value: 'familydent.tj@gmail.com',
      description: 'Для общих вопросов',
      href: 'mailto:familydent.tj@gmail.com'
    },
    {
      icon: MapPin,
      title: 'Филиалы',
      value: 'ул. Айни, 45 / ул. Н. Карабаева, 29',
      description: 'г. Душанбе',
      href: '#'
    }
  ];

  return (
    <section id="contacts" className="py-24 bg-white relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -mr-64 -mt-64" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] -ml-48 -mb-48" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-stretch gap-16 xl:gap-24">
          <div className="flex-1">
            <div className="mb-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 mb-6"
              >
                <div className="w-12 h-0.5 bg-primary" />
                <span className="text-primary font-bold uppercase tracking-[0.2em] text-xs">Контакты</span>
              </motion.div>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl lg:text-5xl font-display font-bold text-[#2C2A28] leading-tight mb-6"
              >
                Ждем вас в наших <br />
                <span className="text-primary italic">филиалах</span>
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-lg text-slate-600 leading-relaxed max-w-xl"
              >
                Мы всегда на связи, чтобы помочь вам. Выберите удобный филиал и запишитесь на прием прямо сейчас.
              </motion.p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
              {contactInfo.map((info, index) => (
                <motion.a
                  key={index}
                  href={info.href}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group p-6 rounded-[32px] bg-white border border-slate-200/50 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 shadow-sm"
                >
                  <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                    <info.icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{info.title}</h4>
                  <p className="text-base font-bold text-[#2C2A28] mb-1">{info.value}</p>
                  <p className="text-xs text-slate-500">{info.description}</p>
                </motion.a>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="p-6 rounded-[32px] bg-primary text-white shadow-2xl shadow-primary/30 flex flex-col justify-center border border-white/10"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5" />
                  <span className="font-bold leading-none tracking-tight">AI Помощник</span>
                </div>
                <p className="text-sm opacity-95 leading-relaxed font-medium">
                  Наш AI-ассистент доступен 24/7 и готов ответить на ваши вопросы.
                </p>
              </motion.div>
            </div>
          </div>

          <div className="flex-1 lg:max-w-xl xl:max-w-2xl w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="h-[450px] lg:h-full min-h-[500px] w-full rounded-[48px] overflow-hidden shadow-2xl border-8 border-white bg-slate-50 relative"
            >
              <div className="absolute inset-0 pointer-events-none border border-slate-200/50 rounded-[40px] z-10" />
              
              <YMaps query={{ lang: 'ru_RU' }}>
                <Map 
                  defaultState={{ 
                    center: [38.553205, 68.791215], 
                    zoom: 12,
                    controls: [] 
                  }} 
                  width="100%" 
                  height="100%"
                  options={{
                    autoFitToViewport: 'always',
                    suppressMapOpenBlock: true,
                    yandexMapDisablePoiInteractivity: true
                  }}
                >
                  {CLINIC_LOCATIONS.map((loc, i) => (
                    <Placemark 
                      key={i}
                      geometry={loc.center}
                      properties={{
                        balloonContentHeader: `<div class="font-bold text-primary p-1">${loc.title}</div>`,
                        balloonContentBody: `<div class="text-slate-600 text-sm px-1 pb-1">${loc.address}</div>`,
                        balloonContentFooter: `<div class="font-bold text-slate-900 px-1 pb-1">${loc.phone}</div>`,
                        hintContent: loc.title
                      }}
                      options={{
                        preset: 'islands#blueMedicalIcon',
                        iconColor: '#C6A15B',
                        hideIconOnBalloonOpen: false,
                        balloonOffset: [3, -40]
                      }}
                    />
                  ))}
                </Map>
              </YMaps>
              <div className="absolute bottom-6 left-6 right-6 z-20 pointer-events-none">
                <div className="bg-white/95 backdrop-blur-md p-5 rounded-3xl shadow-2xl border border-white/20 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Центральная локация</div>
                      <div className="text-base font-bold text-slate-900 tracking-tight">г. Душанбе, Таджикистан</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
