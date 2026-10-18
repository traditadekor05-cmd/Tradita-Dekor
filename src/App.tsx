import React, { useState, useEffect, useCallback } from 'react';
import { 
  CompanySettings, 
  Category, 
  Project, 
  ProjectImage, 
  PageId 
} from './types';
import { api, authStorage } from './services/api';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingContact } from './components/FloatingContact';
import { Lightbox } from './components/Lightbox';

// Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { CatalogPage } from './pages/CatalogPage';
import { CategoryPage } from './pages/CategoryPage';
import { ContactPage } from './pages/ContactPage';
import { AdminPage } from './pages/AdminPage';

import { 
  INITIAL_SETTINGS, 
  INITIAL_CATEGORIES, 
  INITIAL_PROJECTS 
} from './data/initialData';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [settings, setSettings] = useState<CompanySettings>(INITIAL_SETTINGS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Lightbox state
  const [lightbox, setLightbox] = useState<{
    isOpen: boolean;
    images: ProjectImage[];
    currentIndex: number;
    project?: Project;
  }>({
    isOpen: false,
    images: [],
    currentIndex: 0
  });

  // Load data from API
  const refreshData = useCallback(async () => {
    try {
      const [fetchedSettings, fetchedCategories, fetchedProjects] = await Promise.all([
        api.getSettings().catch(() => INITIAL_SETTINGS),
        api.getCategories().catch(() => INITIAL_CATEGORIES),
        api.getProjects({ includeUnpublished: true }).catch(() => INITIAL_PROJECTS)
      ]);

      if (fetchedSettings) setSettings(fetchedSettings);
      if (fetchedCategories && fetchedCategories.length > 0) setCategories(fetchedCategories);
      if (fetchedProjects && fetchedProjects.length > 0) {
        setProjects(fetchedProjects);
      }
    } catch (err) {
      console.warn('Backend sync error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check auth and hash route on mount
  useEffect(() => {
    refreshData();

    // Verify admin token
    api.verifyAuth().then((valid) => {
      setIsAdmin(valid);
    });

    // Hash based routing
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').trim();
      const validPages: PageId[] = [
        'home',
        'about',
        'services',
        'catalog',
        'terasa',
        'veranda',
        'garazha',
        'konstruksione-metali',
        'bunare',
        'contact',
        'admin'
      ];

      if (validPages.includes(hash as PageId)) {
        setCurrentPage(hash as PageId);
      } else if (hash === 'katalogu') {
        setCurrentPage('catalog');
      } else if (hash === 'rreth-nesh') {
        setCurrentPage('about');
      } else if (hash === 'sherbimet') {
        setCurrentPage('services');
      } else if (hash === 'kontakti') {
        setCurrentPage('contact');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [refreshData]);

  const handleNavigate = (page: PageId) => {
    setCurrentPage(page);
    window.location.hash = page === 'home' ? '' : page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenLightbox = (project: Project, index: number) => {
    const allImages = project.mainImage
      ? [project.mainImage, ...project.galleryImages.filter(g => g.id !== project.mainImage?.id)]
      : project.galleryImages;

    if (allImages.length === 0) return;

    setLightbox({
      isOpen: true,
      images: allImages,
      currentIndex: index,
      project
    });
  };

  const handleCloseLightbox = () => {
    setLightbox(prev => ({ ...prev, isOpen: false }));
  };

  const handleNavigateLightbox = (index: number) => {
    setLightbox(prev => ({ ...prev, currentIndex: index }));
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-amber-500 selection:text-neutral-950">
      {/* Navigation Header */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        settings={settings}
        isAdmin={isAdmin}
      />

      {/* Main Page Content */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            settings={settings}
            categories={categories}
            projects={projects}
            onNavigate={handleNavigate}
            onOpenLightbox={handleOpenLightbox}
          />
        )}

        {currentPage === 'about' && (
          <AboutPage
            settings={settings}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'services' && (
          <ServicesPage
            categories={categories}
            settings={settings}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'catalog' && (
          <CatalogPage
            projects={projects}
            categories={categories}
            settings={settings}
            onOpenLightbox={handleOpenLightbox}
            onNavigate={handleNavigate}
          />
        )}

        {['terasa', 'veranda', 'garazha', 'konstruksione-metali', 'bunare'].includes(currentPage) && (
          <CategoryPage
            slug={currentPage}
            categories={categories}
            projects={projects}
            settings={settings}
            onNavigate={handleNavigate}
            onOpenLightbox={handleOpenLightbox}
          />
        )}

        {currentPage === 'contact' && (
          <ContactPage
            settings={settings}
          />
        )}

        {currentPage === 'admin' && (
          <AdminPage
            settings={settings}
            categories={categories}
            projects={projects}
            isAdmin={isAdmin}
            onRefreshData={refreshData}
            onNavigate={handleNavigate}
            onLoginSuccess={() => {
              setIsAdmin(true);
              refreshData();
            }}
            onLogout={() => {
              setIsAdmin(false);
              refreshData();
            }}
          />
        )}
      </main>

      {/* Lightbox modal */}
      <Lightbox
        isOpen={lightbox.isOpen}
        onClose={handleCloseLightbox}
        images={lightbox.images}
        currentIndex={lightbox.currentIndex}
        onNavigate={handleNavigateLightbox}
        project={lightbox.project}
      />

      {/* Floating contact buttons (WhatsApp & Phone) */}
      {currentPage !== 'admin' && (
        <FloatingContact settings={settings} />
      )}

      {/* Footer */}
      <Footer
        settings={settings}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
