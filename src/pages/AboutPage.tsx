import React from 'react';
import { 
  ShieldCheck, 
  Award, 
  Wrench, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Phone, 
  MessageCircle,
  Hammer
} from 'lucide-react';
import { CompanySettings, PageId } from '../types';

interface AboutPageProps {
  settings: CompanySettings;
  onNavigate: (page: PageId) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ settings, onNavigate }) => {
  const cleanPhone = settings.phone.replace(/[^0-9+]/g, '');
  const cleanWhatsapp = settings.whatsapp.replace(/[^0-9]/g, '');

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Hero title */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Kush Jemi Ne
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mt-2 leading-tight">
            Mjeshtëri dhe Përkushtim në Çdo Konstruksion
          </h1>
          <p className="text-base sm:text-lg text-neutral-400 mt-4 leading-relaxed">
            Tradita Dekor është emri i besuar në Kosovë për terasa, veranda moderne, garazha dhe konstruksione hekuri të punuara me standarde europiane.
          </p>
        </div>

        {/* Story & Philosophy Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-5 text-sm sm:text-base text-neutral-300 leading-relaxed">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              Përvoja Jonë në Kosovë
            </h2>
            <p>
              Me një përvojë mbi {settings.experienceYears || 15} vjeçare në sektorin e ndërtimit dhe përpunimit të metaleve, Tradita Dekor u krijua me një qëllim të qartë: të ofrojë produkte metalike me jetëgjatësi të lartë, estetikë të lartë dhe me montim të sigurt në të gjithë territorin e Kosovës.
            </p>
            <p>
              Ne e kuptojmë rëndësinë e çdo detaji. Një terasë apo verandë nuk është thjesht një mbulesë, por një hapësirë ku familja juaj kalon çaste të çmuara. Prandaj, çdo profil, saldim dhe izolim realizohet me rigorozitet të plotë.
            </p>
            <p className="text-amber-300/90 font-medium italic">
              "Politika jonë e palëkundur është transparenca totale: ne paraqesim vetëm punët tona reale, pa imazhe të rreme apo pretendime të pabazuara."
            </p>
          </div>

          {/* Pillars card */}
          <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-8 shadow-2xl relative">
            <div className="absolute top-4 right-4 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              Shtyllat e Cilësisë së Tradita Dekor
            </h3>

            <div className="space-y-4">
              {settings.aboutPillars.map((p, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800/80">
                  <h4 className="text-sm font-bold text-amber-400">{p.title}</h4>
                  <p className="text-xs text-neutral-400 mt-1 leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Materials & Standards */}
        <div className="p-8 sm:p-12 rounded-3xl bg-neutral-900/60 border border-neutral-800">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Standardet Teknike
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Materialet dhe Teknologjia që Përdorim
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-2">
              Zgjedhim vetëm lëndë të para të nivelit të lartë për t’i bërë ballë klimës kontinentale të Kosovës.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 text-center">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-3">
                <Hammer className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-white">Çelik i Trajtuar</h4>
              <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
                Profile çeliku të trasha, të lëmuara dhe të mbrojtura me bojëra antikorrozive industriale.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 text-center">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-3">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-white">Panele Sanduiç</h4>
              <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
                Izolim i lartë termik dhe akustik nga shiu, breshëri dhe i nxehti i verës.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 text-center">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-3">
                <Wrench className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-white">Saldim Profesional</h4>
              <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
                Bashkime të qepura me MIG/TIG për rezistencë maksimale statike ndaj erërave.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 text-center">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-white">Montim i Përpiktë</h4>
              <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
                Ekip me përvojë që respekton afatet e premtuara dhe lë ambientin të pastër.
              </p>
            </div>
          </div>
        </div>

        {/* Action card */}
        <div className="text-center bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-neutral-900 border border-amber-500/30 rounded-3xl p-10">
          <h3 className="text-2xl font-bold text-white">
            Dëshironi të Diskutojmë për Projektin Tuaj?
          </h3>
          <p className="text-sm text-neutral-400 mt-2 max-w-xl mx-auto">
            Vijmë në vendin e ngjarjes për matje të sakta dhe vlerësim profesional të plotë në të gjithë Kosovën.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <a
              href={`tel:${cleanPhone}`}
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider transition-colors"
            >
              Telefono: {settings.phone}
            </a>
            <button
              onClick={() => onNavigate('contact')}
              className="px-6 py-3 rounded-xl bg-neutral-950 border border-neutral-700 hover:border-amber-400 text-white font-semibold text-xs tracking-wider transition-colors cursor-pointer"
            >
              Dërgo Mesazh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
