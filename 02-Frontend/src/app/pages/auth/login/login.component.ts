import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { forkJoin, timer } from 'rxjs';

import { AuthService } from '../../../core/services/auth.service';
import { Usuario } from '../../../core/models/usuario.model';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit {
  cargando: boolean = true;
  cargandoVisible: boolean = true;
  usuario: string = '';
  password: string = '';
  mostrarPassword: boolean = false;

  @ViewChild('usuarioInput') usuarioInputRef!: ElementRef<HTMLInputElement>;

  constructor(
    private router: Router,
    private authService: AuthService,
    private ngZone: NgZone,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    console.log('LoginComponent - ngOnInit iniciado');
    
    forkJoin({
      timer: timer(1000), 
      dummy: timer(500) 
    }).subscribe({
      next: () => this.finalizarCarga(),
      error: (err) => {
        console.warn('LoginComponent - error en carga', err);
        this.finalizarCarga();
      }
    });
  }

  finalizarCarga() {
    this.cargando = false;
    this.cargandoVisible = false;
    console.log('LoginComponent - Listo para interactuar');
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.usuarioInputRef) {
        this.usuarioInputRef.nativeElement.focus();
      }
    }, 300);
  }

  iniciarSesion(): void {
    console.log('Intentando login...');

    if (!this.usuario || !this.password) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos requeridos',
        text: 'Por favor, ingrese usuario y contraseña.'
      });
      return;
    }

    this.cargando = true;
    this.cargandoVisible = true;

    const url = `${environment.apiUrl}/auth/login`;
    const payload = { rut: this.usuario, password: this.password };

    // --- BLOQUE DE PRUEBA (Descomentar si no hay backend) ---
    /*
    setTimeout(() => {
       const userFake: Usuario = { id: 1, nombre: this.usuario, correo: 'test@test.com', rol: 'Admin' };
       this.procesarLoginExitoso({ token: 'fake-token', ...userFake });
    }, 1500);
    return;
    */
    // --------------------------------------------------------

    this.http.post<any>(url, payload).subscribe({
      next: (res) => this.procesarLoginExitoso(res),
      error: (err) => this.onLoginError(err)
    });
  }

  procesarLoginExitoso(res: any) {
    console.log('Login exitoso:', res);
    sessionStorage.setItem('token', res.token);

    const usuarioLogueado: Usuario = {
      id: res.id || 1, 
      nombre: res.nombre || this.usuario,
      correo: res.correo || 'correo@ejemplo.com',
      rol: res.rol || 'Admin'
    };

    this.authService.iniciarSesion(usuarioLogueado);
    this.onLoginSuccess();
  }

  private onLoginSuccess(): void {
    this.fadeOut(() => {
      Swal.fire({
        icon: 'success',
        title: 'Bienvenido/a',
        showConfirmButton: false,
        timer: 1500,
        background: 'rgba(24, 24, 24, 0.85)',
        color: '#99caff',
        iconColor: '#28a745'
      }).then(() => {
        this.ngZone.run(() => {
          this.router.navigate(['/solicitudes']);
        });
      });
    });
  }

  private onLoginError(err: any): void {
    console.error('Error login:', err);
    this.fadeOut(() => {
      let mensaje = 'Problemas con el servidor.';
      if (err.status === 401) mensaje = 'Credenciales incorrectas.';
      
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: mensaje,
        background: 'rgba(30, 10, 10, 0.85)',
        color: '#ff9999'
      });
    });
  }

  fadeOut(callback: () => void) {
    this.cargandoVisible = false;
    setTimeout(() => {
      this.cargando = false;
      callback();
    }, 500);
  }

  // --- CORRECCIÓN: Agregamos el método que faltaba ---
  scrollToInput(event: any): void {
    const target = event.target as HTMLElement;
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}