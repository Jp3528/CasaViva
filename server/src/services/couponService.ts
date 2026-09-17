import { couponRepository } from '../repositories/couponRepository';
import { Coupon } from '../models/types';

export class CouponService {
  public async validateCoupon(code: string, subtotal: number): Promise<{ valid: boolean; coupon?: Coupon; discount: number; message: string }> {
    if (!code || code.trim() === '') {
      return { valid: false, discount: 0, message: 'Ingresa un código de cupón' };
    }

    const coupon = await couponRepository.findByCode(code.trim());
    if (!coupon) {
      return { valid: false, discount: 0, message: 'El cupón ingresado no existe' };
    }

    if (!coupon.activo) {
      return { valid: false, discount: 0, message: 'El cupón se encuentra inactivo o vencido' };
    }

    if (coupon.usos_actuales >= coupon.limite_uso) {
      return { valid: false, discount: 0, message: 'El cupón ha alcanzado el límite máximo de usos' };
    }

    if (subtotal < coupon.compra_minima) {
      return {
        valid: false,
        discount: 0,
        message: `Este cupón requiere una compra mínima de S/ ${coupon.compra_minima.toFixed(2)} (Subtotal actual: S/ ${subtotal.toFixed(2)})`
      };
    }

    let discount = 0;
    if (coupon.tipo_descuento === 'porcentaje') {
      discount = (subtotal * coupon.valor) / 100;
    } else {
      discount = Math.min(coupon.valor, subtotal);
    }

    discount = Number(discount.toFixed(2));

    return {
      valid: true,
      coupon,
      discount,
      message: `¡Cupón ${coupon.codigo} aplicado con éxito! Descuento de S/ ${discount.toFixed(2)}`
    };
  }

  public async getAllCoupons(): Promise<Coupon[]> {
    return await couponRepository.findAll();
  }

  public async createCoupon(data: Omit<Coupon, 'id' | 'usos_actuales'>): Promise<Coupon> {
    const existing = await couponRepository.findByCode(data.codigo);
    if (existing) {
      throw new Error(`El código ${data.codigo} ya existe`);
    }

    const coupon: Coupon = {
      id: `cup-${Date.now()}`,
      codigo: data.codigo.toUpperCase().trim(),
      tipo_descuento: data.tipo_descuento,
      valor: Number(data.valor),
      compra_minima: Number(data.compra_minima || 0),
      limite_uso: Number(data.limite_uso || 100),
      usos_actuales: 0,
      activo: data.activo !== undefined ? data.activo : true,
      descripcion: data.descripcion
    };

    return await couponRepository.create(coupon);
  }

  public async toggleStatus(id: string, activo: boolean): Promise<Coupon | null> {
    return await couponRepository.toggleStatus(id, activo);
  }
}

export const couponService = new CouponService();
