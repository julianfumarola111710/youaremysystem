import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

import { Actividad } from '../../shared/interfaces/actividad.interface';

@Injectable({
  providedIn: 'root'
})

export class ActividadService {

  private apiUrl = environment.apiUrl + '/actividades';

  constructor(
    private http: HttpClient
  ) { }

  getActividades(): Observable<Actividad[]> {

    return this.http.get<Actividad[]>(this.apiUrl);

  }

  getActividad(id: string): Observable<Actividad> {

    return this.http.get<Actividad>(`${this.apiUrl}/${id}`);

  }

  crearActividad(actividad: Actividad): Observable<Actividad> {

    return this.http.post<Actividad>(this.apiUrl, actividad);

  }

  actualizarActividad(id: string, actividad: Actividad): Observable<Actividad> {

    return this.http.put<Actividad>(`${this.apiUrl}/${id}`, actividad);

  }

  eliminarActividad(id: string): Observable<{ ok: boolean }> {

    return this.http.delete<{ ok: boolean }>(`${this.apiUrl}/${id}`);

  }

}