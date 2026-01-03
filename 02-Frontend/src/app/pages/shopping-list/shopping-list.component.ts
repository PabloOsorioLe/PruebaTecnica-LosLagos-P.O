import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../core/services/ProductService';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {
  productos: any[] = [];
  sugerencias: Map<string, any> = new Map(); // Guarda alternativas recomendadas

  presupuesto: number = 20000; // Valor por defecto ajustable por el usuario
  excedido: boolean = false;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.cargarLista();
  }

cargarLista() {
  this.productos = JSON.parse(localStorage.getItem('mi_lista') || '[]');
  this.analizarSustitutos();
  this.analizarPresupuesto(); 
}

  analizarSustitutos() {
    this.productService.getProducts().subscribe(inventario => {
      this.productos.forEach(p => {
        // Si el producto es de bajo impacto (Eco-Score < 60)
        if (p.environmentalImpact < 60) {
          // Buscamos en el inventario local uno de la misma categoría con mejor score
          const mejorAlternativa = inventario
            .filter(inv => inv.category === p.category && inv.environmentalImpact > p.environmentalImpact)
            .sort((a, b) => b.environmentalImpact - a.environmentalImpact)[0];

          if (mejorAlternativa) {
            this.sugerencias.set(p.barcode, mejorAlternativa);
          }
        }
      });
    });
  }

  sustituir(index: number, nuevoProducto: any) {
    this.productos[index] = nuevoProducto;
    this.guardarYRefrescar();
    Swal.fire('¡Optimizado!', 'Has mejorado la sostenibilidad de tu lista.', 'success');
  }

  eliminar(index: number) {
    this.productos.splice(index, 1);
    this.guardarYRefrescar();
  }

  private guardarYRefrescar() {
    localStorage.setItem('mi_lista', JSON.stringify(this.productos));
    this.cargarLista();
  }
calcularPromedioEco(): number {
  if (this.productos.length === 0) return 0;
  const suma = this.productos.reduce((acc, p) => {
    const impact = p.environmentalImpact ? Number(p.environmentalImpact) : 0;
    return acc + impact;
  }, 0);
  return Math.round(suma / this.productos.length);
}

finalizarCompra() {
  Swal.fire({
    title: '¡Compra Registrada!',
    text: 'Tu impacto positivo ha sido contabilizado y la lista se ha limpiado.',
    icon: 'success',
    confirmButtonColor: '#1e293b'
  });
  localStorage.removeItem('mi_lista');
  this.cargarLista();
}
obtenerClaseScore(score: number): string {
  if (score >= 70) {
    return 'bg-eco-high';   // Verde
  } else if (score >= 40) {
    return 'bg-eco-medium'; // Amarillo
  } else {
    return 'bg-eco-low';    // Rojo
  }
}

// Calcula la suma total de dinero de los productos en la lista
calcularTotal(): number {
  return this.productos.reduce((acc, p) => {
    const precio = p.price ? Number(p.price) : 0;
    return acc + precio;
  }, 0);
}

analizarPresupuesto() {
  this.excedido = this.calcularTotal() > this.presupuesto;
}

obtenerSugerenciaRecorte() {
  if (!this.productos || this.productos.length === 0) return null;
  
  return [...this.productos].sort((a, b) => {
    const ratioA = a.environmentalImpact / (a.price || 1);
    const ratioB = b.environmentalImpact / (b.price || 1);
    return ratioA - ratioB; // El que tenga el ratio más bajo es el menos eficiente
  })[0];
}

comparar(actual: any, sugerido: any) {
  const mejora = sugerido.environmentalImpact - actual.environmentalImpact;

  Swal.fire({
    title: '<h4 class="fw-bold mb-0">Comparativa de Sostenibilidad</h4>',
    html: `
      <div class="p-2">
        <table class="table table-borderless align-middle mb-0" style="font-size: 0.95rem;">
          <thead class="border-bottom">
            <tr class="text-center">
              <th class="text-start" style="width: 40%">Característica</th>
              <th class="text-danger" style="width: 30%">Actual</th>
              <th class="text-success" style="width: 30%">Sugerido</th>
            </tr>
          </thead>
          <tbody>
            <tr class="text-center">
              <td class="text-start text-muted">Precio</td>
              <td class="text-danger">$${Number(actual.price).toLocaleString('es-CL')}</td>
              <td class="text-success fw-bold">$${Number(sugerido.price).toLocaleString('es-CL')}</td>
            </tr>
            <tr class="text-center">
              <td class="text-start text-muted">Eco-Score</td>
              <td><span class="badge bg-danger rounded-pill">${actual.environmentalImpact} pts</span></td>
              <td><span class="badge bg-success rounded-pill">${sugerido.environmentalImpact} pts</span></td>
            </tr>
            <tr class="text-center">
              <td class="text-start text-muted">Imp. Social</td>
              <td>${actual.socialImpact}%</td>
              <td class="text-success fw-bold">${sugerido.socialImpact}%</td>
            </tr>
            <tr class="text-center">
              <td class="text-start text-muted">Sostenible</td>
              <td>${actual.isSustainable ? '✅' : '❌'}</td>
              <td><i class="bi bi-check-circle-fill text-success"></i></td>
            </tr>
          </tbody>
        </table>
        
        <div class="mt-4 p-3 bg-light rounded-3 border">
            <p class="mb-0 text-dark" style="font-size: 0.9rem;">
                <i class="bi bi-graph-up-arrow text-success me-1"></i>
                Elegir el sugerido mejora tu impacto global en un <strong>${mejora}%</strong>.
            </p>
        </div>
      </div>
    `,
    showCloseButton: true,
    confirmButtonText: 'Entendido',
    confirmButtonColor: '#1e293b',
    width: '500px',
    customClass: {
      popup: 'rounded-4 shadow-lg'
    }
  });
}

}