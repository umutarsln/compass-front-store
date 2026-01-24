import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// API base URL'i environment variable'dan al
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

if (!API_URL) {
  console.warn('NEXT_PUBLIC_API_URL environment variable is not set');
}

// Axios instance oluştur
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 saniye timeout
});

// Request interceptor - istek gönderilmeden önce
apiClient.interceptors.request.use(
  (config) => {
    // İsteğe token ve guest ID ekle
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Guest ID'yi ekle (authenticated değilse)
      if (!token) {
        let guestId = localStorage.getItem('guest_id');
        if (!guestId) {
          guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          localStorage.setItem('guest_id', guestId);
        }
        config.headers['x-guest-id'] = guestId;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - yanıt alındıktan sonra
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // Hata yönetimi
    if (error.response) {
      // Sunucu yanıt verdi ama hata kodu var (4xx, 5xx)
      const status = error.response.status;
      const message = (error.response.data as any)?.message || error.message;

      switch (status) {
        case 400:
          console.error('Bad Request:', message);
          break;
        case 401:
          // 401 hatası sadece /me/* endpoint'leri için logout yap
          // Cart işlemleri (/carts/*), login, register gibi işlemlerde logout yapma
          const requestUrl = error.config?.url || '';
          const isAuthEndpoint = requestUrl.includes('/auth/');
          const isCartEndpoint = requestUrl.includes('/carts/');
          const isMeEndpoint = requestUrl.includes('/me/') && !isAuthEndpoint;
          
          // Sadece /me/* endpoint'lerinde ve login/register/cart işlemleri dışında logout yap
          if (isMeEndpoint && !isAuthEndpoint && !isCartEndpoint) {
            // Sadece authenticated endpoint'lerde 401 hatası geldiğinde logout yap
            console.error('Unauthorized:', message);
            if (typeof window !== 'undefined') {
              localStorage.removeItem('auth_token');
              localStorage.removeItem('auth_refresh_token');
              localStorage.removeItem('auth_user');
              // Sadece login/register sayfalarında değilsek yönlendir
              if (!window.location.pathname.includes('/giris') && !window.location.pathname.includes('/kayit')) {
                window.location.href = '/giris';
              }
            }
          }
          // Diğer durumlarda (cart merge, login, register vb.) sessizce hatayı fırlat, console'a yazma
          break;
        case 403:
          console.error('Forbidden:', message);
          break;
        case 404:
          console.error('Not Found:', message);
          break;
        case 500:
          console.error('Internal Server Error:', message);
          break;
        default:
          console.error(`Error ${status}:`, message);
      }
    } else if (error.request) {
      // İstek gönderildi ama yanıt alınamadı
      console.error('Network Error: No response received');
    } else {
      // İstek hazırlanırken bir hata oluştu
      console.error('Error:', error.message);
    }

    return Promise.reject(error);
  }
);

// Temel HTTP metodları
export const api = {
  // GET isteği
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return apiClient.get<T>(url, config).then((response) => response.data);
  },

  // POST isteği
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return apiClient.post<T>(url, data, config).then((response) => response.data);
  },

  // PUT isteği
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return apiClient.put<T>(url, data, config).then((response) => response.data);
  },

  // PATCH isteği
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return apiClient.patch<T>(url, data, config).then((response) => response.data);
  },

  // DELETE isteği
  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return apiClient.delete<T>(url, config).then((response) => response.data);
  },
};

// Axios instance'ı da export et (gerekirse direkt kullanılabilir)
export default apiClient;
