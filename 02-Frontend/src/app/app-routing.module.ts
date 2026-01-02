import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Guard de seguridad (en core)
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  // Redirección inicial
  { path: '', redirectTo: '/solicitudes', pathMatch: 'full' },

  // MANTENEDOR DE PRODUCTOS (standalone + lazy)
  {
    path: 'productos',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/mantenedor-productos/mantenedor-productos.component')
        .then(m => m.MantenedorProductosComponent)
  },

  // --- NUEVA RUTA AGREGADA: PROVEEDORES ---
  {
    path: 'proveedores',
    canActivate: [AuthGuard],
    loadComponent: () => 
      import('./pages/proveedores/proveedores.component')
        .then(m => m.ProveedoresComponent)
  },
  // ----------------------------------------

  // Listado de Solicitudes (Lazy Loading standalone)
  {
    path: 'solicitudes',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/solicitudes/lista-solicitudes/lista-solicitudes.component')
        .then(m => m.ListaSolicitudesComponent)
  },

  // Nueva Solicitud (Lazy Loading standalone)
  {
    path: 'solicitudes/nueva',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/solicitudes/nueva-solicitud/nueva-solicitud.component')
        .then(m => m.NuevaSolicitudComponent)
  },

  // Módulo de Autenticación (Login/Registro)
  {
    path: 'auth',
    loadChildren: () =>
      import('./pages/auth/auth.module').then(m => m.AuthModule)
  },

  // Ruta comodín (404) - Siempre al final
  { path: '**', redirectTo: '/solicitudes' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}