// src/app/shared/components/navbar/navbar.component.ts (ruta ejemplo)
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  menuVisible = true;
  menuAbierto = false; // controla el collapse
  iconoActual = 'bi-house';
  tituloActual = 'Inicio';

  constructor(private authService: AuthService) {}

  cerrarSesion(event: Event): void {
    event.preventDefault();
    this.menuAbierto = false;
    this.authService.logout();
  }

  toggleMenu(): void {
    this.menuAbierto = !this.menuAbierto;
  }

  onNavegar(titulo: string, icono: string): void {
    this.tituloActual = titulo;
    this.iconoActual = icono;
    this.menuAbierto = false;
  }
}
