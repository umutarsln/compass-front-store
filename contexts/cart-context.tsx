"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { cartService, Cart, CartItem as BackendCartItem, AppliedCoupon } from "@/services/cart.service"
import { useAuth } from "./auth-context"
import {
  getCartId,
  setCartId,
  setCartData,
  clearCartData,
} from "@/lib/cart-storage"
import { trackEvent } from "@/lib/analytics"

// Legacy interface for backward compatibility
export interface CartItem {
  id: string
  name: string
  price: number
  basePrice?: number
  discountedPrice?: number | null
  image: string
  quantity: number
  // New fields
  productId?: string
  productSlug?: string
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

export interface CartTotals {
  subtotal: number
  discountAmount: number
  total: number
  appliedCoupon: AppliedCoupon | null
}

interface CartContextType {
  items: CartItem[]
  cartTotals: CartTotals | null
  isSidebarOpen: boolean
  isLoading: boolean
  applyingCoupon: boolean
  addingToCart: Set<string>
  updatingItems: Set<string>
  removingItems: Set<string>
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
  applyCoupon: (code: string) => Promise<{ success: boolean; message?: string }>
  removeCoupon: () => Promise<void>
  isAddingToCart: (productId: string, variantId: string | null) => boolean
  isUpdatingItem: (productId: string, variantId: string | null) => boolean
  isRemovingItem: (productId: string, variantId: string | null) => boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

function cartToTotals(cart: Cart): CartTotals {
  return {
    subtotal: cart.subtotal ?? 0,
    discountAmount: cart.discountAmount ?? 0,
    total: cart.total ?? 0,
    appliedCoupon: cart.appliedCoupon ?? null,
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [cartTotals, setCartTotals] = useState<CartTotals | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [applyingCoupon, setApplyingCoupon] = useState(false)
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
          setCartTotals(cartToTotals(userCart))
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
            setCartTotals(cartToTotals(cart))
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
            setCartTotals(cartToTotals(newCart))
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
          setCartTotals(cartToTotals(cart))
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
        setCartTotals(cartToTotals(cart))
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

  const applyCoupon = async (code: string): Promise<{ success: boolean; message?: string }> => {
    const cartId = getCartId()
    if (!cartId) return { success: false, message: "Sepet bulunamadı" }
    setApplyingCoupon(true)
    try {
      await cartService.applyCoupon(cartId, code)
      await syncCart()
      return { success: true }
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || "Kupon uygulanamadı"
      return { success: false, message }
    } finally {
      setApplyingCoupon(false)
    }
  }

  const removeCoupon = async () => {
    const cartId = getCartId()
    if (!cartId) return
    setApplyingCoupon(true)
    try {
      await cartService.removeCoupon(cartId)
      await syncCart()
    } catch (error) {
      console.error("Failed to remove coupon:", error)
    } finally {
      setApplyingCoupon(false)
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

      // Analytics: cart_add (frontend "eklendi" anı)
      if (process.env.NODE_ENV === "development") {
        console.log("[Analytics][CartContext] CART_ADD", { productId, variantId: variantId || undefined, quantity: 1 })
      }
      trackEvent({
        type: "CART_ADD",
        productId,
        variantId: variantId || undefined,
        quantity: 1,
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
    setCartTotals(null)
    clearCartData()
  }

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    if (cartTotals != null && cartTotals.total >= 0) return cartTotals.total
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getCartIdFromContext = (): string | null => {
    return getCartId()
  }

  return (
    <CartContext.Provider
      value={{
        items,
        cartTotals,
        isSidebarOpen,
        isLoading,
        applyingCoupon,
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
        applyCoupon,
        removeCoupon,
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
      basePrice: item.basePrice,
      discountedPrice: item.discountedPrice,
      image: imageUrl,
      quantity: item.quantity,
      productId: item.productId,
      productSlug: product?.slug,
      variantId: item.variantId,
      variantValues: variant?.variantValues || [],
      personalization: item.personalization || undefined,
    }
  })
}
