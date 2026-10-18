import React, { useState, useRef } from 'react';
import { 
  Lock, 
  Unlock, 
  Upload, 
  Trash2, 
  Plus, 
  Edit3, 
  Check, 
  X, 
  Save, 
  Eye, 
  Image as ImageIcon, 
  Layers, 
  Building, 
  Phone, 
  Share2, 
  MapPin, 
  ShieldCheck, 
  ArrowUp, 
  ArrowDown, 
  Star, 
  AlertTriangle,
  RotateCcw,
  LogOut,
  FolderPlus,
  Globe,
  Download,
  UploadCloud,
  CheckCircle2
} from 'lucide-react';
import { 
  CompanySettings, 
  Category, 
  Project, 
  ProjectImage, 
  AdminUser, 
  PageId 
} from '../types';
import { api, authStorage } from '../services/api';

interface AdminPageProps {
  settings: CompanySettings;
  categories: Category[];
  projects: Project[];
  isAdmin: boolean;
  onRefreshData: () => Promise<void>;
  onNavigate: (page: PageId) => void;
  onLoginSuccess: () => void;
  onLogout: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  settings,
  categories,
  projects,
  isAdmin,
  onRefreshData,
  onNavigate,
  onLoginSuccess,
  onLogout
}) => {
  // Login form state
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active dashboard tab
  const [activeTab, setActiveTab] = useState<
    'overview' | 'projects' | 'branding' | 'company' | 'categories' | 'publish' | 'security'
  >('overview');

  // Notification state
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Editing Company Settings state
  const [editSettings, setEditSettings] = useState<CompanySettings>({ ...settings });
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Synchronize editSettings when settings change
  React.useEffect(() => {
    setEditSettings({ ...settings });
  }, [settings]);

  // Project Editor State
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [isSavingProject, setIsSavingProject] = useState(false);
  const [projectUploadPending, setProjectUploadPending] = useState(false);

  // Delete confirmation modals
  const [itemToDelete, setItemToDelete] = useState<{
    type: 'project' | 'image' | 'category';
    id: string;
    extra?: any;
    name: string;
  } | null>(null);

  // Password change state
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');

  // Vercel Publish & Backup states
  const [isPublishingVercel, setIsPublishingVercel] = useState(false);
  const [vercelSyncSuccess, setVercelSyncSuccess] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const restoreFileInputRef = useRef<HTMLInputElement>(null);

  // Logo & Hero Cover upload file inputs
  const logoInputRef = useRef<HTMLInputElement>(null);
  const heroInputRef = useRef<HTMLInputElement>(null);
  const projectPhotosRef = useRef<HTMLInputElement>(null);

  const handlePublishForVercel = async () => {
    setIsPublishingVercel(true);
    setVercelSyncSuccess(null);
    try {
      const res = await api.publishForVercel();
      await onRefreshData();
      setVercelSyncSuccess(res.message || 'Të dhënat u sinkronizuan me sukses për Vercel!');
      showToast('Gjithçka u sinkronizua me sukses për Vercel!');
    } catch (err: any) {
      showToast(err.message || 'Dështoi sinkronizimi për Vercel', 'error');
    } finally {
      setIsPublishingVercel(false);
    }
  };

  const handleDownloadBackup = async () => {
    setIsExporting(true);
    try {
      await api.downloadBackup();
      showToast('Kopja rezervë (JSON) u shkarkua me sukses!');
    } catch (err: any) {
      showToast(err.message || 'Dështoi shkarkimi i të dhënave', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleRestoreFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsRestoring(true);
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      await api.restoreBackup(parsed);
      await onRefreshData();
      showToast('Të dhënat u rikthyen me sukses!');
    } catch (err: any) {
      showToast('Dështoi leximi i skedarit të kopjes rezervë: ' + err.message, 'error');
    } finally {
      setIsRestoring(false);
      if (restoreFileInputRef.current) restoreFileInputRef.current.value = '';
    }
  };

  // ======================== AUTH ACTIONS ========================
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');
    try {
      await api.login(usernameInput, passwordInput);
      onLoginSuccess();
      showToast('Mirë se vini në Panelin e Tradita Dekor!');
    } catch (err: any) {
      setLoginError(err.message || 'Të dhënat janë të pasakta.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogoutClick = () => {
    api.logout();
    onLogout();
    showToast('Keni dalë nga paneli me sukses.');
  };

  // ======================== LOGO & HERO UPLOADS ========================
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      showToast('Duke ngarkuar logon e kompanisë...');
      const res = await api.uploadImage(file);
      await api.updateSettings({ logoUrl: res.url });
      await onRefreshData();
      showToast('Logoja e kompanisë u përditësua me sukses!');
    } catch (err: any) {
      showToast(err.message || 'Dështoi ngarkimi i logos', 'error');
    }
  };

  const handleDeleteLogo = async () => {
    if (!settings.logoUrl) return;
    try {
      await api.deleteImage(settings.logoUrl);
      await api.updateSettings({ logoUrl: null });
      await onRefreshData();
      showToast('Logoja u fshi.');
    } catch (err: any) {
      showToast(err.message || 'Dështoi fshirja e logos', 'error');
    }
  };

  const handleHeroCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      showToast('Duke ngarkuar fotografinë e ballinës...');
      const res = await api.uploadImage(file);
      await api.updateSettings({ heroCoverUrl: res.url });
      await onRefreshData();
      showToast('Fotografia e ballinës u përditësua me sukses!');
    } catch (err: any) {
      showToast(err.message || 'Dështoi ngarkimi i ballinës', 'error');
    }
  };

  const handleDeleteHeroCover = async () => {
    if (!settings.heroCoverUrl) return;
    try {
      await api.deleteImage(settings.heroCoverUrl);
      await api.updateSettings({ heroCoverUrl: null });
      await onRefreshData();
      showToast('Fotografia e ballinës u fshi.');
    } catch (err: any) {
      showToast(err.message || 'Dështoi fshirja e ballinës', 'error');
    }
  };

  // ======================== SAVE SETTINGS ========================
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      await api.updateSettings(editSettings);
      await onRefreshData();
      showToast('Të dhënat e kompanisë u ruajtën me sukses!');
    } catch (err: any) {
      showToast(err.message || 'Dështoi ruajtja e cilësimeve', 'error');
    } finally {
      setIsSavingSettings(false);
    }
  };

  // ======================== PROJECT ACTIONS ========================
  const handleStartCreateProject = () => {
    setEditingProject({
      title: '',
      categorySlug: categories[0]?.slug || 'terasa',
      description: '',
      location: 'Prishtinë',
      completionDate: '2026',
      status: 'E Përfunduar',
      published: true,
      galleryImages: [],
      mainImage: null
    });
    setIsCreatingProject(true);
  };

  const handleStartEditProject = (proj: Project) => {
    setEditingProject({ ...proj });
    setIsCreatingProject(false);
  };

  const handleCancelProjectEdit = () => {
    setEditingProject(null);
    setIsCreatingProject(false);
  };

  const handleUploadProjectPhotos = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !editingProject) return;

    setProjectUploadPending(true);
    try {
      const uploadedImages: ProjectImage[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        showToast(`Duke ngarkuar foton ${i + 1} nga ${files.length}...`);
        const result = await api.uploadImage(file);
        uploadedImages.push(result.image);
      }

      const existingGallery = editingProject.galleryImages || [];
      const updatedGallery = [...existingGallery, ...uploadedImages];
      const mainImg = editingProject.mainImage || uploadedImages[0] || null;

      setEditingProject({
        ...editingProject,
        galleryImages: updatedGallery,
        mainImage: mainImg
      });

      showToast(`${uploadedImages.length} fotografi u ngarkuan me sukses!`);
    } catch (err: any) {
      showToast(err.message || 'Dështoi ngarkimi i fotove', 'error');
    } finally {
      setProjectUploadPending(false);
      if (projectPhotosRef.current) projectPhotosRef.current.value = '';
    }
  };

  const handleSetMainPhoto = (img: ProjectImage) => {
    if (!editingProject) return;
    setEditingProject({
      ...editingProject,
      mainImage: img
    });
  };

  const handleMovePhoto = (index: number, direction: 'up' | 'down') => {
    if (!editingProject || !editingProject.galleryImages) return;
    const gallery = [...editingProject.galleryImages];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= gallery.length) return;

    const temp = gallery[index];
    gallery[index] = gallery[targetIdx];
    gallery[targetIdx] = temp;

    setEditingProject({
      ...editingProject,
      galleryImages: gallery
    });
  };

  const handleDeletePhotoFromProject = (img: ProjectImage) => {
    setItemToDelete({
      type: 'image',
      id: img.id,
      extra: img.url,
      name: img.title || 'Fotografi e projektit'
    });
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !editingProject.title) {
      showToast('Titulli i projektit është i detyrueshëm', 'error');
      return;
    }

    setIsSavingProject(true);
    try {
      if (isCreatingProject) {
        await api.createProject(editingProject);
        showToast('Projekti i ri u krijua me sukses!');
      } else if (editingProject.id) {
        await api.updateProject(editingProject.id, editingProject);
        showToast('Projekti u përditësua me sukses!');
      }
      await onRefreshData();
      setEditingProject(null);
      setIsCreatingProject(false);
    } catch (err: any) {
      showToast(err.message || 'Dështoi ruajtja e projektit', 'error');
    } finally {
      setIsSavingProject(false);
    }
  };

  // ======================== DELETE CONFIRMATION ========================
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      if (itemToDelete.type === 'project') {
        await api.deleteProject(itemToDelete.id);
        showToast('Projekti u fshi përgjithmonë.');
        await onRefreshData();
      } else if (itemToDelete.type === 'category') {
        await api.deleteCategory(itemToDelete.id);
        showToast('Kategoria u fshi.');
        await onRefreshData();
      } else if (itemToDelete.type === 'image') {
        const imageUrl = itemToDelete.extra;
        // Permanently delete file from server
        await api.deleteImage(imageUrl);

        // Remove from current project editor state
        if (editingProject && editingProject.galleryImages) {
          const updatedGallery = editingProject.galleryImages.filter(g => g.url !== imageUrl);
          const newMain = editingProject.mainImage?.url === imageUrl
            ? (updatedGallery[0] || null)
            : editingProject.mainImage;

          setEditingProject({
            ...editingProject,
            galleryImages: updatedGallery,
            mainImage: newMain
          });
        }
        await onRefreshData();
        showToast('Fotografia u fshi përgjithmonë.');
      }
    } catch (err: any) {
      showToast(err.message || 'Dështoi fshirja', 'error');
    } finally {
      setItemToDelete(null);
    }
  };

  // ======================== CHANGE PASSWORD ========================
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError('');
    setPwSuccess('');

    if (newPw !== confirmPw) {
      setPwError('Fjalëkalimet e reja nuk përputhen.');
      return;
    }

    try {
      await api.changePassword(currentPw, newPw);
      setPwSuccess('Fjalëkalimi u përditësua me sukses!');
      setCurrentPw('');
      setNewPw('');
      setConfirmPw('');
    } catch (err: any) {
      setPwError(err.message || 'Dështoi ndryshimi i fjalëkalimit');
    }
  };

  // ======================== RENDER LOGIN IF NOT AUTHENTICATED ========================
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-neutral-900/90 border border-neutral-800 p-8 sm:p-10 rounded-3xl shadow-2xl">
          <div className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto mb-4">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-extrabold text-white">
              Paneli Administrativ
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-neutral-400">
              Tradita Dekor – Menaxhimi i Projekteve dhe Faqes
            </p>
          </div>

          {loginError && (
            <div className="p-3.5 rounded-xl bg-red-950/50 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Helper credential callout */}
          <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-400 space-y-1">
            <p className="text-amber-400 font-semibold">Të dhënat fillestare të administratorit:</p>
            <p className="font-mono text-[11px] text-neutral-300">Përdoruesi: <strong className="text-white">admin</strong> ose <strong className="text-white">tradita.dekor05@gmail.com</strong></p>
            <p className="font-mono text-[11px] text-neutral-300">Fjalëkalimi: <strong className="text-white">tradita2026</strong></p>
            <p className="text-[10px] text-neutral-500 italic mt-1">(Mund ta ndryshoni lirisht fjalëkalimin pasi të kyçeni)</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Përdoruesi ose Email
              </label>
              <input
                type="text"
                required
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="admin ose tradita.dekor05@gmail.com"
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-400 rounded-xl px-4 py-3 text-sm text-neutral-200 placeholder-neutral-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Fjalëkalimi
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-400 rounded-xl px-4 py-3 text-sm text-neutral-200 placeholder-neutral-600 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-amber-500/20 cursor-pointer disabled:opacity-50"
            >
              {isLoggingIn ? 'Duke u verifikuar...' : 'Kyçu në Panel'}
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              onClick={() => onNavigate('home')}
              className="text-xs text-neutral-500 hover:text-amber-400 transition-colors"
            >
              &larr; Kthehu në faqen kryesore
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ======================== RENDER AUTHENTICATED DASHBOARD ========================
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col">
      {/* Toast alert */}
      {toastMessage && (
        <div
          className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl border shadow-2xl text-xs font-semibold flex items-center gap-2 backdrop-blur-md animate-in slide-in-from-top-2 ${
            toastMessage.type === 'error'
              ? 'bg-red-950/90 text-red-200 border-red-500/50'
              : 'bg-emerald-950/90 text-emerald-200 border-emerald-500/50'
          }`}
        >
          {toastMessage.type === 'error' ? <AlertTriangle className="w-4 h-4 text-red-400" /> : <Check className="w-4 h-4 text-emerald-400" />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-red-500/40 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <AlertTriangle className="w-6 h-6 flex-shrink-0" />
              <h3 className="text-base font-bold text-white">Konfirmoni Fshirjen Përfundimtare</h3>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Jeni duke fshirë: <strong className="text-white">{itemToDelete.name}</strong>. Ky veprim është i pakthyeshëm dhe skedari do të hiqet nga disku dhe baza e të dhënave.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold cursor-pointer"
              >
                Anulo
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold cursor-pointer"
              >
                Po, Fshije Përgjithmonë
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Header of Admin */}
      <div className="bg-neutral-900/90 border-b border-neutral-800 px-4 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500 text-neutral-950 font-bold flex items-center justify-center font-serif-brand">
            TD
          </div>
          <div>
            <h1 className="text-base font-bold text-white leading-tight">
              Paneli Administrativ – Tradita Dekor
            </h1>
            <p className="text-[11px] text-amber-400 font-medium">
              Menaxhimi i Fotove Reale & Informacioneve
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span>Shiko Faqen Live</span>
          </button>

          <button
            onClick={handleLogoutClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-300 text-xs font-medium cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Dil</span>
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="bg-neutral-900/50 border-b border-neutral-800 px-4 sm:px-8 overflow-x-auto flex items-center gap-2">
        <button
          onClick={() => { setActiveTab('overview'); setEditingProject(null); }}
          className={`px-4 py-3 text-xs font-bold border-b-2 whitespace-nowrap cursor-pointer transition-colors ${
            activeTab === 'overview'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          Pasqyra e Përgjithshme
        </button>

        <button
          onClick={() => { setActiveTab('projects'); }}
          className={`px-4 py-3 text-xs font-bold border-b-2 whitespace-nowrap cursor-pointer transition-colors flex items-center gap-1.5 ${
            activeTab === 'projects'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Fotot & Projektet ({projects.length})</span>
        </button>

        <button
          onClick={() => { setActiveTab('branding'); setEditingProject(null); }}
          className={`px-4 py-3 text-xs font-bold border-b-2 whitespace-nowrap cursor-pointer transition-colors flex items-center gap-1.5 ${
            activeTab === 'branding'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          <span>Logoja & Ballina</span>
        </button>

        <button
          onClick={() => { setActiveTab('company'); setEditingProject(null); }}
          className={`px-4 py-3 text-xs font-bold border-b-2 whitespace-nowrap cursor-pointer transition-colors flex items-center gap-1.5 ${
            activeTab === 'company'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <Phone className="w-3.5 h-3.5" />
          <span>Të Dhënat e Kompanisë</span>
        </button>

        <button
          onClick={() => { setActiveTab('categories'); setEditingProject(null); }}
          className={`px-4 py-3 text-xs font-bold border-b-2 whitespace-nowrap cursor-pointer transition-colors flex items-center gap-1.5 ${
            activeTab === 'categories'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Kategoritë ({categories.length})</span>
        </button>

        <button
          onClick={() => { setActiveTab('security'); setEditingProject(null); }}
          className={`px-4 py-3 text-xs font-bold border-b-2 whitespace-nowrap cursor-pointer transition-colors flex items-center gap-1.5 ${
            activeTab === 'security'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Siguria</span>
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8">
        {/* ===================== TAB 1: OVERVIEW ===================== */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800">
                <span className="text-xs text-neutral-400">Gjithsej Projekte</span>
                <div className="text-3xl font-extrabold text-white mt-1">{projects.length}</div>
                <span className="text-[11px] text-amber-400 mt-2 block">
                  {projects.filter(p => p.published !== false).length} të publikuara
                </span>
              </div>

              <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800">
                <span className="text-xs text-neutral-400">Fotografi Reale</span>
                <div className="text-3xl font-extrabold text-amber-400 mt-1">
                  {projects.reduce((acc, p) => acc + (p.galleryImages?.length || 0) + (p.mainImage ? 1 : 0), 0)}
                </div>
                <span className="text-[11px] text-neutral-400 mt-2 block">
                  Ruhen përgjithmonë në cloud
                </span>
              </div>

              <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800">
                <span className="text-xs text-neutral-400">Kategoritë</span>
                <div className="text-3xl font-extrabold text-white mt-1">{categories.length}</div>
                <span className="text-[11px] text-neutral-400 mt-2 block">
                  Terasa, Veranda, Garazha, Metal, Bunare
                </span>
              </div>

              <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800">
                <span className="text-xs text-neutral-400">Statusi i Logos & Ballinës</span>
                <div className="text-sm font-bold text-white mt-2 flex flex-col gap-1">
                  <span className={settings.logoUrl ? 'text-emerald-400' : 'text-amber-400'}>
                    • Logo: {settings.logoUrl ? 'E Ngarkuar' : 'Placeholder (E zbrazët)'}
                  </span>
                  <span className={settings.heroCoverUrl ? 'text-emerald-400' : 'text-amber-400'}>
                    • Ballina: {settings.heroCoverUrl ? 'E Ngarkuar' : 'Placeholder (E zbrazët)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div
                onClick={() => { setActiveTab('projects'); handleStartCreateProject(); }}
                className="p-6 rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-900/60 border border-amber-500/30 hover:border-amber-400 transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4 group-hover:bg-amber-500 group-hover:text-neutral-950 transition-colors">
                  <Plus className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">Shto Projekt & Ngarko Foto</h3>
                <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
                  Ngarkoni fotografitë tuaja reale nga telefoni apo kompjuteri për çdo punim të kryer.
                </p>
              </div>

              <div
                onClick={() => setActiveTab('branding')}
                className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-amber-500/30 transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-xl bg-neutral-800 text-amber-400 flex items-center justify-center mb-4 group-hover:bg-amber-500/20 transition-colors">
                  <Upload className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">Vendos Logon dhe Ballinën</h3>
                <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
                  Ngarkoni logon zyrtare dhe fotografinë kryesore të ballinës së faqes.
                </p>
              </div>

              <div
                onClick={() => setActiveTab('company')}
                className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-amber-500/30 transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-xl bg-neutral-800 text-amber-400 flex items-center justify-center mb-4 group-hover:bg-amber-500/20 transition-colors">
                  <Phone className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">Ndrysho Numrat & Kontaktet</h3>
                <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
                  Përditësoni numrin e telefonit, WhatsApp, emailin dhe orarin e punës.
                </p>
              </div>
            </div>

            {/* Instruction Banner on Strict Real Photos Requirement */}
            <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex items-start gap-4">
              <ShieldCheck className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
              <div className="text-xs sm:text-sm text-neutral-300 space-y-1">
                <p className="font-bold text-white">
                  Rregulli i Fotove Autentike të Tradita Dekor
                </p>
                <p className="text-neutral-400 leading-relaxed">
                  Të gjitha imazhet artificiale apo të gjeneruara me AI janë hequr plotësisht. Faqja shfaq vetëm fotot reale që ju ngarkoni këtu. Nëse një kategori apo projekt nuk ka akoma foto, ajo shfaqet automatikisht me njoftimin e pastër: <em className="text-amber-400">"Fotografitë do të publikohen së shpejti"</em>.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 2: PROJECTS & PHOTOS ===================== */}
        {activeTab === 'projects' && (
          <div className="space-y-8">
            {/* If in edit/create project mode */}
            {editingProject ? (
              <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {isCreatingProject ? 'Shto Projekt të Ri' : `Edito Projektin: ${editingProject.title}`}
                    </h2>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Ngarkoni fotot reale dhe plotësoni përshkrimin e punimit.
                    </p>
                  </div>
                  <button
                    onClick={handleCancelProjectEdit}
                    className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveProject} className="space-y-6">
                  {/* Basic fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">
                        Titulli i Projektit *
                      </label>
                      <input
                        type="text"
                        required
                        value={editingProject.title || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                        placeholder="p.sh. Terasë Moderne me Panele Sanduiç në Prishtinë"
                        className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-400 rounded-xl px-4 py-2.5 text-sm text-neutral-200 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">
                        Kategoria *
                      </label>
                      <select
                        value={editingProject.categorySlug || 'terasa'}
                        onChange={(e) => setEditingProject({ ...editingProject, categorySlug: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-400 rounded-xl px-4 py-2.5 text-sm text-neutral-200 focus:outline-none"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.slug}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">
                        Vendndodhja në Kosovë (Opsionale)
                      </label>
                      <input
                        type="text"
                        value={editingProject.location || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, location: e.target.value })}
                        placeholder="p.sh. Ferizaj, Prishtinë, Prizren"
                        className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-400 rounded-xl px-4 py-2.5 text-sm text-neutral-200 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">
                        Viti / Data e Përfundimit (Opsionale)
                      </label>
                      <input
                        type="text"
                        value={editingProject.completionDate || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, completionDate: e.target.value })}
                        placeholder="p.sh. 2026 ose Maj 2026"
                        className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-400 rounded-xl px-4 py-2.5 text-sm text-neutral-200 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">
                        Statusi i Projektit
                      </label>
                      <select
                        value={editingProject.status || 'E Përfunduar'}
                        onChange={(e) => setEditingProject({ ...editingProject, status: e.target.value as any })}
                        className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-400 rounded-xl px-4 py-2.5 text-sm text-neutral-200 focus:outline-none"
                      >
                        <option value="E Përfunduar">E Përfunduar</option>
                        <option value="Në Proces">Në Proces</option>
                        <option value="Planifikim">Planifikim</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Përshkrimi i Projektit
                    </label>
                    <textarea
                      rows={3}
                      value={editingProject.description || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                      placeholder="Përshkruani specifikat e materialit, dimensionet, profilin dhe llojin e punës së kryer..."
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-400 rounded-xl px-4 py-2.5 text-sm text-neutral-200 focus:outline-none"
                    />
                  </div>

                  {/* PUBLISH TOGGLE */}
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-neutral-950 border border-neutral-800">
                    <input
                      type="checkbox"
                      id="publishedToggle"
                      checked={editingProject.published !== false}
                      onChange={(e) => setEditingProject({ ...editingProject, published: e.target.checked })}
                      className="w-4 h-4 accent-amber-500 rounded"
                    />
                    <label htmlFor="publishedToggle" className="text-xs text-neutral-200 cursor-pointer">
                      <strong className="text-white block">Publiko menjëherë në uebsajt</strong>
                      Nëse çaktivizohet, ky projekt do të ruhet si draft i padukshëm për publikun.
                    </label>
                  </div>

                  {/* REAL PHOTOGRAPHS UPLOADER SECTION */}
                  <div className="space-y-4 pt-4 border-t border-neutral-800">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          <ImageIcon className="w-4 h-4 text-amber-400" />
                          Fotografitë Reale të Projektit ({editingProject.galleryImages?.length || 0})
                        </h3>
                        <p className="text-xs text-neutral-400">
                          Mund të ngarkoni disa foto njëherësh nga kompjuteri apo telefoni.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          ref={projectPhotosRef}
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleUploadProjectPhotos}
                          className="hidden"
                        />
                        <button
                          type="button"
                          disabled={projectUploadPending}
                          onClick={() => projectPhotosRef.current?.click()}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>{projectUploadPending ? 'Duke ngarkuar...' : 'Ngarko Foto Reale'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Uploaded photos grid with controls */}
                    {editingProject.galleryImages && editingProject.galleryImages.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-2">
                        {editingProject.galleryImages.map((img, idx) => {
                          const isMain = editingProject.mainImage?.url === img.url;
                          return (
                            <div
                              key={img.id || idx}
                              className={`relative rounded-xl border overflow-hidden group bg-neutral-950 flex flex-col ${
                                isMain ? 'border-amber-400 ring-2 ring-amber-400/40' : 'border-neutral-800'
                              }`}
                            >
                              <div className="relative aspect-square">
                                <img
                                  src={img.url}
                                  alt={img.title || ''}
                                  className="w-full h-full object-cover"
                                />

                                {isMain && (
                                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-neutral-950 flex items-center gap-1 shadow-md">
                                    <Star className="w-3 h-3 fill-current" />
                                    Kryesore
                                  </span>
                                )}

                                <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    type="button"
                                    onClick={() => handleDeletePhotoFromProject(img)}
                                    className="p-1.5 rounded-lg bg-red-600/90 hover:bg-red-500 text-white shadow-lg cursor-pointer"
                                    title="Fshij fotografinë përgjithmonë"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              {/* Photo controls */}
                              <div className="p-2 bg-neutral-900 border-t border-neutral-800 flex items-center justify-between text-xs">
                                <button
                                  type="button"
                                  disabled={isMain}
                                  onClick={() => handleSetMainPhoto(img)}
                                  className={`text-[11px] font-semibold cursor-pointer ${
                                    isMain ? 'text-amber-400' : 'text-neutral-400 hover:text-white'
                                  }`}
                                >
                                  {isMain ? 'Foto Kryesore' : 'Bëje Kryesore'}
                                </button>

                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    disabled={idx === 0}
                                    onClick={() => handleMovePhoto(idx, 'up')}
                                    className="p-1 rounded text-neutral-400 hover:text-white disabled:opacity-20 cursor-pointer"
                                    title="Lëviz majtas"
                                  >
                                    <ArrowUp className="w-3 h-3 -rotate-90" />
                                  </button>
                                  <button
                                    type="button"
                                    disabled={idx === (editingProject.galleryImages?.length || 1) - 1}
                                    onClick={() => handleMovePhoto(idx, 'down')}
                                    className="p-1 rounded text-neutral-400 hover:text-white disabled:opacity-20 cursor-pointer"
                                    title="Lëviz djathtas"
                                  >
                                    <ArrowDown className="w-3 h-3 -rotate-90" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-8 rounded-2xl bg-neutral-950 border border-dashed border-neutral-800 text-center">
                        <ImageIcon className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
                        <p className="text-xs text-neutral-400">
                          Ky projekt nuk ka ende fotografi të ngarkuara.
                        </p>
                        <p className="text-[11px] text-neutral-500 mt-1">
                          Në faqe do të shfaqet me njoftimin e pastër: "Fotografitë do të publikohen së shpejti".
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions buttons */}
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
                    <button
                      type="button"
                      onClick={handleCancelProjectEdit}
                      className="px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold cursor-pointer"
                    >
                      Anulo
                    </button>
                    <button
                      type="submit"
                      disabled={isSavingProject}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold uppercase tracking-wider transition-colors shadow-lg cursor-pointer disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isSavingProject ? 'Duke ruajtur...' : 'Ruaj Projektin'}</span>
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* Projects List View */
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-white">Menaxhimi i Projekteve</h2>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Krijoni, editoni ose fshini projektet e punimeve tuaja reale.
                    </p>
                  </div>

                  <button
                    onClick={handleStartCreateProject}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold uppercase tracking-wider transition-colors shadow-lg cursor-pointer self-start sm:self-auto"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Shto Projekt të Ri</span>
                  </button>
                </div>

                {projects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((proj) => {
                      const allPhotos = proj.mainImage
                        ? [proj.mainImage, ...proj.galleryImages.filter(g => g.id !== proj.mainImage?.id)]
                        : proj.galleryImages;

                      return (
                        <div
                          key={proj.id}
                          className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden flex flex-col justify-between shadow-xl"
                        >
                          <div className="relative aspect-video bg-neutral-950">
                            {allPhotos.length > 0 ? (
                              <img
                                src={allPhotos[0].url}
                                alt={proj.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                                <ImageIcon className="w-6 h-6 text-neutral-600 mb-1" />
                                <span className="text-[11px] text-neutral-500">Pa fotografi</span>
                              </div>
                            )}

                            <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-neutral-950/80 text-amber-400 border border-neutral-800">
                              {proj.categorySlug}
                            </span>

                            <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded text-[10px] font-medium bg-neutral-950/80 text-neutral-300">
                              {allPhotos.length} foto
                            </span>

                            {proj.published === false && (
                              <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-800 text-amber-400 border border-amber-400/30">
                                Draft
                              </span>
                            )}
                          </div>

                          <div className="p-4 flex-1 flex flex-col justify-between">
                            <div>
                              <h3 className="text-sm font-bold text-white line-clamp-1">{proj.title}</h3>
                              {proj.location && (
                                <p className="text-xs text-neutral-400 mt-1 flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-amber-400" />
                                  {proj.location}
                                </p>
                              )}
                            </div>

                            <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between">
                              <span className="text-[11px] text-emerald-400 font-medium">
                                {proj.status}
                              </span>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleStartEditProject(proj)}
                                  className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                                  title="Edito"
                                >
                                  <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                                  <span>Edito</span>
                                </button>
                                <button
                                  onClick={() => setItemToDelete({ type: 'project', id: proj.id, name: proj.title })}
                                  className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 cursor-pointer"
                                  title="Fshij"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-12 rounded-3xl bg-neutral-900/50 border border-neutral-800 text-center max-w-xl mx-auto">
                    <FolderPlus className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-white">Ende nuk keni krijuar asnjë projekt</h3>
                    <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
                      Klikoni butonin më poshtë për të krijuar projektin e parë dhe për të ngarkuar fotografitë tuaja reale.
                    </p>
                    <button
                      onClick={handleStartCreateProject}
                      className="mt-5 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Shto Projektin e Parë
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ===================== TAB 3: BRANDING (LOGO & HERO COVER) ===================== */}
        {activeTab === 'branding' && (
          <div className="space-y-10 max-w-4xl">
            <div>
              <h2 className="text-xl font-bold text-white">Identiteti Vizual dhe Ballina</h2>
              <p className="text-xs text-neutral-400 mt-1">
                Këtu mund të ngarkoni logon tuaj origjinale dhe fotografinë kryesore të ballinës.
              </p>
            </div>

            {/* COMPANY LOGO SECTION */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Building className="w-4 h-4 text-amber-400" />
                    Logoja e Kompanisë
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    Formatet e preferuara: PNG me sfond transparent, SVG ose WebP/JPG.
                  </p>
                </div>

                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => logoInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{settings.logoUrl ? 'Zëvendëso Logon' : 'Ngarko Logon Reale'}</span>
                  </button>

                  {settings.logoUrl && (
                    <button
                      onClick={handleDeleteLogo}
                      className="p-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-500/30 cursor-pointer"
                      title="Fshij logon"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Logo Preview */}
              <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-center min-h-[140px]">
                {settings.logoUrl ? (
                  <div className="text-center space-y-2">
                    <img
                      src={settings.logoUrl}
                      alt="Logoja e Tradita Dekor"
                      className="max-h-24 max-w-full object-contain mx-auto"
                    />
                    <span className="text-[11px] text-emerald-400 block font-medium">
                      ✓ Logoja aktive shfaqet në kokën dhe këmbën e të gjitha faqeve
                    </span>
                  </div>
                ) : (
                  <div className="text-center text-neutral-500 space-y-1">
                    <p className="text-xs font-medium text-neutral-400">
                      Aktualisht po përdoret emblema neutrale arkitekturore "TD".
                    </p>
                    <p className="text-[11px]">
                      Ngarkoni logon tuaj reale për ta zëvendësuar në të gjithë uebsajtin.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* HOMEPAGE HERO COVER SECTION */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-amber-400" />
                    Fotografia e Ballinës Kryesore (Hero Cover)
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    Foto me rezolucion të lartë e një terase apo verande madhështore të Tradita Dekor.
                  </p>
                </div>

                <input
                  ref={heroInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleHeroCoverUpload}
                  className="hidden"
                />

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => heroInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{settings.heroCoverUrl ? 'Zëvendëso Ballinën' : 'Ngarko Ballinën Reale'}</span>
                  </button>

                  {settings.heroCoverUrl && (
                    <button
                      onClick={handleDeleteHeroCover}
                      className="p-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-500/30 cursor-pointer"
                      title="Fshij fotografinë e ballinës"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Cover Preview */}
              <div className="rounded-2xl bg-neutral-950 border border-neutral-800 overflow-hidden min-h-[220px] relative flex items-center justify-center">
                {settings.heroCoverUrl ? (
                  <div className="relative w-full aspect-[21/9]">
                    <img
                      src={settings.heroCoverUrl}
                      alt="Ballina"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-neutral-950/40 flex items-center justify-center">
                      <span className="px-3 py-1 rounded-full bg-neutral-950/80 text-xs text-amber-400 font-semibold backdrop-blur-sm">
                        Pamje e Ballinës Live
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center text-neutral-500 space-y-1">
                    <p className="text-xs font-medium text-neutral-400">
                      Nuk është ngarkuar ende fotografi balline.
                    </p>
                    <p className="text-[11px]">
                      Faqja kryesore po përdor sfondin arkitekturor elegant me ngjyrat e kompanisë.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 4: COMPANY INFO ===================== */}
        {activeTab === 'company' && (
          <form onSubmit={handleSaveSettings} className="space-y-8 max-w-4xl">
            <div>
              <h2 className="text-xl font-bold text-white">Të Dhënat e Kompanisë dhe Kontaktet</h2>
              <p className="text-xs text-neutral-400 mt-1">
                Të gjitha ndryshimet ruhen menjëherë në bazën e të dhënave dhe reflektohen në të gjithë faqen.
              </p>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Emri Zyrtar i Kompanisë
                  </label>
                  <input
                    type="text"
                    value={editSettings.companyName}
                    onChange={(e) => setEditSettings({ ...editSettings, companyName: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-400 rounded-xl px-4 py-2.5 text-sm text-neutral-200 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Slogani Kryesor
                  </label>
                  <input
                    type="text"
                    value={editSettings.tagline}
                    onChange={(e) => setEditSettings({ ...editSettings, tagline: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-400 rounded-xl px-4 py-2.5 text-sm text-neutral-200 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Numri i Telefonit të Thirrjeve
                  </label>
                  <input
                    type="text"
                    value={editSettings.phone}
                    onChange={(e) => setEditSettings({ ...editSettings, phone: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-400 rounded-xl px-4 py-2.5 text-sm text-neutral-200 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Numri i WhatsApp
                  </label>
                  <input
                    type="text"
                    value={editSettings.whatsapp}
                    onChange={(e) => setEditSettings({ ...editSettings, whatsapp: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-400 rounded-xl px-4 py-2.5 text-sm text-neutral-200 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Adresa e Emailit
                  </label>
                  <input
                    type="email"
                    value={editSettings.email}
                    onChange={(e) => setEditSettings({ ...editSettings, email: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-400 rounded-xl px-4 py-2.5 text-sm text-neutral-200 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Orari i Punës
                  </label>
                  <input
                    type="text"
                    value={editSettings.workingHours}
                    onChange={(e) => setEditSettings({ ...editSettings, workingHours: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-400 rounded-xl px-4 py-2.5 text-sm text-neutral-200 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Adresa Fizike / Qyteti
                  </label>
                  <input
                    type="text"
                    value={editSettings.address}
                    onChange={(e) => setEditSettings({ ...editSettings, address: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-400 rounded-xl px-4 py-2.5 text-sm text-neutral-200 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Vitet e Përvojës
                  </label>
                  <input
                    type="number"
                    value={editSettings.experienceYears}
                    onChange={(e) => setEditSettings({ ...editSettings, experienceYears: Number(e.target.value) || 0 })}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-400 rounded-xl px-4 py-2.5 text-sm text-neutral-200 focus:outline-none"
                  />
                </div>
              </div>

              {/* Social Links */}
              <div className="pt-4 border-t border-neutral-800">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
                  Rrjetet Sociale
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">Linku i Facebook</label>
                    <input
                      type="text"
                      value={editSettings.socialLinks?.facebook || ''}
                      onChange={(e) => setEditSettings({
                        ...editSettings,
                        socialLinks: { ...editSettings.socialLinks, facebook: e.target.value }
                      })}
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-400 rounded-xl px-4 py-2 text-xs text-neutral-200 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">Linku i Instagram</label>
                    <input
                      type="text"
                      value={editSettings.socialLinks?.instagram || ''}
                      onChange={(e) => setEditSettings({
                        ...editSettings,
                        socialLinks: { ...editSettings.socialLinks, instagram: e.target.value }
                      })}
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-400 rounded-xl px-4 py-2 text-xs text-neutral-200 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-neutral-400 mb-1">Linku i TikTok</label>
                    <input
                      type="text"
                      value={editSettings.socialLinks?.tiktok || ''}
                      onChange={(e) => setEditSettings({
                        ...editSettings,
                        socialLinks: { ...editSettings.socialLinks, tiktok: e.target.value }
                      })}
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-400 rounded-xl px-4 py-2 text-xs text-neutral-200 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Google Maps Embed Link */}
              <div className="pt-4 border-t border-neutral-800">
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Google Maps Embed URL
                </label>
                <input
                  type="text"
                  value={editSettings.googleMapsEmbedUrl || ''}
                  onChange={(e) => setEditSettings({ ...editSettings, googleMapsEmbedUrl: e.target.value })}
                  placeholder="https://www.google.com/maps/embed?..."
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-400 rounded-xl px-4 py-2.5 text-xs text-neutral-200 focus:outline-none font-mono"
                />
              </div>

              {/* Hero Headlines */}
              <div className="pt-4 border-t border-neutral-800 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Titulli Kryesor i Ballinës (Hero Headline)
                  </label>
                  <input
                    type="text"
                    value={editSettings.heroHeadline || ''}
                    onChange={(e) => setEditSettings({ ...editSettings, heroHeadline: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-400 rounded-xl px-4 py-2.5 text-sm text-neutral-200 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Nëntitulli i Ballinës (Hero Subheadline)
                  </label>
                  <textarea
                    rows={2}
                    value={editSettings.heroSubheadline || ''}
                    onChange={(e) => setEditSettings({ ...editSettings, heroSubheadline: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-400 rounded-xl px-4 py-2.5 text-sm text-neutral-200 focus:outline-none"
                  />
                </div>
              </div>

              {/* About Text */}
              <div className="pt-4 border-t border-neutral-800">
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Teksti "Rreth Nesh"
                </label>
                <textarea
                  rows={4}
                  value={editSettings.aboutText || ''}
                  onChange={(e) => setEditSettings({ ...editSettings, aboutText: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-400 rounded-xl px-4 py-2.5 text-sm text-neutral-200 focus:outline-none"
                />
              </div>

              <div className="flex justify-end pt-4 border-t border-neutral-800">
                <button
                  type="submit"
                  disabled={isSavingSettings}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-lg cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingSettings ? 'Duke ruajtur...' : 'Ruaj Të Dhënat e Kompanisë'}</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* ===================== TAB 5: CATEGORIES ===================== */}
        {activeTab === 'categories' && (
          <div className="space-y-8 max-w-4xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Kategoritë e Punimeve</h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Kategoritë kryesore të Tradita Dekor.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {categories.map((cat) => {
                const count = projects.filter(p => p.categorySlug === cat.slug).length;
                return (
                  <div
                    key={cat.id}
                    className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{cat.name}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-neutral-800 text-amber-400">
                          slug: {cat.slug}
                        </span>
                        <span className="text-xs text-neutral-500">
                          ({count} projekte)
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 mt-1">{cat.description}</p>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        onClick={() => onNavigate(cat.slug as PageId)}
                        className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-300 flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-amber-400" />
                        <span>Shiko</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ===================== TAB 6: SECURITY & PASSWORD ===================== */}
        {activeTab === 'security' && (
          <div className="space-y-8 max-w-xl">
            <div>
              <h2 className="text-xl font-bold text-white">Siguria dhe Fjalëkalimi</h2>
              <p className="text-xs text-neutral-400 mt-1">
                Ndryshoni fjalëkalimin e hyrjes për panelin e administratorit.
              </p>
            </div>

            <form onSubmit={handleChangePassword} className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-4">
              {pwError && (
                <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-red-200 text-xs">
                  {pwError}
                </div>
              )}

              {pwSuccess && (
                <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-200 text-xs">
                  {pwSuccess}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Fjalëkalimi Aktual
                </label>
                <input
                  type="password"
                  required
                  value={currentPw}
                  onChange={(e) => setCurrentPw(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-400 rounded-xl px-4 py-2.5 text-sm text-neutral-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Fjalëkalimi i Ri
                </label>
                <input
                  type="password"
                  required
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                  placeholder="Të paktën 6 karaktere"
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-400 rounded-xl px-4 py-2.5 text-sm text-neutral-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Përsërit Fjalëkalimin e Ri
                </label>
                <input
                  type="password"
                  required
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  placeholder="Përsërit fjalëkalimin"
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-400 rounded-xl px-4 py-2.5 text-sm text-neutral-200 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-lg cursor-pointer"
              >
                Përditëso Fjalëkalimin
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
