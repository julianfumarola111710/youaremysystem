export interface Ticket {

    _id?: string;

    cliente: string | { _id: string; nombre: string };

    problema: string;

    estado: string;

    prioridad: string;

    responsable?: string | { _id: string; nombre: string };

    createdAt?: string;

    updatedAt?: string;

}