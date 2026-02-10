"use client"

import { useState, useCallback, useRef, useEffect, useMemo, startTransition } from "react"
import { useDropzone } from "react-dropzone"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Upload, X, Loader2, Check, FileImage } from "lucide-react"
import { uploadService } from "@/services/upload.service"
import Image from "next/image"
import { Button } from "@/components/ui/button"

interface FieldRendererProps {
  field: {
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
  }
  value: any
  error?: string
  onChange: (value: any) => void
  onFileSelect?: (files: File[]) => void
  existingFiles?: Array<{ id: string; url: string }> // Existing files with IDs and URLs (from cart/order)
  onRemoveExistingFile?: (fileId: string) => void // Callback to remove an existing file
  isLoadingExistingFiles?: boolean // Loading state for existing files
}

export function FieldRenderer({
  field,
  value,
  error,
  onChange,
  onFileSelect,
  existingFiles = [],
  onRemoveExistingFile,
  isLoadingExistingFiles = false,
}: FieldRendererProps) {
  const [uploadErrors, setUploadErrors] = useState<Record<string, string>>({})
  const [selectedFiles, setSelectedFiles] = useState<Array<{ file: File; preview: string }>>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const selectedFilesRef = useRef<Array<{ file: File; preview: string }>>([])
  const pendingCallbacksRef = useRef<Array<{ onChange?: any; onFileSelect?: File[] }>>([])
  
  // Keep ref in sync with state
  useEffect(() => {
    selectedFilesRef.current = selectedFiles
  }, [selectedFiles])

  // Process pending callbacks after state updates
  useEffect(() => {
    if (pendingCallbacksRef.current.length > 0) {
      const callbacks = pendingCallbacksRef.current.shift()
      if (callbacks) {
        if (callbacks.onChange !== undefined) {
          onChange(callbacks.onChange)
        }
        if (callbacks.onFileSelect && onFileSelect) {
          onFileSelect(callbacks.onFileSelect)
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFiles])

  const handleFileSelect = useCallback((files: File[]) => {
    console.log('[FieldRenderer] handleFileSelect called', { files: files.length, fieldKey: field.key })
    const isMulti = field.type.includes('MULTI')
    const maxFiles = field.config?.maxFileCount
    const minFiles = field.config?.minFileCount
    const allowedTypes = Array.isArray(field.config?.allowedMimeTypes) 
      ? field.config.allowedMimeTypes 
      : []
    const maxSize = field.config?.maxFileSize ? field.config.maxFileSize * 1024 * 1024 : undefined

    // Validate file count (consider both existing and new files)
    if (isMulti) {
      const existingCount = existingFiles.length || 0
      // Use ref to get the most current value (avoids stale closure)
      const currentCount = selectedFilesRef.current.length
      const newCount = currentCount + files.length
      const totalCount = existingCount + newCount

      // Check max file count (considering existing files)
      if (maxFiles && totalCount > maxFiles) {
        setUploadErrors((prev) => ({
          ...prev,
          [field.key]: `Maksimum ${maxFiles} dosya seçilebilir`,
        }))
        return // Validation failed, don't proceed
      }
    } else if (files.length > 1) {
      setUploadErrors((prev) => ({
        ...prev,
        [field.key]: 'Sadece bir dosya seçebilirsiniz',
      }))
      return
    }

    // Validate file types and sizes
    for (const file of files) {
      if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
        setUploadErrors((prev) => ({
          ...prev,
          [field.key]: `Desteklenmeyen dosya tipi`,
        }))
        return
      }

      if (maxSize && file.size > maxSize) {
        setUploadErrors((prev) => ({
          ...prev,
          [field.key]: `Maksimum ${field.config.maxFileSize}MB`,
        }))
        return
      }
    }

    // Clear errors
    setUploadErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[field.key]
      return newErrors
    })

    // Store files locally with preview URLs
    const newFiles = files.map((file) => ({
      file,
      preview: field.type.includes('IMAGE') ? URL.createObjectURL(file) : '',
    }))

    if (isMulti) {
      // For MULTI: Add new files to existing ones
      // Calculate the updated files first
      const updated = [...selectedFilesRef.current, ...newFiles]
      const currentFileObjects = updated.map((f) => f.file)
      
      // Update state
      setSelectedFiles(updated)
      selectedFilesRef.current = updated
      
      // Queue callbacks to be called after state update completes
      pendingCallbacksRef.current.push({
        onChange: currentFileObjects,
        onFileSelect: currentFileObjects,
      })
    } else {
      // For SINGLE: Replace existing file
      // Revoke previous preview URL
      if (selectedFilesRef.current[0]?.preview) {
        URL.revokeObjectURL(selectedFilesRef.current[0].preview)
      }
      
      // Update state
      setSelectedFiles(newFiles)
      selectedFilesRef.current = newFiles
      
      // Queue callbacks to be called after state update completes
      pendingCallbacksRef.current.push({
        onChange: files[0],
        onFileSelect: [files[0]],
      })
    }
  }, [field, existingFiles, onChange, onFileSelect])

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      console.log('[FieldRenderer] onDrop called', { files: acceptedFiles.length })
      handleFileSelect(acceptedFiles)
    },
    [handleFileSelect],
  )

  // Calculate maxFiles for useDropzone (considering existing files)
  const maxFilesForDropzone = useMemo(() => {
    if (!field.type.includes('MULTI') || !field.config?.maxFileCount) {
      return undefined
    }
    const existingCount = existingFiles.length || 0
    const currentSelectedCount = selectedFiles.length
    const availableSlots = field.config.maxFileCount - existingCount - currentSelectedCount
    return Math.max(0, availableSlots) // Don't allow negative values
  }, [field.type, field.config?.maxFileCount, existingFiles.length, selectedFiles.length])

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: field.type.includes('IMAGE')
      ? { 'image/*': [] }
      : Array.isArray(field.config?.allowedMimeTypes) && field.config.allowedMimeTypes.length > 0
        ? Object.fromEntries(field.config.allowedMimeTypes.map((type: string) => [type, []]))
        : undefined,
    multiple: field.type.includes('MULTI'),
    maxFiles: maxFilesForDropzone, // Use calculated maxFiles that considers existing files
    disabled: false,
    noClick: true, // Disable default click behavior, we'll handle it manually
    noKeyboard: false,
  })

  const handleClick = useCallback(() => {
    console.log('[FieldRenderer] handleClick called', {
      fieldKey: field.key,
      isDragActive,
      hasOpen: !!open,
      openType: typeof open
    })
    if (!isDragActive && open && typeof open === 'function') {
      console.log('[FieldRenderer] Opening file dialog')
      try {
        open()
      } catch (error) {
        console.error('[FieldRenderer] Error opening file dialog:', error)
      }
    } else {
      console.log('[FieldRenderer] Cannot open dialog', {
        isDragActive,
        hasOpen: !!open,
        openType: typeof open
      })
      // Fallback: try to click the input directly
      if (fileInputRef.current) {
        console.log('[FieldRenderer] Trying to click input directly')
        fileInputRef.current.click()
      }
    }
  }, [field.key, isDragActive, open])

  const removeFile = (index: number) => {
    const fileToRemove = selectedFiles[index]
    if (fileToRemove?.preview) {
      URL.revokeObjectURL(fileToRemove.preview)
    }

    if (field.type.includes('MULTI')) {
      // Calculate new files first
      const newFiles = selectedFiles.filter((_, i) => i !== index)
      const fileObjects = newFiles.map((f) => f.file)
      
      // Update state
      setSelectedFiles(newFiles)
      selectedFilesRef.current = newFiles
      
      // Queue callbacks to be called after state update completes
      pendingCallbacksRef.current.push({
        onChange: fileObjects,
        onFileSelect: fileObjects,
      })
    } else {
      // Update state
      setSelectedFiles([])
      selectedFilesRef.current = []
      
      // Queue callbacks to be called after state update completes
      pendingCallbacksRef.current.push({
        onChange: null,
        onFileSelect: [],
      })
    }
  }

  // Initialize selectedFiles from value prop
  useEffect(() => {
    if (value) {
      const files = field.type.includes('MULTI')
        ? (Array.isArray(value) ? value : [])
        : [value]

      // Check if value contains File objects
      if (files.length > 0 && files[0] instanceof File) {
        const fileData = files.map((file: File) => ({
          file,
          preview: field.type.includes('IMAGE') ? URL.createObjectURL(file) : '',
        }))
        setSelectedFiles(fileData)
      }
    } else {
      setSelectedFiles([])
    }
  }, [value, field.type])

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      selectedFiles.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview)
        }
      })
    }
  }, [selectedFiles])

  const renderField = () => {
    switch (field.type) {
      case "TEXT":
      case "EMAIL":
      case "PHONE":
        return (
          <Input
            type={
              field.type === "EMAIL"
                ? "email"
                : field.type === "PHONE"
                  ? "tel"
                  : "text"
            }
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.helperText || ""}
            className={`text-sm lg:text-base py-2 lg:py-2.5 ${error ? "border-red-500" : ""}`}
          />
        )

      case "TEXTAREA":
        return (
          <Textarea
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.helperText || ""}
            className={`text-sm lg:text-base py-2 lg:py-2.5 ${error ? "border-red-500" : ""}`}
            rows={3}
          />
        )

      case "NUMBER":
        return (
          <Input
            type="number"
            value={value || ""}
            onChange={(e) => onChange(Number(e.target.value))}
            placeholder={field.helperText || ""}
            className={`text-sm lg:text-base py-2 lg:py-2.5 ${error ? "border-red-500" : ""}`}
            min={field.validationRules?.min}
            max={field.validationRules?.max}
          />
        )

      case "SELECT":
        const selectOptions = field.config?.options || []
        return (
          <Select
            value={value || ""}
            onValueChange={onChange}
          >
            <SelectTrigger className={error ? "border-red-500" : ""}>
              <SelectValue placeholder={field.helperText || "Seçiniz"} />
            </SelectTrigger>
            <SelectContent>
              {selectOptions.map((option: string) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case "MULTISELECT":
        const multiOptions = field.config?.options || []
        const selectedValues = Array.isArray(value) ? value : []
        return (
          <div className="space-y-2">
            {multiOptions.map((option: string) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={`${field.key}-${option}`}
                  checked={selectedValues.includes(option)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      onChange([...selectedValues, option])
                    } else {
                      onChange(selectedValues.filter((v) => v !== option))
                    }
                  }}
                />
                <Label
                  htmlFor={`${field.key}-${option}`}
                  className="cursor-pointer"
                >
                  {option}
                </Label>
              </div>
            ))}
          </div>
        )

      case "RADIO":
        const radioOptions = field.config?.options || []
        return (
          <RadioGroup
            value={value || ""}
            onValueChange={onChange}
          >
            {radioOptions.map((option: string) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${field.key}-${option}`} />
                <Label htmlFor={`${field.key}-${option}`} className="cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )

      case "CHECKBOX":
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={field.key}
              checked={value || false}
              onCheckedChange={onChange}
            />
            <Label htmlFor={field.key} className="cursor-pointer text-xs lg:text-sm">
              {field.title}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
          </div>
        )

      case "TOGGLE":
        return (
          <div className="flex items-center space-x-2">
            <Switch
              id={field.key}
              checked={value || false}
              onCheckedChange={onChange}
            />
            <Label htmlFor={field.key} className="cursor-pointer text-xs lg:text-sm">
              {field.title}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
          </div>
        )

      case "COLOR_PICKER":
        return (
          <div className="flex gap-2">
            <Input
              type="color"
              value={value || "#000000"}
              onChange={(e) => onChange(e.target.value)}
              className="w-20 h-10"
            />
            <Input
              type="text"
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              placeholder="#000000"
              className={error ? "border-red-500" : ""}
            />
          </div>
        )

      case "DATE":
        return (
          <Input
            type="date"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className={error ? "border-red-500" : ""}
          />
        )

      case "TIME":
        return (
          <Input
            type="time"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className={error ? "border-red-500" : ""}
          />
        )

      case "RANGE_SLIDER":
        const min = field.config?.min || 0
        const max = field.config?.max || 100
        return (
          <div className="space-y-2">
            <input
              type="range"
              min={min}
              max={max}
              value={value || min}
              onChange={(e) => onChange(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-center text-sm font-medium text-foreground">
              {value || min}
            </div>
          </div>
        )

      case "DIMENSIONS":
        return (
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Input
                type="number"
                value={value?.width || ""}
                onChange={(e) =>
                  onChange({
                    ...value,
                    width: Number(e.target.value),
                  })
                }
                placeholder="Genişlik"
              />
            </div>
            <div>
              <Input
                type="number"
                value={value?.height || ""}
                onChange={(e) =>
                  onChange({
                    ...value,
                    height: Number(e.target.value),
                  })
                }
                placeholder="Yükseklik"
              />
            </div>
            <div>
              <Input
                type="number"
                value={value?.depth || ""}
                onChange={(e) =>
                  onChange({
                    ...value,
                    depth: Number(e.target.value),
                  })
                }
                placeholder="Derinlik"
              />
            </div>
          </div>
        )

      case "IMAGE_PICKER_SINGLE":
      case "IMAGE_PICKER_MULTI":
      case "FILE_UPLOAD_SINGLE":
      case "FILE_UPLOAD_MULTI":
        const isMulti = field.type.includes("MULTI")
        const isImageType = field.type.includes("IMAGE")

        return (
          <div className="space-y-3">
            {/* Drag & Drop Area */}
            <div
              {...getRootProps()}
              onClick={(e) => {
                console.log('[FieldRenderer] Root div clicked', {
                  isDragActive,
                  hasOpen: !!open,
                  eventType: e.type,
                  target: e.target
                })
                e.preventDefault()
                e.stopPropagation()
                handleClick()
              }}
              className={`
                relative border-2 border-dashed rounded-lg p-3 lg:p-4 text-center cursor-pointer transition-all
                ${isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}
                ${error ? "border-red-500" : ""}
              `}
            >
              <input
                {...getInputProps()}
                ref={fileInputRef}
                style={{ position: 'absolute', opacity: 0, width: '100%', height: '100%', cursor: 'pointer', zIndex: 1 }}
                onChange={(e) => {
                  console.log('[FieldRenderer] Input onChange', {
                    files: e.target.files?.length,
                    isMulti,
                    currentSelected: selectedFiles.length
                  })
                  if (e.target.files && e.target.files.length > 0) {
                    const newFiles = Array.from(e.target.files)
                    handleFileSelect(newFiles)
                  }
                  // Reset input value to allow selecting the same file again
                  if (e.target) {
                    e.target.value = ''
                  }
                }}
              />
              <div className="flex flex-col items-center gap-1.5 lg:gap-2">
                <Upload className="w-5 h-5 lg:w-6 lg:h-6 text-muted-foreground" />
                <p className="text-xs lg:text-sm text-foreground">
                  {isDragActive ? "Bırakın" : "Sürükleyin veya tıklayın"}
                </p>
              </div>
            </div>

            {/* Existing Files Preview (from cart/order) */}
            {existingFiles.length > 0 && (
              <div className="space-y-2 overflow-x-hidden">
                <Label className="text-xs text-muted-foreground">Yüklenmiş</Label>
                {isLoadingExistingFiles ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 overflow-x-hidden">
                    {existingFiles.map((file, index) => (
                      <div
                        key={file.id}
                        className="relative group border rounded-lg overflow-hidden bg-muted"
                      >
                        {isImageType ? (
                          <div className="relative aspect-square">
                            <img
                              src={file.url}
                              alt={`Mevcut dosya ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="aspect-square flex items-center justify-center bg-muted">
                            <FileImage className="w-8 h-8 text-muted-foreground" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              if (onRemoveExistingFile) {
                                onRemoveExistingFile(file.id)
                              }
                            }}
                            className="h-8 w-8 p-0"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Selected Files Preview (newly selected) */}
            {selectedFiles.length > 0 && (
              <div className="space-y-2 overflow-x-hidden">
                <Label className="text-xs text-muted-foreground">Seçilen</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 overflow-x-hidden">
                  {selectedFiles.map((fileData, index) => (
                    <div
                      key={index}
                      className="relative group border rounded-lg overflow-hidden bg-muted"
                    >
                      {isImageType && fileData.preview ? (
                        <div className="relative aspect-square">
                          <Image
                            src={fileData.preview}
                            alt={fileData.file.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="aspect-square flex items-center justify-center bg-muted">
                          <Upload className="w-8 h-8 text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="h-8 w-8 p-0"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {uploadErrors[field.key] && (
              <Alert variant="destructive" className="py-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  {uploadErrors[field.key]}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )

      default:
        return (
          <Input
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.helperText || ""}
            className={error ? "border-red-500" : ""}
          />
        )
    }
  }

  return (
    <div className="space-y-1.5 lg:space-y-2">
      {field.type !== "CHECKBOX" && field.type !== "TOGGLE" && (
        <Label htmlFor={field.key} className="text-xs lg:text-sm font-medium">
          {field.title}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      {renderField()}
      {error && (
        <Alert variant="destructive" className="py-1.5 lg:py-2">
          <AlertCircle className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
          <AlertDescription className="text-xs lg:text-sm">{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
