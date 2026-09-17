import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { authService } from '../services/authService';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Lock, Mail, ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';

interface LoginPageProps {
  onNavigate: (page: string, param?: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Recovery Modal
  const [isRecoverOpen, setIsRecoverOpen] = useState(false);
  const [recoverEmail, setRecoverEmail] = useState('');
  const [isRecovering, setIsRecovering] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Por favor ingresa tu correo y contraseña', 'advertencia');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      showToast('¡Bienvenido de vuelta a CasaViva!', 'exito');
      onNavigate('cuenta');
    } catch (err: any) {
      showToast(err.message || 'Credenciales inválidas', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecover = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoverEmail) return;

    setIsRecovering(true);
    try {
      const res = await authService.recoverPassword(recoverEmail);
      showToast(res.message, 'info', 'Restablecimiento de contraseña');
      setIsRecoverOpen(false);
      setRecoverEmail('');
    } catch (err: any) {
      showToast(err.message || 'Error en recuperación', 'error');
    } finally {
      setIsRecovering(false);
    }
  };

  const handleDemoAdmin = () => {
    setEmail('admin@casaviva.pe');
    setPassword('Admin2026*CV');
  };

  const handleDemoClient = () => {
    setEmail('maria.lopez@ejemplo.com');
    setPassword('Cliente123*');
  };

  return (
    <div style={{ backgroundColor: 'var(--cv-bg-warm)', minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 20px' }}>
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--cv-radius-lg)',
          border: '1px solid var(--cv-border)',
          padding: '36px',
          boxShadow: 'var(--cv-shadow-md)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--cv-primary)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 600 }}>
            CV
          </div>
          <h1 style={{ fontSize: '1.875rem', color: 'var(--cv-text-main)', margin: 0 }}>
            Iniciar Sesión
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--cv-text-muted)', marginTop: '4px' }}>
            Ingresa a tu cuenta para gestionar tus pedidos y favoritos
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Correo Electrónico</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <label className="form-label" style={{ margin: 0 }}>Contraseña</label>
              <button
                type="button"
                onClick={() => setIsRecoverOpen(true)}
                style={{ fontSize: '0.75rem', color: 'var(--cv-primary)', fontWeight: 500 }}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div style={{ marginTop: '8px' }}>
            <Button type="submit" variant="primary" size="lg" isLoading={isLoading} style={{ width: '100%' }}>
              Ingresar a CasaViva <ArrowRight size={16} />
            </Button>
          </div>
        </form>

        {/* Demo Fast Login helpers */}
        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--cv-border-subtle)', textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--cv-text-light)' }}>
            Cuentas Demo para Evaluación:
          </span>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '8px' }}>
            <button
              onClick={handleDemoClient}
              style={{ fontSize: '0.75rem', padding: '4px 8px', borderRadius: '4px', backgroundColor: 'var(--cv-bg-warm)', border: '1px solid var(--cv-border)', color: 'var(--cv-text-main)' }}
            >
              Cliente (María)
            </button>
            <button
              onClick={handleDemoAdmin}
              style={{ fontSize: '0.75rem', padding: '4px 8px', borderRadius: '4px', backgroundColor: 'var(--cv-primary-light)', border: '1px solid var(--cv-primary)', color: 'var(--cv-primary)', fontWeight: 600 }}
            >
              Administrador (Admin)
            </button>
          </div>
        </div>

        {/* Switch to Register */}
        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.875rem', color: 'var(--cv-text-muted)' }}>
          ¿Aún no tienes una cuenta?{' '}
          <button
            onClick={() => onNavigate('registro')}
            style={{ color: 'var(--cv-primary)', fontWeight: 600 }}
          >
            Regístrate aquí
          </button>
        </div>
      </div>

      {/* Recover Password Modal */}
      <Modal isOpen={isRecoverOpen} onClose={() => setIsRecoverOpen(false)} title="Recuperar Contraseña">
        <form onSubmit={handleRecover} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--cv-text-muted)' }}>
            Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un código de seguridad para restablecer tu contraseña.
          </p>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Correo Registrado</label>
            <input
              type="email"
              className="form-input"
              value={recoverEmail}
              onChange={e => setRecoverEmail(e.target.value)}
              placeholder="tu@correo.com"
              required
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
            <Button type="button" variant="secondary" onClick={() => setIsRecoverOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" isLoading={isRecovering}>
              Enviar Instrucciones
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
