"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Trash2, Plus, Minus, ShoppingBag, Edit } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { Spinner } from "@/components/ui/spinner"
import { Skeleton } from "@/components/ui/skeleton"
import { PersonalizationSummary } from "@/components/personalization/PersonalizationSummary"
import { PersonalizationFormRenderer } from "@/components/personalization/PersonalizationFormRenderer"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { getProductDetail } from "@/services/products"
import { uploadPersonalizationFiles, preparePersonalizationData } from "@/utils/personalization.helper"

export function CartContent() {
  const { items, isLoading, removeFromCart, updateQuantity, updatePersonalization, getTotalPrice, getTotalItems, isUpdatingItem, isRemovingItem } = useCart()
  const { isAuthenticated } = useAuth()
  const [editingItem, setEditingItem] = useState<{ productId: string; variantId: string | null; product: any } | null>(null)
  const [isLoadingProduct, setIsLoadingProduct] = useState(false)
  const [isSavingPersonalization, setIsSavingPersonalization] = useState(false)

  // Loading state - show skeleton
  if (isLoading) {
    return (
      <section className="py-12 bg-background min-h-screen">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Skeleton className="h-10 w-48 mb-8" />
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Sepet Ürünleri Skeleton */}
            <div className="lg:col-span-2 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-4 p-4 border border-border bg-background">
                  <Skeleton className="w-24 h-24 shrink-0" />
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2">
                        <Skeleton className="w-8 h-8" />
                        <Skeleton className="w-8 h-4" />
                        <Skeleton className="w-8 h-8" />
                      </div>
                      <div className="flex items-center gap-4">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="w-8 h-8" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Sipariş Özeti Skeleton */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 p-6 border border-border bg-background">
                <Skeleton className="h-6 w-32 mb-6" />
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-6 w-24" />
                    </div>
                  </div>
                </div>
                <Skeleton className="h-12 w-full mb-3" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Empty state - show empty message
  if (items.length === 0) {
    return (
      <section className="py-24 bg-background min-h-screen">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-16"
          >
            <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="font-serif text-3xl sm:text-4xl text-foreground mb-4">Sepetiniz Boş</h1>
            <p className="text-muted-foreground mb-8">Sepetinize henüz ürün eklenmemiş.</p>
            <Link
              href="/urunler"
              className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground font-medium text-sm uppercase tracking-wider hover:bg-primary/90 transition-colors"
            >
              Alışverişe Başla
            </Link>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 bg-background min-h-screen">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-serif text-3xl sm:text-4xl text-foreground mb-8">Sepetim</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Sepet Ürünleri */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-4 p-4 border border-border bg-background"
                >
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <Image
                      src={item.image || "/placeholders/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">{item.name}</h3>
                    {item.variantValues && item.variantValues.length > 0 ? (
                      <div className="text-sm text-muted-foreground mt-1 space-y-1">
                        {item.variantValues.map((vv) => (
                          <div key={vv.id} className="flex items-center gap-2">
                            <span className="font-medium">{vv.variantOption?.name || 'Seçenek'}:</span>
                            {vv.variantOption?.type === 'COLOR' && vv.colorCode ? (
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-4 h-4 rounded-full border border-border"
                                  style={{ backgroundColor: vv.colorCode }}
                                />
                                <span>{vv.value}</span>
                              </div>
                            ) : (
                              <span>{vv.value}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : null}
                    {/* Personalization Summary */}
                    {item.personalization && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-foreground">Kişiselleştirme</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={async () => {
                              setIsLoadingProduct(true)
                              try {
                                // Get product detail to load personalization form
                                const productId = item.productId || item.id
                                const product = await getProductDetail(productId)

                                setEditingItem({
                                  productId: product.productId,
                                  variantId: item.variantId || null,
                                  product,
                                })
                              } catch (error) {
                                console.error('Failed to load product:', error)
                              } finally {
                                setIsLoadingProduct(false)
                              }
                            }}
                            disabled={isLoadingProduct || isUpdatingItem(item.productId || item.id, item.variantId || null)}
                            className="h-7 text-xs"
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Düzenle
                          </Button>
                        </div>
                        <PersonalizationSummary personalization={item.personalization} readOnly />
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.productId || item.id, item.variantId || null, item.quantity - 1)}
                          disabled={isUpdatingItem(item.productId || item.id, item.variantId || null) || isRemovingItem(item.productId || item.id, item.variantId || null)}
                          className="w-8 h-8 flex items-center justify-center border border-border hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isUpdatingItem(item.productId || item.id, item.variantId || null) ? (
                            <Spinner className="w-4 h-4" />
                          ) : (
                            <Minus className="w-4 h-4" />
                          )}
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId || item.id, item.variantId || null, item.quantity + 1)}
                          disabled={isUpdatingItem(item.productId || item.id, item.variantId || null) || isRemovingItem(item.productId || item.id, item.variantId || null)}
                          className="w-8 h-8 flex items-center justify-center border border-border hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isUpdatingItem(item.productId || item.id, item.variantId || null) ? (
                            <Spinner className="w-4 h-4" />
                          ) : (
                            <Plus className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="text-sm font-medium text-foreground">
                          {(item.price * item.quantity).toLocaleString("tr-TR")} ₺
                        </p>
                        <button
                          onClick={() => removeFromCart(item.productId || item.id, item.variantId || null)}
                          disabled={isRemovingItem(item.productId || item.id, item.variantId || null) || isUpdatingItem(item.productId || item.id, item.variantId || null)}
                          className="p-2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="Ürünü kaldır"
                        >
                          {isRemovingItem(item.productId || item.id, item.variantId || null) ? (
                            <Spinner className="w-4 h-4" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Sipariş Özeti */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 p-6 border border-border bg-background">
                <h2 className="font-serif text-xl text-foreground mb-6">Sipariş Özeti</h2>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Toplam Ürün</span>
                    <span className="text-foreground">{getTotalItems()} adet</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Ara Toplam</span>
                    <span className="text-foreground">{getTotalPrice().toLocaleString("tr-TR")} ₺</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Kargo</span>
                    <span className="text-foreground">Ücretsiz</span>
                  </div>
                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between">
                      <span className="font-medium text-foreground">Toplam</span>
                      <span className="font-medium text-foreground text-lg">
                        {getTotalPrice().toLocaleString("tr-TR")} ₺
                      </span>
                    </div>
                  </div>
                </div>
                <Link
                  href={isAuthenticated ? "/odeme" : "/odeme-auth"}
                  className="block w-full py-4 bg-primary text-primary-foreground font-medium text-sm uppercase tracking-wider hover:bg-primary/90 transition-colors text-center"
                >
                  Ödemeye Geç
                </Link>
                <Link
                  href="/urunler"
                  className="block w-full mt-3 py-4 border border-foreground text-foreground font-medium text-sm uppercase tracking-wider hover:bg-foreground hover:text-background transition-colors text-center"
                >
                  Alışverişe Devam Et
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Personalization Edit Dialog */}
      <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto overflow-x-hidden">
          <DialogHeader>
            <DialogTitle>Kişiselleştirmeyi Düzenle</DialogTitle>
            <DialogDescription>
              Kişiselleştirme formunu düzenleyin. Değişiklikler sepetteki ürün fiyatını etkileyebilir.
            </DialogDescription>
          </DialogHeader>

          {editingItem && editingItem.product.personalizationForm && (
            <div className="mt-4 overflow-x-hidden">
              <PersonalizationFormRenderer
                formData={editingItem.product.personalizationForm}
                productId={editingItem.productId}
                variantId={editingItem.variantId || undefined}
                initialValues={(() => {
                  // Find the cart item to get existing personalization values
                  const cartItem = items.find(
                    (i) => i.productId === editingItem.productId && i.variantId === editingItem.variantId
                  )
                  return cartItem?.personalization?.userValues || {}
                })()}
                initialFileIds={(() => {
                  // Extract file IDs from personalization snapshot
                  const cartItem = items.find(
                    (i) => i.productId === editingItem.productId && i.variantId === editingItem.variantId
                  )
                  if (!cartItem?.personalization?.userValues) return undefined

                  const fileIdsByField: Record<string, string[]> = {}
                  const schema = editingItem.product.personalizationForm.schemaSnapshot

                  schema.fields.forEach((field: any) => {
                    const value = cartItem.personalization.userValues[field.key]
                    if (!value) return

                    const isFileField =
                      field.type === 'IMAGE_PICKER_SINGLE' ||
                      field.type === 'IMAGE_PICKER_MULTI' ||
                      field.type === 'FILE_UPLOAD_SINGLE' ||
                      field.type === 'FILE_UPLOAD_MULTI'

                    if (isFileField) {
                      const ids = Array.isArray(value) ? value : [value]
                      const validIds = ids.filter(
                        (id) => typeof id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
                      )
                      if (validIds.length > 0) {
                        fileIdsByField[field.key] = validIds
                      }
                    }
                  })

                  return Object.keys(fileIdsByField).length > 0 ? fileIdsByField : undefined
                })()}
              />
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditingItem(null)}
              disabled={isSavingPersonalization}
            >
              İptal
            </Button>
            <Button
              onClick={async () => {
                if (!editingItem) return

                setIsSavingPersonalization(true)
                try {
                  // Get personalization data from form
                  const formData = (window as any).__personalizationFormData

                  if (!formData) {
                    setIsSavingPersonalization(false)
                    return
                  }

                  // 1. Validate form
                  if (formData.validate) {
                    const isValid = await formData.validate()
                    if (!isValid) {
                      setIsSavingPersonalization(false)
                      return
                    }
                  }

                  // 2. Upload new files if they exist
                  let finalFormValues = { ...formData.formValues }
                  let allFileIds: string[] = []

                  const selectedFiles = formData.selectedFiles as Record<string, File[]> | undefined

                  if (selectedFiles && Object.keys(selectedFiles).length > 0) {
                    try {
                      // Upload new files
                      const uploadedFileIds = await uploadPersonalizationFiles(selectedFiles)

                      // Prepare personalization data (combines existing + new files)
                      const prepared = preparePersonalizationData(
                        finalFormValues,
                        selectedFiles,
                        uploadedFileIds
                      )

                      finalFormValues = prepared.formValues
                      allFileIds = prepared.fileIds
                    } catch (uploadError: any) {
                      console.error('[CartContent] File upload failed:', uploadError)
                      setIsSavingPersonalization(false)
                      return
                    }
                  } else {
                    // No new files, just collect existing file IDs from form values
                    Object.entries(finalFormValues).forEach(([key, value]) => {
                      if (value) {
                        const field = editingItem.product.personalizationForm.schemaSnapshot.fields.find(
                          (f: any) => f.key === key
                        )
                        if (field) {
                          const isFileField =
                            field.type === 'IMAGE_PICKER_SINGLE' ||
                            field.type === 'IMAGE_PICKER_MULTI' ||
                            field.type === 'FILE_UPLOAD_SINGLE' ||
                            field.type === 'FILE_UPLOAD_MULTI'

                          if (isFileField) {
                            const ids = Array.isArray(value) ? value : [value]
                            const validIds = ids.filter(
                              (id) => typeof id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
                            )
                            allFileIds.push(...validIds)
                          }
                        }
                      }
                    })
                  }

                  // 3. Update personalization with final values
                  await updatePersonalization(
                    editingItem.productId,
                    editingItem.variantId,
                    {
                      formValues: finalFormValues,
                      fileIds: allFileIds,
                    }
                  )

                  // Close dialog
                  setEditingItem(null)
                } catch (error: any) {
                  console.error('[CartContent] Failed to update personalization:', error)
                } finally {
                  setIsSavingPersonalization(false)
                }
              }}
              disabled={isSavingPersonalization}
            >
              {isSavingPersonalization ? (
                <>
                  <Spinner className="w-4 h-4 mr-2" />
                  Kaydediliyor...
                </>
              ) : (
                'Kaydet'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}
