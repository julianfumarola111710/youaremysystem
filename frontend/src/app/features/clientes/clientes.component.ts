import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
//clientes
import { ClienteService } from '../../core/services/cliente.service';
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

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService
  ) {

    this.clienteForm = this.fb.group({

      nombre: ['', Validators.required],

      empresa: ['', Validators.required],

      telefono: ['', Validators.required],

      correo: ['', [Validators.required, Validators.email]]

    });

  }

  ngOnInit(): void {

    this.cargarClientes();

  }

  cargarClientes(): void {

    this.clienteService.getClientes().subscribe({

      next: (data) => {

        this.clientes = data;

      },

      error: (err) => {

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

        error: err => console.error(err)

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

        error: err => console.error(err)

      });

  }

  editar(cliente: Cliente): void {

    this.clienteSeleccionado = cliente;

    this.clienteForm.patchValue({

      nombre: cliente.nombre,

      empresa: cliente.empresa,

      telefono: cliente.telefono,

      correo: cliente.correo

    });

  }

  eliminar(id?: string): void {

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

        error: err => console.error(err)

      });

  }

  limpiarFormulario(): void {

    this.clienteSeleccionado = null;

    this.clienteForm.reset();

  }

}