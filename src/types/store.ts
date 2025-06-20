export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  telegram?: string;
  website?: string;
}

export interface StoreProfile {
  id: string;
  storeName: string;
  description: string;
  logoUrl?: string;
  location: string;
  phoneNumber: string;
  email: string;
  socialLinks: SocialLinks;
  createdAt: Date;
  updatedAt: Date;
}

export type StoreProfileFormData = Omit<StoreProfile, 'id' | 'createdAt' | 'updatedAt'>;

export type Store = {
  id: string;
  name: string;
  logoUrl: string;
  description: string;
  openingHours: string;
  websiteUrl?: string;
  whatsapp?: string;
  address: string;
  phone?: string;
  email?: string;
  locationUrl: string;
  facebook?: string;
  instagram?: string;
  telegram?: string;
  googleReviewUrl?: string;
  createdAt: number;
  updatedAt: number;
}; 