import { api } from './api';

// Tag bilgisi
export interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string; // Hex format (#FF5733)
  createdAt: string;
  updatedAt: string;
}

// Tag'leri getir
export const getTags = async (): Promise<Tag[]> => {
  return api.get<Tag[]>('/store/tags');
};
