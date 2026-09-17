export type ProductState = 'Nuevo' | 'Oferta' | 'Más vendido' | 'Selección CasaViva' | 'Agotado';
export type UserRole = 'cliente' | 'admin';
export type OrderState = 'Pendiente' | 'En preparación' | 'Enviado' | 'Entregado' | 'Cancelado';
export type DiscountType = 'porcentaje' | 'monto_fijo';
export type PaymentMethod = 'tarjeta' | 'yape' | 'paypal';
export type InvoiceType = 'boleta' | 'factura';

export interface Category {
  id: string;
  slug: string;
  nombre: string;
  descripcion: string;
  imagen: string;
  icono?: string;
  orden: number;
}

export interface ProductVariant {
  id: string;
  producto_id: string;
  sku: string;
  nombre_variante: string;
  color_nombre: string;
  color_hex: string;
  stock: number;
  precio_adicional: number;
  imagen_variante?: string;
}

export interface Product {
  id: string;
  slug: string;
  nombre: string;
  descripcion: string;
  descripcion_corta: string;
  categoria_id: string;
  categoria_nombre?: string;
  marca: string;
  precio_base: number;
  precio_anterior?: number;
  descuento_porcentaje?: number;
  imagen_principal: string;
  galeria_imagenes: string[];
  dimensiones: string;
  cuidados: string;
  caracteristicas: string[];
  estado: ProductState;
  activo: boolean;
  calificacion_promedio: number;
  total_resenas: number;
  destacado?: boolean;
  novedad_bajo_100?: boolean;
  variantes: ProductVariant[];
}

export interface User {
  id: string;
  nombre: string;
  email: string;
  telefono?: string;
  rol: UserRole;
  creado_en?: string;
}

export interface Address {
  id: string;
  usuario_id: string;
  nombre_destinatario: string;
  telefono: string;
  departamento: string;
  provincia: string;
  distrito: string;
  direccion: string;
  referencia?: string;
  es_principal: boolean;
}

export interface Coupon {
  id: string;
  codigo: string;
  tipo_descuento: DiscountType;
  valor: number;
  compra_minima: number;
  limite_uso: number;
  usos_actuales: number;
  activo: boolean;
  descripcion: string;
}

export interface CartItem {
  producto_id: string;
  variante_id: string;
  sku: string;
  nombre_producto: string;
  nombre_variante: string;
  color_nombre: string;
  color_hex: string;
  precio_unitario: number;
  precio_base: number;
  cantidad: number;
  subtotal: number;
  imagen: string;
  stock_disponible: number;
}

export interface CustomerData {
  nombre: string;
  email: string;
  telefono: string;
  tipo_documento: 'DNI' | 'CE' | 'RUC' | 'Pasaporte';
  numero_documento: string;
}

export interface ShippingAddress {
  departamento: string;
  provincia: string;
  distrito: string;
  direccion: string;
  referencia?: string;
  codigo_postal?: string;
}

export interface BillingData {
  tipo_comprobante: InvoiceType;
  ruc?: string;
  razon_social?: string;
  direccion_fiscal?: string;
}

export interface Order {
  id: string;
  codigo_orden: string;
  usuario_id?: string;
  datos_cliente: CustomerData;
  direccion_envio: ShippingAddress;
  metodo_envio: string;
  costo_envio: number;
  metodo_pago: PaymentMethod;
  estado_pago: 'completado' | 'simulado';
  subtotal: number;
  descuento: number;
  codigo_cupon?: string;
  total: number;
  tipo_comprobante: InvoiceType;
  datos_facturacion?: BillingData;
  estado_pedido: OrderState;
  items: CartItem[];
  notas?: string;
  creado_en: string;
}

export interface Review {
  id: string;
  producto_id: string;
  usuario_nombre: string;
  calificacion: number;
  titulo: string;
  comentario: string;
  verificada: boolean;
  creado_en: string;
}

export interface Subscriber {
  id: string;
  email: string;
  origen: string;
  creado_en: string;
}

export interface AdminStats {
  ventas_totales: number;
  pedidos_totales: number;
  pedidos_hoy: number;
  productos_activos: number;
  suscriptores_totales: number;
  ticket_promedio: number;
}

export interface ToastMessage {
  id: string;
  tipo: 'exito' | 'error' | 'info' | 'advertencia';
  titulo?: string;
  mensaje: string;
}
