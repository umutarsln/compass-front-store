import { api } from './api';

// Sıralama seçenekleri
export type OrderBy =
  | 'price_asc'
  | 'price_desc'
  | 'name_asc'
  | 'name_desc'
  | 'created_at_asc'
  | 'created_at_desc';

// Ürün listesi query parametreleri
export interface ProductListQuery {
  search?: string;
  categorySlugs?: string; // Virgülle ayrılmış: "slug1,slug2,slug3"
  tagSlugs?: string; // Virgülle ayrılmış: "slug1,slug2,slug3"
  minPrice?: number;
  maxPrice?: number;
  orderBy?: OrderBy;
  page?: number;
  limit?: number; // Max: 100
}

// Stok bilgisi
export interface Stock {
  availableQuantity: number;
  reservedQuantity: number;
  usableQuantity: number;
}

// Görsel bilgisi
export interface Image {
  id: string;
  s3Url: string;
  displayName: string;
  filename: string;
}

// Galeri yapısı
export interface Gallery {
  mainImage: Image | null;
  thumbnailImage: Image | null;
  detailImages: Image[];
}

// Kategori bilgisi
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

// Tag bilgisi
export interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
}

// Ürün listesi item'ı
export interface ProductListItem {
  id: string;
  productId: string;
  variantCombinationId: string | null;
  name: string;
  subtitle: string | null;
  slug: string;
  description: string;
  price: number;
  basePrice: number;
  isOnSale: boolean;
  discountedPrice: number | null;
  sku: string;
  stock: Stock;
  gallery: Gallery;
  categories: Category[];
  tags: Tag[];
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  variantValues: any[];
  createdAt: string;
  updatedAt: string;
}

// Ürün listesi response'u
export interface ProductListResponse {
  products: ProductListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Varyasyon değeri
export interface VariantValue {
  id: string;
  value: string;
  colorCode?: string;
  priceDelta: number;
  isActive: boolean;
  displayOrder: number;
}

// Varyasyon seçeneği
export interface VariantOption {
  id: string;
  name: string;
  type: string;
  displayOrder: number;
  isRequired: boolean;
  values: VariantValue[];
}

// Varyasyon kombinasyonu
export interface VariantCombination {
  id: string;
  slug: string | null;
  sku: string;
  isActive: boolean;
  isDisabled: boolean;
  price: number;
  stock: Stock;
  gallery: Gallery;
  variantValues: any[];
}

// Ürün detay response'u (Basit Ürün)
export interface SimpleProductDetail {
  productId: string;
  name: string;
  subtitle: string | null;
  slug: string;
  description: string;
  basePrice: number;
  isOnSale: boolean;
  discountedPrice: number | null;
  type: 'SIMPLE';
  price: number;
  sku: string;
  stock: Stock;
  gallery: Gallery;
  categories: Category[];
  tags: Tag[];
  variantOptions: null;
  variantCombinations: null;
  selectedCombination: null;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  personalizationForm?: {
    formId: string;
    versionId: string;
    version: number;
    schemaSnapshot: any;
  } | null;
  createdAt: string;
  updatedAt: string;
}

// Ürün detay response'u (Varyasyonlu Ürün)
export interface VariantProductDetail {
  productId: string;
  name: string;
  subtitle: string | null;
  slug: string;
  description: string;
  basePrice: number;
  isOnSale: boolean;
  discountedPrice: number | null;
  type: 'VARIANT';
  price: null;
  sku: null;
  stock: null;
  gallery: Gallery;
  categories: Category[];
  tags: Tag[];
  variantOptions: VariantOption[];
  variantCombinations: VariantCombination[];
  selectedCombination: VariantCombination | null;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  personalizationForm?: {
    formId: string;
    versionId: string;
    version: number;
    schemaSnapshot: any;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export type ProductDetail = SimpleProductDetail | VariantProductDetail;

// Ürün listesi getir
export const getProducts = async (
  query?: ProductListQuery
): Promise<ProductListResponse> => {
  const params = new URLSearchParams();

  if (query?.search) params.append('search', query.search);
  if (query?.categorySlugs) params.append('categorySlugs', query.categorySlugs);
  if (query?.tagSlugs) params.append('tagSlugs', query.tagSlugs);
  if (query?.minPrice !== undefined) params.append('minPrice', query.minPrice.toString());
  if (query?.maxPrice !== undefined) params.append('maxPrice', query.maxPrice.toString());
  if (query?.orderBy) params.append('orderBy', query.orderBy);
  if (query?.page) params.append('page', query.page.toString());
  if (query?.limit) params.append('limit', query.limit.toString());

  const queryString = params.toString();
  const url = `/store/products${queryString ? `?${queryString}` : ''}`;

  return api.get<ProductListResponse>(url);
};

// Ürün detayı getir
export const getProductDetail = async (
  id: string
): Promise<ProductDetail> => {
  const params = new URLSearchParams();

  const queryString = params.toString();
  const url = `/store/products/${id}`;

  return api.get<ProductDetail>(url);
};
