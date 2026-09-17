import React from 'react';
import { ProductState } from '../../types';

interface BadgeProps {
  state?: ProductState | string;
  children?: React.ReactNode;
  variant?: 'nuevo' | 'oferta' | 'seleccion' | 'mas-vendido' | 'agotado' | 'default';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ state, children, variant, className = '' }) => {
  let computedVariant = variant;

  if (!computedVariant && state) {
    switch (state) {
      case 'Nuevo':
        computedVariant = 'nuevo';
        break;
      case 'Oferta':
        computedVariant = 'oferta';
        break;
      case 'Selección CasaViva':
        computedVariant = 'seleccion';
        break;
      case 'Más vendido':
        computedVariant = 'mas-vendido';
        break;
      case 'Agotado':
        computedVariant = 'agotado';
        break;
      default:
        computedVariant = 'default';
    }
  }

  const variantClassMap: Record<string, string> = {
    nuevo: 'badge-nuevo',
    oferta: 'badge-oferta',
    seleccion: 'badge-seleccion',
    'mas-vendido': 'badge-mas-vendido',
    agotado: 'badge-agotado',
    default: 'bg-[var(--cv-bg-sand)] text-[var(--cv-text-muted)]',
  };

  const activeClass = variantClassMap[computedVariant || 'default'] || variantClassMap.default;

  return (
    <span className={`badge-tag ${activeClass} ${className}`}>
      {children || state}
    </span>
  );
};
