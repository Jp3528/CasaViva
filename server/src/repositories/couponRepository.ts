import { db } from './db';
import { Coupon } from '../models/types';

export class CouponRepository {
  public async findByCode(code: string): Promise<Coupon | null> {
    const coupon = db.coupons.find(c => c.codigo.toUpperCase() === code.trim().toUpperCase());
    return coupon ? { ...coupon } : null;
  }

  public async findAll(): Promise<Coupon[]> {
    return [...db.coupons];
  }

  public async create(coupon: Coupon): Promise<Coupon> {
    db.coupons.push(coupon);
    if (db.isPostgresConnected && db.pool) {
      try {
        await db.pool.query(
          `INSERT INTO cupones (id, codigo, tipo_descuento, valor, compra_minima, limite_uso, usos_actuales, activo, descripcion)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [coupon.id, coupon.codigo, coupon.tipo_descuento, coupon.valor, coupon.compra_minima, coupon.limite_uso, coupon.usos_actuales, coupon.activo, coupon.descripcion]
        );
      } catch (err) {
        console.error('Error insertando cupón en PostgreSQL:', err);
      }
    }
    return { ...coupon };
  }

  public async toggleStatus(id: string, activo: boolean): Promise<Coupon | null> {
    const coupon = db.coupons.find(c => c.id === id);
    if (!coupon) return null;
    coupon.activo = activo;

    if (db.isPostgresConnected && db.pool) {
      try {
        await db.pool.query('UPDATE cupones SET activo = $1 WHERE id = $2', [activo, id]);
      } catch (err) {
        console.error('Error actualizando estado de cupón:', err);
      }
    }
    return { ...coupon };
  }

  public async incrementUsage(code: string): Promise<void> {
    const coupon = db.coupons.find(c => c.codigo.toUpperCase() === code.trim().toUpperCase());
    if (coupon) {
      coupon.usos_actuales += 1;
      if (db.isPostgresConnected && db.pool) {
        try {
          await db.pool.query('UPDATE cupones SET usos_actuales = usos_actuales + 1 WHERE codigo = $1', [code.toUpperCase()]);
        } catch (err) {
          console.error('Error incrementando uso de cupón:', err);
        }
      }
    }
  }
}

export const couponRepository = new CouponRepository();
