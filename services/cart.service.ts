import { api } from './api';

export interface CartItem {
  id: string;
  productId: string;
  variantId: string | null;
  quantity: number;
  basePrice: number;
  discountedPrice: number | null;
  currency: string;
  product: {
    id: string;
    name: string;
    slug: string;
    basePrice: number;
    discountedPrice: number | null;
    isOnSale: boolean;
    gallery: {
      mainImage: {
        id: string;
        s3Url: string;
        displayName: string | null;
        filename: string;
      } | null;
      thumbnailImage: {
        id: string;
        s3Url: string;
        displayName: string | null;
        filename: string;
      } | null;
    } | null;
  } | null;
  variant: {
    id: string;
    slug: string | null;
    gallery: {
      mainImage: {
        id: string;
        s3Url: string;
        displayName: string | null;
        filename: string;
      } | null;
      thumbnailImage: {
        id: string;
        s3Url: string;
        displayName: string | null;
        filename: string;
      } | null;
    } | null;
    variantValues: Array<{
      id: string;
      value: string;
      colorCode: string | null;
      variantOption: {
        id: string;
        name: string;
        type: 'COLOR' | 'TEXT';
      } | null;
    }>;
  } | null;
  personalization?: any | null;
  createdAt: string;
  updatedAt: string;
}

export interface Cart {
  id: string;
  userId: string | null;
  status: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

export interface AddItemDto {
  productId: string;
  variantId?: string;
  quantity: number;
  personalization?: {
    formValues: Record<string, any>;
    fileIds?: string[];
  };
}

export interface UpdateItemDto {
  quantity: number;
  personalization?: {
    formValues: Record<string, any>;
    fileIds?: string[];
  };
}

class CartService {
  /**
   * Create a guest cart
   */
  async createGuestCart(): Promise<Cart> {
    return await api.post<Cart>('/carts/guest');
  }

  /**
   * Get cart by ID
   */
  async getCart(cartId: string): Promise<Cart> {
    return await api.get<Cart>(`/carts/${cartId}`);
  }

  /**
   * Add item to cart
   */
  async addItem(
    cartId: string,
    addItemDto: AddItemDto,
  ): Promise<Cart> {
    return await api.post<Cart>(`/carts/${cartId}/items`, addItemDto);
  }

  /**
   * Update item quantity and/or personalization
   */
  async updateItem(
    cartId: string,
    itemId: string,
    updateItemDto: UpdateItemDto,
  ): Promise<Cart> {
    return await api.patch<Cart>(
      `/carts/${cartId}/items/${itemId}`,
      updateItemDto,
    );
  }

  /**
   * Remove item from cart
   */
  async removeItem(cartId: string, itemId: string): Promise<Cart> {
    return await api.delete<Cart>(`/carts/${cartId}/items/${itemId}`);
  }

  /**
   * Merge guest cart into user cart
   */
  async mergeCart(guestCartId: string): Promise<Cart> {
    return await api.post<Cart>(`/carts/${guestCartId}/merge`);
  }

  /**
   * Get user's active cart
   */
  async getUserCart(): Promise<Cart | null> {
    return await api.get<Cart | null>('/carts/me/cart');
  }
}

export const cartService = new CartService();
