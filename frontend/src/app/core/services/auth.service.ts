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

  logout(): void {
    const refreshToken = this.tokenService.getRefreshToken();

    this.http.post(`${this.apiUrl}/auth/logout`, { refreshToken }).subscribe({
      next: () => {
        console.log('LOGOUT EXITOSO');
      },
      error: (error) => {
        console.error('ERROR LOGOUT');
        console.error(error);
      }
    });
  }
}