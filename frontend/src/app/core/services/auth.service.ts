import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthResponse } from '../../shared/interfaces/auth-response.interface';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) { }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/auth/login`,
      { email, password }
    );
  }

  /* Logout profesional — devuelve Observable para que
     el componente redirija solo cuando el backend confirmó */
  logout(): Observable<any> {
    const refreshToken = this.tokenService.getRefreshToken();
    return this.http.post(
      `${this.apiUrl}/auth/logout`,
      { refreshToken }
    );
  }

  /* Actualizar únicamente el Access Token */
  updateAccessToken(accessToken: string): void {
    localStorage.setItem('accessToken', accessToken);
  }

  /* Obtener Refresh Token */
  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  /* Solicitar un nuevo Access Token al backend */
  refreshAccessToken() {
    return this.http.post(
      `${this.apiUrl}/auth/refresh`,
      {
        refreshToken: this.getRefreshToken()
      }
    );
  }
}