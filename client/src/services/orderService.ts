import { apiRequest } from './api';
import { Order, CartItem, CustomerData, ShippingAddress, BillingData, PaymentMethod, AdminStats } from '../types';

export const orderService = {
  async calculateCart(
    items: { producto_id: string; variante_id?: string; cantidad: number }[],
    codigo_cupon?: string,
    departamento: string = 'Lima'
  ): Promise<{
    calculo: {
      items: CartItem[];
      subtotal: number;
      descuento: number;
      costoEnvio: number;
      total: number;
      cuponAplicado?: string;
      cuponMensaje: string;
    };
  }> {
    return apiRequest('/orders/calcular', {
      method: 'POST',
      body: JSON.stringify({ items, codigo_cupon, departamento }),
    });
  },

  async createOrder(data: {
    usuario_id?: string;
    items: { producto_id: string; variante_id?: string; cantidad: number }[];
    datos_cliente: CustomerData;
    direccion_envio: ShippingAddress;
    metodo_envio: string;
    metodo_pago: PaymentMethod;
    codigo_cupon?: string;
    tipo_comprobante: 'boleta' | 'factura';
    datos_facturacion?: BillingData;
    notas?: string;
  }): Promise<{ pedido: Order; message: string }> {
    return apiRequest('/orders/crear', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getOrderDetails(idOrCode: string): Promise<{ pedido: Order }> {
    return apiRequest(`/orders/${idOrCode}`);
  },

  async getUserOrders(userId: string): Promise<{ pedidos: Order[] }> {
    return apiRequest(`/orders/usuario/${userId}`);
  },

  async getAllOrders(estado?: string): Promise<{ pedidos: Order[] }> {
    const query = estado ? `?estado=${estado}` : '';
    return apiRequest(`/orders/admin/todos${query}`);
  },

  async updateOrderStatus(orderId: string, estado: string): Promise<{ pedido: Order; message: string }> {
    return apiRequest(`/orders/admin/${orderId}/estado`, {
      method: 'PATCH',
      body: JSON.stringify({ estado }),
    });
  },

  async getAdminStats(): Promise<{ metricas: AdminStats }> {
    return apiRequest('/orders/admin/metricas');
  },
};
