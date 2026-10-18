import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const IS_PROD = process.env.NODE_ENV === 'production';

// Ensure data and uploads directories exist
const DATA_DIR = path.resolve(process.cwd(), 'data');
const UPLOADS_DIR = path.resolve(process.cwd(), 'uploads');
const DB_FILE = path.join(DATA_DIR, 'db.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Initial Database Structure
interface CompanySettings {
  companyName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  country: string;
  workingHours: string;
  experienceYears: number;
  aboutTitle: string;
  aboutText: string;
  aboutPillars: { title: string; desc: string }[];
  logoUrl: string | null;
  heroCoverUrl: string | null;
  heroHeadline: string;
  heroSubheadline: string;
  socialLinks: {
    facebook: string;
    instagram: string;
    tiktok: string;
    viber: string;
  };
  googleMapsEmbedUrl: string;
}

interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  badge: string;
  order: number;
}

export interface ProjectImage {
  id: string;
  url: string;
  title?: string;
  altText?: string;
  uploadedAt: string;
  isMain?: boolean;
}

export interface Project {
  id: string;
  title: string;
  categorySlug: string;
  description: string;
  location?: string;
  completionDate?: string;
  status: 'E Përfunduar' | 'Në Proces' | 'Planifikim';
  published: boolean;
  order: number;
  mainImage: ProjectImage | null;
  galleryImages: ProjectImage[];
  createdAt: string;
  updatedAt: string;
}

interface DatabaseSchema {
  settings: CompanySettings;
  categories: Category[];
  projects: Project[];
  admin: {
    username: string;
    email: string;
    passwordHash: string; // SHA-256 for simple clean zero-dependency auth
    sessionTokens: string[];
  };
}

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password.trim()).digest('hex');
}

const DEFAULT_DB: DatabaseSchema = {
  settings: {
    companyName: 'Tradita Dekor',
    tagline: 'Terasa, Veranda dhe Konstruksione Metali në Kosovë',
    phone: '+383 43 952 854',
    whatsapp: '+383 43 952 854',
    email: 'tradita.dekor05@gmail.com',
    address: 'Carralevë, 7200',
    city: 'Shtime',
    country: 'Kosovë',
    workingHours: 'E Hënë - E Shtunë: 08:00 - 18:00',
    experienceYears: 15,
    aboutTitle: 'Traditë, Përkushtim dhe Saktësi në Çdo Konstruksion',
    aboutText: 'Tradita Dekor është kompani e specializuar në Kosovë për projektimin, prodhimin dhe montimin e terasave, verandave, garazhave, konstruksioneve metalike dhe bunareve dekorative. Me vite përvojë dhe përkushtim maksimal ndaj cilësisë, ne sjellim zgjidhje të qëndrueshme, estetike dhe të përshtatura për çdo shtëpi apo objekt biznesi.',
    aboutPillars: [
      { title: 'Materiale Cilësore', desc: 'Përdorim profile metalike të certifikuara dhe veshje antikorrozive afatgjata.' },
      { title: 'Përpunim me Saktësi', desc: 'Punime precize me mjeshtëri dhe vëmendje maksimale ndaj çdo detaji.' },
      { title: 'Garanci dhe Montim', desc: 'Montim i sigurt nga ekipi ynë profesional në tërë territorin e Kosovës.' },
      { title: 'Zgjidhje sipas Kërkesës', desc: 'Projekte të personalizuara që i përgjigjen kërkesave dhe stilit të klientit.' }
    ],
    logoUrl: null, // User uploads real logo via admin
    heroCoverUrl: null, // User uploads real hero photograph via admin
    heroHeadline: 'Terasa, Veranda dhe Konstruksione Metali me Standarde të Larta',
    heroSubheadline: 'Zgjidhje moderne dhe afatgjata për hapësirën tuaj në Kosovë. Punojmë me mjeshtëri, hekur cilësor dhe dizajne të sofistikuara.',
    socialLinks: {
      facebook: 'https://www.facebook.com/profile.php?id=61595550954998',
      instagram: 'https://www.instagram.com/tradita.dekor05/?hl=en',
      tiktok: 'https://www.tiktok.com/@tradita.dekor',
      viber: '+38343952854'
    },
    googleMapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d47158.33036412192!2d20.892015!3d42.433611!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x13547f893e36e78d%3A0xc6cb5266ffda7334!2zQ2FycmFsZXbDqywgU2h0aW1l!5e0!3m2!1ssq!2s!4v1710000000000!5m2!1ssq!2s'
  },
  categories: [
    {
      id: 'cat-terasa',
      slug: 'terasa',
      name: 'Terasa',
      description: 'Mbulesa terasash me konstruksion metalik të galvanizuar, panele xhami, sanduiç dhe polikarbonat për mbrojtje nga dielli dhe reshjet.',
      badge: 'Popullore',
      order: 1
    },
    {
      id: 'cat-veranda',
      slug: 'veranda',
      name: 'Veranda',
      description: 'Veranda moderne me profil hekuri dhe xhama lëvizës, duke krijuar një ambient të ngrohtë dhe të ndritshëm për të gjitha stinët.',
      badge: 'Elegante',
      order: 2
    },
    {
      id: 'cat-garazha',
      slug: 'garazha',
      name: 'Garazha',
      description: 'Konstruksione të forta garazhash metalike për një ose më shumë automjete, me mbulesa të izoluara dhe dizajne bashkëkohore.',
      badge: 'Rezistente',
      order: 3
    },
    {
      id: 'cat-konstruksione-metali',
      slug: 'konstruksione-metali',
      name: 'Konstruksione Metali',
      description: 'Dyer oborri, rrethoja dekorative, shkallë metalike, mbulesa industriale dhe profile hekuri të punuara me saktësi.',
      badge: 'Mjeshtëri',
      order: 4
    },
    {
      id: 'cat-bunare',
      slug: 'bunare',
      name: 'Bunare',
      description: 'Mbulesa dhe kapake dekorativë mbrojtës për bunare, të realizuara me hekur të farkëtuar me rezistencë maksimale.',
      badge: 'Dekor & Siguri',
      order: 5
    }
  ],
  // Empty projects array or clean placeholder project awaiting real user uploads
  projects: [],
  admin: {
    username: 'admin',
    email: 'tradita.dekor05@gmail.com',
    passwordHash: hashPassword('tradita2026'),
    sessionTokens: []
  }
};

function readDb(): DatabaseSchema {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      // Merge with default schema to ensure keys are always intact
      return {
        ...DEFAULT_DB,
        ...parsed,
        settings: { ...DEFAULT_DB.settings, ...(parsed.settings || {}) },
        admin: { ...DEFAULT_DB.admin, ...(parsed.admin || {}) }
      };
    }
  } catch (err) {
    console.error('Error reading db.json, falling back to defaults:', err);
  }
  saveDb(DEFAULT_DB);
  return DEFAULT_DB;
}

function saveDb(data: DatabaseSchema): void {
  try {
    const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);

    // Also mirror to public/data/db.json
    try {
      const publicDataDir = path.join(process.cwd(), 'public', 'data');
      fs.mkdirSync(publicDataDir, { recursive: true });
      fs.writeFileSync(path.join(publicDataDir, 'db.json'), JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.warn('Failed to mirror to public/data/db.json:', e);
    }

    // Also mirror to src/data/initialData.ts for static bundling on Vercel
    try {
      const initialDataFile = path.join(process.cwd(), 'src', 'data', 'initialData.ts');
      const content = `import { CompanySettings, Category, Project } from "../types";

export const INITIAL_SETTINGS: CompanySettings = ${JSON.stringify(data.settings, null, 2)};

export const INITIAL_CATEGORIES: Category[] = ${JSON.stringify(data.categories, null, 2)};

export const INITIAL_PROJECTS: Project[] = ${JSON.stringify(data.projects, null, 2)};
`;
      fs.writeFileSync(initialDataFile, content, 'utf-8');
    } catch (e) {
      console.warn('Failed to mirror to src/data/initialData.ts:', e);
    }
  } catch (err) {
    console.error('Error saving db.json:', err);
  }
}

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve uploaded images statically
app.use('/uploads', express.static(UPLOADS_DIR, {
  maxAge: '7d',
  immutable: true
}));

// Auth helper middleware
function authenticateAdmin(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : (req.headers['x-admin-token'] as string);

  if (!token) {
    res.status(401).json({ error: 'Autorizimi kërkohet. Ju lutem kyçuni.' });
    return;
  }

  const db = readDb();
  if (!db.admin.sessionTokens.includes(token)) {
    res.status(403).json({ error: 'Seanca ka skaduar ose është e pavlefshme.' });
    return;
  }

  next();
}

// ======================== API ROUTES ========================

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', serverTime: new Date().toISOString() });
});

// GET Settings
app.get('/api/settings', (_req: Request, res: Response) => {
  const db = readDb();
  res.json(db.settings);
});

// UPDATE Settings (Admin)
app.put('/api/settings', authenticateAdmin, (req: Request, res: Response) => {
  const db = readDb();
  const newSettings = req.body;
  db.settings = {
    ...db.settings,
    ...newSettings
  };
  saveDb(db);
  res.json({ success: true, settings: db.settings });
});

// GET Categories
app.get('/api/categories', (_req: Request, res: Response) => {
  const db = readDb();
  const sorted = [...db.categories].sort((a, b) => a.order - b.order);
  res.json(sorted);
});

// POST Category (Admin)
app.post('/api/categories', authenticateAdmin, (req: Request, res: Response) => {
  const db = readDb();
  const { name, slug, description, badge } = req.body;
  if (!name || !slug) {
    res.status(400).json({ error: 'Emri dhe identifikuesi (slug) janë të detyrueshëm.' });
    return;
  }
  const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-');
  const existing = db.categories.find(c => c.slug === cleanSlug);
  if (existing) {
    res.status(400).json({ error: 'Kategoria me këtë slug ekziston tashmë.' });
    return;
  }

  const newCat: Category = {
    id: `cat-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    slug: cleanSlug,
    name: name.trim(),
    description: description?.trim() || '',
    badge: badge?.trim() || '',
    order: db.categories.length + 1
  };
  db.categories.push(newCat);
  saveDb(db);
  res.status(201).json(newCat);
});

// PUT Category (Admin)
app.put('/api/categories/:id', authenticateAdmin, (req: Request, res: Response) => {
  const db = readDb();
  const id = req.params.id;
  const index = db.categories.findIndex(c => c.id === id || c.slug === id);
  if (index === -1) {
    res.status(404).json({ error: 'Kategoria nuk u gjet.' });
    return;
  }
  db.categories[index] = {
    ...db.categories[index],
    ...req.body,
    id: db.categories[index].id // preserve id
  };
  saveDb(db);
  res.json(db.categories[index]);
});

// DELETE Category (Admin)
app.delete('/api/categories/:id', authenticateAdmin, (req: Request, res: Response) => {
  const db = readDb();
  const id = req.params.id;
  const categoryToDelete = db.categories.find(c => c.id === id || c.slug === id);
  if (!categoryToDelete) {
    res.status(404).json({ error: 'Kategoria nuk u gjet.' });
    return;
  }

  db.categories = db.categories.filter(c => c.id !== id && c.slug !== id);
  saveDb(db);
  res.json({ success: true, message: 'Kategoria u fshi me sukses.' });
});

// GET Projects (Public & Admin)
app.get('/api/projects', (req: Request, res: Response) => {
  const db = readDb();
  const { category, search, includeUnpublished } = req.query;

  let list = db.projects;

  // Filter unpublished projects unless explicitly authorized or requested
  if (includeUnpublished !== 'true') {
    list = list.filter(p => p.published !== false);
  }

  if (category && typeof category === 'string' && category !== 'all') {
    list = list.filter(p => p.categorySlug === category);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase().trim();
    list = list.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      (p.location && p.location.toLowerCase().includes(q))
    );
  }

  list = [...list].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  res.json(list);
});

// GET Single Project
app.get('/api/projects/:id', (req: Request, res: Response) => {
  const db = readDb();
  const project = db.projects.find(p => p.id === req.params.id);
  if (!project) {
    res.status(404).json({ error: 'Projekti nuk u gjet.' });
    return;
  }
  res.json(project);
});

// POST Project (Admin)
app.post('/api/projects', authenticateAdmin, (req: Request, res: Response) => {
  const db = readDb();
  const {
    title,
    categorySlug,
    description,
    location,
    completionDate,
    status,
    published,
    mainImage,
    galleryImages
  } = req.body;

  if (!title || !categorySlug) {
    res.status(400).json({ error: 'Titulli dhe kategoria janë të detyrueshme.' });
    return;
  }

  const now = new Date().toISOString();
  const newProject: Project = {
    id: `proj-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    title: title.trim(),
    categorySlug,
    description: description?.trim() || '',
    location: location?.trim() || '',
    completionDate: completionDate || '',
    status: status || 'E Përfunduar',
    published: published ?? true,
    order: db.projects.length + 1,
    mainImage: mainImage || null,
    galleryImages: Array.isArray(galleryImages) ? galleryImages : [],
    createdAt: now,
    updatedAt: now
  };

  db.projects.unshift(newProject);
  saveDb(db);
  res.status(201).json(newProject);
});

// PUT Project (Admin)
app.put('/api/projects/:id', authenticateAdmin, (req: Request, res: Response) => {
  const db = readDb();
  const id = req.params.id;
  const index = db.projects.findIndex(p => p.id === id);
  if (index === -1) {
    res.status(404).json({ error: 'Projekti nuk u gjet.' });
    return;
  }

  const current = db.projects[index];
  const updated: Project = {
    ...current,
    ...req.body,
    id: current.id,
    createdAt: current.createdAt,
    updatedAt: new Date().toISOString()
  };

  db.projects[index] = updated;
  saveDb(db);
  res.json(updated);
});

// DELETE Project (Admin)
app.delete('/api/projects/:id', authenticateAdmin, (req: Request, res: Response) => {
  const db = readDb();
  const id = req.params.id;
  const project = db.projects.find(p => p.id === id);
  if (!project) {
    res.status(404).json({ error: 'Projekti nuk u gjet.' });
    return;
  }

  db.projects = db.projects.filter(p => p.id !== id);
  saveDb(db);
  res.json({ success: true, message: 'Projekti u fshi përgjithmonë.' });
});

// POST Image Upload (Admin)
app.post('/api/upload', authenticateAdmin, (req: Request, res: Response) => {
  try {
    const { fileBase64, filename, mimeType } = req.body;
    if (!fileBase64) {
      res.status(400).json({ error: 'Skedari fotografik mungon.' });
      return;
    }

    // Extract base64 payload if it includes data:image/...;base64,
    let base64Data = fileBase64;
    let extension = 'jpg';
    if (fileBase64.includes(';base64,')) {
      const parts = fileBase64.split(';base64,');
      const header = parts[0];
      base64Data = parts[1];
      if (header.includes('image/png')) extension = 'png';
      else if (header.includes('image/webp')) extension = 'webp';
      else if (header.includes('image/jpeg')) extension = 'jpg';
      else if (header.includes('image/svg')) extension = 'svg';
    } else if (mimeType) {
      if (mimeType.includes('png')) extension = 'png';
      else if (mimeType.includes('webp')) extension = 'webp';
      else if (mimeType.includes('jpeg') || mimeType.includes('jpg')) extension = 'jpg';
    }

    const buffer = Buffer.from(base64Data, 'base64');
    const safeName = filename
      ? path.basename(filename).replace(/[^a-zA-Z0-9.-]/g, '_')
      : `photo.${extension}`;
    const uniqueFilename = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}-${safeName}`;
    const targetPath = path.join(UPLOADS_DIR, uniqueFilename);

    fs.writeFileSync(targetPath, buffer);

    // Also mirror to public/uploads for static builds and Vercel
    try {
      const publicUploadsPath = path.join(process.cwd(), 'public', 'uploads', uniqueFilename);
      fs.mkdirSync(path.join(process.cwd(), 'public', 'uploads'), { recursive: true });
      fs.writeFileSync(publicUploadsPath, buffer);
    } catch (e) {
      console.warn('Failed to mirror to public/uploads:', e);
    }

    const publicUrl = `/uploads/${uniqueFilename}`;
    const imageRecord: ProjectImage = {
      id: `img-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
      url: publicUrl,
      title: filename || 'Fotografi e Projektit',
      altText: filename || 'Punim i Tradita Dekor',
      uploadedAt: new Date().toISOString()
    };

    res.status(201).json({
      success: true,
      image: imageRecord,
      url: publicUrl,
      filename: uniqueFilename,
      size: buffer.length
    });
  } catch (err: any) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Dështoi ngarkimi i fotografisë: ' + (err.message || 'Gabim i brendshëm') });
  }
});

// DELETE Uploaded Image (Admin - Permanent deletion)
app.delete('/api/upload/:filename', authenticateAdmin, (req: Request, res: Response) => {
  try {
    const filename = path.basename(req.params.filename);
    const filePath = path.join(UPLOADS_DIR, filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Also remove from any project that references this URL
    const targetUrl = `/uploads/${filename}`;
    const db = readDb();
    let modified = false;

    // Check settings logo & heroCover
    if (db.settings.logoUrl === targetUrl) {
      db.settings.logoUrl = null;
      modified = true;
    }
    if (db.settings.heroCoverUrl === targetUrl) {
      db.settings.heroCoverUrl = null;
      modified = true;
    }

    // Check all projects
    db.projects.forEach(p => {
      if (p.mainImage && p.mainImage.url === targetUrl) {
        p.mainImage = null;
        modified = true;
      }
      const initialGalleryLen = p.galleryImages.length;
      p.galleryImages = p.galleryImages.filter(img => img.url !== targetUrl);
      if (p.galleryImages.length !== initialGalleryLen) {
        modified = true;
      }
    });

    if (modified) {
      saveDb(db);
    }

    res.json({ success: true, message: 'Fotografia u fshi përgjithmonë nga disku dhe baza e të dhënave.' });
  } catch (err: any) {
    console.error('Delete image error:', err);
    res.status(500).json({ error: 'Dështoi fshirja e skedarit: ' + err.message });
  }
});

// AUTH: Login
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ error: 'Ju lutem shkruani emrin e përdoruesit dhe fjalëkalimin.' });
    return;
  }

  const db = readDb();
  const inputHash = hashPassword(password);

  const isUserMatch = username.trim().toLowerCase() === db.admin.username.toLowerCase() ||
                      username.trim().toLowerCase() === db.admin.email.toLowerCase();

  if (isUserMatch && inputHash === db.admin.passwordHash) {
    const token = `adm_${crypto.randomBytes(24).toString('hex')}`;
    db.admin.sessionTokens.push(token);
    // Keep max 10 active tokens
    if (db.admin.sessionTokens.length > 10) {
      db.admin.sessionTokens = db.admin.sessionTokens.slice(-10);
    }
    saveDb(db);
    res.json({
      success: true,
      token,
      user: {
        username: db.admin.username,
        email: db.admin.email
      }
    });
    return;
  }

  res.status(401).json({ error: 'Të dhënat e kyçjes janë të pasakta.' });
});

// AUTH: Verify Token
app.get('/api/auth/verify', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : (req.headers['x-admin-token'] as string);

  if (!token) {
    res.status(401).json({ valid: false });
    return;
  }

  const db = readDb();
  if (db.admin.sessionTokens.includes(token)) {
    res.json({
      valid: true,
      user: {
        username: db.admin.username,
        email: db.admin.email
      }
    });
    return;
  }

  res.status(401).json({ valid: false });
});

// AUTH: Logout
app.post('/api/auth/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : (req.headers['x-admin-token'] as string);

  if (token) {
    const db = readDb();
    db.admin.sessionTokens = db.admin.sessionTokens.filter(t => t !== token);
    saveDb(db);
  }

  res.json({ success: true });
});

// AUTH: Change Password
app.post('/api/auth/change-password', authenticateAdmin, (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword || newPassword.length < 6) {
    res.status(400).json({ error: 'Fjalëkalimi i ri duhet të ketë të paktën 6 karaktere.' });
    return;
  }

  const db = readDb();
  if (hashPassword(currentPassword) !== db.admin.passwordHash) {
    res.status(400).json({ error: 'Fjalëkalimi aktual është i pasaktë.' });
    return;
  }

  db.admin.passwordHash = hashPassword(newPassword);
  res.json({ success: true, message: 'Fjalëkalimi u ndryshua me sukses!' });
});

// PUBLISH & SYNC FOR VERCEL
app.post('/api/publish-vercel', authenticateAdmin, (_req: Request, res: Response) => {
  try {
    const db = readDb();
    const publicUploads = path.join(process.cwd(), 'public', 'uploads');
    fs.mkdirSync(publicUploads, { recursive: true });

    let photoCount = 0;
    if (fs.existsSync(UPLOADS_DIR)) {
      const files = fs.readdirSync(UPLOADS_DIR);
      for (const file of files) {
        const src = path.join(UPLOADS_DIR, file);
        const dest = path.join(publicUploads, file);
        if (fs.statSync(src).isFile()) {
          fs.copyFileSync(src, dest);
          photoCount++;
        }
      }
    }

    // Force save to update public/data/db.json and src/data/initialData.ts
    saveDb(db);

    res.json({
      success: true,
      message: 'Faqja dhe të gjitha të dhënat u sinkronizuan me sukses për Vercel!',
      photoCount,
      projectCount: db.projects.length
    });
  } catch (err: any) {
    console.error('Publish-Vercel sync error:', err);
    res.status(500).json({ error: 'Dështoi sinkronizimi për Vercel: ' + err.message });
  }
});

// EXPORT BACKUP
app.get('/api/backup-data', authenticateAdmin, (_req: Request, res: Response) => {
  try {
    const db = readDb();
    // Return clean backup data without admin session tokens
    const backup = {
      settings: db.settings,
      categories: db.categories,
      projects: db.projects,
      exportedAt: new Date().toISOString()
    };
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=tradita-dekor-backup-${Date.now()}.json`);
    res.send(JSON.stringify(backup, null, 2));
  } catch (err: any) {
    res.status(500).json({ error: 'Dështoi eksportimi i të dhënave: ' + err.message });
  }
});

// RESTORE BACKUP
app.post('/api/restore-data', authenticateAdmin, (req: Request, res: Response) => {
  try {
    const { settings, categories, projects } = req.body;
    if (!settings && !categories && !projects) {
      res.status(400).json({ error: 'Skedari i backup-it nuk përmban të dhëna të vlefshme.' });
      return;
    }

    const db = readDb();
    if (settings) db.settings = { ...db.settings, ...settings };
    if (Array.isArray(categories) && categories.length > 0) db.categories = categories;
    if (Array.isArray(projects)) db.projects = projects;

    saveDb(db);
    res.json({ success: true, message: 'Të dhënat u rikthyen me sukses nga kopja rezervë!' });
  } catch (err: any) {
    res.status(500).json({ error: 'Dështoi rikthimi i të dhënave: ' + err.message });
  }
});

// Mount Vite or serve static production build
async function startServer() {
  if (!IS_PROD) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Tradita Dekor Server running on port ${PORT} (Prod: ${IS_PROD})`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
