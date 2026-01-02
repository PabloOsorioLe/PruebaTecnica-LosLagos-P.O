import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

// CORRECCIÓN 1: Apuntamos a la carpeta correcta 'models' y al archivo '.model'
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
    this.usuarioActualSubject.next(usuario);
    console.log('AuthService -> usuarioActualSubject emitido', usuario);
  }

  // CORRECCIÓN 2: Renombrado a 'logout' para que coincida con el Navbar
  logout() {
    sessionStorage.removeItem('usuarioActual');
    sessionStorage.removeItem('token');
    this.usuarioActualSubject.next(null);
    
    this.router.navigate(['/auth/login']).then(() => {
      window.location.reload(); 
    });
  }

  obtenerUsuarioActual(): Usuario | null {
    return this.usuarioActualSubject.value;
  }
}