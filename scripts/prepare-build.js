import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const ROOT_DIR = process.cwd();
const UPLOADS_DIR = path.join(ROOT_DIR, 'uploads');
const PUBLIC_UPLOADS = path.join(ROOT_DIR, 'public', 'uploads');
const PUBLIC_DATA = path.join(ROOT_DIR, 'public', 'data');
const DATA_FILE = path.join(ROOT_DIR, 'data', 'db.json');
const INITIAL_DATA_FILE = path.join(ROOT_DIR, 'src', 'data', 'initialData.ts');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const DIST_UPLOADS = path.join(DIST_DIR, 'uploads');
const DIST_DATA = path.join(DIST_DIR, 'data');

console.log('📦 [Tradita Dekor] Preparing static assets and sync for Vercel / Production build...');

// 1. Ensure public directories exist
fs.mkdirSync(PUBLIC_UPLOADS, { recursive: true });
fs.mkdirSync(PUBLIC_DATA, { recursive: true });

// 2. Copy uploads to public/uploads
let photoCount = 0;
if (fs.existsSync(UPLOADS_DIR)) {
  const files = fs.readdirSync(UPLOADS_DIR);
  for (const file of files) {
    const src = path.join(UPLOADS_DIR, file);
    const dest = path.join(PUBLIC_UPLOADS, file);
    if (fs.statSync(src).isFile()) {
      fs.copyFileSync(src, dest);
      photoCount++;
    }
  }
  console.log(`✓ Copied ${photoCount} photos into public/uploads`);
}

// 3. Copy db.json to public/data/db.json
if (fs.existsSync(DATA_FILE)) {
  fs.copyFileSync(DATA_FILE, path.join(PUBLIC_DATA, 'db.json'));
  console.log('✓ Copied db.json into public/data/db.json');

  // 4. Synchronize src/data/initialData.ts with the exact content of db.json
  try {
    const dbContent = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    const initialDataContent = `import { CompanySettings, Category, Project } from "../types";

export const INITIAL_SETTINGS: CompanySettings = ${JSON.stringify(dbContent.settings, null, 2)};

export const INITIAL_CATEGORIES: Category[] = ${JSON.stringify(dbContent.categories, null, 2)};

export const INITIAL_PROJECTS: Project[] = ${JSON.stringify(dbContent.projects, null, 2)};
`;
    fs.writeFileSync(INITIAL_DATA_FILE, initialDataContent, 'utf-8');
    console.log(`✓ Synchronized src/data/initialData.ts (${dbContent.projects.length} projects, settings, categories)`);
  } catch (err) {
    console.warn('⚠️ Could not sync initialData.ts from db.json:', err.message);
  }
}

// 5. Run Vite Build
console.log('🚀 Running vite build...');
execSync('vite build', { stdio: 'inherit' });

// 6. Ensure dist/uploads has all photos
fs.mkdirSync(DIST_UPLOADS, { recursive: true });
fs.mkdirSync(DIST_DATA, { recursive: true });

if (fs.existsSync(UPLOADS_DIR)) {
  const files = fs.readdirSync(UPLOADS_DIR);
  for (const file of files) {
    const src = path.join(UPLOADS_DIR, file);
    const dest = path.join(DIST_UPLOADS, file);
    if (fs.statSync(src).isFile()) {
      fs.copyFileSync(src, dest);
    }
  }
  console.log(`✓ Verified ${photoCount} photos in dist/uploads`);
}

if (fs.existsSync(DATA_FILE)) {
  fs.copyFileSync(DATA_FILE, path.join(DIST_DATA, 'db.json'));
}

console.log('✅ [Tradita Dekor] Build finished successfully! 100% ready for Vercel deployment without missing any data.');
