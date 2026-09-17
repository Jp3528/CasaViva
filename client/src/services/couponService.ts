import { apiRequest } from './api';
import { Coupon } from '../types';

export const couponService = {
  async validateCoupon(codigo: string, subtotal: number): Promise<{ success: boolean; valid: boolean; coupon?: Coupon; discount: number; message: string }> {
    return apiRequest('/coupons/validar', {
      method: 'POST',
      body: JSON.stringify({ codigo, subtotal }),
    });
  },

  async getAllCoupons(): Promise<{ cupones: Coupon[] }> {
    return apiRequest('/coupons');
  },

  async createCoupon(data: Partial<Coupon>): Promise<{ cupon: Coupon; message: string }> {
    return apiRequest('/coupons/admin/crear', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async toggleCoupon(id: string, activo: boolean): Promise<{ cupon: Coupon; message: string }> {
    return apiRequest(`/coupons/admin/${id}/estado`, {
      method: 'PATCH',
      body: JSON.stringify({ activo }),
    });
  },
};
