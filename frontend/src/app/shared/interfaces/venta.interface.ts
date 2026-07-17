export interface Venta {

    _id?: string;

    cliente: string | { _id: string; nombre: string };

    usuario: string | { _id: string; nombre: string };

    producto: string | { _id: string; nombre: string };

    fecha: string;

    total: number;

    createdAt?: string;

    updatedAt?: string;

}