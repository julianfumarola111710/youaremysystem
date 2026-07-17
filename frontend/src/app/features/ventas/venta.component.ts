import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import { RouterLink } from '@angular/router';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { VentaService } from '../../core/services/venta.service';
import { ClienteService } from '../../core/services/cliente.service';
import { UsuarioService } from '../../core/services/usuario.service';
import { ProductoService } from '../../core/services/producto.service';

import { Venta } from '../../shared/interfaces/venta.interface';
import { Cliente } from '../../shared/interfaces/cliente.interface';
import { Usuario } from '../../shared/interfaces/usuario.interface';
import { Producto } from '../../shared/interfaces/producto.interface';

@Component({
  selector: 'app-venta',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './venta.component.html',
  styleUrl: './venta.component.css'
})

export class VentaComponent implements OnInit {

  ventas: Venta[] = [];

  clientes: Cliente[] = [];

  usuarios: Usuario[] = [];

  productos: Producto[] = [];

  ventaSeleccionada: Venta | null = null;

  ventaForm: FormGroup;

  constructor(

    private fb: FormBuilder,

    private ventaService: VentaService,

    private clienteService: ClienteService,

    private usuarioService: UsuarioService,

    private productoService: ProductoService

  ) {

    this.ventaForm = this.fb.group({

      cliente: ['', Validators.required],

      usuario: ['', Validators.required],

      producto: ['', Validators.required],

      fecha: ['', Validators.required],

      total: ['', [Validators.required, Validators.min(0)]]

    });

  }

  ngOnInit(): void {

    this.cargarVentas();

    this.cargarClientes();

    this.cargarUsuarios();

    this.cargarProductos();

  }

  cargarVentas(): void {

    this.ventaService.getVentas().subscribe({

      next: (data: Venta[]) => {

        this.ventas = data;

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

      },

      error: (err: Error) => {

        console.error(err);

      }

    });

  }

  cargarProductos(): void {

    this.productoService.getProductos().subscribe({

      next: (data: Producto[]) => {

        this.productos = data;

      },

      error: (err: Error) => {

        console.error(err);

      }

    });

  }

  guardarVenta(): void {

    if (this.ventaForm.invalid) {

      return;

    }

    if (this.ventaSeleccionada) {

      this.actualizarVenta();

    }

    else {

      this.crearVenta();

    }

  }

  crearVenta(): void {

    this.ventaService

      .crearVenta(this.ventaForm.value)

      .subscribe({

        next: (_data: Venta) => {

          this.cargarVentas();

          this.limpiarFormulario();

        },

        error: (err: Error) => {

          console.error(err);

        }

      });

  }

  actualizarVenta(): void {

    if (!this.ventaSeleccionada?._id) {

      return;

    }

    this.ventaService

      .actualizarVenta(

        this.ventaSeleccionada._id,

        this.ventaForm.value

      )

      .subscribe({

        next: (_data: Venta) => {

          this.cargarVentas();

          this.limpiarFormulario();

        },

        error: (err: Error) => {

          console.error(err);

        }

      });

  }

  editar(venta: Venta): void {

    this.ventaSeleccionada = venta;

    this.ventaForm.patchValue({

      cliente:
        typeof venta.cliente === 'object'
          ? venta.cliente._id
          : venta.cliente,

      usuario:
        typeof venta.usuario === 'object'
          ? venta.usuario._id
          : venta.usuario,

      producto:
        typeof venta.producto === 'object'
          ? venta.producto._id
          : venta.producto,

      fecha: venta.fecha.substring(0, 10),

      total: venta.total

    });

  }

  eliminar(id?: string): void {

    if (!id) {

      return;

    }

    if (!confirm('¿Eliminar venta?')) {

      return;

    }

    this.ventaService

      .eliminarVenta(id)

      .subscribe({

        next: (_data: unknown) => {

          this.cargarVentas();

        },

        error: (err: Error) => {

          console.error(err);

        }

      });

  }

  limpiarFormulario(): void {

    this.ventaSeleccionada = null;

    this.ventaForm.reset();

  }

}