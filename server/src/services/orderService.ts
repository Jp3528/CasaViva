import { orderRepository } from '../repositories/orderRepository';
import { productRepository } from '../repositories/productRepository';
import { couponService } from './couponService';
import { subscriberRepository } from '../repositories/subscriberRepository';
import {
  Order,
  CartItemInput,
  CartItemDetail,
  CustomerData,
  ShippingAddress,
  BillingData,
  PaymentMethod,
  OrderState
} from '../models/types';

let orderCounter = 1002;

export class OrderService {
  public async calculateCart(itemsInput: CartItemInput[], couponCode?: string, departamento: string = 'Lima') {
    const items: CartItemDetail[] = [];
    let subtotal = 0;

    for (const item of itemsInput) {
      const product = await productRepository.findById(item.producto_id);
      if (!product || !product.activo) continue;

      let variant = product.variantes.find(v => v.id === item.variante_id);
      if (!variant && product.variantes.length > 0) {
        variant = product.variantes[0];
      }

      const precioUnitario = product.precio_base + (variant?.precio_adicional || 0);
      const cantidad = Math.max(1, item.cantidad);
      const itemSubtotal = precioUnitario * cantidad;

      items.push({
        producto_id: product.id,
        variante_id: variant?.id || 'default',
        sku: variant?.sku || `SKU-${product.id}`,
        nombre_producto: product.nombre,
        nombre_variante: variant?.nombre_variante || 'Estándar',
        color_nombre: variant?.color_nombre || 'Único',
        color_hex: variant?.color_hex || '#2C2C2A',
        precio_unitario: Number(precioUnitario.toFixed(2)),
        precio_base: product.precio_base,
        cantidad,
        subtotal: Number(itemSubtotal.toFixed(2)),
        imagen: variant?.imagen_variante || product.imagen_principal,
        stock_disponible: variant ? variant.stock : 10
      });

      subtotal += itemSubtotal;
    }

    subtotal = Number(subtotal.toFixed(2));

    // Shipping calculation
    let costoEnvio = 0;
    const esLima = departamento.toLowerCase().includes('lima') || departamento.toLowerCase().includes('callao');
    if (subtotal >= 199 || subtotal === 0) {
      costoEnvio = 0; // Envío gratis
    } else {
      costoEnvio = esLima ? 15.00 : 25.00;
    }

    // Coupon discount
    let descuento = 0;
    let cuponAplicado: string | undefined = undefined;
    let cuponMensaje = '';

    if (couponCode && couponCode.trim() !== '') {
      const valResult = await couponService.validateCoupon(couponCode, subtotal);
      if (valResult.valid) {
        descuento = valResult.discount;
        cuponAplicado = valResult.coupon?.codigo;
        cuponMensaje = valResult.message;
      } else {
        cuponMensaje = valResult.message;
      }
    }

    const total = Math.max(0, Number((subtotal - descuento + costoEnvio).toFixed(2)));

    return {
      items,
      subtotal,
      descuento,
      costoEnvio,
      total,
      cuponAplicado,
      cuponMensaje
    };
  }

  public async createOrder(data: {
    usuario_id?: string;
    items: CartItemInput[];
    datos_cliente: CustomerData;
    direccion_envio: ShippingAddress;
    metodo_envio: string;
    metodo_pago: PaymentMethod;
    codigo_cupon?: string;
    tipo_comprobante: 'boleta' | 'factura';
    datos_facturacion?: BillingData;
    notas?: string;
  }): Promise<Order> {
    if (!data.items || data.items.length === 0) {
      throw new Error('El carrito no contiene productos');
    }

    const calculation = await this.calculateCart(
      data.items,
      data.codigo_cupon,
      data.direccion_envio.departamento
    );

    if (calculation.items.length === 0) {
      throw new Error('No se pudieron procesar los artículos del pedido');
    }

    // Check stock and decrement
    for (const item of calculation.items) {
      const prod = await productRepository.findById(item.producto_id);
      if (prod) {
        const variant = prod.variantes.find(v => v.id === item.variante_id);
        if (variant) {
          if (variant.stock < item.cantidad) {
            throw new Error(`Stock insuficiente para "${item.nombre_producto} (${item.nombre_variante})". Disponible: ${variant.stock}`);
          }
          await productRepository.updateVariant(variant.id, {
            stock: variant.stock - item.cantidad
          });
        }
      }
    }

    // Increment coupon usage
    if (calculation.cuponAplicado) {
      await couponService['toggleStatus']; // import repo usage
      const couponRepo = (await import('../repositories/couponRepository')).couponRepository;
      await couponRepo.incrementUsage(calculation.cuponAplicado);
    }

    orderCounter += 1;
    const codigoOrden = `CV-2026-${orderCounter}`;

    const order: Order = {
      id: `ord-${Date.now()}`,
      codigo_orden: codigoOrden,
      usuario_id: data.usuario_id,
      datos_cliente: data.datos_cliente,
      direccion_envio: data.direccion_envio,
      metodo_envio: data.metodo_envio || (calculation.costoEnvio === 0 ? 'Envío Gratuito' : 'Envío Estándar'),
      costo_envio: calculation.costoEnvio,
      metodo_pago: data.metodo_pago,
      estado_pago: 'simulado',
      subtotal: calculation.subtotal,
      descuento: calculation.descuento,
      codigo_cupon: calculation.cuponAplicado,
      total: calculation.total,
      tipo_comprobante: data.tipo_comprobante || 'boleta',
      datos_facturacion: data.datos_facturacion,
      estado_pedido: 'Pendiente',
      items: calculation.items,
      notas: data.notas,
      creado_en: new Date().toISOString()
    };

    const savedOrder = await orderRepository.create(order);

    // Queue confirmation email
    await subscriberRepository.logEmail({
      id: `mail-${Date.now()}`,
      destinatario: data.datos_cliente.email,
      asunto: `Confirmación de tu pedido ${codigoOrden} en CasaViva`,
      tipo: 'confirmacion_pedido',
      cuerpo_resumen: `Hola ${data.datos_cliente.nombre}, hemos recibido tu pedido por S/ ${savedOrder.total.toFixed(2)}. Tu comprobante ${savedOrder.tipo_comprobante.toUpperCase()} está siendo emitido.`,
      enviado_en: new Date().toISOString()
    });

    return savedOrder;
  }

  public async getOrderByIdOrCode(idOrCode: string): Promise<Order | null> {
    return await orderRepository.findById(idOrCode) || await orderRepository.findByCode(idOrCode);
  }

  public async getUserOrders(userId: string): Promise<Order[]> {
    return await orderRepository.findByUserId(userId);
  }

  public async getAllOrders(filterState?: string): Promise<Order[]> {
    return await orderRepository.findAll(filterState);
  }

  public async updateOrderStatus(orderId: string, nuevoEstado: OrderState): Promise<Order | null> {
    const validStates: OrderState[] = ['Pendiente', 'En preparación', 'Enviado', 'Entregado', 'Cancelado'];
    if (!validStates.includes(nuevoEstado)) {
      throw new Error(`Estado inválido: ${nuevoEstado}`);
    }
    return await orderRepository.updateStatus(orderId, nuevoEstado);
  }

  public async getAdminStats() {
    return await orderRepository.getStats();
  }
}

export const orderService = new OrderService();
