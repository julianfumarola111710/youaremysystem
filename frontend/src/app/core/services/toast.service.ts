import { Injectable, signal } from '@angular/core';

export interface ToastMensaje {

  id: number;

  texto: string;

  tipo: 'exito' | 'error';

}

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  private contador = 0;

  mensajes = signal<ToastMensaje[]>([]);

  mostrarExito(texto: string): void {

    this.agregar(texto, 'exito');

  }

  mostrarError(texto: string): void {

    this.agregar(texto, 'error');

  }

  private agregar(texto: string, tipo: 'exito' | 'error'): void {

    const id = this.contador++;

    this.mensajes.update((lista: ToastMensaje[]) => [...lista, { id, texto, tipo }]);

    setTimeout(() => {

      this.mensajes.update((lista: ToastMensaje[]) => lista.filter(m => m.id !== id));

    }, 3500);

  }

}