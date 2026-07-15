import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { NotifiService } from '../../core/services/notifi.service';
import { Notifi } from '../../shared/interfaces/notifi.interface';

@Component({
  selector: 'app-notifi',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './notifi.component.html',
  styleUrl: './notifi.component.css'
})

export class NotifiComponent implements OnInit {

  notifis: Notifi[] = [];

  notifiSeleccionada: Notifi | null = null;

  notifiForm: FormGroup;

  constructor(

    private fb: FormBuilder,

    private notifiService: NotifiService

  ) {

    this.notifiForm = this.fb.group({

      mensaje: ['', Validators.required],

      usuario: ['', Validators.required],

      fecha: ['', Validators.required]

    });

  }

  ngOnInit(): void {

    this.cargarNotifis();

  }

  cargarNotifis(): void {

    this.notifiService.getNotifis().subscribe({

      next: (data: Notifi[]) => {

        this.notifis = data;

      },

      error: (err: Error) => {

        console.error(err);

      }

    });

  }

  guardarNotifi(): void {

    if (this.notifiForm.invalid) {

      return;

    }

    if (this.notifiSeleccionada) {

      this.actualizarNotifi();

    }

    else {

      this.crearNotifi();

    }

  }

  crearNotifi(): void {

    this.notifiService

      .crearNotifi(this.notifiForm.value)

      .subscribe({

        next: (_data: Notifi) => {

          this.cargarNotifis();

          this.limpiarFormulario();

        },

        error: (err: Error) => {

          console.error(err);

        }

      });

  }

  actualizarNotifi(): void {

    if (!this.notifiSeleccionada?._id) {

      return;

    }

    this.notifiService

      .actualizarNotifi(

        this.notifiSeleccionada._id,

        this.notifiForm.value

      )

      .subscribe({

        next: (_data: Notifi) => {

          this.cargarNotifis();

          this.limpiarFormulario();

        },

        error: (err: Error) => {

          console.error(err);

        }

      });

  }

  editar(notifi: Notifi): void {

    this.notifiSeleccionada = notifi;

    this.notifiForm.patchValue({

      mensaje: notifi.mensaje,

      usuario:
        typeof notifi.usuario === 'object'
          ? notifi.usuario._id
          : notifi.usuario,

      fecha: notifi.fecha.substring(0,16)

    });

  }

  eliminar(id?: string): void {

    if (!id) {

      return;

    }

    if (!confirm('¿Eliminar notificación?')) {

      return;

    }

    this.notifiService

      .eliminarNotifi(id)

      .subscribe({

        next: (_data: unknown) => {

          this.cargarNotifis();

        },

        error: (err: Error) => {

          console.error(err);

        }

      });

  }

  limpiarFormulario(): void {

    this.notifiSeleccionada = null;

    this.notifiForm.reset();

  }

}