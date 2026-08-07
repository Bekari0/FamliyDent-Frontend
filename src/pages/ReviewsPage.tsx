import React, { useEffect, useState } from "react";
import { EditorialPageHero } from "../components/shared/editorial-page-hero";
import { VideoReviewCard } from "../components/reviews/video-review-card";
import { Star, MessageSquare } from "lucide-react";
import { getPatientReviews } from "../lib/data/patient-reviews";
import type { PatientReview } from "../lib/data/types";

export function ReviewsPage() {
  const [reviews, setReviews] = useState<PatientReview[]>([]);

  useEffect(() => {
    document.title = "Отзывы пациентов — Family Dent Душанбе";
    async function loadReviews() {
      const data = await getPatientReviews();
      setReviews(data);
    }
    loadReviews();
  }, []);

  return (
    <div className="w-full flex flex-col min-h-screen bg-paper text-ink">
      <EditorialPageHero
        badge="Мнения пациентов"
        title="Отзывы о Family Dent"
        description="Честные видео и текстовые отзывы от пациентов, доверивших здоровье своей улыбки врачам нашей клиники."
      />

      <div className="max-w-7xl mx-auto px-5 my-8 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((rev) =>
            rev.source === "video" ? (
              <VideoReviewCard key={rev.id} review={rev} />
            ) : (
              <div
                key={rev.id}
                className="bg-surface border border-rule rounded-2xl p-6 shadow-card flex flex-col justify-between hover:border-accent/40 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1">
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md bg-accent/15 text-accent border border-accent/25 font-mono">
                      {rev.source}
                    </span>
                  </div>
                  <h3 className="font-display text-base font-bold text-ink mb-2">{rev.authorName}</h3>
                  <p className="text-xs sm:text-sm text-muted font-normal leading-relaxed">
                    "{rev.text}"
                  </p>
                </div>

                {rev.publishedAt && (
                  <span className="text-[10px] text-muted mt-4 block">{rev.publishedAt}</span>
                )}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
