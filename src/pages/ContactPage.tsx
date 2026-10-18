import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageCircle, 
  Send, 
  CheckCircle2, 
  ShieldCheck,
  Building
} from 'lucide-react';
import { CompanySettings } from '../types';

interface ContactPageProps {
  settings: CompanySettings;
}

export const ContactPage: React.FC<ContactPageProps> = ({ settings }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: 'Shtime',
    service: 'Terasa',
    dimensions: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const cleanPhone = settings.phone.replace(/[^0-9+]/g, '');
  const cleanWhatsapp = settings.whatsapp.replace(/[^0-9]/g, '');

  const kosovoCities = [
    'Shtime',
    'Prishtinë',
    'Ferizaj',
    'Prizren',
    'Gjilan',
    'Pejë',
    'Gjakovë',
    'Mitrovicë',
    'Podujevë',
    'Vushtrri',
    'Suharekë',
    'Rahovec',
    'Lipjan',
    'Drenas',
    'Fushë Kosovë',
    'Klinë',
    'Deçan',
    'Istog',
    'Kamenicë',
    'Viti',
    'Kaçanik',
    'Tjetër'
  ];

  const handleWhatsAppSend = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Përshëndetje Tradita Dekor!\n` +
      `Po ju kontaktoj për të bërë pyetje dhe për të marrë informata shtesë:\n` +
      `• Emri: ${formData.name || 'Klient'}\n` +
      `• Telefoni: ${formData.phone || cleanPhone}\n` +
      `• Qyteti: ${formData.city}\n` +
      `• Shërbimi: ${formData.service}\n` +
      (formData.dimensions ? `• Përmasat e përafërta: ${formData.dimensions}\n` : '') +
      (formData.message ? `• Pyetja / Detajet: ${formData.message}` : '');

    window.open(`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(text)}`, '_blank');
    setSubmitted(true);
  };

  const handleDirectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Na Kontaktoni
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mt-2 leading-tight">
            Flisni Drejtpërdrejt me Ekipin Tonë
          </h1>
          <p className="text-sm sm:text-base text-neutral-400 mt-4 leading-relaxed">
            Jemi në dispozicion për t’ju përgjigjur pyetjeve, për të caktuar një takim matjesh në vendndodhje ose për t’ju dërguar një preventiv të detajuar.
          </p>
        </div>

        {/* Contact info grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-neutral-900/80 border border-neutral-800 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Telefoni</h3>
            <p className="text-xs text-neutral-400 mt-1">Telefononi për bisedë të shpejtë</p>
            <a
              href={`tel:${cleanPhone}`}
              className="mt-3 text-base font-bold text-amber-400 hover:text-amber-300"
            >
              {settings.phone}
            </a>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-900/80 border border-neutral-800 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
              <MessageCircle className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">WhatsApp</h3>
            <p className="text-xs text-neutral-400 mt-1">Dërgoni foto të hapësirës suaj</p>
            <a
              href={`https://wa.me/${cleanWhatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 text-base font-bold text-emerald-400 hover:text-emerald-300"
            >
              {settings.whatsapp}
            </a>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-900/80 border border-neutral-800 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Email</h3>
            <p className="text-xs text-neutral-400 mt-1">Dërgoni plane arkitekturore</p>
            <a
              href={`mailto:${settings.email}`}
              className="mt-3 text-sm font-medium text-amber-400 hover:text-amber-300 break-all"
            >
              {settings.email}
            </a>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-900/80 border border-neutral-800 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Orari</h3>
            <p className="text-xs text-neutral-400 mt-1">Ditët e punës</p>
            <span className="mt-3 text-xs font-semibold text-neutral-200">
              {settings.workingHours}
            </span>
          </div>
        </div>

        {/* Main contact form and location layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Form Column */}
          <div className="lg:col-span-7 bg-neutral-900/90 border border-neutral-800 rounded-3xl p-8 sm:p-10 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-2">
              Kërkoni Ofertë të Personalizuar
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mb-8 leading-relaxed">
              Plotësoni të dhënat dhe zgjidhni shërbimin. Mund ta dërgoni menjëherë përmes WhatsApp ose të na lini mesazh këtu.
            </p>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h3 className="text-lg font-bold text-white">Faleminderit për mesazhin tuaj!</h3>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  Kërkesa juaj u regjistrua me sukses. Ekipi i Tradita Dekor do t’ju kontaktojë brenda disa orëve për t'ju dhënë informacionin e nevojshëm.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold"
                >
                  Dërgo një kërkesë tjetër
                </button>
              </div>
            ) : (
              <form onSubmit={handleDirectSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                      Emri dhe Mbiemri *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="p.sh. Agron Berisha"
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-400 rounded-xl px-4 py-3 text-sm text-neutral-200 placeholder-neutral-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                      Numri i Telefonit *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+383 4X XXX XXX"
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-400 rounded-xl px-4 py-3 text-sm text-neutral-200 placeholder-neutral-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                      Qyteti në Kosovë *
                    </label>
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-400 rounded-xl px-4 py-3 text-sm text-neutral-200 focus:outline-none"
                    >
                      {kosovoCities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                      Shërbimi që Ju Intereson *
                    </label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-400 rounded-xl px-4 py-3 text-sm text-neutral-200 focus:outline-none"
                    >
                      <option value="Terasa">Terasa</option>
                      <option value="Veranda">Veranda</option>
                      <option value="Garazha">Garazha</option>
                      <option value="Konstruksione Metali">Konstruksione Metali</option>
                      <option value="Bunare">Bunare</option>
                      <option value="Tjetër / Projekt i Veçantë">Tjetër / Projekt i Veçantë</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    Përmasat e përafërta (Opsionale)
                  </label>
                  <input
                    type="text"
                    value={formData.dimensions}
                    onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                    placeholder="p.sh. 6m gjatësi x 4m gjerësi"
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-400 rounded-xl px-4 py-3 text-sm text-neutral-200 placeholder-neutral-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    Përshkrimi i Kërkesës Suaj
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Përshkruani idenë tuaj, stilin e preferuar apo detajet e objektit..."
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-400 rounded-xl px-4 py-3 text-sm text-neutral-200 placeholder-neutral-600 focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={handleWhatsAppSend}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Dërgo Menjëherë në WhatsApp</span>
                  </button>

                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Dërgo Kërkesë në Faqe</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Location & Map Column */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="p-8 rounded-3xl bg-neutral-900/90 border border-neutral-800 shadow-xl space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Building className="w-5 h-5 text-amber-400" />
                Zyra dhe Punishtja Jonë
              </h3>

              <div className="text-sm text-neutral-300 space-y-2">
                <p className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span className="font-semibold text-white">Shtime, Carralevë, Kosovë, 7200</span>
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>{settings.workingHours}</span>
                </p>
              </div>

              <div className="pt-2 flex flex-wrap gap-2">
                <a
                  href="https://maps.google.com/?q=Carralev%C3%AB,+Shtime,+Kosovo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-amber-400 text-amber-300 text-xs font-semibold transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Hap në Google Maps</span>
                </a>

                <a
                  href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent('Përshëndetje Tradita Dekor, po ju kontaktoj për të bërë pyetje dhe për të marrë informata shtesë.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold hover:bg-emerald-600 hover:text-white transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Bisedo në WhatsApp</span>
                </a>
              </div>

              {/* Social Media Links Box */}
              <div className="pt-3 border-t border-neutral-800/80">
                <span className="text-xs text-neutral-400 block mb-2 font-medium">Na ndiqni në rrjetet sociale:</span>
                <div className="flex items-center gap-2.5">
                  {settings.socialLinks?.facebook && (
                    <a
                      href={settings.socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 hover:border-amber-400 text-xs text-neutral-300 hover:text-white flex items-center gap-1.5 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      <span>Facebook</span>
                    </a>
                  )}

                  {settings.socialLinks?.instagram && (
                    <a
                      href={settings.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 hover:border-amber-400 text-xs text-neutral-300 hover:text-white flex items-center gap-1.5 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                      <span>Instagram</span>
                    </a>
                  )}

                  {settings.socialLinks?.tiktok && (
                    <a
                      href={settings.socialLinks.tiktok}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 hover:border-amber-400 text-xs text-neutral-300 hover:text-white flex items-center gap-1.5 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .57.04.84.11V9.33a6.33 6.33 0 0 0-.84-.06 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 9.77 5.37V12.9a8.27 8.27 0 0 0 5.68 2.25v-3.46a4.83 4.83 0 0 1-3.77-1.89 4.83 4.83 0 0 1-.27-3.11z"/>
                      </svg>
                      <span>TikTok</span>
                    </a>
                  )}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-400 flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Ofrojmë ardhje në vendngjarje për matje kudo në Kosovë.</span>
              </div>
            </div>

            {/* Google Maps Embed */}
            <div className="flex-1 min-h-[300px] rounded-3xl overflow-hidden border border-neutral-800 shadow-2xl relative bg-neutral-900">
              <iframe
                title="Vendndodhja e Tradita Dekor - Carralevë, Shtime"
                src={settings.googleMapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '320px' }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full grayscale contrast-125 opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
