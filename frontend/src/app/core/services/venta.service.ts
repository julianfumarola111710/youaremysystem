import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

import { Venta } from '../../shared/interfaces/venta.interface';

@Injectable({
  providedIn: 'root'
})

export class VentaService {

  private apiUrl = environment.apiUrl + '/ventas';

  constructor(
    private http: HttpClient
  ) { }

  getVentas(): Observable<Venta[]> {

    return this.http.get<Venta[]>(this.apiUrl);

  }

  getVenta(id: string): Observable<Venta> {

    return this.http.get<Venta>(`${this.apiUrl}/${id}`);

  }

  crearVenta(venta: Venta): Observable<Venta> {

    return this.http.post<Venta>(this.apiUrl, venta);

  }

  actualizarVenta(id: string, venta: Venta): Observable<Venta> {

    return this.http.put<Venta>(`${this.apiUrl}/${id}`, venta);

  }

  eliminarVenta(id: string): Observable<{ ok: boolean }> {

    return this.http.delete<{ ok: boolean }>(`${this.apiUrl}/${id}`);

  }

}