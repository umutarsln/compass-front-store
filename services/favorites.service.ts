import { api } from './api';

export interface Favorite {
  id: string;
  productId: string;
  product?: any;
  createdAt: string;
}

class FavoritesService {
  /**
   * Get user favorites
   */
  async getFavorites(): Promise<Favorite[]> {
    return await api.get<Favorite[]>('/me/favorites');
  }

  /**
   * Add favorite
   */
  async addFavorite(productId: string): Promise<Favorite> {
    return await api.post<Favorite>('/me/favorites', { productId });
  }

  /**
   * Remove favorite
   */
  async removeFavorite(productId: string): Promise<void> {
    return await api.delete(`/me/favorites/${productId}`);
  }

  /**
   * Sync favorites (bulk upsert for login sync)
   */
  async syncFavorites(productIds: string[]): Promise<Favorite[]> {
    // Backend doesn't have a bulk sync endpoint, so we'll add them one by one
    // In a real scenario, you might want to add a bulk endpoint
    const results: Favorite[] = [];
    for (const productId of productIds) {
      try {
        const favorite = await this.addFavorite(productId);
        results.push(favorite);
      } catch (error) {
        // If already favorited, skip
        console.warn(`Failed to add favorite for product ${productId}:`, error);
      }
    }
    return results;
  }
}

export const favoritesService = new FavoritesService();
