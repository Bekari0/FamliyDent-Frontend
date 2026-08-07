import React, { useState, useRef } from "react";
import { Play, Pause, Quote } from "lucide-react";
import type { PatientReview } from "../../lib/data/types";

interface VideoReviewCardProps {
  key?: React.Key;
  review: PatientReview;
}

export function VideoReviewCard({ review }: VideoReviewCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="bg-surface border border-rule rounded-2xl overflow-hidden shadow-card flex flex-col group">
      {/* Video Container */}
      <div className="relative aspect-[9/16] sm:aspect-[4/5] w-full bg-paper overflow-hidden">
        {review.videoUrl ? (
          <video
            ref={videoRef}
            src={review.videoUrl}
            poster={review.videoPoster}
            controls={isPlaying}
            onEnded={() => setIsPlaying(false)}
            onPause={() => setIsPlaying(false)}
            preload="none"
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={review.videoPoster || "https://images.pexels.com/photos/3762453/pexels-photo-3762453.jpeg?auto=compress&cs=tinysrgb&w=800"}
            alt={review.authorName}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
          />
        )}

        {/* Play Overlay Button */}
        {!isPlaying && (
          <button
            onClick={togglePlay}
            aria-label={`Смотреть видеоотзыв ${review.authorName}`}
            className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-accent text-accent-ink flex items-center justify-center shadow-md transition-transform duration-300 hover:scale-110 cursor-pointer border-2 border-white/30 backdrop-blur-sm"
          >
            <Play className="w-6 h-6 fill-current ml-1" />
          </button>
        )}

        <div className="absolute top-3 left-3 bg-ink/75 backdrop-blur-md px-2.5 py-1 rounded-pill text-[10px] font-semibold text-paper uppercase tracking-wider border border-white/10 font-mono">
          Видеоотзыв
        </div>
      </div>

      {/* Details */}
      <div className="p-4 bg-paper border-t border-rule flex flex-col gap-1.5">
        <h4 className="font-display text-sm font-bold text-ink">{review.authorName}</h4>
        {review.text && (
          <p className="text-xs text-muted font-normal line-clamp-2">
            "{review.text}"
          </p>
        )}
        {review.publishedAt && (
          <span className="text-[10px] text-muted mt-1">{review.publishedAt}</span>
        )}
      </div>
    </div>
  );
}
