import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  menuAbierto = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  toggleMenu(): void {
    this.menuAbierto = !this.menuAbierto;
  }

  logout(event: Event): void {
    event.preventDefault();
    this.menuAbierto = false;

    Swal.fire({
      title: '¿Cerrar sesión?',
      text: "Se finalizará su sesión en GrupoLagos.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#1e293b', // Color Slate institucional
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.clear();
        this.authService.cerrarSesion();
        this.router.navigate(['/auth/login']);
      }
    });
  }
}