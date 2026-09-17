import { db } from './db';
import { Order, OrderState, AdminStats } from '../models/types';

export class OrderRepository {
  public async create(order: Order): Promise<Order> {
    db.orders.unshift(order);

    if (db.isPostgresConnected && db.pool) {
      try {
        await db.pool.query(
          `INSERT INTO pedidos (
            id, codigo_orden, usuario_id, datos_cliente, direccion_envio,
            metodo_envio, costo_envio, metodo_pago, estado_pago, subtotal,
            descuento, codigo_cupon, total, tipo_comprobante, datos_facturacion,
            estado_pedido, items, notas, creado_en
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)`,
          [
            order.id, order.codigo_orden, order.usuario_id || null,
            JSON.stringify(order.datos_cliente), JSON.stringify(order.direccion_envio),
            order.metodo_envio, order.costo_envio, order.metodo_pago, order.estado_pago,
            order.subtotal, order.descuento, order.codigo_cupon || null, order.total,
            order.tipo_comprobante, JSON.stringify(order.datos_facturacion || {}),
            order.estado_pedido, JSON.stringify(order.items), order.notas || null,
            order.creado_en
          ]
        );
      } catch (err) {
        console.error('Error insertando pedido en PostgreSQL:', err);
      }
    }

    return JSON.parse(JSON.stringify(order));
  }

  public async findById(id: string): Promise<Order | null> {
    const order = db.orders.find(o => o.id === id || o.codigo_orden === id);
    return order ? JSON.parse(JSON.stringify(order)) : null;
  }

  public async findByCode(codigo: string): Promise<Order | null> {
    const order = db.orders.find(o => o.codigo_orden.toUpperCase() === codigo.trim().toUpperCase());
    return order ? JSON.parse(JSON.stringify(order)) : null;
  }

  public async findByUserId(userId: string): Promise<Order[]> {
    return JSON.parse(JSON.stringify(db.orders.filter(o => o.usuario_id === userId)));
  }

  public async findAll(filterState?: string): Promise<Order[]> {
    let list = [...db.orders];
    if (filterState && filterState !== 'todos') {
      list = list.filter(o => o.estado_pedido.toLowerCase() === filterState.toLowerCase());
    }
    return JSON.parse(JSON.stringify(list));
  }

  public async updateStatus(orderId: string, nuevoEstado: OrderState): Promise<Order | null> {
    const order = db.orders.find(o => o.id === orderId || o.codigo_orden === orderId);
    if (!order) return null;

    order.estado_pedido = nuevoEstado;

    if (db.isPostgresConnected && db.pool) {
      try {
        await db.pool.query(
          'UPDATE pedidos SET estado_pedido = $1, actualizado_en = CURRENT_TIMESTAMP WHERE id = $2 OR codigo_orden = $2',
          [nuevoEstado, orderId]
        );
      } catch (err) {
        console.error('Error actualizando estado del pedido en PostgreSQL:', err);
      }
    }

    return JSON.parse(JSON.stringify(order));
  }

  public async getStats(): Promise<AdminStats> {
    const ventasTotales = db.orders.reduce((acc, o) => acc + (o.estado_pedido !== 'Cancelado' ? o.total : 0), 0);
    const pedidosTotales = db.orders.length;
    const pedidosHoy = db.orders.filter(o => {
      const d = new Date(o.creado_en);
      const hoy = new Date();
      return d.toDateString() === hoy.toDateString();
    }).length;
    const productosActivos = db.products.filter(p => p.activo).length;
    const suscriptoresTotales = db.subscribers.length;
    const ticketPromedio = pedidosTotales > 0 ? (ventasTotales / pedidosTotales) : 0;

    return {
      ventas_totales: Number(ventasTotales.toFixed(2)),
      pedidos_totales: pedidosTotales,
      pedidos_hoy: pedidosHoy,
      productos_activos: productosActivos,
      suscriptores_totales: suscriptoresTotales,
      ticket_promedio: Number(ticketPromedio.toFixed(2))
    };
  }
}

export const orderRepository = new OrderRepository();
