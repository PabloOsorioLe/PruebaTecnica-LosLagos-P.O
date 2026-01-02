import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

// --- IMPORTACIONES CORREGIDAS (CORE) ---
import { AuthService } from './core/services/auth.service';
import { Usuario } from './core/models/usuario.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  mostrarLayout: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {
    // Registro global del SVG de Excel
    this.iconRegistry.addSvgIcon(
      'excel',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/excel.svg')
    );
  }

  ngOnInit() {
    // Observa cambios de navegación
    this.router.events
      .pipe(
        filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
      )
      .subscribe(() => {
        this.actualizarLayout();
      });

    // Observa cambios de autenticación en tiempo real
    this.authService.usuarioActual$.subscribe(() => {
      this.actualizarLayout();
    });

    // Inicializa layout al cargar la app
    this.actualizarLayout();
  }

  actualizarLayout() {
    const usuario: Usuario | null = this.authService.obtenerUsuarioActual();
    // Nota: Como movimos auth a /pages/auth, la URL podría contener '/auth/login'
    // El .includes('/login') sigue funcionando bien.
    const enLogin = this.router.url.includes('/login');
    this.mostrarLayout = !!usuario && !enLogin;

    console.log('AppComponent -> actualizarLayout');
    console.log('Usuario actual:', usuario);
    console.log('URL actual:', this.router.url);
    console.log('mostrarLayout:', this.mostrarLayout);
  }
}