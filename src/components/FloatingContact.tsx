import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { CompanySettings } from '../types';

interface FloatingContactProps {
  settings: CompanySettings;
}

export const FloatingContact: React.FC<FloatingContactProps> = ({ settings }) => {
  const cleanPhone = settings.phone.replace(/[^0-9+]/g, '');
  const cleanWhatsapp = settings.whatsapp.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
    'Përshëndetje Tradita Dekor! Po ju kontaktoj nga uebsajti për të bërë pyetje dhe për të marrë informata shtesë rreth punimeve tuaja.'
  )}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 pointer-events-auto">
      {/* WhatsApp Action */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Kontaktoni në WhatsApp"
        className="group flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-lg hover:shadow-emerald-600/30 transition-all transform hover:-translate-y-0.5"
      >
        <span className="hidden sm:inline text-xs font-semibold tracking-wide">
          Bisedo në WhatsApp
        </span>
        <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
      </a>

      {/* Phone Call Action */}
      <a
        href={`tel:${cleanPhone}`}
        aria-label="Telefono kompaninë"
        className="group flex items-center gap-2 px-4 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold shadow-lg hover:shadow-amber-500/30 transition-all transform hover:-translate-y-0.5"
      >
        <span className="hidden sm:inline text-xs font-bold tracking-wide">
          {settings.phone}
        </span>
        <Phone className="w-5 h-5 fill-neutral-950" />
      </a>
    </div>
  );
};
