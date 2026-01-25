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
  selectedFiles: Record<string, File[]>,
  cartId?: string | null
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
  
  console.log('[PersonalizationHelper] Starting file upload', {
    totalFiles: allFiles.length,
    guestId,
    cartId: cartId || 'not provided',
    fileNames: allFiles.map(f => f.name),
  })
  
  for (let i = 0; i < allFiles.length; i++) {
    const file = allFiles[i]
    
    console.log(`[PersonalizationHelper] Uploading file ${i + 1}/${allFiles.length}`, {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      guestId,
      cartId: cartId || undefined,
    })
    
    try {
      // Kişiselleştirme dosyaları için her zaman guest endpoint kullan
      // Cart ID varsa gönder (dosyalar Sepetler/{cartId} klasörüne yüklenecek)
      const uploadResponse = await uploadService.uploadGuest(file, guestId, file.name, cartId || undefined)
      console.log(`[PersonalizationHelper] File ${i + 1} uploaded successfully`, {
        fileName: file.name,
        uploadId: uploadResponse.id,
      })
      uploadedFileIds.push(uploadResponse.id)
    } catch (error: any) {
      console.error(`[PersonalizationHelper] Failed to upload file ${i + 1}/${allFiles.length}`, {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        error: error,
        errorMessage: error?.message,
        errorStack: error?.stack,
        errorName: error?.name,
        errorString: String(error),
        errorJSON: JSON.stringify(error, Object.getOwnPropertyNames(error)),
      })
      throw new Error(`Dosya yüklenemedi: ${file.name} - ${error?.message || error?.toString() || 'Bilinmeyen hata'}`)
    }
  }
  
  console.log('[PersonalizationHelper] All files uploaded successfully', {
    totalUploaded: uploadedFileIds.length,
    uploadedIds: uploadedFileIds,
  })

  return uploadedFileIds
}

/**
 * Form değerlerini hazırla (File objelerini file ID'lere çevir)
 * Mevcut dosyaları korur ve yeni dosyaları ekler
 */
export function preparePersonalizationData(
  formValues: Record<string, any>,
  selectedFiles: Record<string, File[]>,
  uploadedFileIds: string[],
  existingFileIds?: Record<string, string[]> // Mevcut dosya ID'leri (field key -> file IDs array)
): {
  formValues: Record<string, any>
  fileIds: string[]
} {
  // Form değerlerini kopyala
  const preparedFormValues: Record<string, any> = { ...formValues }
  
  // Tüm file ID'leri topla (mevcut + yeni)
  const allFileIds: string[] = []
  
  // File objelerini file ID'lere çevir ve mevcut dosyalarla birleştir
  let fileIdIndex = 0
  
  // Önce tüm field'ları bul (hem selectedFiles hem existingFileIds hem formValues'dan)
  const allFieldKeys = new Set([
    ...Object.keys(selectedFiles),
    ...(existingFileIds ? Object.keys(existingFileIds) : []),
    ...Object.keys(formValues)
  ])
  
  allFieldKeys.forEach((fieldKey) => {
    // Mevcut dosya ID'lerini bul (önce existingFileIds'den, yoksa formValues'dan)
    let existingIds: string[] = []
    
    if (existingFileIds?.[fieldKey]) {
      // existingFileIds parametresinden al
      existingIds = existingFileIds[fieldKey]
    } else {
      // formValues'dan al (eğer file ID ise)
      const formValue = formValues[fieldKey]
      if (formValue) {
        const ids = Array.isArray(formValue) ? formValue : [formValue]
        const validIds = ids.filter(
          (id) => typeof id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
        )
        existingIds = validIds
      }
    }
    
    const newFiles = selectedFiles[fieldKey] || []
    
    if (newFiles.length > 0) {
      // Yeni dosyalar var, onları yükle ve ID'lerini al
      const fileCount = newFiles.length
      const fieldNewFileIds = uploadedFileIds.slice(fileIdIndex, fileIdIndex + fileCount)
      fileIdIndex += fileCount
      
      // Mevcut dosyalar + yeni dosyalar
      const combinedFileIds = [...existingIds, ...fieldNewFileIds]
      allFileIds.push(...combinedFileIds)
      
      // Form değerine kaydet
      if (combinedFileIds.length === 1) {
        preparedFormValues[fieldKey] = combinedFileIds[0]
      } else {
        preparedFormValues[fieldKey] = combinedFileIds
      }
    } else if (existingIds.length > 0) {
      // Sadece mevcut dosyalar var, onları koru
      allFileIds.push(...existingIds)
      
      // Form değerine kaydet (zaten formValues'da olabilir, ama emin olmak için)
      if (existingIds.length === 1) {
        preparedFormValues[fieldKey] = existingIds[0]
      } else {
        preparedFormValues[fieldKey] = existingIds
      }
    }
  })
  
  return {
    formValues: preparedFormValues,
    fileIds: allFileIds,
  }
}
