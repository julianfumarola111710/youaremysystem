import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import { RouterLink } from '@angular/router';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { TicketService } from '../../core/services/ticket.service';
import { ClienteService } from '../../core/services/cliente.service';
import { UsuarioService } from '../../core/services/usuario.service';
import { TokenService } from '../../core/services/token.service';

import { Ticket } from '../../shared/interfaces/ticket.interface';
import { Cliente } from '../../shared/interfaces/cliente.interface';
import { Usuario } from '../../shared/interfaces/usuario.interface';

@Component({
  selector: 'app-ticket',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './ticket.component.html',
  styleUrl: './ticket.component.css'
})

export class TicketComponent implements OnInit {

  tickets: Ticket[] = [];

  clientes: Cliente[] = [];

  usuarios: Usuario[] = [];

  ticketSeleccionado: Ticket | null = null;

  ticketForm: FormGroup;

  rolActual: string = '';

  puedeCrear = false;

  constructor(

    private fb: FormBuilder,

    private ticketService: TicketService,

    private clienteService: ClienteService,

    private usuarioService: UsuarioService,

    private tokenService: TokenService

  ) {

    this.ticketForm = this.fb.group({

      cliente: ['', Validators.required],

      problema: ['', Validators.required],

      estado: ['Abierto', Validators.required],

      prioridad: ['Media', Validators.required],

      responsable: ['']

    });

  }

  ngOnInit(): void {

    const user = this.tokenService.getUser();

    this.rolActual = user?.rol || '';

    this.puedeCrear = this.rolActual === 'admin' || this.rolActual === 'user';

    this.cargarTickets();

    this.cargarClientes();

    this.cargarUsuarios();

  }

  cargarTickets(): void {

    this.ticketService.getTickets().subscribe({

      next: (data: Ticket[]) => {

        this.tickets = data;

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

  guardarTicket(): void {

    if (this.ticketForm.invalid) {

      return;

    }

    if (this.ticketSeleccionado) {

      this.actualizarTicket();

    }

    else {

      this.crearTicket();

    }

  }

  crearTicket(): void {

    this.ticketService

      .crearTicket(this.ticketForm.value)

      .subscribe({

        next: (_data: Ticket) => {

          this.cargarTickets();

          this.limpiarFormulario();

        },

        error: (err: Error) => {

          console.error(err);

        }

      });

  }

  actualizarTicket(): void {

    if (!this.ticketSeleccionado?._id) {

      return;

    }

    this.ticketService

      .actualizarTicket(

        this.ticketSeleccionado._id,

        this.ticketForm.value

      )

      .subscribe({

        next: (_data: Ticket) => {

          this.cargarTickets();

          this.limpiarFormulario();

        },

        error: (err: Error) => {

          console.error(err);

        }

      });

  }

  editar(ticket: Ticket): void {

    if (!this.puedeCrear) {

      return;

    }

    this.ticketSeleccionado = ticket;

    this.ticketForm.patchValue({

      cliente:
        typeof ticket.cliente === 'object'
          ? ticket.cliente._id
          : ticket.cliente,

      problema: ticket.problema,

      estado: ticket.estado,

      prioridad: ticket.prioridad,

      responsable:
        ticket.responsable && typeof ticket.responsable === 'object'
          ? ticket.responsable._id
          : (ticket.responsable || '')

    });

  }

  eliminar(id?: string): void {

    if (this.rolActual !== 'admin') {

      return;

    }

    if (!id) {

      return;

    }

    if (!confirm('¿Eliminar ticket?')) {

      return;

    }

    this.ticketService

      .eliminarTicket(id)

      .subscribe({

        next: (_data: unknown) => {

          this.cargarTickets();

        },

        error: (err: Error) => {

          console.error(err);

        }

      });

  }

  limpiarFormulario(): void {

    this.ticketSeleccionado = null;

    this.ticketForm.reset({ estado: 'Abierto', prioridad: 'Media' });

  }

}