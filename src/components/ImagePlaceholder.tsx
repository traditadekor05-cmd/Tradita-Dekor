import React from 'react';
import { Camera, ImageOff, Hammer } from 'lucide-react';

interface ImagePlaceholderProps {
  categoryName?: string;
  className?: string;
  aspectRatio?: 'video' | 'square' | 'wide' | 'tall';
  customMessage?: string;
  showAdminHint?: boolean;
  onAdminClick?: () => void;
}

export const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({
  categoryName,
  className = '',
  aspectRatio = 'video',
  customMessage,
  showAdminHint = false,
  onAdminClick
}) => {
  const aspectClass = {
    video: 'aspect-video',
    square: 'aspect-square',
    wide: 'aspect-[21/9]',
    tall: 'aspect-[3/4]'
  }[aspectRatio];

  return (
    <div
      className={`relative w-full ${aspectClass} bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 border border-neutral-800/80 rounded-xl overflow-hidden flex flex-col items-center justify-center p-6 text-center select-none group shadow-inner ${className}`}
    >
      {/* Subtle blueprint grid overlay */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(212, 175, 55, 0.3) 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Decorative corner brackets reminiscent of metalwork welding */}
      <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-amber-500/40" />
      <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-amber-500/40" />
      <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-amber-500/40" />
      <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-amber-500/40" />

      {/* Center Icon badge */}
      <div className="relative mb-3 flex items-center justify-center w-14 h-14 rounded-full bg-neutral-800/90 border border-amber-500/30 text-amber-400 group-hover:border-amber-400 transition-colors shadow-lg">
        <Camera className="w-6 h-6 stroke-[1.5]" />
        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-500/20 border border-amber-400 animate-pulse" />
      </div>

      {/* Badge indicating placeholder status */}
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wider uppercase bg-amber-500/10 text-amber-300 border border-amber-500/20 mb-2">
        <Hammer className="w-3 h-3" />
        Hapësirë për Foto Reale
      </span>

      {/* Albanian message */}
      <p className="text-sm font-semibold text-neutral-200 max-w-xs">
        {customMessage || 'Fotografitë do të publikohen së shpejti'}
      </p>

      <p className="text-xs text-neutral-500 mt-1 max-w-xs leading-relaxed">
        {categoryName
          ? `Së shpejti do të shfaqen punimet tona reale për ${categoryName}.`
          : 'Tradita Dekor publikon ekskluzivisht vetëm fotografi të punimeve të veta reale.'}
      </p>

      {showAdminHint && onAdminClick && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAdminClick();
          }}
          className="mt-3 text-xs text-amber-400 hover:text-amber-300 underline underline-offset-4 font-medium transition-colors cursor-pointer"
        >
          Ngarko fotot tuaja nga Paneli Admin &rarr;
        </button>
      )}
    </div>
  );
};
