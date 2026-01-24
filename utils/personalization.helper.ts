/**
 * Personalization Helper Utilities
 * 
 * Bu dosya kişiselleştirme formları ile ilgili yardımcı fonksiyonları içerir.
 */

import { uploadService } from '@/services/upload.service'

export interface PersonalizationFormData {
  formValues: Record<string, any>
  selectedFiles: Record<string, File[]>
  fileIds?: string[]
}

/**
 * Dosyaları yükle ve file ID'lerini döndür
 */
export async function uploadPersonalizationFiles(
  selectedFiles: Record<string, File[]>
): Promise<string[]> {
  // Tüm dosyaları topla
  const allFiles: File[] = []
  Object.values(selectedFiles).forEach((files) => {
    if (Array.isArray(files) && files.length > 0) {
      allFiles.push(...files)
    }
  })

  if (allFiles.length === 0) {
    return []
  }

  // Kişiselleştirme dosyaları için her zaman guest endpoint kullanılır
  // Bu güvenlik için önemli: sadece kişiselleştirme için dosya yükleme izni verilir
  // Authenticated kullanıcılar için de guest endpoint kullanılır çünkü:
  // 1. Bu dosyalar sadece kişiselleştirme için kullanılır
  // 2. Admin panel upload yetkisi ayrı bir endpoint'tir
  // 3. Guest endpoint zaten public ve güvenli
  
  // Guest ID'yi al veya oluştur (authenticated kullanıcılar için de)
  const getGuestId = (): string => {
    if (typeof window === 'undefined') return ''
    let guestId = localStorage.getItem('guest_id')
    if (!guestId) {
      guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem('guest_id', guestId)
    }
    return guestId
  }

  // Dosyaları sırayla yükle (her zaman guest endpoint kullan)
  const uploadedFileIds: string[] = []
  const guestId = getGuestId()
  
  for (let i = 0; i < allFiles.length; i++) {
    const file = allFiles[i]
    
    try {
      // Kişiselleştirme dosyaları için her zaman guest endpoint kullan
      const uploadResponse = await uploadService.uploadGuest(file, guestId, file.name)
      uploadedFileIds.push(uploadResponse.id)
    } catch (error: any) {
      console.error(`[PersonalizationHelper] Failed to upload file ${i + 1}/${allFiles.length}:`, {
        fileName: file.name,
        error: error.message
      })
      throw new Error(`Dosya yüklenemedi: ${file.name} - ${error.message || 'Bilinmeyen hata'}`)
    }
  }

  return uploadedFileIds
}

/**
 * Form değerlerini hazırla (File objelerini file ID'lere çevir)
 */
export function preparePersonalizationData(
  formValues: Record<string, any>,
  selectedFiles: Record<string, File[]>,
  uploadedFileIds: string[]
): {
  formValues: Record<string, any>
  fileIds: string[]
} {
  // Form değerlerini kopyala
  const preparedFormValues: Record<string, any> = { ...formValues }
  
  // File objelerini file ID'lere çevir
  let fileIdIndex = 0
  
  Object.entries(selectedFiles).forEach(([fieldKey, files]) => {
    if (Array.isArray(files) && files.length > 0) {
      // Bu field için kaç dosya var?
      const fileCount = files.length
      const fieldFileIds = uploadedFileIds.slice(fileIdIndex, fileIdIndex + fileCount)
      fileIdIndex += fileCount
      
      // Form değerinde File objelerini file ID'lere çevir
      if (fileCount === 1) {
        preparedFormValues[fieldKey] = fieldFileIds[0]
      } else {
        preparedFormValues[fieldKey] = fieldFileIds
      }
    }
  })
  
  return {
    formValues: preparedFormValues,
    fileIds: uploadedFileIds,
  }
}
