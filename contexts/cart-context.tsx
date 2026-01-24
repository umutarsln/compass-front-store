"use client"

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react"
import { cartService, Cart, CartItem as BackendCartItem } from "@/services/cart.service"
import { useAuth } from "./auth-context"
import {
  getCartId,
  setCartId,
  getCartData,
  setCartData,
  clearCartData,
} from "@/lib/cart-storage"

// Legacy interface for backward compatibility
export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  // New fields
  productId?: string
  variantId?: string | null
  variantValues?: Array<{
    id: string
    value: string
    colorCode: string | null
    variantOption: {
      id: string
      name: string
      type: 'COLOR' | 'TEXT'
    } | null
  }>
  personalization?: any // Personalization snapshot data
}

interface CartContextType {
  items: CartItem[]
  isSidebarOpen: boolean
  isLoading: boolean
  addingToCart: Set<string> // productId-variantId kombinasyonları için loading state
  updatingItems: Set<string> // productId-variantId kombinasyonları için loading state
  removingItems: Set<string> // productId-variantId kombinasyonları için loading state
  openSidebar: () => void
  closeSidebar: () => void
  addToCart: (
    item: Omit<CartItem, "quantity">,
    personalizationData?: {
      formValues: Record<string, any>
      fileIds: string[]
    } | undefined,
    shouldOpenSidebar?: boolean
  ) => Promise<void>
  removeFromCart: (productId: string, variantId: string | null) => Promise<void>
  updateQuantity: (productId: string, variantId: string | null, quantity: number) => Promise<void>
  updatePersonalization: (
    productId: string,
    variantId: string | null,
    personalizationData: {
      formValues: Record<string, any>
      fileIds: string[]
    }
  ) => Promise<void>
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
  getCartId: () => string | null
  syncCart: () => Promise<void>
  isAddingToCart: (productId: string, variantId: string | null) => boolean
  isUpdatingItem: (productId: string, variantId: string | null) => boolean
  isRemovingItem: (productId: string, variantId: string | null) => boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [addingToCart, setAddingToCart] = useState<Set<string>>(new Set())
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set())
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set())
  const { isAuthenticated } = useAuth()

  // Initialize cart on mount
  useEffect(() => {
    initializeCart()
  }, [isAuthenticated])

  // Sync cart when sidebar opens
  useEffect(() => {
    if (isSidebarOpen) {
      syncCart()
    }
  }, [isSidebarOpen])

  const initializeCart = async () => {
    try {
      setIsLoading(true)
      let cartId = getCartId()

      if (isAuthenticated) {
        // Authenticated: Get user cart
        const userCart = await cartService.getUserCart()
        if (userCart) {
          cartId = userCart.id
          setCartId(cartId)
          setCartData({
            cartId: userCart.id,
            items: userCart.items.map((item) => ({
              productId: item.productId,
              variantId: item.variantId,
              quantity: item.quantity,
              basePrice: item.basePrice,
              discountedPrice: item.discountedPrice,
            })),
            updatedAt: userCart.updatedAt,
          })
          setItems(mapBackendItemsToLegacy(userCart.items))
        } else {
          // No user cart, check if we have a guest cart to merge
          const localCartId = getCartId()
          if (localCartId) {
            // Will be merged on login sync
            clearCartData()
          }
        }
      } else {
        // Guest: Get or create guest cart
        if (cartId) {
          try {
            const cart = await cartService.getCart(cartId)
            setItems(mapBackendItemsToLegacy(cart.items))
            setCartData({
              cartId: cart.id,
              items: cart.items.map((item) => ({
                productId: item.productId,
                variantId: item.variantId,
                quantity: item.quantity,
                basePrice: item.basePrice,
                discountedPrice: item.discountedPrice,
              })),
              updatedAt: cart.updatedAt,
            })
          } catch (error) {
            // Cart not found, create new one
            const newCart = await cartService.createGuestCart()
            setCartId(newCart.id)
            setItems([])
          }
        } else {
          // No cart ID, will be created on first add
        }
      }
    } catch (error) {
      console.error("Failed to initialize cart:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const syncCart = async () => {
    try {
      const cartId = getCartId()
      if (!cartId) return

      if (isAuthenticated) {
        const cart = await cartService.getUserCart()
        if (cart) {
          setItems(mapBackendItemsToLegacy(cart.items))
          setCartData({
            cartId: cart.id,
            items: cart.items.map((item) => ({
              productId: item.productId,
              variantId: item.variantId,
              quantity: item.quantity,
              basePrice: item.basePrice,
              discountedPrice: item.discountedPrice,
            })),
            updatedAt: cart.updatedAt,
          })
        }
      } else {
        const cart = await cartService.getCart(cartId)
        setItems(mapBackendItemsToLegacy(cart.items))
        setCartData({
          cartId: cart.id,
          items: cart.items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            basePrice: item.basePrice,
            discountedPrice: item.discountedPrice,
          })),
          updatedAt: cart.updatedAt,
        })
      }
    } catch (error) {
      console.error("Failed to sync cart:", error)
    }
  }

  const openSidebar = () => {
    setIsSidebarOpen(true)
  }

  const closeSidebar = () => {
    setIsSidebarOpen(false)
  }

  const addToCart = async (
    item: Omit<CartItem, "quantity">,
    personalizationData?: {
      formValues: Record<string, any>
      fileIds: string[]
    } | undefined,
    shouldOpenSidebar: boolean = true
  ) => {
    const productId = item.productId || item.id
    const variantId = item.variantId || null
    const key = `${productId}-${variantId || 'null'}`

    // Set loading state
    setAddingToCart((prev) => new Set(prev).add(key))

    try {
      let cartId = getCartId()

      // Create cart if doesn't exist
      if (!cartId) {
        const newCart = await cartService.createGuestCart()
        cartId = newCart.id
        setCartId(cartId)
      }

      // Personalization data parametreden geliyor (zaten hazırlanmış)
      const personalization = personalizationData
        ? {
            formValues: personalizationData.formValues,
            fileIds: personalizationData.fileIds,
          }
        : undefined

      // Add item to cart
      await cartService.addItem(cartId, {
        productId,
        variantId: variantId || undefined,
        quantity: 1,
        personalization,
      })

      // Sync cart to get updated state
      await syncCart()

      if (shouldOpenSidebar) {
        setIsSidebarOpen(true)
      }
    } catch (error) {
      console.error("Failed to add to cart:", error)
      // Optimistic update fallback
      const fallbackProductId = item.productId || item.id
      const fallbackVariantId = item.variantId || null
      setItems((prevItems) => {
        const existingItem = prevItems.find(
          (i) => i.productId === fallbackProductId && i.variantId === fallbackVariantId
        )

        if (existingItem) {
          return prevItems.map((i) =>
            i.productId === fallbackProductId && i.variantId === fallbackVariantId
              ? { ...i, quantity: i.quantity + 1 }
              : i
          )
        }

        return [...prevItems, { ...item, quantity: 1 }]
      })
    } finally {
      // Clear loading state
      setAddingToCart((prev) => {
        const next = new Set(prev)
        next.delete(key)
        return next
      })
    }
  }

  const isAddingToCart = (productId: string, variantId: string | null): boolean => {
    const key = `${productId}-${variantId || 'null'}`
    return addingToCart.has(key)
  }

  const removeFromCart = async (productId: string, variantId: string | null) => {
    const key = `${productId}-${variantId || 'null'}`
    setRemovingItems((prev) => new Set(prev).add(key))

    try {
      const cartId = getCartId()
      if (!cartId) return

      // Find backend item ID
      const cart = await cartService.getCart(cartId)
      const backendItem = cart.items.find(
        (i) => i.productId === productId && i.variantId === variantId
      )

      if (backendItem) {
        await cartService.removeItem(cartId, backendItem.id)
        await syncCart()
        return
      }

      // Fallback: remove from local state
      setItems((prevItems) =>
        prevItems.filter(
          (item) => !(item.productId === productId && item.variantId === variantId)
        )
      )
    } catch (error) {
      console.error("Failed to remove from cart:", error)
      // Fallback: remove from local state
      setItems((prevItems) =>
        prevItems.filter(
          (item) => !(item.productId === productId && item.variantId === variantId)
        )
      )
    } finally {
      setRemovingItems((prev) => {
        const next = new Set(prev)
        next.delete(key)
        return next
      })
    }
  }

  const updateQuantity = async (
    productId: string,
    variantId: string | null,
    quantity: number
  ) => {
    if (quantity <= 0) {
      await removeFromCart(productId, variantId)
      return
    }

    const key = `${productId}-${variantId || 'null'}`
    setUpdatingItems((prev) => new Set(prev).add(key))

    try {
      const cartId = getCartId()
      if (!cartId) return

      // Find backend item ID
      const cart = await cartService.getCart(cartId)
      const backendItem = cart.items.find(
        (i) => i.productId === productId && i.variantId === variantId
      )

      if (backendItem) {
        await cartService.updateItem(cartId, backendItem.id, { quantity })
        await syncCart()
        return
      }

      // Fallback: update local state
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.productId === productId && item.variantId === variantId
            ? { ...item, quantity }
            : item
        )
      )
    } catch (error) {
      console.error("Failed to update quantity:", error)
      // Fallback: update local state
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.productId === productId && item.variantId === variantId
            ? { ...item, quantity }
            : item
        )
      )
    } finally {
      setUpdatingItems((prev) => {
        const next = new Set(prev)
        next.delete(key)
        return next
      })
    }
  }

  const updatePersonalization = async (
    productId: string,
    variantId: string | null,
    personalizationData: {
      formValues: Record<string, any>
      fileIds: string[]
    }
  ) => {
    const key = `${productId}-${variantId || 'null'}`
    setUpdatingItems((prev) => new Set(prev).add(key))

    try {
      const cartId = getCartId()
      if (!cartId) {
        throw new Error('Sepet bulunamadı')
      }

      // Find backend item ID
      const cart = await cartService.getCart(cartId)
      const backendItem = cart.items.find(
        (i) => i.productId === productId && i.variantId === variantId
      )

      if (!backendItem) {
        throw new Error('Sepet öğesi bulunamadı')
      }

      // Update item with new personalization
      await cartService.updateItem(cartId, backendItem.id, {
        quantity: backendItem.quantity, // Keep existing quantity
        personalization: personalizationData,
      })

      // Sync cart to get updated state
      await syncCart()
    } catch (error) {
      console.error("Failed to update personalization:", error)
      throw error
    } finally {
      setUpdatingItems((prev) => {
        const next = new Set(prev)
        next.delete(key)
        return next
      })
    }
  }

  const isUpdatingItem = (productId: string, variantId: string | null): boolean => {
    const key = `${productId}-${variantId || 'null'}`
    return updatingItems.has(key)
  }

  const isRemovingItem = (productId: string, variantId: string | null): boolean => {
    const key = `${productId}-${variantId || 'null'}`
    return removingItems.has(key)
  }

  const clearCart = () => {
    setItems([])
    clearCartData()
  }

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getCartIdFromContext = (): string | null => {
    return getCartId()
  }

  return (
    <CartContext.Provider
      value={{
        items,
        isSidebarOpen,
        isLoading,
        addingToCart,
        updatingItems,
        removingItems,
        openSidebar,
        closeSidebar,
        addToCart,
        removeFromCart,
        updateQuantity,
        updatePersonalization,
        clearCart,
        getTotalItems,
        getTotalPrice,
        getCartId: getCartIdFromContext,
        syncCart,
        isAddingToCart,
        isUpdatingItem,
        isRemovingItem,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

// Helper to map backend items to legacy format
function mapBackendItemsToLegacy(backendItems: BackendCartItem[]): CartItem[] {
  return backendItems.map((item) => {
    const product = item.product
    const variant = item.variant
    const price = item.discountedPrice ?? item.basePrice

    // Get image from variant gallery (if exists) or product gallery
    let imageUrl = '/placeholders/placeholder.svg'
    if (variant?.gallery?.mainImage?.s3Url) {
      imageUrl = variant.gallery.mainImage.s3Url
    } else if (variant?.gallery?.thumbnailImage?.s3Url) {
      imageUrl = variant.gallery.thumbnailImage.s3Url
    } else if (product?.gallery?.mainImage?.s3Url) {
      imageUrl = product.gallery.mainImage.s3Url
    } else if (product?.gallery?.thumbnailImage?.s3Url) {
      imageUrl = product.gallery.thumbnailImage.s3Url
    }

    return {
      id: item.id, // Use cart item ID (unique per item, even for same product with different personalizations)
      name: product?.name || 'Ürün',
      price: price,
      image: imageUrl,
      quantity: item.quantity,
      productId: item.productId,
      variantId: item.variantId,
      variantValues: variant?.variantValues || [],
      personalization: item.personalization || undefined,
    }
  })
}
