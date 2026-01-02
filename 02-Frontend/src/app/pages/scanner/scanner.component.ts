import { Component } from '@angular/core';
import { ProductService } from '../../core/services/ProductService';
import Swal from 'sweetalert2';
import { BarcodeFormat } from '@zxing/library'; 

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.css']
})
export class ScannerComponent {
  scannerEnabled: boolean = false;

  allowedFormats = [ 
    BarcodeFormat.EAN_13, 
    BarcodeFormat.CODE_128, 
    BarcodeFormat.QR_CODE 
  ];

  constructor(private productService: ProductService) {}

  // Se activa al detectar un código de barras
// src/app/pages/scanner/scanner.component.ts
onCodeResult(resultString: string) {
    this.scannerEnabled = false;
    this.productService.scanBarcode(resultString).subscribe({
      next: (producto) => {
        if (producto) {
          this.mostrarResultadoExitoso(producto);
        } else {
          this.mostrarAlertaError('Producto no registrado en Azure.');
        }
      },
      error: () => this.mostrarAlertaError('Error al conectar con la base de datos.')
    });
  }

  mostrarResultadoExitoso(p: any) {
    Swal.fire({
      title: p.name,
      html: `
        <div class="text-start">
          <p><strong>Categoría:</strong> ${p.category}</p>
          <p><strong>Eco-Score:</strong> ${p.environmentalImpact}</p>
          <p><strong>Sostenible:</strong> ${p.isSustainable ? '✅ Sí' : '❌ No'}</p>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Cerrar',
      confirmButtonColor: '#1e293b' 
    });
  }

  mostrarAlertaError(mensaje: string) {
    Swal.fire({ title: 'Atención', text: mensaje, icon: 'warning' });
  }
}