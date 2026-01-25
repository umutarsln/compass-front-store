import { ProductListItem } from '@/services/products';

// Frontend ProductCard için gerekli format
export interface FrontendProduct {
  id: string; // Product ID (for display/URL purposes)
  productId: string; // Real product ID (for API calls)
  name: string;
  subtitle: string | null;
  price: number;
  basePrice: number;
  discountedPrice: number | null;
  image: string;
  category: string;
  slug: string;
  stock: {
    availableQuantity: number;
    reservedQuantity: number;
    usableQuantity: number;
  };
  variantValues: Array<{
    id: string;
    value: string;
    colorCode?: string | null;
    variantOption?: {
      id: string;
      name: string;
      type: 'COLOR' | 'TEXT';
    };
  }>;
}

/**
 * Backend'den gelen ProductListItem formatını frontend ProductCard formatına dönüştürür
 */
export function transformProductListItem(product: ProductListItem): FrontendProduct {
  // Görsel URL'ini belirle: önce mainImage, yoksa thumbnailImage, yoksa placeholder
  const imageUrl =
    product.gallery?.mainImage?.s3Url ||
    product.gallery?.thumbnailImage?.s3Url ||
    '/placeholders/placeholder.svg';

  // Kategori adını al: ilk kategori veya "Genel"
  const categoryName = product.categories[0]?.name || 'Genel';

  console.log("product: ", product);

  return {
    id: product.id, // Keep id for display/URL purposes
    productId: product.productId, // Real product ID for API calls
    name: product.name,
    subtitle: product.subtitle,
    price: product.price,
    basePrice: product.basePrice,
    discountedPrice: product.discountedPrice,
    image: imageUrl,
    category: categoryName,
    slug: product.slug,
    stock: product.stock,
    variantValues: product.variantValues || [],
  };
}

/**
 * Backend'den gelen ProductListItem array'ini frontend formatına dönüştürür
 */
export function transformProductList(products: ProductListItem[]): FrontendProduct[] {
  return products.map(transformProductListItem);
}
