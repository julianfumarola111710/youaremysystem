import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

import { Ticket } from '../../shared/interfaces/ticket.interface';

@Injectable({
  providedIn: 'root'
})

export class TicketService {

  private apiUrl = environment.apiUrl + '/tickets';

  constructor(
    private http: HttpClient
  ) { }

  getTickets(): Observable<Ticket[]> {

    return this.http.get<Ticket[]>(this.apiUrl);

  }

  getTicket(id: string): Observable<Ticket> {

    return this.http.get<Ticket>(`${this.apiUrl}/${id}`);

  }

  crearTicket(ticket: Ticket): Observable<Ticket> {

    return this.http.post<Ticket>(this.apiUrl, ticket);

  }

  actualizarTicket(id: string, ticket: Ticket): Observable<Ticket> {

    return this.http.put<Ticket>(`${this.apiUrl}/${id}`, ticket);

  }

  eliminarTicket(id: string): Observable<{ ok: boolean }> {

    return this.http.delete<{ ok: boolean }>(`${this.apiUrl}/${id}`);

  }

}