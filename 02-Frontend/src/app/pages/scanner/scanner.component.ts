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
    // Definimos el color y el icono según el impacto (Requisito del reto)
    const isGood = p.environmentalImpact >= 70;
    const iconColor = isGood ? '#16a34a' : '#dc2626';

    Swal.fire({
        title: `<span style="color: #1e293b">${p.name}</span>`,
        icon: p.isSustainable ? 'success' : 'warning', // Icono cambia según sostenibilidad
        html: `
            <div class="text-start" style="font-family: 'Inter', sans-serif;">
                <p><strong>Categoría:</strong> <span class="badge bg-light text-dark">${p.category}</span></p>
                <p><strong>Eco-Score:</strong> 
                    <span style="color: ${iconColor}; font-weight: bold;">${p.environmentalImpact} pts</span>
                </p>
                <p><strong>Sostenible:</strong> ${p.isSustainable ? '✅ Producto Sostenible' : '❌ Alto impacto ambiental'}</p>
            </div>
        `,
        confirmButtonText: 'Continuar Escaneando',
        confirmButtonColor: '#1e293b',
        showClass: { popup: 'animate__animated animate__fadeInUp' }
    }).then(() => {
        this.scannerEnabled = true; // Reactiva la cámara automáticamente
    });
}

  mostrarAlertaError(mensaje: string) {
    Swal.fire({ title: 'Atención', text: mensaje, icon: 'warning' });
  }
}