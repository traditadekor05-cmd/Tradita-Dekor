import React from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Facebook, 
  Instagram, 
  Lock, 
  ArrowUpRight 
} from 'lucide-react';
import { CompanySettings, PageId } from '../types';

interface FooterProps {
  settings: CompanySettings;
  onNavigate: (page: PageId) => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onNavigate }) => {
  const currentYear = 2026;

  const handleNav = (page: PageId) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-neutral-950 border-t border-neutral-800 text-neutral-300 relative overflow-hidden">
      {/* Decorative top accent glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Brand & Bio */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {settings.logoUrl ? (
                <img
                  src={settings.logoUrl}
                  alt={settings.companyName}
                  className="h-12 w-auto max-w-[170px] object-contain rounded"
                />
              ) : (
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-amber-500/40 flex items-center justify-center text-amber-400 font-serif-brand font-bold text-lg">
                    TD
                  </div>
                  <span className="font-heading font-extrabold text-xl text-white tracking-wide">
                    Tradita <span className="text-amber-400">Dekor</span>
                  </span>
                </div>
              )}
            </div>

            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              {settings.tagline || 'Ekspertë në ndërtimin e terasave, verandave, garazhave dhe konstruksioneve metalike cilësore në tërë territorin e Kosovës.'}
            </p>

            <div className="flex items-center gap-3 pt-2">
              {settings.socialLinks.facebook && (
                <a
                  href={settings.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-amber-400 hover:border-amber-400/50 transition-colors"
                  aria-label="Facebook"
                  title="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {settings.socialLinks.instagram && (
                <a
                  href={settings.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-amber-400 hover:border-amber-400/50 transition-colors"
                  aria-label="Instagram"
                  title="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {settings.socialLinks.tiktok && (
                <a
                  href={settings.socialLinks.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-amber-400 hover:border-amber-400/50 transition-colors"
                  aria-label="TikTok"
                  title="TikTok"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .57.04.84.11V9.33a6.33 6.33 0 0 0-.84-.06 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 9.77 5.37V12.9a8.27 8.27 0 0 0 5.68 2.25v-3.46a4.83 4.83 0 0 1-3.77-1.89 4.83 4.83 0 0 1-.27-3.11z"/>
                  </svg>
                </a>
              )}
              <a
                href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Përshëndetje Tradita Dekor, po ju kontaktoj për të bërë një pyetje dhe për të marrë informata shtesë.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-center text-emerald-400 hover:bg-emerald-600 hover:text-white transition-colors"
                aria-label="WhatsApp"
                title="Bisedo në WhatsApp"
              >
                <span className="font-bold text-xs">WA</span>
              </a>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              Faqet Kryesore
            </h3>
            <ul className="space-y-2.5 text-sm text-neutral-400">
              <li>
                <button
                  onClick={() => handleNav('home')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Kryefaqja
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('about')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Rreth Nesh
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('services')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Shërbimet Tona
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('catalog')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Katalogu i Projekteve
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('contact')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Kontakti & Vendndodhja
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              Kategoritë
            </h3>
            <ul className="space-y-2.5 text-sm text-neutral-400">
              <li>
                <button
                  onClick={() => handleNav('terasa')}
                  className="hover:text-amber-400 transition-colors cursor-pointer flex items-center justify-between w-full pr-4"
                >
                  <span>Terasa</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-40" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('veranda')}
                  className="hover:text-amber-400 transition-colors cursor-pointer flex items-center justify-between w-full pr-4"
                >
                  <span>Veranda</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-40" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('garazha')}
                  className="hover:text-amber-400 transition-colors cursor-pointer flex items-center justify-between w-full pr-4"
                >
                  <span>Garazha</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-40" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('konstruksione-metali')}
                  className="hover:text-amber-400 transition-colors cursor-pointer flex items-center justify-between w-full pr-4"
                >
                  <span>Konstruksione Metali</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-40" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('bunare')}
                  className="hover:text-amber-400 transition-colors cursor-pointer flex items-center justify-between w-full pr-4"
                >
                  <span>Bunare</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-40" />
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Kosovo Details */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              Kontakti i Drejtpërdrejtë
            </h3>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <a
                  href="https://maps.google.com/?q=Carralev%C3%AB,+Shtime,+Kosovo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition-colors"
                >
                  Shtime, Carralevë, Kosovë, 7200
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <a
                  href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
                  className="hover:text-white transition-colors font-semibold"
                >
                  {settings.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <a
                  href={`mailto:${settings.email}`}
                  className="hover:text-white transition-colors break-all"
                >
                  {settings.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span className="text-xs">{settings.workingHours}</span>
              </li>
            </ul>

            <div className="mt-5 p-3 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-neutral-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>Punime me kontratë dhe garanci cilësie.</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>
            &copy; {currentYear} {settings.companyName}. Të gjitha të drejtat e rezervuara.
          </p>

          <div className="flex items-center gap-4">
            <span className="text-neutral-600">Ndërtim & Metalurgji në Kosovë</span>
            <button
              onClick={() => handleNav('admin')}
              className="text-neutral-500 hover:text-amber-400 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Paneli Administrativ</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
