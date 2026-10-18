import React from 'react';
import { 
  ArrowRight, 
  Phone, 
  MessageCircle, 
  ShieldCheck, 
  Wrench, 
  Award, 
  MapPin, 
  Layers, 
  Check, 
  Camera, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { CompanySettings, Category, Project, PageId } from '../types';
import { ImagePlaceholder } from '../components/ImagePlaceholder';

interface HomePageProps {
  settings: CompanySettings;
  categories: Category[];
  projects: Project[];
  onNavigate: (page: PageId) => void;
  onOpenLightbox: (project: Project, index: number) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  settings,
  categories,
  projects,
  onNavigate,
  onOpenLightbox
}) => {
  const publishedProjects = projects.filter(p => p.published !== false);
  const featuredProjects = publishedProjects.slice(0, 6);

  const cleanWhatsapp = settings.whatsapp.replace(/[^0-9]/g, '');
  const cleanPhone = settings.phone.replace(/[^0-9+]/g, '');

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden border-b border-neutral-800/80">
        {/* Background Cover Image or Architectural Metalwork Pattern */}
        {settings.heroCoverUrl ? (
          <div className="absolute inset-0 z-0">
            <img
              src={settings.heroCoverUrl}
              alt="Ballina Tradita Dekor"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-neutral-950/40" />
            <div className="absolute inset-0 bg-neutral-950/30" />
          </div>
        ) : (
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-950">
            {/* Architectural Grid pattern */}
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `radial-gradient(rgba(212, 175, 55, 0.4) 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px)`,
                backgroundSize: '40px 40px, 80px 80px'
              }}
            />
            {/* Ambient lighting glows */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-500/10 blur-[130px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-10 left-10 w-[300px] h-[300px] bg-amber-600/5 blur-[100px] rounded-full pointer-events-none" />
          </div>
        )}

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-center flex flex-col items-center">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900/90 border border-amber-500/40 text-amber-300 text-xs sm:text-sm font-semibold tracking-wider uppercase mb-6 shadow-xl backdrop-blur-sm">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Mjeshtëri e Dëshmuar • Shërbim në Gjithë Kosovën</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl leading-tight">
            {settings.heroHeadline || 'Terasa, Veranda dhe Konstruksione Metali me Standarde të Larta'}
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-xl text-neutral-300 max-w-2xl font-normal leading-relaxed">
            {settings.heroSubheadline || 'Zgjidhje moderne dhe afatgjata për hapësirën tuaj në Kosovë. Punojmë me hekur cilësor, saktësi maksimale dhe dizajne elegante.'}
          </p>

          {/* CTA Buttons */}
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={() => onNavigate('catalog')}
              className="flex items-center gap-2.5 px-6 sm:px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm sm:text-base transition-all transform hover:-translate-y-0.5 shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <span>Shiko Katalogun e Projekteve</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent('Përshëndetje Tradita Dekor, po ju kontaktoj nga uebsajti për të bërë pyetje dhe për të marrë informata shtesë rreth punimeve tuaja.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 sm:px-7 py-3.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700 hover:border-amber-400/50 text-white font-semibold text-sm sm:text-base transition-all backdrop-blur-sm"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Bisedo në WhatsApp</span>
            </a>

            <a
              href={`tel:${cleanPhone}`}
              className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-neutral-900/70 hover:bg-neutral-800/90 border border-neutral-800 text-neutral-300 hover:text-white font-medium text-sm transition-all"
            >
              <Phone className="w-4 h-4 text-amber-400" />
              <span>{settings.phone}</span>
            </a>
          </div>

          {/* Hero cover notice if not set */}
          {!settings.heroCoverUrl && (
            <div className="mt-10 px-4 py-2 rounded-lg bg-neutral-900/70 border border-amber-500/20 text-xs text-neutral-400 flex items-center gap-2">
              <Camera className="w-3.5 h-3.5 text-amber-400" />
              <span>Fotografia reale e ballinës mund të ngarkohet nga paneli administrativ.</span>
            </div>
          )}
        </div>
      </section>

      {/* 2. STATS & REASONS HIGHLIGHT */}
      <section className="bg-neutral-900/50 border-b border-neutral-800/60 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
            <div className="text-2xl sm:text-4xl font-extrabold text-amber-400 font-heading">
              100%
            </div>
            <div className="text-xs sm:text-sm text-neutral-400 mt-1 font-medium">
              Foto Reale të Punimeve
            </div>
          </div>

          <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
            <div className="text-2xl sm:text-4xl font-extrabold text-amber-400 font-heading">
              +{settings.experienceYears || 15} Vite
            </div>
            <div className="text-xs sm:text-sm text-neutral-400 mt-1 font-medium">
              Përvojë në Metalurgji & Ndërtim
            </div>
          </div>

          <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
            <div className="text-2xl sm:text-4xl font-extrabold text-amber-400 font-heading">
              Kosovë
            </div>
            <div className="text-xs sm:text-sm text-neutral-400 mt-1 font-medium">
              Montim në të Gjitha Komunat
            </div>
          </div>

          <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
            <div className="text-2xl sm:text-4xl font-extrabold text-amber-400 font-heading">
              Garanci
            </div>
            <div className="text-xs sm:text-sm text-neutral-400 mt-1 font-medium">
              Për Çdo Konstruksion të Dorëzuar
            </div>
          </div>
        </div>
      </section>

      {/* 3. SERVICE CATEGORIES */}
      <section className="py-20 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Specializimi Ynë
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-2">
              Kategoritë Kryesore të Shërbimeve
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base mt-3">
              Zgjidhni njërën nga kategoritë për të parë detajet dhe fotografitë e projekteve tona.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => {
              const catProjects = publishedProjects.filter(p => p.categorySlug === cat.slug);
              return (
                <div
                  key={cat.id}
                  onClick={() => onNavigate(cat.slug as PageId)}
                  className="group relative p-7 rounded-2xl bg-neutral-900/70 border border-neutral-800 hover:border-amber-500/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {cat.badge || 'Tradita Dekor'}
                      </span>
                      <span className="text-xs text-neutral-500">
                        {catProjects.length} {catProjects.length === 1 ? 'Projekt' : 'Projekte'}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
                      {cat.name}
                    </h3>

                    <p className="text-sm text-neutral-400 mt-2.5 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center justify-between text-xs font-semibold text-amber-400 group-hover:text-amber-300">
                    <span>Eksploro Shërbimin</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. PROJECT CATALOG PREVIEW */}
      <section className="py-20 bg-neutral-900/30 border-y border-neutral-800/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Puna Jonë në Terren
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-1">
                Katalogu i Projekteve
              </h2>
              <p className="text-neutral-400 text-sm mt-2 max-w-xl">
                Fotografi reale nga punimet tona në Kosovë. Çdo projekt është i ndërtuar me materiale cilësore dhe përkushtim maksimal.
              </p>
            </div>

            <button
              onClick={() => onNavigate('catalog')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 hover:border-amber-400 text-amber-400 hover:text-amber-300 text-sm font-semibold transition-all self-start md:self-auto cursor-pointer"
            >
              <span>Shiko Të Gjitha Projektet</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Projects Grid or Placeholder State */}
          {featuredProjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.map((project) => {
                const hasImages = project.mainImage || (project.galleryImages && project.galleryImages.length > 0);
                const displayImage = project.mainImage || project.galleryImages[0];
                const allImages = project.mainImage 
                  ? [project.mainImage, ...project.galleryImages.filter(g => g.id !== project.mainImage?.id)]
                  : project.galleryImages;

                return (
                  <div
                    key={project.id}
                    className="group bg-neutral-900/90 rounded-2xl border border-neutral-800 overflow-hidden hover:border-amber-500/40 transition-all shadow-xl flex flex-col"
                  >
                    {/* Image Area */}
                    <div className="relative aspect-video overflow-hidden bg-neutral-950">
                      {hasImages ? (
                        <div
                          className="w-full h-full cursor-pointer relative"
                          onClick={() => onOpenLightbox(project, 0)}
                        >
                          <img
                            src={displayImage.url}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-neutral-950/20 group-hover:bg-neutral-950/0 transition-colors" />
                          <span className="absolute bottom-2 right-2 px-2 py-1 rounded bg-neutral-950/80 text-[11px] font-medium text-neutral-300 backdrop-blur-sm">
                            {allImages.length} {allImages.length === 1 ? 'foto' : 'foto'}
                          </span>
                        </div>
                      ) : (
                        <ImagePlaceholder
                          categoryName={project.categorySlug}
                          showAdminHint
                          onAdminClick={() => onNavigate('admin')}
                        />
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
                          <span className="font-semibold text-amber-400 uppercase tracking-wider">
                            {project.categorySlug}
                          </span>
                          {project.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-neutral-500" />
                              {project.location}
                            </span>
                          )}
                        </div>

                        <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                          {project.title}
                        </h3>

                        {project.description && (
                          <p className="text-xs text-neutral-400 mt-2 line-clamp-2 leading-relaxed">
                            {project.description}
                          </p>
                        )}
                      </div>

                      <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs">
                        <span className="text-emerald-400 font-medium flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          {project.status}
                        </span>

                        {hasImages && (
                          <button
                            onClick={() => onOpenLightbox(project, 0)}
                            className="text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
                          >
                            Hap Galerinë &rarr;
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Clean Empty Placeholder State complying strictly with user rule */
            <div className="p-8 sm:p-12 rounded-2xl bg-neutral-900/60 border border-neutral-800 text-center max-w-3xl mx-auto">
              <ImagePlaceholder
                customMessage="Fotografitë e para të projekteve do të publikohen së shpejti"
                aspectRatio="wide"
                showAdminHint
                onAdminClick={() => onNavigate('admin')}
              />
              <div className="mt-6 text-sm text-neutral-400 max-w-md mx-auto">
                Tradita Dekor nuk përdor fotografi false apo të gjeneruara nga AI. 
                Përdorni panelin administrativ për të ngarkuar menjëherë fotografitë tuaja reale nga telefoni apo kompjuteri.
              </div>
              <button
                onClick={() => onNavigate('admin')}
                className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Kyçu në Panelin Administrativ për të ngarkuar foto
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 5. ABOUT SUMMARY & QUALITY PILLARS */}
      <section className="py-20 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Përvoja & Përkushtimi
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-2 leading-tight">
                {settings.aboutTitle || 'Traditë, Përkushtim dhe Saktësi në Çdo Konstruksion'}
              </h2>
              <p className="mt-4 text-neutral-300 text-sm sm:text-base leading-relaxed">
                {settings.aboutText}
              </p>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {settings.aboutPillars.map((pillar, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-neutral-900/70 border border-neutral-800">
                    <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      {pillar.title}
                    </h4>
                    <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex items-center gap-4">
                <button
                  onClick={() => onNavigate('about')}
                  className="px-6 py-3 rounded-xl bg-neutral-900 border border-neutral-700 hover:border-amber-400 text-white font-semibold text-sm transition-all cursor-pointer"
                >
                  Më Shumë Rreth Nesh &rarr;
                </button>
                <button
                  onClick={() => onNavigate('contact')}
                  className="text-amber-400 hover:text-amber-300 text-sm font-semibold underline underline-offset-4 cursor-pointer"
                >
                  Na Kontaktoni
                </button>
              </div>
            </div>

            {/* Architectural badge showcase */}
            <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-neutral-900 via-neutral-900/90 to-neutral-950 border border-amber-500/30 shadow-2xl relative">
              <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-400 font-bold font-serif-brand text-xl">
                  TD
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Tradita Dekor</h3>
                  <p className="text-xs text-amber-400">Terasa • Veranda • Konstruksione Metali</p>
                </div>
              </div>

              <div className="space-y-4 text-sm text-neutral-300">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span>Matje të sakta në vendin e ngjarjes dhe këshillim profesional falas.</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span>Materiale të trajtuara kundër ndryshkut për rezistencë shumëvjeçare.</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span>Montim i shpejtë, i pastër dhe me afate të garantuara kohore.</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span>Raport i shkëlqyer mes çmimit dhe cilësisë së punës.</span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-neutral-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-neutral-500 block">Keni një pyetje?</span>
                  <a
                    href={`tel:${cleanPhone}`}
                    className="text-base font-bold text-amber-400 hover:text-amber-300"
                  >
                    {settings.phone}
                  </a>
                </div>
                <a
                  href={`https://wa.me/${cleanWhatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION SECTION */}
      <section className="py-16 bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 border-t border-neutral-800 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Gati për të Filluar Projektin Tuaj?
          </h2>
          <p className="mt-3 text-neutral-400 text-sm sm:text-base max-w-xl mx-auto">
            Na kontaktoni sot për konsultim, matje dhe ofertë të personalizuar pa asnjë obligim.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href={`tel:${cleanPhone}`}
              className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/20"
            >
              <Phone className="w-4 h-4" />
              <span>Telefono: {settings.phone}</span>
            </a>
            <button
              onClick={() => onNavigate('contact')}
              className="px-6 py-3.5 rounded-xl bg-neutral-900 border border-neutral-700 hover:border-amber-400 text-white font-semibold text-sm transition-all cursor-pointer"
            >
              Dërgo Mesazh në Faqe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
