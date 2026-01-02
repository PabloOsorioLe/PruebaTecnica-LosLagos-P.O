import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usuarioActualSubject = new BehaviorSubject<Usuario | null>(null);
  usuarioActual$: Observable<Usuario | null> = this.usuarioActualSubject.asObservable();

  constructor(private router: Router) {
    const usuarioGuardado = sessionStorage.getItem('usuarioActual');
    if (usuarioGuardado) {
      this.usuarioActualSubject.next(JSON.parse(usuarioGuardado));
    }
  }

  iniciarSesion(usuario: Usuario) {
    sessionStorage.setItem('usuarioActual', JSON.stringify(usuario));
    // El token '12345' ya lo guardamos en el componente, 
    // pero aquí centralizamos la sesión del usuario.
    this.usuarioActualSubject.next(usuario);
  }

  // CAMBIO CLAVE: Renombramos para que el Navbar no dé error
  cerrarSesion() {
    // 1. Limpiamos TODA la sesión (usuario y token)
    sessionStorage.clear();
    
    // 2. Notificamos a toda la app que ya no hay usuario
    this.usuarioActualSubject.next(null);
    
    // 3. Redirigimos al login
    this.router.navigate(['/auth/login']);
  }

  // Opcional: dejamos logout como alias por si acaso
  logout() {
    this.cerrarSesion();
  }

  obtenerUsuarioActual(): Usuario | null {
    return this.usuarioActualSubject.value;
  }
}