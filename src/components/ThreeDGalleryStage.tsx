import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Play, Maximize2 } from 'lucide-react';
import { MediaItem, ColorTheme } from '../types';

interface ThreeDGalleryStageProps {
  items: MediaItem[];
  theme: ColorTheme;
  onSelectMedia: (item: MediaItem) => void;
}

export const ThreeDGalleryStage: React.FC<ThreeDGalleryStageProps> = ({
  items,
  theme,
  onSelectMedia,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
  }, [items.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
  }, [items.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext]);

  if (!items || items.length === 0) return null;

  return (
    <div className="relative w-full py-8 sm:py-12 overflow-hidden select-none">
      {/* 3D Stage Container */}
      <div 
        className="relative h-[360px] sm:h-[460px] md:h-[500px] w-full flex items-center justify-center"
        style={{ perspective: '1200px' }}
      >
        {items.map((item, index) => {
          const offset = index - currentIndex;
          // Normalize offset for circular feel or clamp to visible range
          const absOffset = Math.abs(offset);
          if (absOffset > 3) return null; // Don't render far away items

          const isCenter = offset === 0;
          const isVideo = item.type === 'video';
          const displayThumb = item.thumbnailUrl || (isVideo ? 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80' : item.url);

          // Calculate 3D transforms
          const translateX = offset * (window.innerWidth < 640 ? 140 : 220);
          const translateZ = isCenter ? 120 : -absOffset * 100;
          const rotateY = isCenter ? 0 : offset > 0 ? -38 : 38;
          const scale = isCenter ? 1 : Math.max(0.72, 1 - absOffset * 0.16);
          const opacity = isCenter ? 1 : Math.max(0.35, 1 - absOffset * 0.28);
          const zIndex = 20 - absOffset;

          return (
            <div
              key={item.id}
              onClick={() => {
                if (isCenter) {
                  onSelectMedia(item);
                } else {
                  setCurrentIndex(index);
                }
              }}
              className="absolute w-[240px] sm:w-[320px] md:w-[380px] h-[300px] sm:h-[400px] md:h-[440px] rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 ease-out group"
              style={{
                transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                opacity,
                zIndex,
                boxShadow: isCenter 
                  ? '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 35px rgba(212, 175, 55, 0.35)' 
                  : '0 15px 30px -10px rgba(0, 0, 0, 0.5)',
                border: isCenter ? `2px solid ${theme.gold}` : '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              {/* Media Image */}
              <img
                src={displayThumb}
                alt={item.title || 'Wedding memory'}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Dynamic Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-between p-4 text-white">
                <div className="flex items-center justify-between">
                  {isVideo && (
                    <span className="px-2 py-0.5 rounded-full bg-black/60 text-[10px] uppercase tracking-wider font-semibold text-amber-300 border border-amber-300/40 backdrop-blur-xs flex items-center gap-1">
                      <Play className="w-2.5 h-2.5 fill-current" /> Video
                    </span>
                  )}
                  {isCenter && (
                    <button
                      type="button"
                      className="ml-auto w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-amber-200 flex items-center justify-center backdrop-blur-xs transition-colors"
                      title="Open full view"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div>
                  {item.title && (
                    <h4 className="font-serif text-base sm:text-lg font-medium text-amber-100 drop-shadow">
                      {item.title}
                    </h4>
                  )}
                  {item.caption && (
                    <p className="text-xs text-stone-300 line-clamp-2 mt-0.5 font-light">
                      {item.caption}
                    </p>
                  )}
                  {isCenter && (
                    <span className="inline-block text-[11px] text-amber-300 font-medium tracking-wide mt-2">
                      Tap to open full view &rarr;
                    </span>
                  )}
                </div>
              </div>

              {/* Video Play Button Overlay */}
              {isVideo && isCenter && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-14 h-14 rounded-full bg-black/70 backdrop-blur-md border border-amber-300 flex items-center justify-center text-amber-300 shadow-2xl group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 fill-amber-300 ml-1" />
                  </div>
                </div>
              )}

              {/* Ornamental Corners on Active Card */}
              {isCenter && (
                <>
                  <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-amber-300 pointer-events-none" />
                  <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-amber-300 pointer-events-none" />
                  <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-amber-300 pointer-events-none" />
                  <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-amber-300 pointer-events-none" />
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-center gap-4 mt-6 z-20 relative">
        <button
          type="button"
          onClick={handlePrev}
          className="w-11 h-11 rounded-full bg-stone-900/80 hover:bg-stone-900 text-amber-200 border border-amber-300/40 flex items-center justify-center shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-xs"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Counter Indicators */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 border border-amber-300/20 backdrop-blur-xs">
          {items.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`transition-all rounded-full ${
                idx === currentIndex
                  ? 'w-6 h-2 bg-amber-400'
                  : 'w-2 h-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={handleNext}
          className="w-11 h-11 rounded-full bg-stone-900/80 hover:bg-stone-900 text-amber-200 border border-amber-300/40 flex items-center justify-center shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-xs"
          aria-label="Next image"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
