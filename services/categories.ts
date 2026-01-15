import { api } from './api';

// Görsel bilgisi
export interface Image {
  id: string;
  s3Url: string;
  displayName: string;
  filename: string;
}

// Kategori bilgisi (recursive yapı)
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId: string | null;
  parent: Category | null;
  children: Category[];
  image: Image | null;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

// Kategorileri getir (hiyerarşik ve sıralanmış)
export const getCategories = async (): Promise<Category[]> => {
  return api.get<Category[]>('/store/categories');
};
