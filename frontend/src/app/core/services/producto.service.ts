import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import {
  Producto,
  ProductoResponse,
  ProductosResponse
} from '../../shared/interfaces/producto.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private apiUrl = environment.apiUrl + '/productos';

  constructor(private http: HttpClient) {}

  getProductos(): Observable<ProductosResponse> {
    return this.http.get<ProductosResponse>(this.apiUrl);
  }

  getProducto(id: string): Observable<ProductoResponse> {
    return this.http.get<ProductoResponse>(`${this.apiUrl}/${id}`);
  }

  crearProducto(producto: Producto): Observable<ProductoResponse> {
    return this.http.post<ProductoResponse>(this.apiUrl, producto);
  }

  actualizarProducto(
    id: string,
    producto: Producto
  ): Observable<ProductoResponse> {
    return this.http.put<ProductoResponse>(
      `${this.apiUrl}/${id}`,
      producto
    );
  }

  eliminarProducto(id: string): Observable<ProductoResponse> {
    return this.http.delete<ProductoResponse>(
      `${this.apiUrl}/${id}`
    );
  }
}