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