"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { favoritesService } from "@/services/favorites.service"
import { useAuth } from "./auth-context"
import {
  getFavorites,
  addFavorite as addFavoriteLocal,
  removeFavorite as removeFavoriteLocal,
  isFavorite as isFavoriteLocal,
  getFavoriteProductIds,
  clearFavorites,
} from "@/lib/favorites-storage"

export interface FavoriteItem {
  id: string
  name: string
  price: number
  image: string
  category: string
}

interface FavoritesContextType {
  items: FavoriteItem[]
  isLoading: boolean
  togglingFavorites: Set<string> // productId'ler için loading state
  addToFavorites: (item: FavoriteItem) => Promise<void>
  removeFromFavorites: (id: string) => Promise<void>
  isFavorite: (id: string) => boolean
  toggleFavorite: (item: FavoriteItem) => Promise<void>
  syncFavorites: () => Promise<void>
  isTogglingFavorite: (id: string) => boolean
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<FavoriteItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [togglingFavorites, setTogglingFavorites] = useState<Set<string>>(new Set())
  const { isAuthenticated } = useAuth()

  // Initialize favorites on mount
  useEffect(() => {
    initializeFavorites()
  }, [isAuthenticated])

  const initializeFavorites = async () => {
    try {
      setIsLoading(true)
      if (isAuthenticated) {
        // Authenticated: Get from backend
        const favorites = await favoritesService.getFavorites()
        // Map to FavoriteItem format (would need product details)
        setItems([]) // Placeholder - need to fetch product details
      } else {
        // Guest: Get from localStorage
        const localFavorites = getFavorites()
        if (localFavorites) {
          // Map productIds to FavoriteItem format (would need product details)
          setItems([]) // Placeholder - need to fetch product details
        }
      }
    } catch (error) {
      console.error("Failed to initialize favorites:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const syncFavorites = async () => {
    if (!isAuthenticated) return

    try {
      // Get cloud favorites
      const cloudFavorites = await favoritesService.getFavorites()
      
      // Get local favorites
      const localFavoriteIds = getFavoriteProductIds()
      
      // Merge: Add local favorites that don't exist in cloud
      if (localFavoriteIds.length > 0) {
        const cloudProductIds = cloudFavorites.map((f) => f.productId)
        const newProductIds = localFavoriteIds.filter(
          (id) => !cloudProductIds.includes(id)
        )
        
        if (newProductIds.length > 0) {
          try {
            await favoritesService.syncFavorites(newProductIds)
            // After successful sync, clear local favorites
            clearFavorites()
          } catch (error) {
            console.warn("Failed to sync local favorites to cloud:", error)
          }
        } else {
          // All local favorites are already in cloud, clear local
          clearFavorites()
        }
      }
      
      // Fetch updated favorites from cloud
      const updatedFavorites = await favoritesService.getFavorites()
      // Map to FavoriteItem format (would need product details)
      // For now, just store productIds
      setItems([]) // Placeholder - need to fetch product details
    } catch (error) {
      console.error("Failed to sync favorites:", error)
    }
  }

  const addToFavorites = async (item: FavoriteItem) => {
    setTogglingFavorites((prev) => new Set(prev).add(item.id))
    try {
      if (isAuthenticated) {
        // Authenticated: Add to backend
        await favoritesService.addFavorite(item.id)
        setItems((prevItems) => {
          if (prevItems.find((i) => i.id === item.id)) {
            return prevItems
          }
          return [...prevItems, item]
        })
      } else {
        // Guest: Add to localStorage
        addFavoriteLocal(item.id)
        setItems((prevItems) => {
          if (prevItems.find((i) => i.id === item.id)) {
            return prevItems
          }
          return [...prevItems, item]
        })
      }
    } catch (error) {
      console.error("Failed to add to favorites:", error)
    } finally {
      setTogglingFavorites((prev) => {
        const next = new Set(prev)
        next.delete(item.id)
        return next
      })
    }
  }

  const removeFromFavorites = async (id: string) => {
    setTogglingFavorites((prev) => new Set(prev).add(id))
    try {
      if (isAuthenticated) {
        // Authenticated: Remove from backend
        await favoritesService.removeFavorite(id)
        setItems((prevItems) => prevItems.filter((item) => item.id !== id))
      } else {
        // Guest: Remove from localStorage
        removeFavoriteLocal(id)
        setItems((prevItems) => prevItems.filter((item) => item.id !== id))
      }
    } catch (error) {
      console.error("Failed to remove from favorites:", error)
    } finally {
      setTogglingFavorites((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }
  }

  const isFavorite = (id: string): boolean => {
    if (isAuthenticated) {
      // Check both local state and backend
      return items.some((item) => item.id === id)
    } else {
      // Check localStorage
      return isFavoriteLocal(id)
    }
  }

  const toggleFavorite = async (item: FavoriteItem) => {
    if (isFavorite(item.id)) {
      await removeFromFavorites(item.id)
    } else {
      await addToFavorites(item)
    }
  }

  const isTogglingFavorite = (id: string): boolean => {
    return togglingFavorites.has(id)
  }

  return (
    <FavoritesContext.Provider
      value={{
        items,
        isLoading,
        togglingFavorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        toggleFavorite,
        syncFavorites,
        isTogglingFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider")
  }
  return context
}
