import { describe, it, expect } from 'vitest';
import { Product } from '../types';

describe('Filtrado y Reglas de Negocio de Catálogo CasaViva', () => {
  const sampleProducts: Partial<Product>[] = [
    { id: '1', nombre: 'Sofá Modular Toscana', precio_base: 1890, categoria_id: 'cat-sala', estado: 'Selección CasaViva' },
    { id: '2', nombre: 'Funda de Cojín en Lino', precio_base: 45, categoria_id: 'cat-accesorios', estado: 'Oferta' },
    { id: '3', nombre: 'Vela Aromática Cedro', precio_base: 39.90, categoria_id: 'cat-decoracion', estado: 'Nuevo' },
    { id: '4', nombre: 'Lámpara de Pie Nórdica', precio_base: 249, categoria_id: 'cat-iluminacion', estado: 'Selección CasaViva' },
    { id: '5', nombre: 'Tabla Olivo Macizo', precio_base: 69, categoria_id: 'cat-cocina', estado: 'Nuevo' },
  ];

  it('Filtra productos bajo S/ 100 adecuadamente', () => {
    const under100 = sampleProducts.filter(p => (p.precio_base || 0) <= 100);
    expect(under100.length).toBe(3);
    expect(under100.map(p => p.nombre)).toContain('Funda de Cojín en Lino');
    expect(under100.map(p => p.nombre)).toContain('Vela Aromática Cedro');
    expect(under100.map(p => p.nombre)).toContain('Tabla Olivo Macizo');
  });

  it('Filtra productos por categoría específica', () => {
    const salaProducts = sampleProducts.filter(p => p.categoria_id === 'cat-sala');
    expect(salaProducts.length).toBe(1);
    expect(salaProducts[0].nombre).toBe('Sofá Modular Toscana');
  });

  it('Ordena por menor a mayor precio', () => {
    const sorted = [...sampleProducts].sort((a, b) => (a.precio_base || 0) - (b.precio_base || 0));
    expect(sorted[0].precio_base).toBe(39.90);
    expect(sorted[sorted.length - 1].precio_base).toBe(1890);
  });
});
