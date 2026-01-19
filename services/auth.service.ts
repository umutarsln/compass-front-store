import { api } from './api';
import { setToken, setRefreshToken, setUser, removeToken, getToken as getTokenFromStorage, getRefreshToken as getRefreshTokenFromStorage } from '@/lib/auth-client';

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthResponse {
  user: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    roles: string[];
    createdAt: string;
    updatedAt: string;
  };
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

class AuthService {
  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/store/login', loginDto);
    this.setAuthData(response);
    return response;
  }

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/store/register', registerDto);
    this.setAuthData(response);
    return response;
  }

  logout(): void {
    removeToken();
  }

  getCurrentUser(): User | null {
    const token = getTokenFromStorage();
    if (!token) return null;
    
    // User bilgisini localStorage'dan al
    const userStr = localStorage.getItem('auth_user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }

  getToken(): string | null {
    return getTokenFromStorage();
  }

  getRefreshToken(): string | null {
    return getRefreshTokenFromStorage();
  }

  private setAuthData(response: AuthResponse): void {
    setToken(response.accessToken);
    setRefreshToken(response.refreshToken);
    setUser(response.user);
  }
}

export const authService = new AuthService();
