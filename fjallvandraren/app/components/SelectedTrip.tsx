"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight, X, Maximize2 } from "lucide-react";
import type { Trip, TripImage } from "@/app/types/trip";

const PLACEHOLDER_IMAGE: TripImage = {
  imageSrc:
    "https://cdn.britannica.com/10/241010-049-3EB67AA2/highest-mountains-of-the-world-on-each-continent.jpg",
  imageAlt: "Placeholder image",
  imageDescription: "Select a trip to view images.",
};

interface SelectedTripProps {
  trip?: Trip | null;
}

function clampIndex(index: number, length: number): number {
  if (length <= 0) return 0;
  if (index < 0) return length - 1;
  if (index >= length) return 0;
  return index;
}

export default function SelectedTrip({ trip }: SelectedTripProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const images = useMemo(() => {
    if (!trip) return [PLACEHOLDER_IMAGE];
    return trip.images?.length ? trip.images : [PLACEHOLDER_IMAGE];
  }, [trip]);

  const goTo = useCallback(
    (index: number) => {
      if (images.length <= 1) return;
      setCurrentIndex(() => clampIndex(index, images.length));
    },
    [images.length]
  );

  const goPrev = () => goTo(currentIndex - 1);
  const goNext = () => goTo(currentIndex + 1);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  const lightboxImage = lightboxIndex !== null ? images[lightboxIndex] ?? null : null;

  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxIndex]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") setLightboxIndex((i) => clampIndex(i! - 1, images.length));
      if (e.key === "ArrowRight") setLightboxIndex((i) => clampIndex(i! + 1, images.length));
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxIndex, images.length, closeLightbox]);

  if (!trip) {
    return (
      <div className="w-full max-w-[900px] flex-1 flex flex-col gap-7 pb-10">
        <div className="flex-1 flex flex-col items-center justify-center gap-2 text-[#6b7b6e] text-center px-8 py-12 border border-dashed border-[rgba(255,255,255,0.07)] rounded-[18px] bg-[rgb(30,39,33)]">
          <p className="text-xl font-medium text-[#e8eae6]">No trip selected</p>
          <p className="text-[0.95rem]">Use the search above to choose a trip</p>
        </div>
      </div>
    );
  }

  const currentImage = images[currentIndex] ?? PLACEHOLDER_IMAGE;

  return (
    <div className="w-full max-w-[900px] flex-1 flex flex-col gap-7 pb-10">
      {/* Header */}
      <header className="text-center pb-1">
        <h2 className="font-julius text-[clamp(1.75rem,4vw,2.35rem)] font-normal tracking-[0.08em] text-[#e8eae6] mb-[0.35rem]">
          {trip.location}
        </h2>
        <span className="inline-block text-[0.9rem] text-[#6b7b6e] mb-[0.85rem]">
          {trip.date}
        </span>
        <p className="text-base text-[#6b7b6e] max-w-[600px] mx-auto leading-[1.65]">
          {trip.description}
        </p>
      </header>

      {/* Carousel */}
      <div className="relative flex items-center gap-3 w-full">
        {/* Previous Button */}
        <button
          type="button"
          className="flex-shrink-0 w-12 h-12 rounded-full border-2 border-[rgba(255,255,255,0.07)] bg-[rgb(30,39,33)] text-[#e8eae6] flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-[rgb(61,107,74)] hover:border-[rgb(61,107,74)] hover:text-white hover:scale-105 disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:bg-[rgb(30,39,33)] disabled:hover:border-[rgba(255,255,255,0.07)] disabled:hover:scale-100 sm:w-10 sm:h-10"
          onClick={goPrev}
          disabled={images.length <= 1}
          aria-label="Previous image"
        >
          <ChevronLeft className="w-7 h-7 sm:w-6 sm:h-6" />
        </button>

        {/* Viewport */}
        <div className="flex-1 min-w-0 rounded-[18px] overflow-hidden bg-[rgb(30,39,33)] shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-[rgba(255,255,255,0.07)]">
          <div
            className="flex transition-transform duration-300 ease-out"
            style={{
              transform: `translate3d(${-currentIndex * 100}%, 0, 0)`,
            }}
          >
            {images.map((img, i) => (
              <div key={i} className="flex-[0_0_100%] min-w-0">
                <div className="relative w-full aspect-[16/10] overflow-hidden bg-[rgb(30,39,33)] sm:aspect-[4/3]">
                  <img
                    src={img.imageSrc}
                    alt={img.imageAlt}
                    className="w-full h-full object-contain block max-w-full max-h-full"
                    loading={i === currentIndex ? "eager" : "lazy"}
                  />
                </div>
              </div>
            ))}
          </div>
          
          {/* Expand Button */}
          <button
            type="button"
            className="absolute bottom-3 right-3 w-10 h-10 rounded-xl border border-white/40 bg-black/45 backdrop-blur-[6px] text-white flex items-center justify-center cursor-pointer transition-all duration-200 z-20 hover:bg-black/65 hover:border-white/70 hover:scale-110 sm:w-9 sm:h-9 sm:bottom-2 sm:right-2"
            onClick={() => openLightbox(currentIndex)}
            aria-label="View image full screen"
            title="View full screen"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
        </div>

        {/* Next Button */}
        <button
          type="button"
          className="flex-shrink-0 w-12 h-12 rounded-full border-2 border-[rgba(255,255,255,0.07)] bg-[rgb(30,39,33)] text-[#e8eae6] flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-[rgb(61,107,74)] hover:border-[rgb(61,107,74)] hover:text-white hover:scale-105 disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:bg-[rgb(30,39,33)] disabled:hover:border-[rgba(255,255,255,0.07)] disabled:hover:scale-100 sm:w-10 sm:h-10"
          onClick={goNext}
          disabled={images.length <= 1}
          aria-label="Next image"
        >
          <ChevronRight className="w-7 h-7 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Caption */}
      <div className="bg-[rgb(30,39,33)] rounded-xl px-5 py-4 border border-[rgba(255,255,255,0.07)] flex items-start justify-between gap-4">
        <p className="flex-1 min-w-0 text-[0.95rem] leading-[1.55] text-[#e8eae6]">
          {currentImage.imageDescription}
        </p>
        <span className="flex-shrink-0 text-[0.8rem] text-[#6b7b6e] tabular-nums">
          {currentIndex + 1} / {images.length}
        </span>
      </div>

      {/* Dots Navigation */}
      {images.length > 1 && (
        <div className="flex justify-center gap-2 flex-wrap" role="tablist" aria-label="Image navigation">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === currentIndex}
              aria-label={`Go to image ${i + 1}`}
              className={`w-[10px] h-[10px] rounded-full border-2 cursor-pointer transition-all duration-200 hover:border-[rgb(61,107,74)] hover:scale-115 ${
                i === currentIndex
                  ? "bg-[rgb(61,107,74)] border-[rgb(61,107,74)]"
                  : "bg-transparent border-[#6b7b6e]"
              }`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxImage && lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[1000] bg-black/96 flex flex-col items-center justify-center p-0 animate-lightbox-fade-in"
          role="dialog"
          aria-modal="true"
          aria-label="Image full screen view"
          onClick={(e) => e.target === e.currentTarget && closeLightbox()}
        >
          {/* Close Button */}
          <button
            type="button"
            className="absolute top-6 right-6 w-[52px] h-[52px] rounded-full border border-white/20 bg-black/50 backdrop-blur-[10px] text-white text-[2rem] leading-none flex items-center justify-center cursor-pointer transition-all duration-200 z-[1002] hover:bg-white/20 hover:border-white/60 hover:scale-105 sm:top-4 sm:right-4 sm:w-[46px] sm:h-[46px]"
            onClick={closeLightbox}
            aria-label="Close full screen"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                className="absolute top-1/2 -translate-y-1/2 left-8 w-[60px] h-[60px] rounded-full border border-white/20 bg-black/50 backdrop-blur-[10px] text-white flex items-center justify-center cursor-pointer transition-all duration-200 z-[1002] hover:bg-white/20 hover:border-white/60 hover:scale-105 sm:left-4 sm:w-12 sm:h-12"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex(clampIndex(lightboxIndex - 1, images.length));
                }}
                aria-label="Previous image"
              >
                <ChevronLeft className="w-9 h-9 sm:w-7 sm:h-7" />
              </button>
              <button
                type="button"
                className="absolute top-1/2 -translate-y-1/2 right-8 w-[60px] h-[60px] rounded-full border border-white/20 bg-black/50 backdrop-blur-[10px] text-white flex items-center justify-center cursor-pointer transition-all duration-200 z-[1002] hover:bg-white/20 hover:border-white/60 hover:scale-105 sm:right-4 sm:w-12 sm:h-12"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex(clampIndex(lightboxIndex + 1, images.length));
                }}
                aria-label="Next image"
              >
                <ChevronRight className="w-9 h-9 sm:w-7 sm:h-7" />
              </button>
            </>
          )}

          {/* Image Container */}
          <div className="flex-1 flex items-center justify-center w-full min-h-0 h-screen px-8 pt-16 pb-40 relative sm:px-4 sm:pt-12 sm:pb-36">
            {images.map((img, i) => (
              <div
                key={i}
                className="absolute inset-0 flex items-center justify-center transition-opacity duration-400"
                style={{
                  opacity: i === lightboxIndex ? 1 : 0,
                  pointerEvents: i === lightboxIndex ? "auto" : "none",
                }}
              >
                <img
                  src={img.imageSrc}
                  alt={img.imageAlt}
                  className="max-w-full max-h-full w-auto h-auto object-contain block"
                />
              </div>
            ))}
          </div>

          {/* Caption */}
          <div className="absolute bottom-0 left-0 right-0 px-12 pt-8 pb-10 bg-gradient-to-t from-black/90 via-black/85 to-transparent backdrop-blur-[2px] flex flex-col gap-3 animate-caption-slide-up sm:px-5 sm:pt-6 sm:pb-8">
            <p className="text-[1.1rem] leading-[1.6] text-white/95 max-w-[900px] tracking-[0.01em] sm:text-base">
              {lightboxImage.imageDescription}
            </p>
            <span className="text-[0.9rem] text-white/50 tabular-nums font-medium tracking-[0.05em]">
              {lightboxIndex + 1} / {images.length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}