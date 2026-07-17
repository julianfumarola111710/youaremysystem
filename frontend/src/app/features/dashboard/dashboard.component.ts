import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { TokenService } from '../../core/services/token.service';
import { VentaService } from '../../core/services/venta.service';
import { ClienteService } from '../../core/services/cliente.service';
import { UsuarioService } from '../../core/services/usuario.service';
import { TicketService } from '../../core/services/ticket.service';

import { Venta } from '../../shared/interfaces/venta.interface';
import { Cliente } from '../../shared/interfaces/cliente.interface';
import { Ticket } from '../../shared/interfaces/ticket.interface';

interface ClienteVentas {

  clienteId: string;

  nombre: string;

  totalVentas: number;

  cantidadVentas: number;

  porcentaje: number;

}

interface ProductoVentas {

  productoId: string;

  nombre: string;

  cantidadVendida: number;

  montoTotal: number;

  porcentaje: number;

}

interface UsuarioPie {

  usuarioId: string;

  nombre: string;

  cantidadVentas: number;

  porcentaje: number;

  color: string;

}

const COLORES_PIE = [
  '#0d6efd', '#198754', '#fd7e14', '#dc3545',
  '#6f42c1', '#20c997', '#ffc107', '#6c757d',
  '#0dcaf0', '#d63384'
];

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  ventas: Venta[] = [];

  clientes: Cliente[] = [];

  tickets: Ticket[] = [];

  clientesRanking: ClienteVentas[] = [];

  productosRanking: ProductoVentas[] = [];

  usuariosPie: UsuarioPie[] = [];

  pieGradient = '';

  totalVentasMonto = 0;

  totalVentasCantidad = 0;

  totalClientes = 0;

  ticketsAbiertos = 0;

  cargando = true;

  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router,
    private ventaService: VentaService,
    private clienteService: ClienteService,
    private usuarioService: UsuarioService,
    private ticketService: TicketService
  ) { }

  ngOnInit(): void {

    this.cargarDatos();

  }

  cargarDatos(): void {

    this.cargando = true;

    this.ventaService.getVentas().subscribe({

      next: (ventas: Venta[]) => {

        this.ventas = ventas;

        this.calcularEstadisticas();

        this.calcularProductosMasVendidos();

        this.calcularVentasPorUsuario();

        this.cargando = false;

      },

      error: (err: Error) => {

        console.error(err);

        this.cargando = false;

      }

    });

    this.clienteService.getClientes().subscribe({

      next: (data: Cliente[]) => {

        this.clientes = data;

        this.totalClientes = data.length;

      },

      error: (err: Error) => {

        console.error(err);

      }

    });

    this.ticketService.getTickets().subscribe({

      next: (data: Ticket[]) => {

        this.tickets = data;

        this.ticketsAbiertos = data.filter(
          t => t.estado === 'Abierto' || t.estado === 'En curso'
        ).length;

      },

      error: (err: Error) => {

        console.error(err);

      }

    });

  }

  calcularEstadisticas(): void {

    this.totalVentasCantidad = this.ventas.length;

    this.totalVentasMonto = this.ventas.reduce(
      (acc, v) => acc + (v.total || 0),
      0
    );

    const mapa = new Map<string, ClienteVentas>();

    for (const venta of this.ventas) {

      const clienteObj = typeof venta.cliente === 'object' ? venta.cliente : null;

      const clienteId = clienteObj ? clienteObj._id : (venta.cliente as string);

      const nombre = clienteObj ? clienteObj.nombre : 'Cliente desconocido';

      if (!mapa.has(clienteId)) {

        mapa.set(clienteId, {

          clienteId,

          nombre,

          totalVentas: 0,

          cantidadVentas: 0,

          porcentaje: 0

        });

      }

      const registro = mapa.get(clienteId)!;

      registro.totalVentas += venta.total || 0;

      registro.cantidadVentas += 1;

    }

    const ranking = Array.from(mapa.values())
      .sort((a, b) => b.totalVentas - a.totalVentas);

    const maxVenta = ranking.length > 0 ? ranking[0].totalVentas : 0;

    for (const r of ranking) {

      r.porcentaje = maxVenta > 0 ? (r.totalVentas / maxVenta) * 100 : 0;

    }

    this.clientesRanking = ranking.slice(0, 8);

  }

  calcularProductosMasVendidos(): void {

    const mapa = new Map<string, ProductoVentas>();

    for (const venta of this.ventas) {

      const productoObj = typeof venta.producto === 'object' ? venta.producto : null;

      const productoId = productoObj ? productoObj._id : (venta.producto as string);

      const nombre = productoObj ? productoObj.nombre : 'Producto desconocido';

      if (!mapa.has(productoId)) {

        mapa.set(productoId, {

          productoId,

          nombre,

          cantidadVendida: 0,

          montoTotal: 0,

          porcentaje: 0

        });

      }

      const registro = mapa.get(productoId)!;

      registro.cantidadVendida += venta.cantidad || 0;

      registro.montoTotal += venta.total || 0;

    }

    const ranking = Array.from(mapa.values())
      .sort((a, b) => b.cantidadVendida - a.cantidadVendida);

    const maxCantidad = ranking.length > 0 ? ranking[0].cantidadVendida : 0;

    for (const r of ranking) {

      r.porcentaje = maxCantidad > 0 ? (r.cantidadVendida / maxCantidad) * 100 : 0;

    }

    this.productosRanking = ranking.slice(0, 8);

  }

  calcularVentasPorUsuario(): void {

    const mapa = new Map<string, UsuarioPie>();

    for (const venta of this.ventas) {

      const usuarioObj = typeof venta.usuario === 'object' ? venta.usuario : null;

      const usuarioId = usuarioObj ? usuarioObj._id : (venta.usuario as string);

      const nombre = usuarioObj ? usuarioObj.nombre : 'Usuario desconocido';

      if (!mapa.has(usuarioId)) {

        mapa.set(usuarioId, {

          usuarioId,

          nombre,

          cantidadVentas: 0,

          porcentaje: 0,

          color: ''

        });

      }

      mapa.get(usuarioId)!.cantidadVentas += 1;

    }

    const lista = Array.from(mapa.values())
      .sort((a, b) => b.cantidadVentas - a.cantidadVentas);

    const totalVentas = lista.reduce((acc, u) => acc + u.cantidadVentas, 0);

    let acumulado = 0;

    const segmentos: string[] = [];

    lista.forEach((u, i) => {

      u.color = COLORES_PIE[i % COLORES_PIE.length];

      u.porcentaje = totalVentas > 0
        ? Math.round((u.cantidadVentas / totalVentas) * 1000) / 10
        : 0;

      const inicio = acumulado;

      acumulado += u.porcentaje;

      segmentos.push(`${u.color} ${inicio}% ${acumulado}%`);

    });

    this.pieGradient = segmentos.length > 0
      ? `conic-gradient(${segmentos.join(', ')})`
      : '#eef1f5';

    this.usuariosPie = lista;

  }

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