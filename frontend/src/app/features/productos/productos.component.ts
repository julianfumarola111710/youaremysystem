import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { RouterLink } from '@angular/router';

import { ProductoService } from '../../core/services/producto.service';
import { TokenService } from '../../core/services/token.service';
import { Producto, ProductosResponse, ProductoResponse } from '../../shared/interfaces/producto.interface';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent implements OnInit {

  productos: Producto[] = [];
  productoSeleccionado: Producto | null = null;
  productoForm: FormGroup;

  terminoBusqueda = '';
  mensajeExito = '';
  mensajeError = '';
  cargando = false;
  esAdmin = false;

  categorias = [
    'Electronica',
    'Hogar',
    'Oficina',
    'Ropa',
    'Alimentos'
  ];

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService,
    private tokenService: TokenService
  ) {
    this.productoForm = this.fb.group({
      nombre: ['', [
        Validators.required,
        Validators.minLength(2)
      ]],
      codigo_sku: ['', [
        Validators.required,
        Validators.pattern(/^[A-Z]{3}-\d{4}$/)
      ]],
      categoria: ['', Validators.required],
      precio: [0, [
        Validators.required,
        Validators.min(0)
      ]],
      stock: [0, [
        Validators.required,
        Validators.min(0)
      ]],
      descripcion: [''],
      activo: [true]
    });
  }

  ngOnInit(): void {
    const usuario = this.tokenService.getUser();

    this.esAdmin = usuario?.rol === 'admin';

    this.cargarProductos();
  }

  get productosFiltrados(): Producto[] {
    const termino = this.terminoBusqueda
      .trim()
      .toLowerCase();

    if (!termino) {
      return this.productos;
    }

    return this.productos.filter(producto =>
      producto.nombre.toLowerCase().includes(termino) ||
      producto.codigo_sku.toLowerCase().includes(termino) ||
      producto.categoria.toLowerCase().includes(termino)
    );
  }

  cargarProductos(): void {
    this.cargando = true;

    this.productoService.getProductos().subscribe({
      next: (response: ProductosResponse) => {
        this.productos = response.productos;
        this.cargando = false;
      },
      error: (error: HttpErrorResponse) => {
        this.mostrarError(
          error.error?.mensaje ||
          'No se pudieron cargar los productos'
        );

        this.cargando = false;
      }
    });
  }

  guardarProducto(): void {
    this.limpiarMensajes();

    if (!this.esAdmin) {
      this.mostrarError(
        'No tiene permisos para administrar productos'
      );
      return;
    }

    if (this.productoForm.invalid) {
      this.productoForm.markAllAsTouched();
      this.mostrarError('Revise los campos obligatorios');
      return;
    }

    const producto: Producto = {
      ...this.productoForm.value,
      codigo_sku:
        this.productoForm.value.codigo_sku.toUpperCase(),
      precio: Number(this.productoForm.value.precio),
      stock: Number(this.productoForm.value.stock)
    };

    if (this.productoSeleccionado?._id) {
      this.actualizarProducto(
        this.productoSeleccionado._id,
        producto
      );
    } else {
      this.crearProducto(producto);
    }
  }

  crearProducto(producto: Producto): void {
    this.productoService
      .crearProducto(producto)
      .subscribe({
        next: (response: ProductoResponse) => {
          this.mensajeExito =
            (response as any).mensaje ||
            'Producto creado correctamente';

          this.mensajeError = '';

          this.limpiarFormulario(false);
          this.cargarProductos();
        },
        error: (error: HttpErrorResponse) => {
          this.procesarError(error);
        }
      });
  }

  actualizarProducto(
    id: string,
    producto: Producto
  ): void {
    this.productoService
      .actualizarProducto(id, producto)
      .subscribe({
        next: (response: ProductoResponse) => {
          this.mensajeExito =
            (response as any).mensaje ||
            'Producto actualizado correctamente';

          this.mensajeError = '';

          this.limpiarFormulario(false);
          this.cargarProductos();
        },
        error: (error: HttpErrorResponse) => {
          this.procesarError(error);
        }
      });
  }

  editar(producto: Producto): void {
    if (!this.esAdmin) {
      return;
    }

    this.productoSeleccionado = producto;
    this.limpiarMensajes();

    this.productoForm.patchValue({
      nombre: producto.nombre,
      codigo_sku: producto.codigo_sku,
      categoria: producto.categoria,
      precio: producto.precio,
      stock: producto.stock,
      descripcion: producto.descripcion,
      activo: producto.activo
    });

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  eliminar(producto: Producto): void {
    if (!this.esAdmin || !producto._id) {
      return;
    }

    const confirmar = confirm(
      `¿Desea eliminar el producto "${producto.nombre}"?`
    );

    if (!confirmar) {
      return;
    }

    this.limpiarMensajes();

    this.productoService
      .eliminarProducto(producto._id)
      .subscribe({
        next: (response: ProductoResponse) => {
          this.mensajeExito =
            (response as any).mensaje ||
            'Producto eliminado correctamente';

          this.mensajeError = '';

          this.cargarProductos();
        },
        error: (error: HttpErrorResponse) => {
          this.procesarError(error);
        }
      });
  }

  limpiarFormulario(
    limpiarMensajes: boolean = true
  ): void {
    this.productoSeleccionado = null;

    this.productoForm.reset({
      nombre: '',
      codigo_sku: '',
      categoria: '',
      precio: 0,
      stock: 0,
      descripcion: '',
      activo: true
    });

    if (limpiarMensajes) {
      this.limpiarMensajes();
    }
  }

  convertirSkuMayuscula(): void {
    const sku =
      this.productoForm.get('codigo_sku')?.value;

    if (sku) {
      this.productoForm
        .get('codigo_sku')
        ?.setValue(
          sku.toUpperCase(),
          { emitEvent: false }
        );
    }
  }

  private procesarError(error: HttpErrorResponse): void {
    const errores = error.error?.errores;

    if (
      Array.isArray(errores) &&
      errores.length > 0
    ) {
      this.mostrarError(errores.join(' '));
      return;
    }

    this.mostrarError(
      error.error?.mensaje ||
      'Ocurrió un error con el producto'
    );
  }

  private mostrarError(mensaje: string): void {
    this.mensajeError = mensaje;
    this.mensajeExito = '';
  }

  private limpiarMensajes(): void {
    this.mensajeExito = '';
    this.mensajeError = '';
  }
}