import React, { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2, MapPin, Calendar, CheckCircle2 } from 'lucide-react';
import { ProjectImage, Project } from '../types';

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  images: ProjectImage[];
  currentIndex: number;
  onNavigate: (index: number) => void;
  project?: Project;
}

export const Lightbox: React.FC<LightboxProps> = ({
  isOpen,
  onClose,
  images,
  currentIndex,
  onNavigate,
  project
}) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && images.length > 1) {
        onNavigate((currentIndex + 1) % images.length);
      }
      if (e.key === 'ArrowLeft' && images.length > 1) {
        onNavigate((currentIndex - 1 + images.length) % images.length);
      }
    },
    [isOpen, onClose, onNavigate, currentIndex, images.length]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handleKeyDown, isOpen]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex] || images[0];

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-neutral-950/95 backdrop-blur-md select-none"
      onClick={onClose}
    >
      {/* Top Bar */}
      <div
        className="flex items-center justify-between px-4 py-3 sm:px-6 bg-neutral-900/80 border-b border-neutral-800 text-white z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-amber-400">
            {project?.title || 'Galeria e Projektit'}
          </span>
          <span className="text-xs text-neutral-400">
            Fotografia {currentIndex + 1} nga {images.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer"
            title="Mbyll (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main image viewer */}
      <div
        className="relative flex-1 flex items-center justify-center p-4 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Previous Button */}
        {images.length > 1 && (
          <button
            onClick={() => onNavigate((currentIndex - 1 + images.length) % images.length)}
            className="absolute left-3 sm:left-6 z-20 p-3 rounded-full bg-neutral-900/80 border border-neutral-700 hover:border-amber-400 text-neutral-200 hover:text-white transition-all shadow-xl cursor-pointer"
            title="Prapa"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Current Image */}
        <div className="relative max-w-5xl max-h-[75vh] w-full h-full flex flex-col items-center justify-center">
          <img
            src={currentImage.url}
            alt={currentImage.altText || currentImage.title || project?.title || 'Punim Tradita Dekor'}
            className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl border border-neutral-800"
          />

          {/* Caption / Title */}
          {(currentImage.title || project?.location) && (
            <div className="mt-3 text-center">
              <p className="text-sm font-medium text-neutral-200">
                {currentImage.title || project?.title}
              </p>
              {project && (
                <div className="flex items-center justify-center gap-4 text-xs text-neutral-400 mt-1">
                  {project.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      {project.location}
                    </span>
                  )}
                  {project.completionDate && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      {project.completionDate}
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {project.status}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Next Button */}
        {images.length > 1 && (
          <button
            onClick={() => onNavigate((currentIndex + 1) % images.length)}
            className="absolute right-3 sm:right-6 z-20 p-3 rounded-full bg-neutral-900/80 border border-neutral-700 hover:border-amber-400 text-neutral-200 hover:text-white transition-all shadow-xl cursor-pointer"
            title="Përpara"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Thumbnails strip */}
      {images.length > 1 && (
        <div
          className="p-3 bg-neutral-950/90 border-t border-neutral-800/80 overflow-x-auto flex items-center justify-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((img, idx) => (
            <button
              key={img.id || idx}
              onClick={() => onNavigate(idx)}
              className={`relative h-14 w-20 rounded-md overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                idx === currentIndex
                  ? 'border-amber-400 scale-105'
                  : 'border-neutral-800 opacity-60 hover:opacity-100'
              }`}
            >
              <img
                src={img.url}
                alt=""
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
