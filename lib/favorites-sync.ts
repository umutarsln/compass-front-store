import { favoritesService } from '@/services/favorites.service';
import {
  getFavoriteProductIds,
  clearFavorites,
} from './favorites-storage';
import { getToken } from './auth-client';

/**
 * Merge favorites on favorites page load
 * Merges local favorites with cloud favorites
 */
export async function mergeFavoritesOnPageLoad(): Promise<void> {
  try {
    // Check if user is authenticated
    const token = getToken();
    if (!token) {
      // Not authenticated, no merge needed
      return;
    }

    // Step 1: Get local favorites
    const localFavoriteIds = getFavoriteProductIds();

    // Step 2: Get cloud favorites
    let cloudFavorites: any[] = [];
    try {
      cloudFavorites = await favoritesService.getFavorites();
    } catch (error: any) {
      // If 401 or other error, skip merge
      if (error?.response?.status === 401) {
        return;
      }
      console.warn('Failed to fetch cloud favorites:', error);
    }

    const cloudProductIds = cloudFavorites.map((f) => f.productId);

    // Step 3: Merge logic
    if (localFavoriteIds.length > 0) {
      // Local favorites exist - merge with cloud
      // Add local favorites that don't exist in cloud
      const newProductIds = localFavoriteIds.filter(
        (id) => !cloudProductIds.includes(id)
      );

      if (newProductIds.length > 0) {
        try {
          // Sync new favorites to cloud
          await favoritesService.syncFavorites(newProductIds);
          // After successful sync, clear local favorites
          clearFavorites();
        } catch (error: any) {
          // If sync fails, keep local favorites
          console.warn('Failed to sync favorites to cloud:', error);
        }
      } else {
        // All local favorites are already in cloud, clear local
        clearFavorites();
      }
    } else if (cloudProductIds.length > 0) {
      // Local empty, cloud has favorites - already synced, nothing to do
      // Cloud favorites are already the source of truth
    }
    // Both empty - nothing to do
  } catch (error) {
    console.error('Favorites merge error:', error);
    // Don't throw - merge failure shouldn't break the page
  }
}
