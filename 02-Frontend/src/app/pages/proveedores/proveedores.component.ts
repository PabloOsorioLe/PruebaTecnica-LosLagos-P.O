import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Importaciones locales
import { ProveedorService } from './services/proveedor.service';
import { Proveedor } from './interfaces/proveedor.interface';

@Component({
  selector: 'app-proveedores',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css']
})
export class ProveedoresComponent implements OnInit {

  // Inyección de dependencia del servicio
  private proveedorService = inject(ProveedorService);
  
  // Variable principal para los datos
  listaProveedores: Proveedor[] = [];

  ngOnInit(): void {
    this.cargarProveedores();
  }

  cargarProveedores(): void {
    this.proveedorService.getProveedores().subscribe({
      next: (data) => {
        this.listaProveedores = data;
      },
      error: (err) => console.error('Error al cargar proveedores:', err)
    });
  }

  /**
   * Alterna el estado de desplegado/contraído de un proveedor
   * @param prov El proveedor al que se le hizo clic
   */
  toggleExpand(prov: Proveedor): void {
    prov.expanded = !prov.expanded;
  }

  /**
   * Genera un array numérico para iterar las estrellas en el HTML
   * @param calificacion Número de 1 a 5
   */
  getEstrellas(calificacion: number): number[] {
    // Retorna un array vacío de largo N para poder usar *ngFor
    return Array(Math.floor(calificacion)).fill(0);
  }

  /**
   * Recorre todos los proveedores y sus productos para encontrar los seleccionados
   */
  enviarSolicitud(): void {
    const itemsSeleccionados: any[] = [];

    // Recorremos Proveedor -> Productos
    this.listaProveedores.forEach(prov => {
      prov.productos.forEach(prod => {
        if (prod.seleccionado) {
          // Si está seleccionado, guardamos la info combinada
          itemsSeleccionados.push({
            proveedorId: prov.id,
            proveedorNombre: prov.empresa,
            emailContacto: prov.email,
            skuProducto: prod.sku,
            nombreProducto: prod.nombre,
            precio: prod.precioUnitario
          });
        }
      });
    });

    // Validación final
    if (itemsSeleccionados.length > 0) {
      console.log('Procesando Orden de Compra:', itemsSeleccionados);
      alert(`Has seleccionado ${itemsSeleccionados.length} productos. Revisa la consola para ver el detalle.`);
      // Aquí podrías navegar a otra ruta o llamar a una API
    } else {
      alert('Por favor, despliega los proveedores y selecciona al menos un producto.');
    }
  }
}