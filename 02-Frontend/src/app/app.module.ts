import { NgModule, isDevMode, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeEsCL from '@angular/common/locales/es-CL';

registerLocaleData(localeEsCL);

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// Componentes standalone
import { NavbarComponent } from './shared/components/navbar/navbar.component';

// Módulos legacy
import { AuthModule } from './pages/auth/auth.module';

// Angular Material
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

// Otros
import { FlatpickrModule } from 'angularx-flatpickr';
import { ServiceWorkerModule } from '@angular/service-worker';
import { SolicitudesComponent } from './pages/solicitudes/solicitudes.component';
import { ScannerComponent } from './pages/scanner/scanner.component';
import { ProductosComponent } from './pages/productos/productos.component';
import { ZXingScannerModule } from '@zxing/ngx-scanner';

@NgModule({
  declarations: [
    AppComponent,
    SolicitudesComponent,
    ScannerComponent,
    ProductosComponent
    // NO declarar aquí componentes standalone
    // NO declarar MantenedorProductosComponent
  ],
  imports: [
    // 1. Componentes standalone
    NavbarComponent,

    // 2. Core Angular
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,

    // 3. Módulos funcionales
    AuthModule,

    // 4. Angular Material
    MatPaginatorModule,
    MatTableModule,
    MatSelectModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatIconModule,
    MatAutocompleteModule,

    // 5. Librerías externas
    FlatpickrModule.forRoot(),
   
    // 6. PWA
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),

     // 7. Libreria scaner
    ZXingScannerModule,
 
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es-CL' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
