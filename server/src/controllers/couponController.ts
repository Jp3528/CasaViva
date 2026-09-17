import { Request, Response } from 'express';
import { couponService } from '../services/couponService';

export class CouponController {
  public async validate(req: Request, res: Response) {
    try {
      const { codigo, subtotal } = req.body;
      const result = await couponService.validateCoupon(codigo, parseFloat(subtotal || 0));
      res.json({ success: result.valid, ...result });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  public async getAll(req: Request, res: Response) {
    try {
      const cupones = await couponService.getAllCoupons();
      res.json({ success: true, cupones });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  public async create(req: Request, res: Response) {
    try {
      const coupon = await couponService.createCoupon(req.body);
      res.status(201).json({ success: true, cupon: coupon, message: 'Cupón creado con éxito' });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  public async toggle(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { activo } = req.body;
      const updated = await couponService.toggleStatus(id, activo);
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Cupón no encontrado' });
      }
      res.json({ success: true, cupon: updated, message: `Cupón ${activo ? 'activado' : 'desactivado'}` });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

export const couponController = new CouponController();
