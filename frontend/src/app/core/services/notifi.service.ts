import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

import { Notifi } from '../../shared/interfaces/notifi.interface';

@Injectable({
  providedIn: 'root'
})

export class NotifiService {

  private apiUrl = environment.apiUrl + '/notifi';

  constructor(
    private http: HttpClient
  ) { }

  getNotifis(): Observable<Notifi[]> {

    return this.http.get<Notifi[]>(this.apiUrl);

  }

  getNotifi(id: string): Observable<Notifi> {

    return this.http.get<Notifi>(`${this.apiUrl}/${id}`);

  }

  crearNotifi(notifi: Notifi): Observable<Notifi> {

    return this.http.post<Notifi>(
      this.apiUrl,
      notifi
    );

  }

  actualizarNotifi(
    id: string,
    notifi: Notifi
  ): Observable<Notifi> {

    return this.http.put<Notifi>(
      `${this.apiUrl}/${id}`,
      notifi
    );

  }

  eliminarNotifi(id: string): Observable<any> {

    return this.http.delete(
      `${this.apiUrl}/${id}`
    );

  }

}