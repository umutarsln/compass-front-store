import { api } from "./api"
import { AxiosResponse } from "axios"

export interface PersonalizationFormData {
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

export interface ValidatePersonalizationResponse {
  valid: boolean
  message: string
}

class PersonalizationService {
  private endpoint = "/personalization"

  async getProductPersonalizationForm(
    productId: string,
  ): Promise<PersonalizationFormData | null> {
    try {
      const response: AxiosResponse<PersonalizationFormData | null> = await api.get(
        `${this.endpoint}/products/${productId}`,
      )
      return response.data
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null
      }
      throw error
    }
  }

  async validatePersonalization(
    productId: string,
    variantId: string | undefined,
    formValues: Record<string, any>,
    fileIds?: string[],
  ): Promise<ValidatePersonalizationResponse> {
    const response: AxiosResponse<ValidatePersonalizationResponse> = await api.post(
      `${this.endpoint}/validate`,
      {
        productId,
        variantId,
        formValues,
        fileIds,
      },
    )
    return response.data
  }
}

export const personalizationService = new PersonalizationService()
