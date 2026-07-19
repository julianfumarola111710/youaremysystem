import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import { RouterLink } from '@angular/router';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { ActividadService } from '../../core/services/actividad.service';
import { ClienteService } from '../../core/services/cliente.service';
import { UsuarioService } from '../../core/services/usuario.service';
import { TokenService } from '../../core/services/token.service';

import { Actividad } from '../../shared/interfaces/actividad.interface';
import { Cliente } from '../../shared/interfaces/cliente.interface';
import { Usuario } from '../../shared/interfaces/usuario.interface';

const NIVELES_ROL: { [key: string]: number } = {

  guest: 1,

  user: 2,

  admin: 3

};

@Component({
  selector: 'app-actividad',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './actividad.component.html',
  styleUrl: './actividad.component.css'
})

export class ActividadComponent implements OnInit {

  actividades: Actividad[] = [];

  clientes: Cliente[] = [];

  usuarios: Usuario[] = [];

  usuariosDisponibles: Usuario[] = [];

  actividadSeleccionada: Actividad | null = null;

  actividadForm: FormGroup;

  rolActual: string = '';

  puedeCrear = false;

  constructor(

    private fb: FormBuilder,

    private actividadService: ActividadService,

    private clienteService: ClienteService,

    private usuarioService: UsuarioService,

    private tokenService: TokenService

  ) {

    this.actividadForm = this.fb.group({

      tipo: ['', Validators.required],

      descripcion: ['', Validators.required],

      cliente: ['', Validators.required],

      responsable: ['', Validators.required]

    });

  }

  ngOnInit(): void {

    const user = this.tokenService.getUser();

    this.rolActual = user?.rol || '';

    this.puedeCrear = this.rolActual === 'admin' || this.rolActual === 'user';

    this.cargarActividades();

    this.cargarClientes();

    this.cargarUsuarios();

  }

  cargarActividades(): void {

    this.actividadService.getActividades().subscribe({

      next: (data: Actividad[]) => {

        this.actividades = data;

      },

      error: (err: Error) => {

        console.error(err);

      }

    });

  }

  cargarClientes(): void {

    this.clienteService.getClientes().subscribe({

      next: (data: Cliente[]) => {

        this.clientes = data;

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

        const nivelActual = NIVELES_ROL[this.rolActual] || 0;

        this.usuariosDisponibles = data.filter(

          u => (NIVELES_ROL[u.rol] || 0) <= nivelActual

        );

      },

      error: (err: Error) => {

        console.error(err);

      }

    });

  }

  guardarActividad(): void {

    if (this.actividadForm.invalid) {

      return;

    }

    if (this.actividadSeleccionada) {

      this.actualizarActividad();

    }

    else {

      this.crearActividad();

    }

  }

  crearActividad(): void {

    this.actividadService

      .crearActividad(this.actividadForm.value)

      .subscribe({

        next: (_data: Actividad) => {

          this.cargarActividades();

          this.limpiarFormulario();

        },

        error: (err: Error) => {

          console.error(err);

        }

      });

  }

  actualizarActividad(): void {

    if (!this.actividadSeleccionada?._id) {

      return;

    }

    this.actividadService

      .actualizarActividad(

        this.actividadSeleccionada._id,

        this.actividadForm.value

      )

      .subscribe({

        next: (_data: Actividad) => {

          this.cargarActividades();

          this.limpiarFormulario();

        },

        error: (err: Error) => {

          console.error(err);

        }

      });

  }

  editar(actividad: Actividad): void {

    if (!this.puedeCrear) {

      return;

    }

    this.actividadSeleccionada = actividad;

    this.actividadForm.patchValue({

      tipo: actividad.tipo,

      descripcion: actividad.descripcion,

      cliente:
        typeof actividad.cliente === 'object'
          ? actividad.cliente._id
          : actividad.cliente,

      responsable:
        typeof actividad.responsable === 'object'
          ? actividad.responsable._id
          : actividad.responsable

    });

  }

  eliminar(id?: string): void {

    if (this.rolActual !== 'admin') {

      return;

    }

    if (!id) {

      return;

    }

    if (!confirm('¿Eliminar actividad?')) {

      return;

    }

    this.actividadService

      .eliminarActividad(id)

      .subscribe({

        next: (_data: unknown) => {

          this.cargarActividades();

        },

        error: (err: Error) => {

          console.error(err);

        }

      });

  }

  limpiarFormulario(): void {

    this.actividadSeleccionada = null;

    this.actividadForm.reset();

  }

}