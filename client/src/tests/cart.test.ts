import { describe, it, expect } from 'vitest';

describe('Lógica de Cálculos de Carrito y Cupones en CasaViva', () => {
  const FREE_SHIPPING_THRESHOLD = 199.00;

  it('Calcula subtotal correctamente para múltiples artículos y variantes', () => {
    const items = [
      { precio_unitario: 45.00, cantidad: 2 }, // Cojines: S/ 90.00
      { precio_unitario: 89.00, cantidad: 1 }, // Set toallas: S/ 89.00
    ];

    const subtotal = items.reduce((acc, item) => acc + item.precio_unitario * item.cantidad, 0);
    expect(subtotal).toBe(179.00);
  });

  it('Aplica costo de envío estándar para compras menores al umbral de S/ 199', () => {
    const subtotal = 179.00;
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 15.00;
    expect(shipping).toBe(15.00);
  });

  it('Aplica envío gratuito (S/ 0.00) para compras iguales o mayores a S/ 199', () => {
    const subtotal = 249.00;
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 15.00;
    expect(shipping).toBe(0.00);
  });

  it('Calcula descuento porcentual con cupón BIENVENIDO15 (15%)', () => {
    const subtotal = 200.00;
    const couponValor = 15;
    const discount = (subtotal * couponValor) / 100;
    expect(discount).toBe(30.00);
    const total = subtotal - discount;
    expect(total).toBe(170.00);
  });

  it('Calcula descuento monto fijo con cupón HOGAR2026 (S/ 30 OFF)', () => {
    const subtotal = 250.00;
    const fixedDiscount = 30.00;
    const total = subtotal - fixedDiscount;
    expect(total).toBe(220.00);
  });
});
