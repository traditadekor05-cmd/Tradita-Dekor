import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  Camera, 
  ExternalLink,
  Layers
} from 'lucide-react';
import { Project, Category, CompanySettings, PageId } from '../types';
import { ImagePlaceholder } from '../components/ImagePlaceholder';

interface CatalogPageProps {
  projects: Project[];
  categories: Category[];
  settings: CompanySettings;
  onOpenLightbox: (project: Project, index: number) => void;
  onNavigate: (page: PageId) => void;
  initialCategory?: string;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({
  projects,
  categories,
  settings,
  onOpenLightbox,
  onNavigate,
  initialCategory = 'all'
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      if (p.published === false) return false;
      if (selectedCategory !== 'all' && p.categorySlug !== selectedCategory) return false;
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        const matchesLoc = p.location ? p.location.toLowerCase().includes(q) : false;
        return matchesTitle || matchesDesc || matchesLoc;
      }
      return true;
    });
  }, [projects, selectedCategory, statusFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Galeria Zyrtare
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mt-2">
            Katalogu i Projekteve
          </h1>
          <p className="text-sm sm:text-base text-neutral-400 mt-3 leading-relaxed">
            Eksploroni punimet tona në terren në të gjithë Kosovën. Të gjitha fotografitë janë autentike dhe paraqesin realizimet reale të Tradita Dekor.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4 sm:p-5 mb-10 shadow-lg space-y-4">
          {/* Top row: Search and Status */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Kërko sipas titullit, vendndodhjes ose përshkrimit..."
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-400 rounded-xl pl-10 pr-4 py-2.5 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-white"
                >
                  Pastro
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-neutral-400 flex items-center gap-1 whitespace-nowrap">
                <Filter className="w-3.5 h-3.5 text-amber-400" />
                Statusi:
              </span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-neutral-950 border border-neutral-800 focus:border-amber-400 rounded-xl px-3 py-2 text-xs text-neutral-200 focus:outline-none"
              >
                <option value="all">Të gjitha statuset</option>
                <option value="E Përfunduar">E Përfunduar</option>
                <option value="Në Proces">Në Proces</option>
                <option value="Planifikim">Planifikim</option>
              </select>
            </div>
          </div>

          {/* Category Chips Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                  : 'bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
              }`}
            >
              Të Gjitha ({projects.filter(p => p.published !== false).length})
            </button>

            {categories.map((cat) => {
              const count = projects.filter(p => p.published !== false && p.categorySlug === cat.slug).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat.slug
                      ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                      : 'bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
                  }`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-neutral-400 mb-6 px-1">
          <span>
            Shfaqen <strong className="text-white">{filteredProjects.length}</strong> projekte
          </span>
          {selectedCategory !== 'all' && (
            <button
              onClick={() => setSelectedCategory('all')}
              className="text-amber-400 hover:text-amber-300"
            >
              Hiq filtrin e kategorisë
            </button>
          )}
        </div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => {
              const allImages = project.mainImage
                ? [project.mainImage, ...project.galleryImages.filter(g => g.id !== project.mainImage?.id)]
                : project.galleryImages;
              const hasImages = allImages.length > 0;
              const displayImage = allImages[0];

              return (
                <div
                  key={project.id}
                  className="group bg-neutral-900/90 rounded-2xl border border-neutral-800 overflow-hidden hover:border-amber-500/40 transition-all duration-300 hover:-translate-y-1 shadow-xl flex flex-col justify-between"
                >
                  {/* Photo Section */}
                  <div className="relative aspect-video overflow-hidden bg-neutral-950">
                    {hasImages ? (
                      <div
                        className="w-full h-full cursor-pointer relative"
                        onClick={() => onOpenLightbox(project, 0)}
                      >
                        <img
                          src={displayImage.url}
                          alt={displayImage.altText || project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-neutral-950/20 group-hover:bg-neutral-950/0 transition-colors" />
                        <span className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-neutral-950/80 text-xs font-medium text-amber-300 backdrop-blur-md border border-neutral-800 flex items-center gap-1.5">
                          <Camera className="w-3 h-3 text-amber-400" />
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

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
                        <span className="font-bold text-amber-400 uppercase tracking-wider">
                          {project.categorySlug}
                        </span>
                        {project.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                            {project.location}
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                        {project.title}
                      </h3>

                      {project.description && (
                        <p className="text-xs text-neutral-400 mt-2 line-clamp-3 leading-relaxed">
                          {project.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-5 pt-3.5 border-t border-neutral-800 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {project.status}
                        </span>
                        {project.completionDate && (
                          <span className="text-neutral-500 text-[11px] flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {project.completionDate}
                          </span>
                        )}
                      </div>

                      {hasImages ? (
                        <button
                          onClick={() => onOpenLightbox(project, 0)}
                          className="text-amber-400 hover:text-amber-300 font-bold transition-colors cursor-pointer"
                        >
                          Shiko Galerinë &rarr;
                        </button>
                      ) : (
                        <span className="text-neutral-500 text-[11px] italic">
                          Së shpejti fotot
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty Search or Empty Category */
          <div className="p-12 rounded-2xl bg-neutral-900/50 border border-neutral-800 text-center max-w-2xl mx-auto my-8">
            <ImagePlaceholder
              customMessage="Nuk u gjetën projekte me këto filtra"
              aspectRatio="wide"
              showAdminHint
              onAdminClick={() => onNavigate('admin')}
            />
            <p className="text-sm text-neutral-400 mt-4">
              Nuk ka projekte të publikuara për këtë kërkim. Provoni të ndryshoni kategorinë ose fjalën e kërkimit.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Pastro të gjithë filtrat
              </button>
              <button
                onClick={() => onNavigate('admin')}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold transition-colors cursor-pointer"
              >
                Shto Projekt të Ri
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
