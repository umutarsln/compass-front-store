"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  color: string
  size: string
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  isSidebarOpen: boolean
  openSidebar: () => void
  closeSidebar: () => void
  addToCart: (item: Omit<CartItem, "quantity">, shouldOpenSidebar?: boolean) => void
  removeFromCart: (id: string, color: string, size: string) => void
  updateQuantity: (id: string, color: string, size: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (error) {
        console.error("Failed to load cart from localStorage", error)
      }
    }
  }, [])

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items))
  }, [items])

  const openSidebar = () => {
    setIsSidebarOpen(true)
  }

  const closeSidebar = () => {
    setIsSidebarOpen(false)
  }

  const addToCart = (item: Omit<CartItem, "quantity">, shouldOpenSidebar: boolean = true) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (i) => i.id === item.id && i.color === item.color && i.size === item.size
      )

      if (existingItem) {
        return prevItems.map((i) =>
          i.id === existingItem.id && i.color === existingItem.color && i.size === existingItem.size
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      }

      return [...prevItems, { ...item, quantity: 1 }]
    })
    // Sepete ekledikten sonra sidebar'ı aç (eğer shouldOpenSidebar true ise)
    if (shouldOpenSidebar) {
      setIsSidebarOpen(true)
    }
  }

  const removeFromCart = (id: string, color: string, size: string) => {
    setItems((prevItems) =>
      prevItems.filter(
        (item) => !(item.id === id && item.color === color && item.size === size)
      )
    )
  }

  const updateQuantity = (id: string, color: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id, color, size)
      return
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.color === color && item.size === size
          ? { ...item, quantity }
          : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        items,
        isSidebarOpen,
        openSidebar,
        closeSidebar,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
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
