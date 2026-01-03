import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../../core/services/auth.service';
import { Usuario } from '../../../core/models/usuario.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  // Propiedades para el formulario
  usuario: string = '';
  password: string = '';
  cargando: boolean = false;
  mostrarPassword: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // Si ya hay un token, redirigir directo a solicitudes
    if (sessionStorage.getItem('token')) {
      this.router.navigate(['/dashboard']);
    }
  }

  iniciarSesion(): void {
    if (!this.usuario || !this.password) {
      Swal.fire({ 
        icon: 'warning', 
        title: 'Campos incompletos', 
        text: 'Por favor, ingrese sus credenciales.',
        confirmButtonColor: '#1e293b'
      });
      return;
    }

    this.cargando = true;

    // Simulación de validación para prueba técnica (1 y 1)
    setTimeout(() => {
      if (this.usuario === '1' && this.password === '1') {
        this.ejecutarLoginExitoso();
      } else {
        this.ejecutarLoginError();
      }
    }, 1200);
  }

  private ejecutarLoginExitoso() {
    // Datos simulados del usuario para el servicio
    const userFake: Usuario = { 
      id: 1, 
      nombre: 'Admin Prueba', 
      correo: 'admin@grupolagos.cl', 
      rol: 'Admin' 
    };

    // Guardar estado en el servicio y token en el navegador
    this.authService.iniciarSesion(userFake);
    sessionStorage.setItem('token', 'fake-jwt-token-grupolagos-12345');

    this.cargando = false;

    Swal.fire({
      icon: 'success',
      title: '¡Acceso Correcto!',
      text: 'Bienvenido al sistema de GrupoLagos',
      timer: 1500,
      showConfirmButton: false
    }).then(() => {
      // Redirigir a la página principal
      this.router.navigate(['/dashboard']);
    });
  }

  private ejecutarLoginError() {
    this.cargando = false;
    Swal.fire({
      icon: 'error',
      title: 'Error de autenticación',
      text: 'Usuario o contraseña inválidos. (Use credenciales de prueba 1 / 1)',
      confirmButtonColor: '#1e293b'
    });
  }
  
   
  
}