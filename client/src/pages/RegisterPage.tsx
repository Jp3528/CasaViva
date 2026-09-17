import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/ui/Button';
import { ArrowRight, UserPlus, ShieldCheck } from 'lucide-react';

interface RegisterPageProps {
  onNavigate: (page: string, param?: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate }) => {
  const { register } = useAuth();
  const { showToast } = useToast();

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !email.trim() || !password) {
      showToast('Por favor completa todos los campos requeridos', 'advertencia');
      return;
    }

    if (password !== confirmPassword) {
      showToast('Las contraseñas no coinciden', 'error');
      return;
    }

    if (password.length < 6) {
      showToast('La contraseña debe tener al menos 6 caracteres', 'advertencia');
      return;
    }

    setIsLoading(true);
    try {
      await register(nombre.trim(), email.trim(), password, telefono.trim());
      showToast('¡Cuenta creada exitosamente! Bienvenido a CasaViva', 'exito');
      onNavigate('cuenta');
    } catch (err: any) {
      showToast(err.message || 'Error al crear cuenta', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--cv-bg-warm)', minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 20px' }}>
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
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
            Crear Cuenta en CasaViva
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--cv-text-muted)', marginTop: '4px' }}>
            Únete a nuestra comunidad de diseño y disfruta de promociones exclusivas.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Nombres y Apellidos *</label>
            <input
              type="text"
              className="form-input"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              placeholder="Ej. Valeria Ramos"
              required
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Correo Electrónico *</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="valeria@ejemplo.com"
              required
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Teléfono / Celular (opcional)</label>
            <input
              type="tel"
              className="form-input"
              value={telefono}
              onChange={e => setTelefono(e.target.value)}
              placeholder="987 654 321"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Contraseña *</label>
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Mín. 6 caracteres"
                required
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Confirmar Contraseña *</label>
              <input
                type="password"
                className="form-input"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Repite tu contraseña"
                required
              />
            </div>
          </div>

          <div style={{ marginTop: '8px' }}>
            <Button type="submit" variant="primary" size="lg" isLoading={isLoading} style={{ width: '100%' }}>
              Registrarme en CasaViva <ArrowRight size={16} />
            </Button>
          </div>
        </form>

        {/* Switch to Login */}
        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.875rem', color: 'var(--cv-text-muted)' }}>
          ¿Ya tienes una cuenta registrada?{' '}
          <button
            onClick={() => onNavigate('login')}
            style={{ color: 'var(--cv-primary)', fontWeight: 600 }}
          >
            Inicia sesión
          </button>
        </div>
      </div>
    </div>
  );
};
