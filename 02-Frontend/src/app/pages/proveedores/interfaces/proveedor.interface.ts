export interface ProductoProveedor {
  sku: string;
  nombre: string;
  stock: number;
  precioUnitario: number;
  unidad: string; // ej: 'un.', 'cajas'
  seleccionado: boolean;
}

export interface Proveedor {
  id: number;
  empresa: string;
  rut: string;
  rubro: string;
  contacto: string;
  email: string;
  calificacion: number;
  // Propiedad nueva para controlar el acordeón visual
  expanded?: boolean; 
  productos: ProductoProveedor[];
}