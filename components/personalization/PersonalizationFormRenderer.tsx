"use client"

import { useState, useMemo, useEffect } from "react"
import { FieldRenderer } from "./FieldRenderer"
import { personalizationService } from "@/services/personalization.service"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle } from "lucide-react"

interface PersonalizationFormRendererProps {
  formData: {
    formId: string
    versionId: string
    version: number
    schemaSnapshot: {
      fields: Array<{
        id: string
        key: string
        title: string
        subtitle?: string | null
        helperText?: string | null
        required: boolean
        type: string
        defaultValue?: any
        validationRules?: any
        pricingRules?: any
        config?: any
        orderIndex: number
      }>
      conditions: Array<{
        id: string
        fieldId?: string | null
        ifJson: any
        thenJson: any
        orderIndex: number
      }>
    }
  }
  productId: string
  variantId?: string
  initialValues?: Record<string, any> // Optional: existing values from cart/order (may contain file IDs)
  initialFileIds?: Record<string, string[]> // Optional: existing file IDs per field key
}

export function PersonalizationFormRenderer({
  formData,
  productId,
  variantId,
  initialValues,
  initialFileIds,
}: PersonalizationFormRendererProps) {
  const [formValues, setFormValues] = useState<Record<string, any>>(initialValues || {})
  const [fileIds, setFileIds] = useState<string[]>([])
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File[]>>({}) // Store File objects locally
  const [existingFiles, setExistingFiles] = useState<Record<string, Array<{ id: string; url: string }>>>({}) // Store existing files (ID + URL)
  const [loadingExistingFiles, setLoadingExistingFiles] = useState<Record<string, boolean>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isValidating, setIsValidating] = useState(false)
  const [pricingBreakdown, setPricingBreakdown] = useState<
    Array<{ fieldKey: string; fieldTitle: string; amount: number }>
  >([])
  const [totalPersonalizationAmount, setTotalPersonalizationAmount] = useState(0)

  // Load initial values when they change
  useEffect(() => {
    if (initialValues) {
      setFormValues(initialValues)
    }
  }, [initialValues])

  // Load existing file URLs from file IDs
  useEffect(() => {
    const loadExistingFiles = async () => {
      // Extract file IDs from initialValues if initialFileIds not provided
      const fileIdsByField: Record<string, string[]> = {}

      if (initialFileIds) {
        // Use provided initialFileIds
        Object.assign(fileIdsByField, initialFileIds)
        console.log('[PersonalizationFormRenderer] Using initialFileIds:', initialFileIds)
      } else if (initialValues) {
        // Extract file IDs from initialValues
        formData.schemaSnapshot.fields.forEach((field) => {
          const value = initialValues[field.key]
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
        console.log('[PersonalizationFormRenderer] Extracted file IDs from initialValues:', fileIdsByField)
      }

      if (Object.keys(fileIdsByField).length === 0) {
        console.log('[PersonalizationFormRenderer] No file IDs found to load')
        return
      }

      console.log('[PersonalizationFormRenderer] Loading files for fields:', Object.keys(fileIdsByField))

      // Load file URLs
      setLoadingExistingFiles((prev) => {
        const newState = { ...prev }
        Object.keys(fileIdsByField).forEach((key) => {
          newState[key] = true
        })
        return newState
      })

      try {
        const { uploadService } = await import('@/services/upload.service')
        const urlPromises: Array<Promise<{ fieldKey: string; urls: string[] }>> = []

        Object.entries(fileIdsByField).forEach(([fieldKey, ids]) => {
          const promise = Promise.all(
            ids.map(async (fileId) => {
              try {
                console.log(`[PersonalizationFormRenderer] Loading file ${fileId} for field ${fieldKey}`)
                const upload = await uploadService.getUpload(fileId)
                // uploadService.getUpload returns { url: data.s3Url, ... }
                return upload.url
              } catch (error) {
                console.error(`[PersonalizationFormRenderer] Failed to load file ${fileId}:`, error)
                return null
              }
            })
          ).then((urls) => ({
            fieldKey,
            urls: urls.filter((url) => url !== null) as string[],
          }))
          urlPromises.push(promise)
        })

        const results = await Promise.all(urlPromises)
        const filesByField: Record<string, Array<{ id: string; url: string }>> = {}
        results.forEach(({ fieldKey, urls }) => {
          const fieldFileIds = fileIdsByField[fieldKey]
          filesByField[fieldKey] = urls.map((url, idx) => ({
            id: fieldFileIds[idx],
            url,
          }))
        })

        console.log('[PersonalizationFormRenderer] Loaded files:', filesByField)
        setExistingFiles(filesByField)
      } catch (error) {
        console.error('[PersonalizationFormRenderer] Failed to load existing files:', error)
      } finally {
        setLoadingExistingFiles((prev) => {
          const newState = { ...prev }
          Object.keys(fileIdsByField).forEach((key) => {
            newState[key] = false
          })
          return newState
        })
      }
    }

    loadExistingFiles()
  }, [initialFileIds, initialValues, formData.schemaSnapshot.fields])

  // Evaluate conditions to determine visible fields
  const visibleFields = useMemo(() => {
    let fields = [...(formData.schemaSnapshot.fields || [])]
    const requiredFields = new Set<string>()

    // Evaluate conditions
    for (const condition of formData.schemaSnapshot.conditions || []) {
      const ifClause = condition.ifJson
      const thenClause = condition.thenJson

      if (!ifClause || !thenClause) continue

      const conditionMet = evaluateIfClause(ifClause, formValues)

      if (conditionMet) {
        const action = thenClause.action
        const targetKeys = thenClause.targetFieldKeys || []

        for (const targetKey of targetKeys) {
          const targetField = fields.find((f) => f.key === targetKey)
          if (!targetField) continue

          if (action === "HIDE") {
            fields = fields.filter((f) => f.key !== targetKey)
            requiredFields.delete(targetKey)
          } else if (action === "REQUIRE") {
            requiredFields.add(targetKey)
            targetField.required = true
          }
        }
      }
    }

    // Update required status
    fields.forEach((field) => {
      if (requiredFields.has(field.key)) {
        field.required = true
      }
    })

    return fields.sort((a, b) => a.orderIndex - b.orderIndex)
  }, [formData.schemaSnapshot, formValues])

  // Calculate pricing when form values change
  useEffect(() => {
    calculatePricing()
  }, [formValues, formData.schemaSnapshot.fields])

  const evaluateIfClause = (ifClause: any, values: Record<string, any>): boolean => {
    const { fieldKey, operator, value } = ifClause

    if (!fieldKey || !operator) {
      return false
    }

    const fieldValue = values[fieldKey]

    switch (operator) {
      case "eq":
        return fieldValue === value
      case "neq":
        return fieldValue !== value
      case "in":
        return Array.isArray(value) && value.includes(fieldValue)
      case "filled":
        return fieldValue !== undefined && fieldValue !== null && fieldValue !== ""
      case "contains":
        return (
          typeof fieldValue === "string" &&
          typeof value === "string" &&
          fieldValue.includes(value)
        )
      default:
        return false
    }
  }

  const calculatePricing = () => {
    let breakdown: Array<{ fieldKey: string; fieldTitle: string; amount: number }> = []
    let total = 0

    for (const field of formData.schemaSnapshot.fields || []) {
      const pricingRules = field.pricingRules
      if (!pricingRules) continue

      const fieldValue = formValues[field.key]
      if (fieldValue === undefined || fieldValue === null || fieldValue === "") {
        continue
      }

      let amount = 0

      if (pricingRules.type === "FLAT_IF_FILLED") {
        amount = pricingRules.amount || 0
      } else if (pricingRules.type === "BY_OPTION") {
        const options = pricingRules.options || {}
        if (Array.isArray(fieldValue)) {
          for (const val of fieldValue) {
            if (options[val] !== undefined) {
              amount += options[val] || 0
            }
          }
        } else {
          if (options[fieldValue] !== undefined) {
            amount = options[fieldValue] || 0
          }
        }
      }

      if (amount > 0) {
        breakdown.push({
          fieldKey: field.key,
          fieldTitle: field.title,
          amount,
        })
        total += amount
      }
    }

    setPricingBreakdown(breakdown)
    setTotalPersonalizationAmount(Math.round(total * 100) / 100)
  }

  const handleFieldChange = (fieldKey: string, value: any) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldKey]: value,
    }))
    // Clear error for this field
    if (errors[fieldKey]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[fieldKey]
        return newErrors
      })
    }
  }

  const handleFileSelect = (fieldKey: string, files: File[]) => {
    // Store files locally (not uploaded yet)
    setSelectedFiles((prev) => ({
      ...prev,
      [fieldKey]: files,
    }))
    // Don't update formValues with File objects - keep existing file IDs in formValues
    // File objects are stored in selectedFiles state and will be uploaded separately
    // formValues should keep existing file IDs for validation
  }

  // Upload files and get file IDs - uses helper utility
  const uploadFiles = async (): Promise<string[]> => {
    const { uploadPersonalizationFiles } = await import('@/utils/personalization.helper')
    return await uploadPersonalizationFiles(selectedFiles)
  }

  const validateForm = async (): Promise<boolean> => {
    setIsValidating(true)
    setErrors({})

    try {
      // Check required fields
      const newErrors: Record<string, string> = {}
      for (const field of visibleFields) {
        if (field.required) {
          const value = formValues[field.key]
          // Check if it's a file field
          if (field.type.includes('FILE') || field.type.includes('IMAGE')) {
            // Count both existing files and newly selected files
            const existingCount = existingFiles[field.key]?.length || 0
            const newFiles = selectedFiles[field.key] || []
            const totalFileCount = existingCount + newFiles.length

            if (field.type.includes('MULTI')) {
              if (totalFileCount === 0) {
                newErrors[field.key] = `${field.title} zorunludur`
              }
            } else {
              if (totalFileCount === 0) {
                newErrors[field.key] = `${field.title} zorunludur`
              }
            }
          } else {
            if (value === undefined || value === null || value === "") {
              newErrors[field.key] = `${field.title} zorunludur`
            }
          }
        }
      }

      // Check file count requirements (consider both existing and new files)
      for (const field of visibleFields) {
        if (field.type.includes('MULTI') && field.config?.minFileCount) {
          const existingCount = existingFiles[field.key]?.length || 0
          const newFiles = selectedFiles[field.key] || []
          const totalFileCount = existingCount + newFiles.length

          if (totalFileCount < field.config.minFileCount) {
            newErrors[field.key] = `En az ${field.config.minFileCount} dosya seçmelisiniz (şu anda ${totalFileCount} dosya var)`
          }
        }
        if (field.type.includes('MULTI') && field.config?.maxFileCount) {
          const existingCount = existingFiles[field.key]?.length || 0
          const newFiles = selectedFiles[field.key] || []
          const totalFileCount = existingCount + newFiles.length

          if (totalFileCount > field.config.maxFileCount) {
            newErrors[field.key] = `En fazla ${field.config.maxFileCount} dosya seçebilirsiniz (şu anda ${totalFileCount} dosya var)`
          }
        }
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors)
        setIsValidating(false)
        return false
      }

      // Don't upload files here - just validate structure
      // Files will be uploaded when adding to cart
      setIsValidating(false)
      return true
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || "Form doğrulama hatası"
      setErrors({ _general: errorMessage })
      setIsValidating(false)
      return false
    }
  }

  // Expose form values and validation function to parent
  useEffect(() => {
    // This will be used by ProductDetail to get personalization data
    ; (window as any).__personalizationFormData = {
      formValues,
      fileIds,
      selectedFiles, // Expose selected files for upload
      pricingBreakdown,
      totalPersonalizationAmount,
      validate: validateForm,
      uploadFiles, // Expose upload function
    }
  }, [formValues, fileIds, selectedFiles, pricingBreakdown, totalPersonalizationAmount])

  return (
    <div className="mt-8 space-y-6 border-t pt-8 overflow-x-hidden">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Kişiselleştirme
        </h3>
        <p className="text-sm text-muted-foreground">
          Ürününüzü kişiselleştirmek için aşağıdaki formu doldurun.
        </p>
      </div>

      {errors._general && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errors._general}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-6 overflow-x-hidden">
        {visibleFields.map((field) => (
          <FieldRenderer
            key={field.id}
            field={field}
            value={formValues[field.key]}
            error={errors[field.key]}
            onChange={(value) => handleFieldChange(field.key, value)}
            onFileSelect={(files) => {
              handleFileSelect(field.key, files)
            }}
            existingFiles={existingFiles[field.key] || []}
            onRemoveExistingFile={(fileId) => {
              // Remove from existing files
              setExistingFiles((prev) => {
                const newFiles = [...(prev[field.key] || [])]
                const index = newFiles.findIndex((f) => f.id === fileId)
                if (index > -1) {
                  newFiles.splice(index, 1)
                }
                return {
                  ...prev,
                  [field.key]: newFiles,
                }
              })
              // Update form values to remove the file ID
              const currentValue = formValues[field.key]
              if (Array.isArray(currentValue)) {
                const newValue = currentValue.filter((id) => id !== fileId)
                handleFieldChange(field.key, newValue.length > 0 ? newValue : null)
              } else {
                handleFieldChange(field.key, null)
              }
            }}
            isLoadingExistingFiles={loadingExistingFiles[field.key] || false}
          />
        ))}
      </div>

      {pricingBreakdown.length > 0 && (
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="text-sm font-medium text-foreground mb-2">
            Kişiselleştirme Fiyatlandırması
          </h4>
          <div className="space-y-1">
            {pricingBreakdown.map((item) => (
              <div
                key={item.fieldKey}
                className="flex justify-between text-sm"
              >
                <span className="text-muted-foreground">{item.fieldTitle}:</span>
                <span className="font-medium">
                  +{item.amount.toLocaleString("tr-TR")} ₺
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t flex justify-between text-base font-semibold">
            <span>Toplam Kişiselleştirme:</span>
            <span>+{totalPersonalizationAmount.toLocaleString("tr-TR")} ₺</span>
          </div>
        </div>
      )}
    </div>
  )
}
