import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable, map } from 'rxjs';

import { environment } from '../../environments/environment';

import { Usuario } from '../../shared/interfaces/usuario.interface';

@Injectable({
  providedIn: 'root'
})

export class UsuarioService {

  private apiUrl = environment.apiUrl + '/usuario';

  constructor(
    private http: HttpClient
  ) { }

  /* ===========================
     Obtener todos
  =========================== */

  getUsers(): Observable<Usuario[]> {

    return this.http

      .get<{ ok: boolean; usuarios: Usuario[] }>(this.apiUrl)

      .pipe(

        map((response: { ok: boolean; usuarios: Usuario[] }) => response.usuarios)

      );

  }

  /* ===========================
     Obtener por ID
  =========================== */

  getUser(id: string): Observable<Usuario> {

    return this.http

      .get<{ success: boolean; data: Usuario }>(

        `${this.apiUrl}/${id}`

      )

      .pipe(

        map((response: { success: boolean; data: Usuario }) => response.data)

      );

  }

  /* ===========================
     Crear
  =========================== */

  crearUsuario(usuario: Usuario): Observable<any> {

    return this.http.post(

      this.apiUrl,

      usuario

    );

  }

  /* ===========================
     Actualizar
  =========================== */

  actualizarUsuario(

    id: string,

    usuario: Usuario

  ): Observable<any> {

    return this.http.put(

      `${this.apiUrl}/${id}`,

      usuario

    );

  }

  /* ===========================
     Eliminar
  =========================== */

  eliminarUsuario(id: string): Observable<any> {

    return this.http.delete(

      `${this.apiUrl}/${id}`

    );

  }

}