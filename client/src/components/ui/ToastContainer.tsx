import React from 'react';
import { useToast } from '../../context/ToastContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '24px',
        zIndex: 2000,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: '380px',
        pointerEvents: 'none',
      }}
    >
      {toasts.map(toast => {
        const iconMap = {
          exito: <CheckCircle2 size={20} color="#53634B" />,
          error: <AlertCircle size={20} color="#C45E3D" />,
          advertencia: <AlertTriangle size={20} color="#D4A347" />,
          info: <Info size={20} color="#3B82F6" />,
        };

        const bgMap = {
          exito: '#F4F7F2',
          error: '#FCF3F0',
          advertencia: '#FEF9EE',
          info: '#F0F7FF',
        };

        const borderMap = {
          exito: '#CBD8C6',
          error: '#F1D0C6',
          advertencia: '#F7E6B8',
          info: '#CDE4FE',
        };

        return (
          <div
            key={toast.id}
            style={{
              pointerEvents: 'auto',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '14px 16px',
              backgroundColor: bgMap[toast.tipo],
              border: `1px solid ${borderMap[toast.tipo]}`,
              borderRadius: 'var(--cv-radius-md)',
              boxShadow: 'var(--cv-shadow-md)',
              animation: 'fadeInPop 0.25s ease forwards',
            }}
          >
            <div style={{ flexShrink: 0, marginTop: '2px' }}>{iconMap[toast.tipo]}</div>
            <div style={{ flex: 1 }}>
              {toast.titulo && (
                <p style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '2px', color: 'var(--cv-text-main)' }}>
                  {toast.titulo}
                </p>
              )}
              <p style={{ fontSize: '0.875rem', color: 'var(--cv-text-main)', lineHeight: 1.4 }}>
                {toast.mensaje}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--cv-text-muted)',
                padding: '2px',
                display: 'flex',
                alignItems: 'center',
              }}
              aria-label="Cerrar notificación"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
