import React, { useEffect, ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widthClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        backgroundColor: 'rgba(32, 32, 30, 0.65)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--cv-radius-lg)',
          boxShadow: 'var(--cv-shadow-lg)',
          border: '1px solid var(--cv-border)',
          overflow: 'hidden',
          animation: 'fadeInPop 0.2s ease forwards',
        }}
        className={widthClasses[maxWidth]}
        onClick={e => e.stopPropagation()}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 24px',
            borderBottom: '1px solid var(--cv-border-subtle)',
            backgroundColor: 'var(--cv-bg-warm)',
          }}
        >
          {title && <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-serif)', margin: 0 }}>{title}</h3>}
          <button
            onClick={onClose}
            aria-label="Cerrar modal"
            style={{
              padding: '6px',
              borderRadius: 'var(--cv-radius-sm)',
              color: 'var(--cv-text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={20} />
          </button>
        </div>
        <div style={{ padding: '24px', maxHeight: 'calc(85vh - 80px)', overflowY: 'auto' }}>
          {children}
        </div>
      </div>
    </div>
  );
};
