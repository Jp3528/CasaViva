import React from 'react';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--cv-radius-lg)',
        border: '1px solid var(--cv-border-subtle)',
        overflow: 'hidden',
        padding: '12px',
        animation: 'pulse 1.5s infinite ease-in-out',
      }}
    >
      <div
        style={{
          width: '100%',
          aspectRatio: '4/5',
          backgroundColor: 'var(--cv-bg-warm)',
          borderRadius: 'var(--cv-radius-md)',
          marginBottom: '12px',
        }}
      />
      <div style={{ height: '14px', width: '40%', backgroundColor: 'var(--cv-bg-sand)', borderRadius: '4px', marginBottom: '8px' }} />
      <div style={{ height: '18px', width: '85%', backgroundColor: 'var(--cv-bg-warm)', borderRadius: '4px', marginBottom: '12px' }} />
      <div style={{ height: '16px', width: '30%', backgroundColor: 'var(--cv-bg-sand)', borderRadius: '4px' }} />
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          style={{
            height: '48px',
            backgroundColor: 'var(--cv-bg-warm)',
            borderRadius: 'var(--cv-radius-md)',
            animation: 'pulse 1.5s infinite ease-in-out',
          }}
        />
      ))}
    </div>
  );
};
