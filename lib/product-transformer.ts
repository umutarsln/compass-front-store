import { ProductListItem } from '@/services/products';

// Frontend ProductCard için gerekli format
export interface FrontendProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  slug: string;
}

/**
 * Backend'den gelen ProductListItem formatını frontend ProductCard formatına dönüştürür
 */
export function transformProductListItem(product: ProductListItem): FrontendProduct {
  // Görsel URL'ini belirle: önce mainImage, yoksa thumbnailImage, yoksa placeholder
  const imageUrl = 
    product.gallery.mainImage?.s3Url || 
    product.gallery.thumbnailImage?.s3Url || 
    '/placeholders/placeholder.svg';

  // Kategori adını al: ilk kategori veya "Genel"
  const categoryName = product.categories[0]?.name || 'Genel';

  return {
    id: product.id,
    name: product.name,
    price: product.price,
    image: imageUrl,
    category: categoryName,
    slug: product.slug,
  };
}

/**
 * Backend'den gelen ProductListItem array'ini frontend formatına dönüştürür
 */
export function transformProductList(products: ProductListItem[]): FrontendProduct[] {
  return products.map(transformProductListItem);
}
