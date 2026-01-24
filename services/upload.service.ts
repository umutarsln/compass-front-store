import { api } from './api';

export interface UploadResponse {
  id: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  createdAt: string;
}

class UploadService {
  private endpoint = '/uploads';

  /**
   * Guest kullanıcılar için dosya yükleme
   */
  async uploadGuest(
    file: File,
    guestId: string,
    displayName?: string,
  ): Promise<UploadResponse> {
    console.log('[UploadService] uploadGuest called', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      guestId,
      displayName,
      apiUrl: process.env.NEXT_PUBLIC_API_URL,
      endpoint: `${this.endpoint}/guest`
    })

    const formData = new FormData();
    formData.append('file', file);
    if (displayName) {
      formData.append('displayName', displayName);
    }
    // guestId sadece header'da gönderilmeli, body'de değil

    const url = `${process.env.NEXT_PUBLIC_API_URL}${this.endpoint}/guest`
    console.log('[UploadService] Making request to:', url)

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        headers: {
          'x-guest-id': guestId, // Sadece header'da gönder
        },
      });

      console.log('[UploadService] Response received', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      })

      if (!response.ok) {
        let errorMessage = 'Dosya yüklenemedi'
        try {
          const error = await response.json()
          errorMessage = error.message || errorMessage
          console.error('[UploadService] Error response:', error)
        } catch (parseError) {
          const text = await response.text()
          console.error('[UploadService] Error response (text):', text)
          errorMessage = text || errorMessage
        }
        throw new Error(errorMessage);
      }

      const data = await response.json()
      console.log('[UploadService] Upload successful', { data })
      return data
    } catch (error: any) {
      console.error('[UploadService] Upload failed', {
        error,
        errorMessage: error.message,
        errorStack: error.stack,
        errorName: error.name
      })
      throw error
    }
  }

  /**
   * Authenticated kullanıcılar için dosya yükleme
   */
  async upload(
    file: File,
    displayName?: string,
  ): Promise<UploadResponse> {
    console.log('[UploadService] upload called', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      displayName,
      apiUrl: process.env.NEXT_PUBLIC_API_URL,
      endpoint: this.endpoint
    })

    const formData = new FormData();
    formData.append('file', file);
    if (displayName) {
      formData.append('displayName', displayName);
    }

    const token = localStorage.getItem('auth_token');
    console.log('[UploadService] Auth token exists:', !!token)

    const url = `${process.env.NEXT_PUBLIC_API_URL}${this.endpoint}`
    console.log('[UploadService] Making request to:', url)

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      });

      console.log('[UploadService] Response received', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      })

      if (!response.ok) {
        let errorMessage = 'Dosya yüklenemedi'
        try {
          const error = await response.json()
          errorMessage = error.message || errorMessage
          console.error('[UploadService] Error response:', error)
        } catch (parseError) {
          const text = await response.text()
          console.error('[UploadService] Error response (text):', text)
          errorMessage = text || errorMessage
        }
        throw new Error(errorMessage);
      }

      const data = await response.json()
      console.log('[UploadService] Upload successful', { data })
      return data
    } catch (error: any) {
      console.error('[UploadService] Upload failed', {
        error,
        errorMessage: error.message,
        errorStack: error.stack
      })
      throw error
    }
  }

  /**
   * Upload detayını ID ile getir
   */
  async getUpload(id: string): Promise<UploadResponse> {
    const token = localStorage.getItem('auth_token');
    const guestId = localStorage.getItem('guest_id');
    
    const headers: HeadersInit = {}
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
    if (guestId && !token) {
      headers['x-guest-id'] = guestId
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/uploads/${id}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Dosya bulunamadı');
    }

    const data = await response.json();
    return {
      id: data.id,
      fileName: data.filename,
      originalName: data.filename,
      mimeType: data.mimeType,
      size: data.size,
      url: data.s3Url,
      createdAt: data.createdAt,
    };
  }
}

export const uploadService = new UploadService();
