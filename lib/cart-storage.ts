const CART_ID_KEY = 'shawk_cart_id';
const CART_DATA_KEY = 'shawk_cart_data';

export interface LocalCartData {
    cartId: string;
    items: Array<{
        productId: string;
        variantId: string | null;
        quantity: number;
        basePrice: number;
        discountedPrice: number | null;
    }>;
    updatedAt: string;
}

/**
 * Get cart ID from localStorage
 */
export function getCartId(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(CART_ID_KEY);
}

/**
 * Set cart ID in localStorage
 */
export function setCartId(cartId: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(CART_ID_KEY, cartId);
}

/**
 * Remove cart ID from localStorage
 */
export function removeCartId(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(CART_ID_KEY);
    localStorage.removeItem(CART_DATA_KEY);
}

/**
 * Get cart data from localStorage
 */
export function getCartData(): LocalCartData | null {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(CART_DATA_KEY);
    if (!data) return null;
    try {
        return JSON.parse(data);
    } catch {
        return null;
    }
}

/**
 * Set cart data in localStorage
 */
export function setCartData(data: LocalCartData): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(CART_DATA_KEY, JSON.stringify(data));
}

/**
 * Clear all cart data
 */
export function clearCartData(): void {
    removeCartId();
}
