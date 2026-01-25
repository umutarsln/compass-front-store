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
    cartId?: string,
  ): Promise<UploadResponse> {
    console.log('[UploadService] uploadGuest called', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      guestId,
      displayName,
      cartId,
      apiUrl: process.env.NEXT_PUBLIC_API_URL,
      endpoint: `${this.endpoint}/guest`
    })

    const formData = new FormData();
    formData.append('file', file);
    if (displayName) {
      formData.append('displayName', displayName);
    }
    // guestId ve cartId sadece header'da gönderilmeli, body'de değil

    const url = `${process.env.NEXT_PUBLIC_API_URL}${this.endpoint}/guest`
    console.log('[UploadService] Making request to:', url)

    const headers: Record<string, string> = {
      'x-guest-id': guestId, // Sadece header'da gönder
    };
    
    // Cart ID varsa header'a ekle
    if (cartId) {
      headers['x-cart-id'] = cartId;
    }

    try {
      console.log('[UploadService] Sending request', {
        url,
        method: 'POST',
        hasFile: !!file,
        fileName: file.name,
        fileSize: file.size,
        headers: Object.keys(headers),
        guestId,
        cartId: cartId || 'not provided',
      })

      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        headers,
      });

      console.log('[UploadService] Response received', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        statusCode: response.status,
        headers: Object.fromEntries(response.headers.entries())
      })

      if (!response.ok) {
        let errorMessage = 'Dosya yüklenemedi'
        let errorData: any = null
        
        try {
          const contentType = response.headers.get('content-type')
          console.log('[UploadService] Error response content-type:', contentType)
          
          if (contentType && contentType.includes('application/json')) {
            errorData = await response.json()
            errorMessage = errorData.message || errorData.error || errorMessage
            console.error('[UploadService] Error response (JSON):', {
              errorData,
              message: errorData.message,
              error: errorData.error,
              status: errorData.status,
            })
          } else {
            const text = await response.text()
            console.error('[UploadService] Error response (text):', {
              text,
              length: text.length,
              preview: text.substring(0, 500),
            })
            errorMessage = text || errorMessage
          }
        } catch (parseError: any) {
          console.error('[UploadService] Failed to parse error response', {
            parseError,
            parseErrorMessage: parseError?.message,
            parseErrorStack: parseError?.stack,
          })
          try {
            const text = await response.text()
            errorMessage = text || errorMessage
          } catch (textError) {
            errorMessage = `HTTP ${response.status}: ${response.statusText}`
          }
        }
        
        const finalError = new Error(errorMessage)
        ;(finalError as any).status = response.status
        ;(finalError as any).statusText = response.statusText
        ;(finalError as any).errorData = errorData
        throw finalError
      }

      const data = await response.json()
      console.log('[UploadService] Upload successful', { 
        data,
        uploadId: data.id,
        fileName: data.filename,
        s3Url: data.s3Url,
      })
      return data
    } catch (error: any) {
      console.error('[UploadService] Upload failed', {
        error,
        errorType: typeof error,
        errorConstructor: error?.constructor?.name,
        errorMessage: error?.message,
        errorStack: error?.stack,
        errorName: error?.name,
        errorStatus: error?.status,
        errorStatusText: error?.statusText,
        errorData: error?.errorData,
        errorString: String(error),
        errorKeys: error ? Object.keys(error) : [],
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

  /**
   * Upload'ı sil (S3'ten de silinir)
   * Guest upload'lar için guestId header'ı gönderilir
   */
  async deleteUpload(id: string): Promise<void> {
    const token = localStorage.getItem('auth_token');
    const guestId = localStorage.getItem('guest_id');
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    } else if (guestId) {
      headers['x-guest-id'] = guestId;
    }

    console.log('[UploadService] Deleting upload', {
      id,
      hasToken: !!token,
      hasGuestId: !!guestId,
    });

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/uploads/${id}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      // If file is already deleted (404), that's fine - return silently
      if (response.status === 404) {
        console.log('[UploadService] File already deleted (404), continuing', { id });
        return;
      }
      
      let errorMessage = 'Dosya silinemedi';
      try {
        const error = await response.json();
        errorMessage = error.message || errorMessage;
        console.error('[UploadService] Delete error response:', error);
      } catch (parseError) {
        const text = await response.text();
        console.error('[UploadService] Delete error response (text):', text);
        errorMessage = text || errorMessage;
      }
      throw new Error(errorMessage);
    }

    console.log('[UploadService] Upload deleted successfully', { id });
  }
}

export const uploadService = new UploadService();
