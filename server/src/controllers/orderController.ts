import { Request, Response } from 'express';
import { orderService } from '../services/orderService';

export class OrderController {
  public async calculateCart(req: Request, res: Response) {
    try {
      const { items, codigo_cupon, departamento } = req.body;
      const result = await orderService.calculateCart(items || [], codigo_cupon, departamento);
      res.json({ success: true, calculo: result });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  public async createOrder(req: Request, res: Response) {
    try {
      const order = await orderService.createOrder(req.body);
      res.status(201).json({
        success: true,
        pedido: order,
        message: 'Pedido realizado con éxito'
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  public async getOrderDetails(req: Request, res: Response) {
    try {
      const { idOrCode } = req.params;
      const order = await orderService.getOrderByIdOrCode(idOrCode);
      if (!order) {
        return res.status(404).json({ success: false, message: 'Pedido no encontrado' });
      }
      res.json({ success: true, pedido: order });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  public async getUserOrders(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const orders = await orderService.getUserOrders(userId);
      res.json({ success: true, pedidos: orders });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  public async getAllOrders(req: Request, res: Response) {
    try {
      const { estado } = req.query;
      const orders = await orderService.getAllOrders(estado as string);
      res.json({ success: true, pedidos: orders });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  public async updateOrderStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { estado } = req.body;
      const updated = await orderService.updateOrderStatus(id, estado);
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Pedido no encontrado' });
      }
      res.json({
        success: true,
        pedido: updated,
        message: `Estado del pedido actualizado a: ${estado}`
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  public async getAdminStats(req: Request, res: Response) {
    try {
      const stats = await orderService.getAdminStats();
      res.json({ success: true, metricas: stats });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

export const orderController = new OrderController();
