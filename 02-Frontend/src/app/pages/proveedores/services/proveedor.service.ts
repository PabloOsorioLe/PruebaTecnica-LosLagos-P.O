import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
// Ajusta la ruta si es necesario, según tu estructura de carpetas
import { Proveedor } from '../interfaces/proveedor.interface';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {

  constructor() { }

  getProveedores(): Observable<Proveedor[]> {
    const data: Proveedor[] = [
      {
        id: 1,
        empresa: 'Muebles Santiago SpA',
        rut: '76.123.456-K',
        rubro: 'Mobiliario',
        contacto: 'Juan Pérez',
        email: 'ventas@mueblessantiago.cl',
        calificacion: 5,
        expanded: false, // <--- INICIA CERRADO
        productos: [
          { sku: 'MOB-SIL-001', nombre: 'Silla Ergonómica Pro (Negro)', stock: 500, precioUnitario: 45000, unidad: 'un.', seleccionado: false },
          { sku: 'MOB-SIL-002', nombre: 'Silla Ergonómica Pro (Gris)', stock: 150, precioUnitario: 47000, unidad: 'un.', seleccionado: false },
          { sku: 'MOB-WKS-005', nombre: 'Kit Reposapiés Ajustable', stock: 50, precioUnitario: 12000, unidad: 'un.', seleccionado: false }
        ]
      },
      {
        id: 2,
        empresa: 'Oficina Total',
        rut: '99.888.777-1',
        rubro: 'Mobiliario',
        contacto: 'María González',
        email: 'maria@oficinatotal.cl',
        calificacion: 4,
        expanded: false, // <--- INICIA CERRADO
        productos: [
          { sku: 'MOB-SIL-001', nombre: 'Silla Ergonómica Pro (Importada)', stock: 1200, precioUnitario: 42000, unidad: 'un.', seleccionado: false }
        ]
      },
      {
        id: 3,
        empresa: 'Tech & Sillas',
        rut: '55.444.333-2',
        rubro: 'Tecnología y Muebles',
        contacto: 'Carlos Ruiz',
        email: 'contacto@techsillas.com',
        calificacion: 3,
        expanded: false, // <--- INICIA CERRADO
        productos: [
          { sku: 'MOB-SIL-001-R', nombre: 'Silla Ergonómica Reacondicionada', stock: 20, precioUnitario: 25000, unidad: 'un.', seleccionado: false }
        ]
      }
    ];
    return of(data);
  }
}