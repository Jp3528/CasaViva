import React, { ReactNode } from 'react';
import { PackageOpen } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionText,
  onAction,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '48px 24px',
        backgroundColor: 'var(--cv-bg-warm)',
        borderRadius: 'var(--cv-radius-lg)',
        border: '1px dashed var(--cv-border)',
        margin: '24px 0',
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--cv-primary)',
          marginBottom: '16px',
          boxShadow: 'var(--cv-shadow-sm)',
        }}
      >
        {icon || <PackageOpen size={28} />}
      </div>
      <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', color: 'var(--cv-text-main)' }}>{title}</h3>
      <p style={{ color: 'var(--cv-text-muted)', maxWidth: '420px', fontSize: '0.9375rem', marginBottom: actionText ? '20px' : 0 }}>
        {description}
      </p>
      {actionText && onAction && (
        <Button variant="primary" size="md" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};
