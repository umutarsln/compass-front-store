const FAVORITES_KEY = 'shawk_favorites';

export interface LocalFavoritesData {
    productIds: string[];
    updatedAt: string;
}

/**
 * Get favorites from localStorage
 */
export function getFavorites(): LocalFavoritesData | null {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(FAVORITES_KEY);
    if (!data) return null;
    try {
        return JSON.parse(data);
    } catch {
        return null;
    }
}

/**
 * Set favorites in localStorage
 */
export function setFavorites(data: LocalFavoritesData): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(data));
}

/**
 * Add product ID to favorites
 */
export function addFavorite(productId: string): void {
    if (typeof window === 'undefined') return;
    const current = getFavorites();
    const productIds = current?.productIds || [];
    if (!productIds.includes(productId)) {
        setFavorites({
            productIds: [...productIds, productId],
            updatedAt: new Date().toISOString(),
        });
    }
}

/**
 * Remove product ID from favorites
 */
export function removeFavorite(productId: string): void {
    if (typeof window === 'undefined') return;
    const current = getFavorites();
    if (!current) return;
    setFavorites({
        productIds: current.productIds.filter((id) => id !== productId),
        updatedAt: new Date().toISOString(),
    });
}

/**
 * Check if product is favorited
 */
export function isFavorite(productId: string): boolean {
    if (typeof window === 'undefined') return false;
    const current = getFavorites();
    return current?.productIds?.includes(productId) || false;
}

/**
 * Get favorite product IDs
 */
export function getFavoriteProductIds(): string[] {
    if (typeof window === 'undefined') return [];
    const current = getFavorites();
    return current?.productIds || [];
}

/**
 * Clear favorites
 */
export function clearFavorites(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(FAVORITES_KEY);
}
