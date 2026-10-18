export interface CompanySettings {
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

export interface Category {
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

export interface AdminUser {
  username: string;
  email: string;
}

export type PageId =
  | 'home'
  | 'about'
  | 'services'
  | 'catalog'
  | 'terasa'
  | 'veranda'
  | 'garazha'
  | 'konstruksione-metali'
  | 'bunare'
  | 'contact'
  | 'admin';
