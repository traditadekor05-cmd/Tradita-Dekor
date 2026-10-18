import React, { useState } from 'react';
import { 
  Menu, 
  X, 
  Phone, 
  ShieldCheck, 
  ChevronDown, 
  Home, 
  Info, 
  Wrench, 
  Layers, 
  Mail, 
  Lock
} from 'lucide-react';
import { CompanySettings, PageId } from '../types';

interface NavbarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  settings: CompanySettings;
  isAdmin: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  settings,
  isAdmin
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);

  const categoryPages: { id: PageId; label: string }[] = [
    { id: 'terasa', label: 'Terasa' },
    { id: 'veranda', label: 'Veranda' },
    { id: 'garazha', label: 'Garazha' },
    { id: 'konstruksione-metali', label: 'Konstruksione Metali' },
    { id: 'bunare', label: 'Bunare' },
  ];

  const handleNav = (page: PageId) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    setCategoriesDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isCategoryActive = categoryPages.some(cat => cat.id === currentPage);

  return (
    <header className="sticky top-0 z-40 w-full bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800/80 transition-all">
      {/* Top micro-bar for phone, location, and social links */}
      <div className="hidden lg:block bg-neutral-900/80 border-b border-neutral-800/60 text-neutral-400 text-xs py-1.5 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-5">
            <a
              href="https://maps.google.com/?q=Carralev%C3%AB,+Shtime,+Kosovo"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-neutral-300 hover:text-amber-400 transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block animate-pulse" />
              <span>Shtime, Carralevë, Kosovë (7200)</span>
            </a>
            <span className="text-neutral-600">|</span>
            <span className="text-neutral-400">Orari: {settings.workingHours}</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Social media quick icons */}
            <div className="flex items-center gap-2 pr-3 border-r border-neutral-800">
              {settings.socialLinks?.facebook && (
                <a
                  href={settings.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-amber-400 transition-colors"
                  title="Facebook"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              )}
              {settings.socialLinks?.instagram && (
                <a
                  href={settings.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-amber-400 transition-colors"
                  title="Instagram"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              )}
              {settings.socialLinks?.tiktok && (
                <a
                  href={settings.socialLinks.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-amber-400 transition-colors"
                  title="TikTok"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .57.04.84.11V9.33a6.33 6.33 0 0 0-.84-.06 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 9.77 5.37V12.9a8.27 8.27 0 0 0 5.68 2.25v-3.46a4.83 4.83 0 0 1-3.77-1.89 4.83 4.83 0 0 1-.27-3.11z"/>
                  </svg>
                </a>
              )}
            </div>

            <a
              href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Përshëndetje Tradita Dekor, po ju kontaktoj për të bërë pyetje dhe për të marrë informata shtesë.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 transition-colors"
            >
              <span>WhatsApp:</span>
              <span className="font-semibold">{settings.whatsapp}</span>
            </a>

            <a
              href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
              className="text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{settings.phone}</span>
            </a>
            {isAdmin && (
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Kyçur si Administrator
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <button
          onClick={() => handleNav('home')}
          className="flex items-center gap-3.5 text-left group cursor-pointer focus:outline-none"
        >
          {settings.logoUrl ? (
            <img
              src={settings.logoUrl}
              alt={settings.companyName}
              className="h-12 w-auto max-w-[180px] object-contain rounded"
            />
          ) : (
            <div className="flex items-center gap-3">
              {/* Architectural emblem placeholder */}
              <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-neutral-800 to-neutral-900 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-md group-hover:border-amber-400 transition-colors">
                <span className="font-serif-brand font-bold text-xl tracking-tighter">TD</span>
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-extrabold text-lg sm:text-xl tracking-wider text-white uppercase group-hover:text-amber-300 transition-colors">
                  Tradita <span className="text-amber-400">Dekor</span>
                </span>
                <span className="text-[10px] sm:text-[11px] text-neutral-400 tracking-wider uppercase font-medium">
                  Terasa • Veranda • Metal
                </span>
              </div>
            </div>
          )}
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-medium">
          <button
            onClick={() => handleNav('home')}
            className={`px-3 py-2 rounded-md transition-colors cursor-pointer ${
              currentPage === 'home'
                ? 'text-amber-400 bg-neutral-900 font-semibold'
                : 'text-neutral-300 hover:text-white hover:bg-neutral-900/60'
            }`}
          >
            Kryefaqja
          </button>

          <button
            onClick={() => handleNav('about')}
            className={`px-3 py-2 rounded-md transition-colors cursor-pointer ${
              currentPage === 'about'
                ? 'text-amber-400 bg-neutral-900 font-semibold'
                : 'text-neutral-300 hover:text-white hover:bg-neutral-900/60'
            }`}
          >
            Rreth Nesh
          </button>

          <button
            onClick={() => handleNav('services')}
            className={`px-3 py-2 rounded-md transition-colors cursor-pointer ${
              currentPage === 'services'
                ? 'text-amber-400 bg-neutral-900 font-semibold'
                : 'text-neutral-300 hover:text-white hover:bg-neutral-900/60'
            }`}
          >
            Shërbimet
          </button>

          {/* Categories Dropdown */}
          <div className="relative">
            <button
              onClick={() => setCategoriesDropdownOpen(!categoriesDropdownOpen)}
              onMouseEnter={() => setCategoriesDropdownOpen(true)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md transition-colors cursor-pointer ${
                isCategoryActive
                  ? 'text-amber-400 bg-neutral-900 font-semibold'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-900/60'
              }`}
            >
              <span>Kategoritë</span>
              <ChevronDown className="w-4 h-4 opacity-70" />
            </button>

            {categoriesDropdownOpen && (
              <div
                onMouseLeave={() => setCategoriesDropdownOpen(false)}
                className="absolute top-full left-0 mt-1 w-56 rounded-xl bg-neutral-900 border border-neutral-800 shadow-2xl p-2 z-50 flex flex-col gap-1 backdrop-blur-xl animate-in fade-in duration-150"
              >
                {categoryPages.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleNav(cat.id)}
                    className={`text-left px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                      currentPage === cat.id
                        ? 'bg-amber-500/10 text-amber-400 font-semibold border-l-2 border-amber-400'
                        : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => handleNav('catalog')}
            className={`px-3 py-2 rounded-md transition-colors cursor-pointer ${
              currentPage === 'catalog'
                ? 'text-amber-400 bg-neutral-900 font-semibold'
                : 'text-neutral-300 hover:text-white hover:bg-neutral-900/60'
            }`}
          >
            Katalogu i Projekteve
          </button>

          <button
            onClick={() => handleNav('contact')}
            className={`px-3 py-2 rounded-md transition-colors cursor-pointer ${
              currentPage === 'contact'
                ? 'text-amber-400 bg-neutral-900 font-semibold'
                : 'text-neutral-300 hover:text-white hover:bg-neutral-900/60'
            }`}
          >
            Kontakti
          </button>
        </nav>

        {/* Action Buttons & Admin */}
        <div className="hidden sm:flex items-center gap-2.5">
          <a
            href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Përshëndetje Tradita Dekor, po ju kontaktoj nga uebsajti për të bërë pyetje dhe për të marrë informata shtesë.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold tracking-wider transition-all shadow-md"
          >
            <span>WhatsApp</span>
          </a>

          <a
            href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-neutral-900 border border-amber-500/40 hover:border-amber-400 text-amber-300 text-xs font-semibold tracking-wider transition-all"
          >
            <Phone className="w-3.5 h-3.5 text-amber-400" />
            <span>{settings.phone}</span>
          </a>

          <button
            onClick={() => handleNav('admin')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              currentPage === 'admin'
                ? 'bg-amber-500 text-neutral-950 font-bold'
                : 'bg-neutral-900/80 border border-neutral-800 text-neutral-400 hover:text-amber-300 hover:border-neutral-700'
            }`}
            title="Paneli Administrativ"
          >
            <Lock className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Admin</span>
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => handleNav('admin')}
            className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-amber-400"
            title="Admin"
          >
            <Lock className="w-4 h-4" />
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-200 hover:text-white cursor-pointer"
            aria-label="Hap menynë"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-neutral-950 border-b border-neutral-800 px-5 pt-3 pb-6 flex flex-col gap-2 max-h-[85vh] overflow-y-auto animate-in slide-in-from-top duration-200">
          <div className="text-xs uppercase tracking-wider text-neutral-500 font-semibold px-2 pt-1 pb-1">
            Faqet Kryesore
          </div>

          <button
            onClick={() => handleNav('home')}
            className={`text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
              currentPage === 'home' ? 'bg-amber-500/10 text-amber-400 font-bold' : 'text-neutral-300'
            }`}
          >
            Kryefaqja
          </button>

          <button
            onClick={() => handleNav('about')}
            className={`text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
              currentPage === 'about' ? 'bg-amber-500/10 text-amber-400 font-bold' : 'text-neutral-300'
            }`}
          >
            Rreth Nesh
          </button>

          <button
            onClick={() => handleNav('services')}
            className={`text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
              currentPage === 'services' ? 'bg-amber-500/10 text-amber-400 font-bold' : 'text-neutral-300'
            }`}
          >
            Shërbimet
          </button>

          <button
            onClick={() => handleNav('catalog')}
            className={`text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
              currentPage === 'catalog' ? 'bg-amber-500/10 text-amber-400 font-bold' : 'text-neutral-300'
            }`}
          >
            Katalogu i Projekteve
          </button>

          <div className="text-xs uppercase tracking-wider text-neutral-500 font-semibold px-2 pt-3 pb-1">
            Kategoritë e Produkteve
          </div>

          {categoryPages.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleNav(cat.id)}
              className={`text-left px-4 py-2 rounded-lg text-sm font-medium pl-6 ${
                currentPage === cat.id ? 'bg-amber-500/10 text-amber-400 font-bold' : 'text-neutral-400'
              }`}
            >
              • {cat.label}
            </button>
          ))}

          <div className="pt-2">
            <button
              onClick={() => handleNav('contact')}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
                currentPage === 'contact' ? 'bg-amber-500/10 text-amber-400 font-bold' : 'text-neutral-300'
              }`}
            >
              Kontakti
            </button>
          </div>

          <div className="pt-4 border-t border-neutral-800 flex flex-col gap-2.5">
            <a
              href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Përshëndetje Tradita Dekor, po ju kontaktoj nga uebsajti për të bërë pyetje dhe për të marrë informata shtesë.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2"
            >
              <span>Bisedo në WhatsApp ({settings.whatsapp})</span>
            </a>

            <a
              href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
              className="w-full text-center py-2.5 rounded-lg bg-amber-500 text-neutral-950 font-bold text-sm"
            >
              Telefono: {settings.phone}
            </a>

            {/* Mobile Social Links */}
            <div className="flex items-center justify-center gap-4 py-2 border-y border-neutral-800/80 my-1">
              {settings.socialLinks?.facebook && (
                <a
                  href={settings.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-amber-400"
                  title="Facebook"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              )}
              {settings.socialLinks?.instagram && (
                <a
                  href={settings.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-amber-400"
                  title="Instagram"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              )}
              {settings.socialLinks?.tiktok && (
                <a
                  href={settings.socialLinks.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-amber-400"
                  title="TikTok"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .57.04.84.11V9.33a6.33 6.33 0 0 0-.84-.06 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 9.77 5.37V12.9a8.27 8.27 0 0 0 5.68 2.25v-3.46a4.83 4.83 0 0 1-3.77-1.89 4.83 4.83 0 0 1-.27-3.11z"/>
                  </svg>
                </a>
              )}
            </div>

            <button
              onClick={() => handleNav('admin')}
              className="w-full text-center py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 font-medium text-sm flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4 text-amber-400" />
              Paneli Administrativ
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
