import React from 'react';
import { ProductVariant } from '../../types';
import { Check } from 'lucide-react';

interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedVariant?: ProductVariant;
  onSelectVariant: (variant: ProductVariant) => void;
}

export const VariantSelector: React.FC<VariantSelectorProps> = ({
  variants,
  selectedVariant,
  onSelectVariant,
}) => {
  if (!variants || variants.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--cv-text-main)' }}>
          Variante / Color:{' '}
          <span style={{ fontWeight: 400, color: 'var(--cv-text-muted)' }}>
            {selectedVariant?.color_nombre || selectedVariant?.nombre_variante}
          </span>
        </span>
        {selectedVariant && (
          <span style={{ fontSize: '0.75rem', color: 'var(--cv-text-light)' }}>
            SKU: {selectedVariant.sku}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {variants.map(v => {
          const isSelected = selectedVariant?.id === v.id;
          const isOut = v.stock <= 0;

          return (
            <button
              key={v.id}
              onClick={() => onSelectVariant(v)}
              disabled={isOut}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 14px',
                borderRadius: 'var(--cv-radius-md)',
                border: isSelected ? '2px solid var(--cv-primary)' : '1px solid var(--cv-border)',
                backgroundColor: isSelected ? 'var(--cv-primary-light)' : isOut ? 'var(--cv-bg-warm)' : '#FFFFFF',
                color: isOut ? 'var(--cv-text-light)' : 'var(--cv-text-main)',
                cursor: isOut ? 'not-allowed' : 'pointer',
                opacity: isOut ? 0.6 : 1,
                fontSize: '0.875rem',
                fontWeight: isSelected ? 600 : 400,
                position: 'relative',
              }}
            >
              <span
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  backgroundColor: v.color_hex,
                  border: '1px solid rgba(0,0,0,0.15)',
                  display: 'inline-block',
                }}
              />
              <span>{v.color_nombre}</span>
              {v.precio_adicional > 0 && (
                <span style={{ fontSize: '0.75rem', color: 'var(--cv-primary)' }}>
                  (+S/ {v.precio_adicional.toFixed(2)})
                </span>
              )}
              {isSelected && <Check size={14} color="var(--cv-primary)" />}
            </button>
          );
        })}
      </div>

      {/* Real-time stock banner */}
      {selectedVariant && (
        <div style={{ fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: selectedVariant.stock > 3 ? '#53634B' : selectedVariant.stock > 0 ? '#D4A347' : '#C45E3D',
            }}
          />
          <span style={{ color: 'var(--cv-text-muted)' }}>
            {selectedVariant.stock > 3
              ? `En stock (${selectedVariant.stock} unidades disponibles)`
              : selectedVariant.stock > 0
              ? `¡Últimas ${selectedVariant.stock} unidades disponibles!`
              : 'Agotado temporalmente'}
          </span>
        </div>
      )}
    </div>
  );
};
