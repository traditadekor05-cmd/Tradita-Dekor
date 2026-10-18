import React from 'react';
import { 
  ArrowLeft, 
  Phone, 
  MessageCircle, 
  ShieldCheck, 
  Check, 
  Camera, 
  MapPin, 
  Calendar,
  Layers,
  Wrench
} from 'lucide-react';
import { Category, Project, CompanySettings, PageId } from '../types';
import { ImagePlaceholder } from '../components/ImagePlaceholder';

interface CategoryPageProps {
  slug: string;
  categories: Category[];
  projects: Project[];
  settings: CompanySettings;
  onNavigate: (page: PageId) => void;
  onOpenLightbox: (project: Project, index: number) => void;
}

// Domain-specific information in Albanian for each trade
const CATEGORY_DETAILS: Record<string, {
  tagline: string;
  fullDescription: string;
  features: string[];
  materials: string[];
  process: string[];
}> = {
  terasa: {
    tagline: 'Mbrojtje maksimale, elegancë dhe jetëgjatësi për terasën tuaj.',
    fullDescription: 'Ndërtojmë mbulesa terasash me konstruksione metalike të profileve të rënda dhe të lehta, me përfundim me ngjyrë pluhur elektrostatike apo zinkim. Zgjedhje panelesh sanduiç me termoizolim, xhama të sigurt të laminuar/temperuar ose polikarbonat cilësor kundër rrezeve UV.',
    features: [
      'Rezistencë ndaj peshës së borës dhe erërave të forta të klimës së Kosovës',
      'Kanalizim i integruar i ujërave atmosferikë pa rrjedhje anësore',
      'Dizajne moderne bashkëkohore që përshtaten me arkitekturën e shtëpisë',
      'Mundësi mbylljeje të mëvonshme me xham rrëshqitës'
    ],
    materials: ['Profile çeliku të certifikuara', 'Panele sanduiç 40-80mm', 'Xhama të temperuar', 'Polikarbonat UV'],
    process: ['Matje në vendndodhje', 'Modelim dhe përzgjedhje materiali', 'Përgatitje në punishte', 'Montim i shpejtë në objekt']
  },
  veranda: {
    tagline: 'Komoditet dhe ambient i ndritshëm në çdo stinë të vitit.',
    fullDescription: 'Verandat e punuara nga Tradita Dekor kombinojnë profilin e fortë metalik me transparencën e xhamit. Ideale për shtëpi banimi, vila dhe lokale hoteliere që kërkojnë të zgjerojnë hapësirën e shfrytëzueshme me pamje panoramike.',
    features: [
      'Sisteme xhami panoramik të lëvizshëm me hapje totale ose të pjesshme',
      'Izolim i shkëlqyer termik dhe akustik nga zhurmat e jashtme',
      'Strukturë metalike me jetëgjatësi shumëdekadëshe',
      'Përshtatje sipas dimensioneve të çdo hapësire'
    ],
    materials: ['Skelet hekuri të përpunuar me saktësi', 'Profile alumini termik', 'Paketa xhami dopio', 'Gomina silikoni izoluese'],
    process: ['Konsultim paraprak', 'Skicim teknik', 'Përpunim me saldim profesional', 'Instalim dhe testim i mekanizmave']
  },
  garazha: {
    tagline: 'Siguri e plotë dhe mbrojtje nga dielli, shiu dhe breshëri për veturën tuaj.',
    fullDescription: 'Prodhimi dhe montimi i garazhave metalike të hapura (carport) dhe të mbyllura. Zgjidhje ideale për një, dy ose më shumë automjete, me mbulesa të izoluara nga panelet sanduiç ose llamarina të profilizuara me garanci.',
    features: [
      'Konstruksion i përforcuar për stabilitet maksimal',
      'Mbrojtje e plotë e ngjyrës dhe llamarinës së automjetit nga rrezatimi diellor dhe reshjet',
      'Dizajn i hapur elegant ose opsion me mbyllje anësore',
      'Përfundim me ngjyra sipas dëshirës suaj me bojëra antikorrozive'
    ],
    materials: ['Gypa çeliku katror dhe drejtkëndor', 'Panele çatie sanduiç me shkumë poliuretani', 'Llamarinë e zinguar me ngjyrë'],
    process: ['Përcaktimi i dimensionit sipas numrit të makinave', 'Konstruimi i shtyllave mbajtëse', 'Mbulesa e çatisë', 'Lidhja e ulluqeve']
  },
  'konstruksione-metali': {
    tagline: 'Punime hekuri të thjeshta dhe të rënda me saktësi milimetrike.',
    fullDescription: 'Tradita Dekor ofron gamë të gjerë punimesh metalike: dyer oborri (me hapje automatike ose manuale), rrethoja dekorative, parmakë për shkallë e terasa, shkallë emergjente spirale dhe mbulesa industriale.',
    features: [
      'Saldim me aparatura bashkëkohore për bashkime të padukshme dhe të forta',
      'Mbrojtje e dyfishtë antikorrozive (primer epoksid + ngjyrë përfundimtare)',
      'Punime klasike të farkëtuara dhe moderne minimaliste',
      'Montim me vida dhe spiranca profesionale betoni'
    ],
    materials: ['Shufra hekuri të plotë', 'Profile metalike me trashësi standarde', 'Mekanizma dhe mentesha të forta'],
    process: ['Konsultim dhe zgjedhje e modelit', 'Prerje dhe saldim preciz', 'Lyerje industriale', 'Montim në vend']
  },
  bunare: {
    tagline: 'Mbulesa dhe kapake dekorativë mbrojtës për bunare uji.',
    fullDescription: 'Bunari në oborrin tuaj meriton një mbrojtje maksimale kundër pluhurit dhe rreziqeve, duke ruajtur njëkohësisht bukurinë tradicionale. Prodhimi i kapakëve të bunareve me hekur të punuar, mbulesa cilindrike apo katrore me mekanizma të lehtë hapjeje.',
    features: [
      'Siguri absolute për fëmijët dhe kafshët shtëpiake',
      'Mekanizëm i sigurt i mbylljes me mundësi dryni',
      'Detaje dekorative tradicionale dhe bashkëkohore',
      'Rezistencë e jashtëzakonshme ndaj lagështirës së vazhdueshme'
    ],
    materials: ['Hekur i farkëtuar i rëndë', 'Llamarinë e galvanizuar', 'Bojëra mbrojtëse rezistente ndaj ujit'],
    process: ['Matja e diametrit të unazës së bunarit', 'Përpunimi i harkut dhe kornizës', 'Vendosja e dorezave dhe menteshave', 'Montimi final']
  }
};

export const CategoryPage: React.FC<CategoryPageProps> = ({
  slug,
  categories,
  projects,
  settings,
  onNavigate,
  onOpenLightbox
}) => {
  const currentCategory = categories.find(c => c.slug === slug) || {
    id: slug,
    slug,
    name: slug.charAt(0).toUpperCase() + slug.slice(1).replace('-', ' '),
    description: 'Punime profesionale nga Tradita Dekor në Kosovë.',
    badge: 'Cilësi e Garantuar',
    order: 0
  };

  const details = CATEGORY_DETAILS[slug] || {
    tagline: 'Zgjidhje profesionale dhe cilësore nga Tradita Dekor.',
    fullDescription: currentCategory.description,
    features: [
      'Materiale çeliku dhe zingu të certifikuara',
      'Montim i shpejtë dhe i saktë',
      'Garanci e plotë për stabilitet',
      'Çmime të volitshme në tregun e Kosovës'
    ],
    materials: ['Profile metalike cilësore', 'Veshje mbrojtëse', 'Aksesorë montimi të certifikuar'],
    process: ['Matje në terren', 'Përgatitje', 'Montim në vendngjarje']
  };

  const categoryProjects = projects.filter(
    p => p.published !== false && p.categorySlug === slug
  );

  const cleanPhone = settings.phone.replace(/[^0-9+]/g, '');
  const cleanWhatsapp = settings.whatsapp.replace(/[^0-9]/g, '');

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back navigation */}
        <button
          onClick={() => onNavigate('catalog')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-amber-400 transition-colors mb-8 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kthehu te të Gjitha Shërbimet & Katalogu</span>
        </button>

        {/* Hero header */}
        <div className="rounded-3xl bg-gradient-to-br from-neutral-900 via-neutral-900/90 to-neutral-950 border border-amber-500/30 p-8 sm:p-12 mb-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 blur-[100px] pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 mb-4">
              Kategoria: {currentCategory.name}
            </span>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
              {currentCategory.name} në Kosovë
            </h1>

            <p className="text-lg sm:text-xl font-medium text-amber-300/90 mt-3">
              {details.tagline}
            </p>

            <p className="text-sm sm:text-base text-neutral-300 mt-4 leading-relaxed">
              {details.fullDescription}
            </p>

            {/* Quick contact buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={`tel:${cleanPhone}`}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-amber-500/20"
              >
                <Phone className="w-4 h-4" />
                <span>Telefono për Ofertë: {settings.phone}</span>
              </a>

              <a
                href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(`Përshëndetje Tradita Dekor, po ju kontaktoj për të bërë pyetje dhe për të marrë informata shtesë rreth punimeve për ${currentCategory.name}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-amber-400/50 text-white font-semibold text-xs tracking-wider transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Bisedo në WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Features & Technical specifications */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="p-6 rounded-2xl bg-neutral-900/70 border border-neutral-800">
            <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              Përparësitë Kryesore
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-neutral-300">
              {details.features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-900/70 border border-neutral-800">
            <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-400" />
              Materialet që Përdorim
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-neutral-300">
              {details.materials.map((mat, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
                  <span>{mat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-900/70 border border-neutral-800">
            <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-amber-400" />
              Procesi i Punës
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-neutral-300">
              {details.process.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="font-bold text-amber-400 text-xs w-4">
                    {idx + 1}.
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Category Projects Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Projektet Tona në {currentCategory.name}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                Vetëm fotografi reale të punimeve të dorëzuara nga ekipi i Tradita Dekor.
              </p>
            </div>

            <button
              onClick={() => onNavigate('admin')}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
            >
              <span>Shto foto për këtë kategori</span> &rarr;
            </button>
          </div>

          {categoryProjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryProjects.map((project) => {
                const allImages = project.mainImage
                  ? [project.mainImage, ...project.galleryImages.filter(g => g.id !== project.mainImage?.id)]
                  : project.galleryImages;
                const hasImages = allImages.length > 0;
                const displayImage = allImages[0];

                return (
                  <div
                    key={project.id}
                    className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden hover:border-amber-500/40 transition-all shadow-xl flex flex-col justify-between"
                  >
                    <div className="relative aspect-video overflow-hidden bg-neutral-950">
                      {hasImages ? (
                        <div
                          className="w-full h-full cursor-pointer relative"
                          onClick={() => onOpenLightbox(project, 0)}
                        >
                          <img
                            src={displayImage.url}
                            alt={project.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          />
                          <span className="absolute bottom-2 right-2 px-2 py-1 rounded bg-neutral-950/80 text-[11px] font-medium text-amber-300 backdrop-blur-sm">
                            {allImages.length} {allImages.length === 1 ? 'foto' : 'foto'}
                          </span>
                        </div>
                      ) : (
                        <ImagePlaceholder
                          categoryName={currentCategory.name}
                          showAdminHint
                          onAdminClick={() => onNavigate('admin')}
                        />
                      )}
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        {project.location && (
                          <div className="flex items-center gap-1 text-xs text-neutral-400 mb-1">
                            <MapPin className="w-3.5 h-3.5 text-amber-400" />
                            <span>{project.location}</span>
                          </div>
                        )}
                        <h4 className="text-lg font-bold text-white">{project.title}</h4>
                        {project.description && (
                          <p className="text-xs text-neutral-400 mt-2 line-clamp-3">
                            {project.description}
                          </p>
                        )}
                      </div>

                      <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between text-xs">
                        <span className="text-emerald-400 font-semibold">{project.status}</span>
                        {hasImages && (
                          <button
                            onClick={() => onOpenLightbox(project, 0)}
                            className="text-amber-400 hover:text-amber-300 font-bold cursor-pointer"
                          >
                            Galeria &rarr;
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
            <div className="p-8 sm:p-12 rounded-2xl bg-neutral-900/60 border border-neutral-800 text-center max-w-2xl mx-auto">
              <ImagePlaceholder
                customMessage={`Fotografitë për ${currentCategory.name} do të publikohen së shpejti`}
                aspectRatio="wide"
                showAdminHint
                onAdminClick={() => onNavigate('admin')}
              />
              <p className="text-xs sm:text-sm text-neutral-400 mt-4 leading-relaxed">
                Nuk kemi vendosur fotografi artificiale. Sapo të ngarkoni fotografitë tuaja reale nga paneli i administratorit, ato do të shfaqen menjëherë këtu.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
