import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../core/services/ProductService';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  stats: any = null;
  cargando: boolean = true;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.cargarEstadisticas();
  }

  cargarEstadisticas() {
    this.productService.getImpactStats().subscribe({
      next: (res) => {
        this.stats = res;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar métricas de impacto:', err);
        this.cargando = false;
      }
    });
  }
}