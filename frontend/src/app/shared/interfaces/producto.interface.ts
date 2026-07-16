export interface Producto {
  _id?: string;
  nombre: string;
  codigo_sku: string;
  categoria: 'Electronica' | 'Hogar' | 'Oficina' | 'Ropa' | 'Alimentos';
  precio: number;
  stock: number;
  descripcion?: string;
  activo: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductosResponse {
  ok: boolean;
  total: number;
  productos: Producto[];
}

export interface ProductoResponse {
  ok: boolean;
  mensaje?: string;
  producto: Producto;
  errores?: string[];
}