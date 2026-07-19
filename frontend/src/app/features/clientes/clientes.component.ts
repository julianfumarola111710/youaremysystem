import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { HttpErrorResponse } from '@angular/common/http';

import { ClienteService } from '../../core/services/cliente.service';
import { TokenService } from '../../core/services/token.service';
import { Cliente } from '../../shared/interfaces/cliente.interface';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css'
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[] = [];

  clienteSeleccionado: Cliente | null = null;

  clienteForm: FormGroup;

  rolActual: string = '';

  puedeCrear = false;

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private tokenService: TokenService
  ) {

    this.clienteForm = this.fb.group({

      nombre: ['', Validators.required],

      empresa: ['', Validators.required],

      telefono: ['', Validators.required],

      correo: ['', [Validators.required, Validators.email]]

    });

  }

  ngOnInit(): void {

    const user = this.tokenService.getUser();

    this.rolActual = user?.rol || '';

    this.puedeCrear = this.rolActual === 'admin' || this.rolActual === 'user';

    this.cargarClientes();

  }

  cargarClientes(): void {

    this.clienteService.getClientes().subscribe({

      next: (data: Cliente[]) => {

        this.clientes = data;

      },

      error: (err: HttpErrorResponse) => {

        console.error(err);

      }

    });

  }

  guardarCliente(): void {

    if (this.clienteForm.invalid) {

      return;

    }

    if (this.clienteSeleccionado) {

      this.actualizarCliente();

    } else {

      this.crearCliente();

    }

  }

  crearCliente(): void {

    this.clienteService
      .crearCliente(this.clienteForm.value)
      .subscribe({

        next: () => {

          this.cargarClientes();

          this.limpiarFormulario();

        },

        error: (err: HttpErrorResponse) => {

          console.error(err);

        }

      });

  }

  actualizarCliente(): void {

    if (!this.clienteSeleccionado?._id) {

      return;

    }

    this.clienteService

      .actualizarCliente(

        this.clienteSeleccionado._id,

        this.clienteForm.value

      )

      .subscribe({

        next: () => {

          this.cargarClientes();

          this.limpiarFormulario();

        },

        error: (err: HttpErrorResponse) => {

          console.error(err);

        }

      });

  }

  editar(cliente: Cliente): void {

    if (!this.puedeCrear) {

      return;

    }

    this.clienteSeleccionado = cliente;

    this.clienteForm.patchValue({

      nombre: cliente.nombre,

      empresa: cliente.empresa,

      telefono: cliente.telefono,

      correo: cliente.correo

    });

  }

  eliminar(id?: string): void {

    if (this.rolActual !== 'admin') {

      return;

    }

    if (!id) {

      return;

    }

    if (!confirm('¿Eliminar cliente?')) {

      return;

    }

    this.clienteService

      .eliminarCliente(id)

      .subscribe({

        next: () => {

          this.cargarClientes();

        },

        error: (err: HttpErrorResponse) => {

          console.error(err);

        }

      });

  }

 limpiarFormulario(): void {

    this.clienteSeleccionado = null;

    this.clienteForm.reset();

  }

}