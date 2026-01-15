"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

export interface FavoriteItem {
  id: string
  name: string
  price: number
  image: string
  category: string
}

interface FavoritesContextType {
  items: FavoriteItem[]
  addToFavorites: (item: FavoriteItem) => void
  removeFromFavorites: (id: string) => void
  isFavorite: (id: string) => boolean
  toggleFavorite: (item: FavoriteItem) => void
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<FavoriteItem[]>([])

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem("favorites")
    if (savedFavorites) {
      try {
        setItems(JSON.parse(savedFavorites))
      } catch (error) {
        console.error("Failed to load favorites from localStorage", error)
      }
    }
  }, [])

  // Save favorites to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(items))
  }, [items])

  const addToFavorites = (item: FavoriteItem) => {
    setItems((prevItems) => {
      if (prevItems.find((i) => i.id === item.id)) {
        return prevItems
      }
      return [...prevItems, item]
    })
  }

  const removeFromFavorites = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  const isFavorite = (id: string) => {
    return items.some((item) => item.id === id)
  }

  const toggleFavorite = (item: FavoriteItem) => {
    if (isFavorite(item.id)) {
      removeFromFavorites(item.id)
    } else {
      addToFavorites(item)
    }
  }

  return (
    <FavoritesContext.Provider
      value={{
        items,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        toggleFavorite,
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
