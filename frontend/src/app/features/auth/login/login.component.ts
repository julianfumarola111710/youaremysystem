import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { TokenService } from '../../../core/services/token.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  mensajeError = '';

  verificandoUsuarios = true;

  hayUsuarios = true;

  creandoAdmin = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {

    this.authService.existeUsuarios().subscribe({

      next: (response: { ok: boolean; existeUsuarios: boolean }) => {

        this.hayUsuarios = response.existeUsuarios;

        this.verificandoUsuarios = false;

      },

      error: () => {

        // Si falla la verificación, mostramos el login normal por seguridad
        this.hayUsuarios = true;

        this.verificandoUsuarios = false;

      }

    });

  }

  onSubmit(): void {

    this.mensajeError = '';

    if (this.loginForm.invalid) {
      return;
    }

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (response: any) => {
        this.tokenService.saveSession(
          response.accessToken,
          response.refreshToken,
          response.usuario
        );

        this.router.navigate(['/dashboard']);
      },
      error: (error: HttpErrorResponse) => {

        this.mensajeError = 'Credenciales incorrectas. Verifique su correo y contraseña.';

      }
    });
  }

  crearAdminInicial(): void {

    this.creandoAdmin = true;

    this.mensajeError = '';

    this.authService.crearAdminInicial().subscribe({

      next: (response: any) => {

        this.tokenService.saveSession(

          response.accessToken,

          response.refreshToken,

          response.usuario

        );

        this.creandoAdmin = false;

        this.router.navigate(['/dashboard']);

      },

      error: (error: HttpErrorResponse) => {

        this.creandoAdmin = false;

        this.mensajeError = error.error?.mensaje || 'No se pudo crear el usuario administrador';

        // Si falló porque ya existen usuarios, mostramos el login normal
        this.hayUsuarios = true;

      }

    });

  }
}