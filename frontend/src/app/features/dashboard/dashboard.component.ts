import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { TokenService } from '../../core/services/token.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterLink
  ],
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
        this.tokenService.clearSession();
        this.router.navigate(['/login']);
      },
      error: () => {
        this.tokenService.clearSession();
        this.router.navigate(['/login']);
      }
    });
  }

}