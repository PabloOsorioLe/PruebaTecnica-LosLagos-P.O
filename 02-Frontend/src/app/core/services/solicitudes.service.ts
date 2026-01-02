import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

// Definimos una interfaz sencilla para la Solicitud
export interface Solicitud {
  id?: number;
  productName: string;
  category: string;
  description: string;
  status?: string;
  createdAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class SolicitudesService {
  private apiUrl = `${environment.apiUrl}/solicitudes`;

  constructor(private http: HttpClient) { }

  // Obtener todas las solicitudes desde Azure
  getSolicitudes(): Observable<Solicitud[]> {
    return this.http.get<Solicitud[]>(this.apiUrl);
  }

  // Enviar una nueva propuesta
  crearSolicitud(solicitud: Solicitud): Observable<Solicitud> {
    return this.http.post<Solicitud>(this.apiUrl, solicitud);
  }
}