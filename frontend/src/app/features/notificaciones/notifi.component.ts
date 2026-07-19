import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { NotifiService } from '../../core/services/notifi.service';
import { UsuarioService } from '../../core/services/usuario.service';
import { TokenService } from '../../core/services/token.service';
import { Notifi } from '../../shared/interfaces/notifi.interface';
import { Usuario } from '../../shared/interfaces/usuario.interface';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-notifi',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './notifi.component.html',
  styleUrl: './notifi.component.css'
})

export class NotifiComponent implements OnInit {

  notifis: Notifi[] = [];

  usuarios: Usuario[] = [];

  notifiSeleccionada: Notifi | null = null;

  notifiForm: FormGroup;

  rolActual: string = '';

  puedeCrear = false;

  constructor(

    private fb: FormBuilder,

    private notifiService: NotifiService,

    private usuarioService: UsuarioService,

    private tokenService: TokenService

  ) {

    this.notifiForm = this.fb.group({

      mensaje: ['', Validators.required],

      usuario: ['', Validators.required],

      fecha: ['', Validators.required]

    });

  }

  ngOnInit(): void {

    const user = this.tokenService.getUser();

    this.rolActual = user?.rol || '';

    this.puedeCrear = this.rolActual === 'admin' || this.rolActual === 'user';

    this.cargarNotifis();

    this.cargarUsuarios();

  }

  cargarNotifis(): void {

    this.notifiService.getNotifis().subscribe({

      next: (data: Notifi[]) => {

        this.notifis = data;

      },

      error: (err: Error) => {

        console.error(err);

      }

    });

  }

  cargarUsuarios(): void {

    this.usuarioService.getUsers().subscribe({

      next: (data: Usuario[]) => {

        this.usuarios = data;

      },

      error: (err: Error) => {

        console.error(err);

      }

    });

  }

  guardarNotifi(): void {

    if (this.notifiForm.invalid) {

      return;

    }

    if (this.notifiSeleccionada) {

      this.actualizarNotifi();

    }

    else {

      this.crearNotifi();

    }

  }

  crearNotifi(): void {

    this.notifiService

      .crearNotifi(this.notifiForm.value)

      .subscribe({

        next: (_data: Notifi) => {

          this.cargarNotifis();

          this.limpiarFormulario();

        },

        error: (err: Error) => {

          console.error(err);

        }

      });

  }

  actualizarNotifi(): void {

    if (!this.notifiSeleccionada?._id) {

      return;

    }

    this.notifiService

      .actualizarNotifi(

        this.notifiSeleccionada._id,

        this.notifiForm.value

      )

      .subscribe({

        next: (_data: Notifi) => {

          this.cargarNotifis();

          this.limpiarFormulario();

        },

        error: (err: Error) => {

          console.error(err);

        }

      });

  }

  editar(notifi: Notifi): void {

    if (!this.puedeCrear) {

      return;

    }

    this.notifiSeleccionada = notifi;

    this.notifiForm.patchValue({

      mensaje: notifi.mensaje,

      usuario:
        typeof notifi.usuario === 'object'
          ? notifi.usuario._id
          : notifi.usuario,

      fecha: notifi.fecha.substring(0,16)

    });

  }

  eliminar(id?: string): void {

    if (this.rolActual !== 'admin') {

      return;

    }

    if (!id) {

      return;

    }

    if (!confirm('¿Eliminar notificación?')) {

      return;

    }

    this.notifiService

      .eliminarNotifi(id)

      .subscribe({

        next: (_data: unknown) => {

          this.cargarNotifis();

        },

        error: (err: Error) => {

          console.error(err);

        }

      });

  }

  limpiarFormulario(): void {

    this.notifiSeleccionada = null;

    this.notifiForm.reset();

  }

}