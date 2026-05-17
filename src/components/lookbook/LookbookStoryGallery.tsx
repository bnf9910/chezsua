'use client';

import { useState, useEffect, useCallback } from 'react';

interface Props {
  images: string[];
  title: string;
}

export function LookbookStoryGallery({ images, title }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  // 키보드 단축키 (라이트박스에서)
  useEffect(() => {
    if (!isLightboxOpen) return;

    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsLightboxOpen(false);
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    }

    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isLightboxOpen, goPrev, goNext]);

  // 사진 없을 때
  if (images.length === 0) {
    return (
      <div className="w-full h-[60vh] bg-gradient-to-br from-accent-sage to-accent-green flex items-center justify-center">
        <div className="text-bg-primary text-mono text-[11px] tracking-[0.3em] uppercase">
          No Images
        </div>
      </div>
    );
  }

  const currentImage = images[currentIndex];

  return (
    <>
      {/* 메인 히어로 사진 (전체 덮음) */}
      <div className="relative w-full h-[85vh] max-md:h-[60vh] bg-ink-primary overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={currentImage}
          alt={`${title} - ${currentIndex + 1}`}
          className="w-full h-full object-cover cursor-zoom-in"
          onClick={() => setIsLightboxOpen(true)}
        />

        {/* 좌우 화살표 (사진 2장 이상일 때만) */}
        {images.length > 1 && (
          <>
            <button
              onClick={goPrev}
              aria-label="Previous"
              className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-bg-primary/80 backdrop-blur text-ink-primary hover:bg-bg-primary rounded-full flex items-center justify-center transition-all max-md:left-3 max-md:w-10 max-md:h-10"
            >
              ←
            </button>
            <button
              onClick={goNext}
              aria-label="Next"
              className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-bg-primary/80 backdrop-blur text-ink-primary hover:bg-bg-primary rounded-full flex items-center justify-center transition-all max-md:right-3 max-md:w-10 max-md:h-10"
            >
              →
            </button>
          </>
        )}

        {/* 페이지 번호 표시 (사진 2장 이상일 때) */}
        {images.length > 1 && (
          <div className="absolute bottom-6 right-6 text-mono text-[11px] tracking-[0.2em] text-bg-primary bg-ink-primary/60 backdrop-blur px-3 py-1.5 rounded">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* 썸네일 갤러리 (사진 2장 이상일 때만) */}
      {images.length > 1 && (
        <div className="max-w-[1200px] mx-auto px-12 py-8 max-md:px-6 max-md:py-5">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {images.map((img, index) => (
              <button
                key={img + index}
                onClick={() => setCurrentIndex(index)}
                className={`flex-shrink-0 w-24 h-24 max-md:w-20 max-md:h-20 overflow-hidden border-2 transition-all ${
                  currentIndex === index
                    ? 'border-ink-primary scale-105'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
                aria-label={`Image ${index + 1}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 라이트박스 (사진 클릭 시 확대 보기) */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 bg-ink-primary/95 z-[100] flex items-center justify-center"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* 닫기 */}
          <button
            onClick={() => setIsLightboxOpen(false)}
            aria-label="Close"
            className="absolute top-6 right-6 text-bg-primary text-2xl hover:text-accent-green z-10"
          >
            ×
          </button>

          {/* 좌우 */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
                aria-label="Previous"
                className="absolute left-6 text-bg-primary text-3xl hover:text-accent-green z-10"
              >
                ←
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
                aria-label="Next"
                className="absolute right-6 text-bg-primary text-3xl hover:text-accent-green z-10"
              >
                →
              </button>
            </>
          )}

          {/* 큰 사진 */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentImage}
            alt={`${title} - ${currentIndex + 1}`}
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {/* 페이지 번호 */}
          {images.length > 1 && (
            <div className="absolute bottom-6 text-mono text-[11px] tracking-[0.2em] text-bg-primary">
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </div>
      )}
    </>
  );
}
