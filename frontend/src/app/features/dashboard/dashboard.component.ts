import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { TokenService } from '../../core/services/token.service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router
  ) { }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        /* Backend confirmó — ahora sí limpiamos y redirigimos */
        this.tokenService.clearSession();
        this.router.navigate(['/login']);
        console.log('LOGOUT EXITOSO');
      },
      error: () => {
        /* Si el backend falla, igual limpiamos localmente
           para no dejar al usuario atrapado */
        this.tokenService.clearSession();
        this.router.navigate(['/login']);
        console.error('LOGOUT con error de backend — sesión limpiada localmente');
      }
    });
  }
}