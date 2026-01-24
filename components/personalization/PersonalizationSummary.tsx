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
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Yükleniyor...</span>
            </div>
          )
        }

        if (singleUrl) {
          const isImage = field.type.includes('IMAGE')
          return (
            <div className="mt-2">
              {isImage ? (
                <div className="h-24 inline-block">
                  <img
                    src={singleUrl}
                    alt={field.title}
                    className="rounded-lg object-contain h-24 w-auto max-w-full"
                    style={{ height: '96px', width: 'auto' }}
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2 p-2 border rounded-lg">
                  <FileImage className="w-5 h-5 text-muted-foreground" />
                  <a
                    href={singleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    Dosyayı Görüntüle
                  </a>
                </div>
              )}
            </div>
          )
        }
        return <span className="text-sm text-muted-foreground">Dosya yüklendi</span>

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
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Yükleniyor...</span>
              </div>
            )
          }

          return (
            <div className="mt-2 flex gap-2 flex-wrap">
              {value.map((fileId, idx) => {
                const url = getFileUrl(fileId)
                return (
                  <div key={idx} className="h-20 inline-block">
                    {url ? (
                      isImage ? (
                        <img
                          src={url}
                          alt={`${field.title} ${idx + 1}`}
                          className="rounded-lg object-contain h-20 w-auto max-w-full"
                          style={{ height: '80px', width: 'auto' }}
                        />
                      ) : (
                        <div className="h-20 w-20 border rounded-lg flex items-center justify-center bg-muted">
                          <FileImage className="w-8 h-8 text-muted-foreground" />
                        </div>
                      )
                    ) : (
                      <div className="h-20 w-20 border rounded-lg flex items-center justify-center bg-muted">
                        <FileImage className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )
        }
        return <span className="text-sm text-muted-foreground">Dosyalar yüklendi</span>

      case "COLOR_PICKER":
        return (
          <div className="flex items-center gap-2 mt-2">
            <div
              className="w-6 h-6 rounded-full border border-border"
              style={{ backgroundColor: value }}
            />
            <span className="text-sm">{value}</span>
          </div>
        )

      case "CHECKBOX":
      case "TOGGLE":
        return (
          <Badge variant={value ? "default" : "secondary"} className="mt-2">
            {value ? "Evet" : "Hayır"}
          </Badge>
        )

      case "MULTISELECT":
        if (Array.isArray(value)) {
          return (
            <div className="mt-2 flex flex-wrap gap-2">
              {value.map((v, idx) => (
                <Badge key={idx} variant="outline">
                  {v}
                </Badge>
              ))}
            </div>
          )
        }
        return String(value)

      case "DIMENSIONS":
        if (typeof value === "object" && value !== null) {
          return (
            <div className="mt-2 text-sm">
              {value.width && <span>Genişlik: {value.width}cm</span>}
              {value.height && <span className="ml-4">Yükseklik: {value.height}cm</span>}
              {value.depth && <span className="ml-4">Derinlik: {value.depth}cm</span>}
            </div>
          )
        }
        return String(value)

      default:
        return <span className="text-sm">{String(value)}</span>
    }
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-base">Kişiselleştirme</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Form Info */}
        <div className="text-sm text-muted-foreground">
          <span className="font-medium">{form.title}</span>
        </div>

        {/* User Values */}
        {Object.keys(userValues).length > 0 && (
          <div className="space-y-3">
            {Object.entries(userValues).map(([fieldKey, value]) => {
              const field = getFieldDefinition(fieldKey)
              if (!field || (value === null || value === undefined || value === "")) return null

              return (
                <div key={fieldKey} className="border-b pb-3 last:border-0">
                  <div className="text-sm font-medium text-foreground">{field.title}</div>
                  {field.subtitle && (
                    <div className="text-xs text-muted-foreground mb-1">{field.subtitle}</div>
                  )}
                  <div className="mt-1">{renderFieldValue(fieldKey, value)}</div>
                </div>
              )
            })}
          </div>
        )}

        {/* Pricing Breakdown */}
        {pricingBreakdown.length > 0 && (
          <div className="pt-4 border-t">
            <h4 className="text-sm font-medium text-foreground mb-2">
              Kişiselleştirme Fiyatlandırması
            </h4>
            <div className="space-y-1">
              {pricingBreakdown.map((item) => (
                <div key={item.fieldKey} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.fieldTitle}:</span>
                  <span className="font-medium">
                    +{item.amount.toLocaleString("tr-TR")} ₺
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t flex justify-between text-sm font-semibold">
              <span>Toplam Kişiselleştirme:</span>
              <span>+{totalPersonalizationAmount.toLocaleString("tr-TR")} ₺</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
