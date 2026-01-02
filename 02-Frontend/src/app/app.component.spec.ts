import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { IdleTimeoutService } from './services/idle-timeout.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'FrontendCore';
  tituloActual = ''; // Será enviado al navbar

  constructor(
    public router: Router,
    private idleService: IdleTimeoutService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const isLoginPage = this.router.url === '/login';

        if (isLoginPage) {
          this.idleService.stopWatching();
        } else {
          const isLoggedIn = !!localStorage.getItem('token') || !!sessionStorage.getItem('token');
          if (isLoggedIn) {
            this.idleService.startWatching();
          }
        }

        this.setTituloDesdeRuta(event.urlAfterRedirects);

        // También puedes cerrar menú móvil desde aquí si prefieres
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
          navbarCollapse.classList.remove('show');
        }
      }
    });
  }

  get mostrarLayout(): boolean {
    return this.router.url !== '/login';
  }

  setTituloDesdeRuta(url: string): void {
    if (url.includes('trabajadores')) this.tituloActual = 'trabajadores';
    else if (url.includes('visitas')) this.tituloActual = 'Visitas';
    else if (url.includes('personas')) this.tituloActual = 'Personas';
    else if (url.includes('productos')) this.tituloActual = 'Productos';
    else if (url.includes('informe-tecnico')) this.tituloActual = 'Informe Técnico';
    else if (url.includes('reuniones')) this.tituloActual = 'Reuniones';
    else if (url.includes('players')) this.tituloActual = 'Players';
    else this.tituloActual = '';
  }
}
