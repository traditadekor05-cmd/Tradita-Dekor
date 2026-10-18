import { CompanySettings, Category, Project, ProjectImage, AdminUser } from '../types';
import { INITIAL_SETTINGS, INITIAL_CATEGORIES, INITIAL_PROJECTS } from '../data/initialData';

const TOKEN_KEY = 'tradita_admin_token';
const USER_KEY = 'tradita_admin_user';

// Helper to get auth headers
function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem(TOKEN_KEY);
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

export const authStorage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  getUser: (): AdminUser | null => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },
  setAuth: (token: string, user: AdminUser) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  clearAuth: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
};

/**
 * Optimizes an image using HTML5 Canvas before uploading
 * Resizes max width/height to 1920px and converts to WebP/JPEG quality 0.88
 */
export async function optimizeImageFile(file: File): Promise<{ base64: string; filename: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const MAX_WIDTH = 1920;
        const MAX_HEIGHT = 1920;
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH || height > MAX_HEIGHT) {
          if (width > height) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          } else {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Canvas context could not be created'));
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Try WebP first, fallback to jpeg
        let outputType = 'image/webp';
        let dataUrl = canvas.toDataURL(outputType, 0.88);
        if (!dataUrl.startsWith('data:image/webp')) {
          outputType = 'image/jpeg';
          dataUrl = canvas.toDataURL(outputType, 0.88);
        }

        resolve({
          base64: dataUrl,
          filename: file.name.replace(/\.[^/.]+$/, '') + (outputType === 'image/webp' ? '.webp' : '.jpg'),
          mimeType: outputType
        });
      };
      img.onerror = () => reject(new Error('Fotografia nuk mund të lexohet.'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Dështoi leximi i skedarit.'));
    reader.readAsDataURL(file);
  });
}

// REST API calls with robust fallbacks for Vercel Static and Live Server
export const api = {
  // Settings
  async getSettings(): Promise<CompanySettings> {
    try {
      const res = await fetch('/api/settings');
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (data && data.companyName) return data;
      }
    } catch {
      // ignore network errors and fallback
    }

    // Fallback 1: check static /data/db.json bundled into public and dist
    try {
      const res2 = await fetch('/data/db.json');
      if (res2.ok) {
        const db = await res2.json();
        if (db && db.settings) return db.settings;
      }
    } catch {
      // ignore
    }

    // Fallback 2: bundled INITIAL_SETTINGS
    return INITIAL_SETTINGS;
  },

  async updateSettings(settings: Partial<CompanySettings>): Promise<{ success: boolean; settings: CompanySettings }> {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(settings)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Dështoi ruajtja e cilësimeve.');
    }
    return res.json();
  },

  // Categories
  async getCategories(): Promise<Category[]> {
    try {
      const res = await fetch('/api/categories');
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch {
      // ignore network errors and fallback
    }

    // Fallback 1: check static /data/db.json
    try {
      const res2 = await fetch('/data/db.json');
      if (res2.ok) {
        const db = await res2.json();
        if (db && Array.isArray(db.categories) && db.categories.length > 0) return db.categories;
      }
    } catch {
      // ignore
    }

    // Fallback 2: bundled INITIAL_CATEGORIES
    return INITIAL_CATEGORIES;
  },

  async createCategory(cat: Omit<Category, 'id' | 'order'>): Promise<Category> {
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(cat)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Dështoi krijimi i kategorisë.');
    }
    return res.json();
  },

  async updateCategory(id: string, cat: Partial<Category>): Promise<Category> {
    const res = await fetch(`/api/categories/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(cat)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Dështoi përditësimi i kategorisë.');
    }
    return res.json();
  },

  async deleteCategory(id: string): Promise<void> {
    const res = await fetch(`/api/categories/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Dështoi fshirja e kategorisë.');
    }
  },

  // Projects
  async getProjects(params?: { category?: string; search?: string; includeUnpublished?: boolean }): Promise<Project[]> {
    try {
      const url = new URL('/api/projects', window.location.origin);
      if (params?.category) url.searchParams.set('category', params.category);
      if (params?.search) url.searchParams.set('search', params.search);
      if (params?.includeUnpublished) url.searchParams.set('includeUnpublished', 'true');

      const res = await fetch(url.toString());
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (Array.isArray(data)) return data;
      }
    } catch {
      // ignore and fallback
    }

    // Fallback: load static /data/db.json or INITIAL_PROJECTS
    let projectsList = INITIAL_PROJECTS;
    try {
      const res2 = await fetch('/data/db.json');
      if (res2.ok) {
        const db = await res2.json();
        if (db && Array.isArray(db.projects) && db.projects.length > 0) {
          projectsList = db.projects;
        }
      }
    } catch {
      // use INITIAL_PROJECTS
    }

    // Apply filtering on client side
    let filtered = [...projectsList];
    if (!params?.includeUnpublished) {
      filtered = filtered.filter(p => p.published !== false);
    }
    if (params?.category) {
      filtered = filtered.filter(p => p.categorySlug === params.category);
    }
    if (params?.search) {
      const q = params.search.toLowerCase().trim();
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.location && p.location.toLowerCase().includes(q))
      );
    }
    return filtered.sort((a, b) => a.order - b.order);
  },

  async getProject(id: string): Promise<Project> {
    try {
      const res = await fetch(`/api/projects/${id}`);
      if (res.ok) return await res.json();
    } catch {
      // fallback to list search
    }
    const projects = await api.getProjects({ includeUnpublished: true });
    const found = projects.find(p => p.id === id);
    if (!found) throw new Error('Projekti nuk u gjet');
    return found;
  },

  async createProject(project: Partial<Project>): Promise<Project> {
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(project)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Dështoi krijimi i projektit.');
    }
    return res.json();
  },

  async updateProject(id: string, project: Partial<Project>): Promise<Project> {
    const res = await fetch(`/api/projects/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(project)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Dështoi përditësimi i projektit.');
    }
    return res.json();
  },

  async deleteProject(id: string): Promise<void> {
    const res = await fetch(`/api/projects/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Dështoi fshirja e projektit.');
    }
  },

  // Image Upload and Permanent Deletion
  async uploadImage(file: File): Promise<{ image: ProjectImage; url: string; filename: string }> {
    const optimized = await optimizeImageFile(file);
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        fileBase64: optimized.base64,
        filename: optimized.filename,
        mimeType: optimized.mimeType
      })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Dështoi ngarkimi i fotografisë.');
    }
    return res.json();
  },

  async deleteImage(filenameOrUrl: string): Promise<void> {
    // Extract filename from URL if full URL is passed
    const filename = filenameOrUrl.split('/').pop();
    if (!filename) throw new Error('Emri i skedarit është i pavlefshëm.');

    const res = await fetch(`/api/upload/${filename}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Dështoi fshirja e përhershme e fotografisë.');
    }
  },

  // Vercel Publish & Data Management
  async publishForVercel(): Promise<{ success: boolean; message: string; photoCount?: number; projectCount?: number }> {
    const res = await fetch('/api/publish-vercel', {
      method: 'POST',
      headers: getAuthHeaders()
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Dështoi sinkronizimi për Vercel.');
    }
    return res.json();
  },

  async downloadBackup(): Promise<void> {
    const token = authStorage.getToken();
    const res = await fetch('/api/backup-data', {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    if (!res.ok) throw new Error('Dështoi shkarkimi i të dhënave.');
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tradita-dekor-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  },

  async restoreBackup(backupData: any): Promise<{ success: boolean; message: string }> {
    const res = await fetch('/api/restore-data', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(backupData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Dështoi rikthimi i të dhënave.');
    }
    return res.json();
  },

  // Auth
  async login(username: string, password: string): Promise<{ token: string; user: AdminUser }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Të dhënat e kyçjes janë të pasakta.');
    }
    const data = await res.json();
    authStorage.setAuth(data.token, data.user);
    return data;
  },

  async verifyAuth(): Promise<boolean> {
    const token = authStorage.getToken();
    if (!token) return false;
    try {
      const res = await fetch('/api/auth/verify', {
        headers: getAuthHeaders()
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const res = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ currentPassword, newPassword })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Dështoi ndryshimi i fjalëkalimit.');
    }
  },

  logout(): void {
    const token = authStorage.getToken();
    if (token) {
      fetch('/api/auth/logout', {
        method: 'POST',
        headers: getAuthHeaders()
      }).catch(() => {});
    }
    authStorage.clearAuth();
  }
};
