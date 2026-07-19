import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { HttpErrorResponse } from '@angular/common/http';

import { UsuarioService } from '../../core/services/usuario.service';
import { TokenService } from '../../core/services/token.service';

import { Usuario } from '../../shared/interfaces/usuario.interface';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css'
})

export class UsuarioComponent implements OnInit {

  usuarios: Usuario[] = [];

  usuarioSeleccionado: Usuario | null = null;

  usuarioForm: FormGroup;

  rolActual: string = '';

  puedeCrear = false;

  rolesDisponibles: { value: string; label: string }[] = [];

  constructor(

    private fb: FormBuilder,

    private usuarioService: UsuarioService,

    private tokenService: TokenService

  ) {

    this.usuarioForm = this.fb.group({

      nombre: ['', Validators.required],

      email: ['', [Validators.required, Validators.email]],

      password: ['', Validators.required],

      rol: ['guest', Validators.required],

      activo: [true]

    });

  }

  ngOnInit(): void {

    const user = this.tokenService.getUser();

    this.rolActual = user?.rol || '';

    this.puedeCrear = this.rolActual === 'admin' || this.rolActual === 'user';

    if (this.rolActual === 'admin') {

      this.rolesDisponibles = [

        { value: 'guest', label: 'Invitado' },

        { value: 'user', label: 'Usuario' },

        { value: 'admin', label: 'Administrador' }

      ];

    }

    else if (this.rolActual === 'user') {

      this.rolesDisponibles = [

        { value: 'guest', label: 'Invitado' }

      ];

    }

    this.cargarUsuarios();

  }

  cargarUsuarios(): void {

    this.usuarioService.getUsers().subscribe({

      next: (data: Usuario[]) => {

        this.usuarios = data;

      },

      error: (err: HttpErrorResponse) => {

        console.error(err);

      }

    });

  }

  guardarUsuario(): void {

    if (this.usuarioForm.invalid) {

      return;

    }

    if (this.usuarioSeleccionado) {

      this.actualizarUsuario();

    }

    else {

      this.crearUsuario();

    }

  }

  crearUsuario(): void {

    this.usuarioService

      .crearUsuario(this.usuarioForm.value)

      .subscribe({

        next: () => {

          this.cargarUsuarios();

          this.limpiarFormulario();

        },

        error: (err: HttpErrorResponse) => {

          console.error(err);

        }

      });

  }

  actualizarUsuario(): void {

    if (!this.usuarioSeleccionado?._id) {

      return;

    }

    this.usuarioService

      .actualizarUsuario(

        this.usuarioSeleccionado._id,

        this.usuarioForm.value

      )

      .subscribe({

        next: () => {

          this.cargarUsuarios();

          this.limpiarFormulario();

        },

        error: (err: HttpErrorResponse) => {

          console.error(err);

        }

      });

  }

  editar(usuario: Usuario): void {

    if (!this.puedeCrear) {

      return;

    }

    this.usuarioSeleccionado = usuario;

    this.usuarioForm.patchValue({

      nombre: usuario.nombre,

      email: usuario.email,

      password: '',

      rol: usuario.rol,

      activo: usuario.activo

    });

  }

  eliminar(id?: string): void {

    if (this.rolActual !== 'admin') {

      return;

    }

    if (!id) {

      return;

    }

    if (!confirm('¿Eliminar usuario?')) {

      return;

    }

    this.usuarioService

      .eliminarUsuario(id)

      .subscribe({

        next: () => {

          this.cargarUsuarios();

        },

        error: (err: HttpErrorResponse) => {

          console.error(err);

        }

      });

  }

  limpiarFormulario(): void {

    this.usuarioSeleccionado = null;

    this.usuarioForm.reset({

      rol: 'guest',

      activo: true

    });

  }

}