// src/app/interfaces/usuario.ts
export interface Usuario {
  id: number;          // ID del usuario
  nombre: string;      // Nombre completo
  correo: string;      // Email del usuario
  rol?: string;        // Rol del usuario (opcional)
  token?: string;      // Token JWT si usas autenticación con token
}
