export interface Usuario {

    _id?: string;

    nombre: string;

    email: string;

    password: string;

    rol: 'admin' | 'user';

    activo: boolean;

    refreshToken?: string | null;

    createdAt?: string;

    updatedAt?: string;

}