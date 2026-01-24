import { cartService, Cart } from '@/services/cart.service';
import { favoritesService } from '@/services/favorites.service';
import {
    getCartId,
    setCartId,
    getCartData,
    setCartData,
    clearCartData,
} from './cart-storage';
import {
    getFavorites,
    getFavoriteProductIds,
    clearFavorites,
} from './favorites-storage';
import { getToken } from './auth-client';

/**
 * Sync cart and favorites on login
 */
export async function syncOnLogin(): Promise<void> {
    try {
        // Check if token exists before attempting sync
        const token = getToken();
        if (!token) {
            console.warn('No token found, skipping cart sync');
            return;
        }

        // Step 1: Fetch cloud state
        const cloudCart = await cartService.getUserCart();
        const cloudFavorites = await favoritesService.getFavorites();

        // Step 2: Get local state
        const localCartId = getCartId();
        const localCartData = getCartData();
        const localFavoriteIds = getFavoriteProductIds();

        // Step 3: Cart sync
        if (localCartId && localCartData) {
            // Double check token exists before attempting merge
            const currentToken = getToken();
            if (!currentToken) {
                console.warn('No token available for cart merge, skipping');
                return;
            }

            if (cloudCart) {
                // Both exist - merge (only if token exists)
                try {
                    await cartService.mergeCart(localCartId);
                    // Fetch merged cart
                    const mergedCart = await cartService.getUserCart();
                    if (mergedCart) {
                        setCartId(mergedCart.id);
                        setCartData({
                            cartId: mergedCart.id,
                            items: mergedCart.items.map((item) => ({
                                productId: item.productId,
                                variantId: item.variantId,
                                quantity: item.quantity,
                                basePrice: item.basePrice,
                                discountedPrice: item.discountedPrice,
                                personalization: item.personalization, // Preserve personalization data
                            })),
                            updatedAt: mergedCart.updatedAt,
                        });
                    }
                } catch (mergeError: any) {
                    // If merge fails (e.g., 401), skip merge and keep local cart
                    // Silently fail - don't log to console as this is expected during login
                    if (mergeError?.response?.status !== 401) {
                        console.warn('Cart merge failed, keeping local cart:', mergeError);
                    }
                }
            } else {
                // Local exists, cloud empty - attach local to user
                try {
                    await cartService.mergeCart(localCartId);
                    const userCart = await cartService.getUserCart();
                    if (userCart) {
                        setCartId(userCart.id);
                        setCartData({
                            cartId: userCart.id,
                            items: userCart.items.map((item) => ({
                                productId: item.productId,
                                variantId: item.variantId,
                                quantity: item.quantity,
                                basePrice: item.basePrice,
                                discountedPrice: item.discountedPrice,
                                personalization: item.personalization, // Preserve personalization data
                            })),
                            updatedAt: userCart.updatedAt,
                        });
                    }
                } catch (mergeError: any) {
                    // If merge fails (e.g., 401), skip merge and keep local cart
                    // Silently fail - don't log to console as this is expected during login
                    if (mergeError?.response?.status !== 401) {
                        console.warn('Cart merge failed, keeping local cart:', mergeError);
                    }
                }
            }
        } else if (cloudCart) {
            // Local empty, cloud exists - pull cloud
            setCartId(cloudCart.id);
            setCartData({
                cartId: cloudCart.id,
                items: cloudCart.items.map((item) => ({
                    productId: item.productId,
                    variantId: item.variantId,
                    quantity: item.quantity,
                    basePrice: item.basePrice,
                    discountedPrice: item.discountedPrice,
                    personalization: item.personalization, // Preserve personalization data
                })),
                updatedAt: cloudCart.updatedAt,
            });
        } else {
            // Both empty - create empty (will be created on first add)
            clearCartData();
        }

        // Step 4: Favorites sync
        if (localFavoriteIds.length > 0) {
            // Local favorites exist - upsert into DB
            await favoritesService.syncFavorites(localFavoriteIds);
            // Clear local favorites after sync
            clearFavorites();
        } else if (cloudFavorites.length > 0) {
            // Local empty, pull cloud favorites
            // Store in localStorage for consistency
            // Note: In authenticated mode, favorites are managed by backend
            // We don't need to store them locally
        }

        // Step 5: Cleanup
        // Guest cart ID is already cleared if merged
        // Favorites are cleared after sync
    } catch (error) {
        console.error('Cart sync error:', error);
        throw error;
    }
}
