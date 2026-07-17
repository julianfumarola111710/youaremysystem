export interface Venta {

    _id?: string;

    cliente: string | { _id: string; nombre: string };

    usuario: string | { _id: string; nombre: string };

    producto: string | { _id: string; nombre: string; precio: number };

    fecha: string;

    cantidad: number;

    precioUnitario: number;

    subtotal: number;

    itbms: number;

    total: number;

    createdAt?: string;

    updatedAt?: string;

}