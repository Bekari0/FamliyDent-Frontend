import { motion } from 'motion/react';
import { REVIEWS } from '@/constants';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Star, Quote } from 'lucide-react';

export function Reviews() {
  return (
    <section id="reviews" className="section-padding bg-white scroll-mt-20 overflow-hidden relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 rounded-[100%] blur-[120px] -z-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-slate-100 overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                </div>
              ))}
            </div>
            <div className="text-sm font-bold text-slate-900">
              <span className="text-primary">500+</span> счастливых пациентов
            </div>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-title mb-6"
          >
            Что говорят о нас <span className="text-primary">пациенты</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 leading-relaxed"
          >
            Ваше доверие — наша главная награда. Мы гордимся тем, что помогаем вам улыбаться чаще.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {REVIEWS.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="review-card group">
                <Quote className="absolute top-8 right-8 w-12 h-12 text-primary/5 group-hover:text-primary/10 transition-colors" />
                
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-accent fill-accent" />
                  ))}
                </div>

                <p className="text-slate-600 leading-relaxed mb-8 italic relative z-10">
                  "{review.text}"
                </p>

                <div className="flex items-center gap-4 pt-6 border-t border-slate-50">
                  <Avatar className="w-14 h-14 border-2 border-primary/10">
                    <AvatarImage src={review.avatar} alt={review.author} />
                    <AvatarFallback className="bg-primary/5 text-primary font-bold">
                      {review.author.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-slate-900">{review.author}</h4>
                      <div className="w-3.5 h-3.5 bg-accent rounded-full flex items-center justify-center">
                        <svg className="w-2 h-2 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 font-medium">{review.date}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

