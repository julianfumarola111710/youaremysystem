export interface AuthResponse {
  ok: boolean;
  mensaje: string;
  accessToken: string;
  refreshToken: string;
  usuario: {
    id: string;
    nombre: string;
    email: string;
    rol: string;
  };
}