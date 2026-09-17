import React, { useState } from 'react';
import { Mail, Phone, MapPin, ShieldCheck, Truck, RotateCcw, CreditCard, Check, ArrowRight } from 'lucide-react';
import { subscriberService } from '../../services/subscriberService';
import { useToast } from '../../context/ToastContext';

interface FooterProps {
  onNavigate: (page: string, param?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { showToast } = useToast();

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Ingresa un correo electrónico válido', 'advertencia');
      return;
    }

    setIsLoading(true);
    try {
      const res = await subscriberService.subscribe(email, 'footer_newsletter');
      setIsSubscribed(true);
      showToast(res.message, 'exito', '¡Suscripción exitosa!');
      setEmail('');
    } catch (err: any) {
      showToast(err.message || 'Error al registrar suscripción', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer style={{ backgroundColor: '#1C1C1A', color: '#E5DFC5', paddingTop: '64px', paddingBottom: '32px', borderTop: '1px solid #2F2E2B' }}>
      {/* Benefits Bar */}
      <div className="cv-container" style={{ marginBottom: '56px', paddingBottom: '40px', borderBottom: '1px solid rgba(229, 223, 197, 0.12)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(83, 99, 75, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#CBD8C6' }}>
              <Truck size={24} />
            </div>
            <div>
              <h4 style={{ color: '#FFFFFF', fontSize: '1rem', fontWeight: 600, margin: 0 }}>Envíos a todo el Perú</h4>
              <p style={{ color: '#A09D95', fontSize: '0.8125rem', margin: '2px 0 0' }}>Gratis en compras desde S/ 199</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(83, 99, 75, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#CBD8C6' }}>
              <RotateCcw size={24} />
            </div>
            <div>
              <h4 style={{ color: '#FFFFFF', fontSize: '1rem', fontWeight: 600, margin: 0 }}>Garantía de 30 Días</h4>
              <p style={{ color: '#A09D95', fontSize: '0.8125rem', margin: '2px 0 0' }}>Cambios y devoluciones fáciles</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(83, 99, 75, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#CBD8C6' }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 style={{ color: '#FFFFFF', fontSize: '1rem', fontWeight: 600, margin: 0 }}>Compra 100% Confiable</h4>
              <p style={{ color: '#A09D95', fontSize: '0.8125rem', margin: '2px 0 0' }}>Yape, Tarjetas y PayPal</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(83, 99, 75, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#CBD8C6' }}>
              <Phone size={24} />
            </div>
            <div>
              <h4 style={{ color: '#FFFFFF', fontSize: '1rem', fontWeight: 600, margin: 0 }}>Asesoría de Espacios</h4>
              <p style={{ color: '#A09D95', fontSize: '0.8125rem', margin: '2px 0 0' }}>Atención personalizada diaria</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="cv-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '48px', marginBottom: '56px' }}>
        {/* Brand Column */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--cv-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.125rem', fontWeight: 600 }}>CV</span>
            </div>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.625rem', color: '#FFFFFF', fontWeight: 600 }}>
              CasaViva
            </span>
          </div>
          <p style={{ fontSize: '0.875rem', color: '#A09D95', lineHeight: 1.6, marginBottom: '20px' }}>
            Curaduría de mobiliario, iluminación, accesorios y organización para crear hogares serenos, luminosos y funcionales.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8125rem', color: '#C5C0B3' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={16} color="#7F9474" /> Lima, Perú</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Phone size={16} color="#7F9474" /> +51 987 654 321</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Mail size={16} color="#7F9474" /> contacto@casaviva.pe</span>
          </div>
        </div>

        {/* Categories */}
        <div>
          <h4 style={{ color: '#FFFFFF', fontSize: '1.125rem', marginBottom: '20px' }}>Catálogo</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.875rem' }}>
            <li><button onClick={() => onNavigate('catalogo')} style={{ color: '#B3AFA5' }}>Ver Catálogo Completo</button></li>
            <li><button onClick={() => onNavigate('catalogo', 'categoria=cat-sala')} style={{ color: '#B3AFA5' }}>Sala y Estar</button></li>
            <li><button onClick={() => onNavigate('catalogo', 'categoria=cat-dormitorio')} style={{ color: '#B3AFA5' }}>Dormitorio y Textiles</button></li>
            <li><button onClick={() => onNavigate('catalogo', 'categoria=cat-cocina')} style={{ color: '#B3AFA5' }}>Cocina y Comedor</button></li>
            <li><button onClick={() => onNavigate('catalogo', 'categoria=cat-bano')} style={{ color: '#B3AFA5' }}>Baño y Spa</button></li>
            <li><button onClick={() => onNavigate('catalogo', 'categoria=cat-iluminacion')} style={{ color: '#B3AFA5' }}>Iluminación Cálida</button></li>
            <li><button onClick={() => onNavigate('catalogo', 'categoria=bajo_100')} style={{ color: '#B3AFA5' }}>Novedades bajo S/ 100</button></li>
          </ul>
        </div>

        {/* Customer Care */}
        <div>
          <h4 style={{ color: '#FFFFFF', fontSize: '1.125rem', marginBottom: '20px' }}>Atención al Cliente</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.875rem' }}>
            <li><button onClick={() => onNavigate('cuenta', 'pedidos')} style={{ color: '#B3AFA5' }}>Seguimiento de Pedidos</button></li>
            <li><button onClick={() => onNavigate('cuenta', 'perfil')} style={{ color: '#B3AFA5' }}>Mi Cuenta</button></li>
            <li><span style={{ color: '#B3AFA5' }}>Políticas de Envíos y Tiempos</span></li>
            <li><span style={{ color: '#B3AFA5' }}>Cambios y Devoluciones</span></li>
            <li><span style={{ color: '#B3AFA5' }}>Términos y Condiciones</span></li>
            <li><span style={{ color: '#B3AFA5' }}>Libro de Reclamaciones</span></li>
          </ul>
        </div>

        {/* Newsletter Signup */}
        <div>
          <h4 style={{ color: '#FFFFFF', fontSize: '1.125rem', marginBottom: '12px' }}>Club CasaViva</h4>
          <p style={{ fontSize: '0.875rem', color: '#A09D95', marginBottom: '16px' }}>
            Suscríbete y recibe un <strong>15% de descuento</strong> en tu primera compra, además de guías de decoración exclusivas.
          </p>

          {isSubscribed ? (
            <div style={{ padding: '12px 16px', backgroundColor: 'rgba(83, 99, 75, 0.3)', border: '1px solid #53634B', borderRadius: '8px', color: '#CBD8C6', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Check size={18} /> ¡Bienvenido! Usa el cupón <strong>BIENVENIDO15</strong>
            </div>
          ) : (
            <form onSubmit={handleNewsletter} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  placeholder="Tu correo electrónico..."
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    backgroundColor: '#272624',
                    border: '1px solid #44433E',
                    borderRadius: 'var(--cv-radius-md)',
                    color: '#FFFFFF',
                    fontSize: '0.875rem',
                  }}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  backgroundColor: 'var(--cv-primary)',
                  color: '#FFFFFF',
                  padding: '12px',
                  borderRadius: 'var(--cv-radius-md)',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                {isLoading ? 'Registrando...' : <>Unirme al Club <ArrowRight size={16} /></>}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Bottom Bar & Payments */}
      <div className="cv-container" style={{ paddingTop: '24px', borderTop: '1px solid rgba(229, 223, 197, 0.08)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', fontSize: '0.8125rem', color: '#88857E' }}>
        <div>
          © 2026 CasaViva E-commerce. Todos los derechos reservados. Diseñado con calidez y orden.
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Medios de Pago:</span>
          <span style={{ backgroundColor: '#2C2B28', padding: '4px 8px', borderRadius: '4px', color: '#E0DCD3', fontSize: '0.75rem', fontWeight: 600 }}>YAPE</span>
          <span style={{ backgroundColor: '#2C2B28', padding: '4px 8px', borderRadius: '4px', color: '#E0DCD3', fontSize: '0.75rem', fontWeight: 600 }}>PLIN</span>
          <span style={{ backgroundColor: '#2C2B28', padding: '4px 8px', borderRadius: '4px', color: '#E0DCD3', fontSize: '0.75rem', fontWeight: 600 }}>VISA</span>
          <span style={{ backgroundColor: '#2C2B28', padding: '4px 8px', borderRadius: '4px', color: '#E0DCD3', fontSize: '0.75rem', fontWeight: 600 }}>MASTERCARD</span>
          <span style={{ backgroundColor: '#2C2B28', padding: '4px 8px', borderRadius: '4px', color: '#E0DCD3', fontSize: '0.75rem', fontWeight: 600 }}>PAYPAL</span>
        </div>
      </div>
    </footer>
  );
};
