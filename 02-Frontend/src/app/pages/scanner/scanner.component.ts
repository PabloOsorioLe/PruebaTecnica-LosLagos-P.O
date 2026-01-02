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
  manualCode: string = '';

  allowedFormats = [ 
    BarcodeFormat.EAN_13, 
    BarcodeFormat.CODE_128, 
    BarcodeFormat.QR_CODE 
  ];
  

  constructor(private productService: ProductService) {}

  onManualSearch() {
    if (!this.manualCode) return;
    this.procesarCodigo(this.manualCode);
  }
  // Se activa al detectar un código de barras
// src/app/pages/scanner/scanner.component.ts
onCodeResult(resultString: string) {
    this.scannerEnabled = false;
    this.procesarCodigo(resultString);
  }

  // Lógica centralizada de consulta
  private procesarCodigo(codigo: string) {
    this.productService.scanBarcode(codigo).subscribe({
      next: (producto) => {
        this.mostrarResultadoExitoso(producto);
        this.manualCode = ''; // Limpiar tras éxito
      },
      error: (err) => {
        if (err.status === 404) {
          this.mostrarAlertaError(`El código ${codigo} no existe en Azure ni en la base mundial.`);
        } else {
          this.mostrarAlertaError('Error de comunicación con el servidor.');
        }
      }
    });
  }

 mostrarResultadoExitoso(p: any) {
    // Definimos el color y el icono según el impacto (Requisito del reto)
    const isGood = p.environmentalImpact >= 70;
    const iconColor = isGood ? '#16a34a' : '#dc2626';

    Swal.fire({
        title: `<span style="color: #1e293b">${p.name}</span>`,
        icon: p.isSustainable ? 'success' : 'warning',
        html: `
            <div class="text-start" style="font-family: 'Inter', sans-serif;">
                <p><strong>Categoría:</strong> <span class="badge bg-light text-dark">${p.category}</span></p>
                <p><strong>Eco-Score:</strong> 
                    <span style="color: ${iconColor}; font-weight: bold;">${p.environmentalImpact} pts</span>
                </p>
                <p><strong>Sostenible:</strong> ${p.isSustainable ? '✅ Producto Sostenible' : '❌ Alto impacto ambiental'}</p>
            </div>
        `,
        showCancelButton: true, // Habilita el segundo botón
        confirmButtonText: 'Continuar Escaneando',
        cancelButtonText: 'Cerrar',
        confirmButtonColor: '#1e293b', // Color oscuro institucional
        cancelButtonColor: '#64748b',  // Color gris para la opción de cerrar
        reverseButtons: true,          // Pone "Cerrar" a la izquierda para mejor UX
        showClass: { popup: 'animate__animated animate__fadeInUp' }
    }).then((result) => {
        // Solo reactiva la cámara si el usuario hizo clic en "Continuar Escaneando"
        if (result.isConfirmed) {
            this.scannerEnabled = true;
        } else {
            // Si hace clic en "Cerrar", la cámara se mantiene apagada
            this.scannerEnabled = false;
        }
    });
}

  mostrarAlertaError(mensaje: string) {
    Swal.fire({ title: 'Atención', text: mensaje, icon: 'warning' });
  }
}