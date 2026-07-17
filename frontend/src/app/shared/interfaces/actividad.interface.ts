export interface Actividad {

    _id?: string;

    tipo: string;

    descripcion: string;

    cliente: string | { _id: string; nombre: string };

    responsable: string | { _id: string; nombre: string };

    createdAt?: string;

    updatedAt?: string;

}