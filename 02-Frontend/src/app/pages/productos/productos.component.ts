import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../core/services/ProductService';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
  listaProductos: Product[] = [];
  cargando: boolean = true;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.cargarDesdeAzure();
  }

  cargarDesdeAzure() {
    this.productService.getProducts().subscribe({
      next: (res) => {
        this.listaProductos = res;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al conectar con el backend:', err);
        this.cargando = false;
      }
    });
  }

  // Lógica para los colores del Eco-Score (Requisito del reto)
  getColorImpacto(score: number): string {
    if (score >= 80) return '#16a34a'; // Verde (Sostenible)
    if (score >= 40) return '#eab308'; // Amarillo (Medio)
    return '#dc2626'; // Rojo (Alto impacto)
  }
}