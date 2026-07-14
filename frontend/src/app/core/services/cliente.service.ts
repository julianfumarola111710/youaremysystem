import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

import { Cliente } from '../../shared/interfaces/cliente.interface';

@Injectable({
  providedIn: 'root'
})

export class ClienteService {

  private apiUrl = environment.apiUrl + '/clientes';

  constructor(
    private http: HttpClient
  ) { }

  getClientes(): Observable<Cliente[]> {

    return this.http.get<Cliente[]>(this.apiUrl);

  }

  getCliente(id: string): Observable<Cliente> {

    return this.http.get<Cliente>(`${this.apiUrl}/${id}`);

  }

  crearCliente(cliente: Cliente): Observable<Cliente> {

    return this.http.post<Cliente>(this.apiUrl, cliente);

  }

  actualizarCliente(
    id: string,
    cliente: Cliente
  ): Observable<Cliente> {

    return this.http.put<Cliente>(
      `${this.apiUrl}/${id}`,
      cliente
    );

  }

  eliminarCliente(id: string): Observable<any> {

    return this.http.delete(
      `${this.apiUrl}/${id}`
    );

  }

}