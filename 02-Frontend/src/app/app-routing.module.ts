import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// 1. IMPORTACIONES FALTANTES (Esto es lo que quita el error)
import { AuthGuard } from './core/guards/auth.guard';
import { SolicitudesComponent } from './pages/solicitudes/solicitudes.component';
import { ScannerComponent } from './pages/scanner/scanner.component';
import { ProductosComponent } from './pages/productos/productos.component';

const routes: Routes = [
  // Redirección inicial: directo al login
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },

  { 
    path: 'solicitudes', 
    component: SolicitudesComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'scanner', 
    component: ScannerComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'productos', 
    component: ProductosComponent, 
    canActivate: [AuthGuard] 
  },

  // Módulo de Autenticación con Lazy Loading
  { 
    path: 'auth', 
    loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule) 
  },

  // Ruta comodín: si la ruta no existe, vuelve al login o a solicitudes
  { path: '**', redirectTo: '/auth/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {}