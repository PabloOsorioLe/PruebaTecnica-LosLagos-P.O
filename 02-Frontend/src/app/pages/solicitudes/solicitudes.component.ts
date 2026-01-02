import { Component, OnInit } from '@angular/core';
import { SolicitudesService, Solicitud } from '../../core/services/solicitudes.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.css']
})
export class SolicitudesComponent implements OnInit {
  
  nuevaSolicitud: Solicitud = {
    productName: '',
    category: 'Lacteos',
    description: ''
  };

  listaSolicitudes: Solicitud[] = [];
  cargando: boolean = false;

  constructor(private solicitudesService: SolicitudesService) { }

  ngOnInit(): void {
    this.cargarSolicitudes();
  }

  cargarSolicitudes() {
    this.cargando = true;
    this.solicitudesService.getSolicitudes().subscribe({
      next: (res) => {
        this.listaSolicitudes = res;
        this.cargando = false;
      },
      error: () => this.cargando = false
    });
  }

  // Nombre corregido para coincidir con el (ngSubmit) de tu HTML
  enviarSolicitud() {
    this.solicitudesService.crearSolicitud(this.nuevaSolicitud).subscribe({
      next: () => {
        Swal.fire({
          title: '¡Solicitud Registrada!',
          text: 'Se ha guardado exitosamente en la base de datos de Azure.',
          icon: 'success',
          confirmButtonColor: '#1e293b'
        });
        
        this.nuevaSolicitud = { productName: '', category: 'Lacteos', description: '' };
        this.cargarSolicitudes();
      },
      error: (err) => {
        Swal.fire('Error', 'Asegúrate de que el backend en Render esté activo.', 'error');
      }
    });
  }

  getStatusBadgeClass(status: string | undefined): string {
    switch (status) {
      case 'aprobada': return 'bg-success';
      case 'rechazada': return 'bg-danger';
      default: return 'bg-warning text-dark';
    }
  }
}