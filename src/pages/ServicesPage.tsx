import React from 'react';
import { 
  ArrowRight, 
  ShieldCheck, 
  Wrench, 
  Layers, 
  Home, 
  Check, 
  Phone, 
  MessageCircle 
} from 'lucide-react';
import { Category, CompanySettings, PageId } from '../types';

interface ServicesPageProps {
  categories: Category[];
  settings: CompanySettings;
  onNavigate: (page: PageId) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({
  categories,
  settings,
  onNavigate
}) => {
  const cleanPhone = settings.phone.replace(/[^0-9+]/g, '');
  const cleanWhatsapp = settings.whatsapp.replace(/[^0-9]/g, '');

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Shërbimet Tona
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mt-2 leading-tight">
            Zgjidhje Gjithëpërfshirëse në Ndërtim & Metal
          </h1>
          <p className="text-base text-neutral-400 mt-4 leading-relaxed">
            Nga terasat moderne e deri te konstruksionet industriale dhe kapakët mbrojtës të bunareve. Zgjidhni shërbimin për të parë specifikat dhe projektet përkatëse.
          </p>
        </div>

        {/* Detailed Services List */}
        <div className="space-y-8">
          {categories.map((cat, idx) => (
            <div
              key={cat.id}
              className="p-8 sm:p-10 rounded-3xl bg-neutral-900/80 border border-neutral-800 hover:border-amber-500/40 transition-all shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-8 group"
            >
              <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-amber-400 font-bold text-sm tracking-wider font-mono">
                    0{idx + 1}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    {cat.badge || 'Tradita Dekor'}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold text-white group-hover:text-amber-300 transition-colors">
                  {cat.name}
                </h2>

                <p className="text-sm sm:text-base text-neutral-300 mt-3 leading-relaxed">
                  {cat.description}
                </p>

                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-400">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span>Matje dhe këshillim pa pagesë</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span>Materiale të certifikuara</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span>Montim në çdo qytet të Kosovës</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span>Garanci e shkruar e stabilitetit</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[220px]">
                <button
                  onClick={() => onNavigate(cat.slug as PageId)}
                  className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  <span>Shiko Detajet e Shërbimit</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(`Përshëndetje Tradita Dekor, po ju kontaktoj për të bërë pyetje dhe për të marrë informata shtesë rreth ${cat.name}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-700 text-white font-medium text-xs transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>Pyet në WhatsApp</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Order Box */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 border border-neutral-800 text-center">
          <h3 className="text-2xl sm:text-3xl font-bold text-white">
            Keni një Projekt Specifik Metalik?
          </h3>
          <p className="text-sm text-neutral-400 mt-3 max-w-xl mx-auto">
            Përveç kategorive standarde, punishtja jonë realizon çdo punim të personalizuar me hekur, profil ose llamarinë sipas skicave apo ideve tuaja.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href={`tel:${cleanPhone}`}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-lg"
            >
              <Phone className="w-4 h-4" />
              <span>Telefono Mjeshtrin: {settings.phone}</span>
            </a>
            <button
              onClick={() => onNavigate('contact')}
              className="px-6 py-3.5 rounded-xl bg-neutral-900 border border-neutral-700 hover:border-amber-400 text-white font-semibold text-xs tracking-wider transition-colors cursor-pointer"
            >
              Dërgo Kërkesë me Shkrim
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
