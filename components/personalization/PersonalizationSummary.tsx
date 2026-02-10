"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { Download, FileImage, Loader2 } from "lucide-react"
import { uploadService } from "@/services/upload.service"

interface PersonalizationSummaryProps {
  personalization: {
    form: {
      formId: string
      versionId: string
      title: string
      slug: string
    }
    schemaSnapshot: {
      fields: any[]
      conditions: any[]
    }
    userValues: Record<string, any>
    pricingBreakdown: Array<{
      fieldKey: string
      fieldTitle: string
      amount: number
      currency: string
    }>
    totalPersonalizationAmount: number
    currency: string
  }
  readOnly?: boolean
}

export function PersonalizationSummary({
  personalization,
  readOnly = false,
}: PersonalizationSummaryProps) {
  const { form, schemaSnapshot, userValues, pricingBreakdown, totalPersonalizationAmount } =
    personalization

  // State for file URLs (fileId -> url mapping)
  const [fileUrls, setFileUrls] = useState<Record<string, string>>({})
  const [loadingFiles, setLoadingFiles] = useState<Record<string, boolean>>({})

  // Get field definitions from schema
  const getFieldDefinition = (fieldKey: string) => {
    return schemaSnapshot.fields.find((f) => f.key === fieldKey)
  }

  // Load file URLs from file IDs
  useEffect(() => {
    const loadFileUrls = async () => {
      const fileIds: string[] = []
      const fileIdToFieldKey: Record<string, string> = {}

      // Collect all file IDs from userValues
      Object.entries(userValues).forEach(([fieldKey, value]) => {
        const field = getFieldDefinition(fieldKey)
        if (!field) return

        const isFileField =
          field.type === 'IMAGE_PICKER_SINGLE' ||
          field.type === 'IMAGE_PICKER_MULTI' ||
          field.type === 'FILE_UPLOAD_SINGLE' ||
          field.type === 'FILE_UPLOAD_MULTI'

        if (isFileField && value) {
          const ids = Array.isArray(value) ? value : [value]
          ids.forEach((id) => {
            if (typeof id === 'string' && !id.startsWith('http')) {
              // UUID formatında bir ID ise (dosya ID'si)
              const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
              if (uuidRegex.test(id)) {
                fileIds.push(id)
                fileIdToFieldKey[id] = fieldKey
              }
            }
          })
        }
      })

      // Unique file IDs
      const uniqueFileIds = [...new Set(fileIds)]

      if (uniqueFileIds.length === 0) return

      // Load file URLs
      setLoadingFiles((prev) => {
        const newState = { ...prev }
        uniqueFileIds.forEach((id) => {
          newState[id] = true
        })
        return newState
      })

      try {
        const urlPromises = uniqueFileIds.map(async (fileId) => {
          try {
            const upload = await uploadService.getUpload(fileId)
            return { fileId, url: upload.url }
          } catch (error) {
            console.error(`Failed to load file ${fileId}:`, error)
            return { fileId, url: null }
          }
        })

        const results = await Promise.all(urlPromises)
        const urlMap: Record<string, string> = {}
        results.forEach(({ fileId, url }) => {
          if (url) {
            urlMap[fileId] = url
          }
        })

        setFileUrls((prev) => ({ ...prev, ...urlMap }))
      } catch (error) {
        console.error('Failed to load file URLs:', error)
      } finally {
        setLoadingFiles((prev) => {
          const newState = { ...prev }
          uniqueFileIds.forEach((id) => {
            newState[id] = false
          })
          return newState
        })
      }
    }

    loadFileUrls()
  }, [userValues, schemaSnapshot])

  // Get file URL from file ID
  const getFileUrl = (fileId: string): string | null => {
    // Eğer zaten URL ise direkt döndür
    if (typeof fileId === 'string' && fileId.startsWith('http')) {
      return fileId
    }
    // File ID ise URL'den al
    return fileUrls[fileId] || null
  }

  // Render field value based on type
  const renderFieldValue = (fieldKey: string, value: any) => {
    const field = getFieldDefinition(fieldKey)
    if (!field) return String(value)

    switch (field.type) {
      case "IMAGE_PICKER_SINGLE":
      case "FILE_UPLOAD_SINGLE":
        const singleFileId = value
        const singleUrl = getFileUrl(singleFileId)
        const isLoadingSingle = typeof singleFileId === 'string' && !singleFileId.startsWith('http') && loadingFiles[singleFileId]

        if (isLoadingSingle) {
          return (
            <div className="mt-2 flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin text-muted-foreground shrink-0" />
              <span className="text-xs sm:text-sm text-muted-foreground">Yükleniyor...</span>
            </div>
          )
        }

        if (singleUrl) {
          const isImage = field.type.includes('IMAGE')
          return (
            <div className="mt-2 overflow-hidden">
              {isImage ? (
                <div className="inline-block max-w-full overflow-hidden">
                  <img
                    src={singleUrl}
                    alt={field.title}
                    className="rounded-lg object-contain max-h-20 sm:max-h-24 w-auto max-w-full"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2 p-2 border rounded-lg overflow-hidden">
                  <FileImage className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground shrink-0" />
                  <a
                    href={singleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs sm:text-sm text-primary hover:underline truncate flex-1 min-w-0"
                  >
                    Dosyayı Görüntüle
                  </a>
                </div>
              )}
            </div>
          )
        }
        return <span className="text-xs sm:text-sm text-muted-foreground">Dosya yüklendi</span>

      case "IMAGE_PICKER_MULTI":
      case "FILE_UPLOAD_MULTI":
        if (Array.isArray(value)) {
          const isImage = field.type.includes('IMAGE')
          const hasLoading = value.some(
            (id) => typeof id === 'string' && !id.startsWith('http') && loadingFiles[id]
          )

          if (hasLoading) {
            return (
              <div className="mt-2 flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin text-muted-foreground shrink-0" />
                <span className="text-xs sm:text-sm text-muted-foreground">Yükleniyor...</span>
              </div>
            )
          }

          return (
            <div className="mt-2 flex gap-2 flex-wrap overflow-hidden">
              {value.map((fileId, idx) => {
                const url = getFileUrl(fileId)
                return (
                  <div key={idx} className="h-16 sm:h-20 inline-block max-w-full shrink-0">
                    {url ? (
                      isImage ? (
                        <img
                          src={url}
                          alt={`${field.title} ${idx + 1}`}
                          className="rounded-lg object-contain max-h-16 sm:max-h-20 w-auto max-w-full"
                        />
                      ) : (
                        <div className="h-16 w-16 sm:h-20 sm:w-20 border rounded-lg flex items-center justify-center bg-muted">
                          <FileImage className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
                        </div>
                      )
                    ) : (
                      <div className="h-16 w-16 sm:h-20 sm:w-20 border rounded-lg flex items-center justify-center bg-muted">
                        <FileImage className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )
        }
        return <span className="text-xs sm:text-sm text-muted-foreground">Dosyalar yüklendi</span>

      case "COLOR_PICKER":
        return (
          <div className="flex items-center gap-2 mt-2 overflow-hidden">
            <div
              className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-border shrink-0"
              style={{ backgroundColor: value }}
            />
            <span className="text-xs sm:text-sm truncate flex-1 min-w-0">{value}</span>
          </div>
        )

      case "CHECKBOX":
      case "TOGGLE":
        return (
          <Badge variant={value ? "default" : "secondary"} className="mt-2 text-xs">
            {value ? "Evet" : "Hayır"}
          </Badge>
        )

      case "MULTISELECT":
        if (Array.isArray(value)) {
          return (
            <div className="mt-2 flex flex-wrap gap-1.5 sm:gap-2">
              {value.map((v, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  <span className="break-words">{v}</span>
                </Badge>
              ))}
            </div>
          )
        }
        return <span className="text-xs sm:text-sm break-words">{String(value)}</span>

      case "DIMENSIONS":
        if (typeof value === "object" && value !== null) {
          return (
            <div className="mt-2 text-xs sm:text-sm flex flex-wrap gap-2 sm:gap-4">
              {value.width && <span>Genişlik: {value.width}cm</span>}
              {value.height && <span>Yükseklik: {value.height}cm</span>}
              {value.depth && <span>Derinlik: {value.depth}cm</span>}
            </div>
          )
        }
        return <span className="text-xs sm:text-sm break-words">{String(value)}</span>

      default:
        return <span className="text-xs sm:text-sm break-words">{String(value)}</span>
    }
  }

  return (
    <Card className="mt-0 sm:mt-0 overflow-hidden w-full max-w-full">
      <CardHeader className="p-3 sm:p-6">
        <CardTitle className="text-sm sm:text-base">Kişiselleştirme</CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-6 pt-0 space-y-3 sm:space-y-4">
        {/* Form Info */}
        <div className="text-xs sm:text-sm text-muted-foreground">
          <span className="font-medium break-words">{form.title}</span>
        </div>

        {/* User Values */}
        {Object.keys(userValues).length > 0 && (
          <div className="space-y-2 sm:space-y-3">
            {Object.entries(userValues).map(([fieldKey, value]) => {
              const field = getFieldDefinition(fieldKey)
              if (!field || (value === null || value === undefined || value === "")) return null

              return (
                <div key={fieldKey} className="border-b pb-2 sm:pb-3 last:border-0 overflow-hidden">
                  <div className="text-xs sm:text-sm font-medium text-foreground break-words">{field.title}</div>
                  {field.subtitle && (
                    <div className="text-xs text-muted-foreground mb-1 break-words">{field.subtitle}</div>
                  )}
                  <div className="mt-1 overflow-hidden">{renderFieldValue(fieldKey, value)}</div>
                </div>
              )
            })}
          </div>
        )}

        {/* Pricing Breakdown */}
        {pricingBreakdown.length > 0 && (
          <div className="pt-3 sm:pt-4 border-t">
            <h4 className="text-xs sm:text-sm font-medium text-foreground mb-2">
              Kişiselleştirme Fiyatlandırması
            </h4>
            <div className="space-y-1">
              {pricingBreakdown.map((item) => (
                <div key={item.fieldKey} className="flex justify-between text-xs sm:text-sm gap-2">
                  <span className="text-muted-foreground truncate flex-1 min-w-0">{item.fieldTitle}:</span>
                  <span className="font-medium shrink-0">
                    +{item.amount.toLocaleString("tr-TR")} ₺
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t flex justify-between text-xs sm:text-sm font-semibold gap-2">
              <span className="truncate flex-1 min-w-0">Toplam Kişiselleştirme:</span>
              <span className="shrink-0">+{totalPersonalizationAmount.toLocaleString("tr-TR")} ₺</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
