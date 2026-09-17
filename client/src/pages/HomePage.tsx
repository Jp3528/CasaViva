import React, { useState, useEffect } from 'react';
import { InteractiveLivingRoom } from '../components/hero/InteractiveLivingRoom';
import { ProductCard } from '../components/product/ProductCard';
import { productService } from '../services/productService';
import { subscriberService } from '../services/subscriberService';
import { Product, Category } from '../types';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/ui/Button';
import { RatingStars } from '../components/ui/RatingStars';
import { ArrowRight, Sparkles, Tag, Star, Check, Mail, Compass, ShieldCheck } from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: string, param?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [under100Products, setUnder100Products] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Newsletter state
  const [newsEmail, setNewsEmail] = useState('');
  const [isSubmittingNews, setIsSubmittingNews] = useState(false);
  const [newsSuccess, setNewsSuccess] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [catRes, featRes, u100Res] = await Promise.all([
          productService.getCategories(),
          productService.getFeaturedProducts(),
          productService.getProductsUnder100(),
        ]);
        setCategories(catRes.categorias || []);
        setFeaturedProducts(featRes.productos || []);
        setUnder100Products(u100Res.productos || []);
      } catch (err) {
        console.error('Error cargando datos de inicio:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsEmail || !newsEmail.includes('@')) {
      showToast('Ingresa un correo electrónico válido', 'advertencia');
      return;
    }

    setIsSubmittingNews(true);
    try {
      const res = await subscriberService.subscribe(newsEmail, 'home_body_section');
      setNewsSuccess(true);
      showToast(res.message, 'exito', '¡Bienvenido a CasaViva!');
      setNewsEmail('');
    } catch (err: any) {
      showToast(err.message || 'Error en suscripción', 'error');
    } finally {
      setIsSubmittingNews(false);
    }
  };

  const customerReviews = [
    {
      name: 'Camila Villarán',
      city: 'San Isidro, Lima',
      comment: 'El sofá en lino marfil y la alfombra de yute le dieron a mi departamento la serenidad que tanto buscaba. Acabados de nivel internacional.',
      rating: 5,
      product: 'Sofá Modular Toscana',
    },
    {
      name: 'Rodrigo Mendoza',
      city: 'Arequipa',
      comment: 'Llegó en 3 días hasta Arequipa perfectamente embalado. La lámpara de pie con base de mármol es sólida y la luz es sumamente acogedora.',
      rating: 5,
      product: 'Lámpara de Pie Nórdica',
    },
    {
      name: 'Luciana Silva',
      city: 'Miraflores, Lima',
      comment: 'Compré varios accesorios por menos de S/ 100 (velas, cojines y floreros). La calidad de los textiles supera por mucho su precio.',
      rating: 5,
      product: 'Textiles y Decoración',
    },
  ];

  return (
    <div style={{ backgroundColor: 'var(--cv-bg-main)' }}>
      {/* 1. Interactive Living Room Hero Section */}
      <InteractiveLivingRoom onNavigate={onNavigate} />

      {/* 2. Featured Categories Grid */}
      <section className="cv-section" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="cv-container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span style={{ fontSize: '0.8125rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--cv-primary)', fontWeight: 600 }}>
              Curaduría por Espacios
            </span>
            <h2 style={{ fontSize: '2.5rem', color: 'var(--cv-text-main)', marginTop: '4px' }}>
              Descubre nuestras categorías
            </h2>
            <p style={{ color: 'var(--cv-text-muted)', maxWidth: '520px', margin: '8px auto 0' }}>
              Mobiliario, piezas de diseño y textiles seleccionados para brindar armonía a cada rincón de tu casa.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '24px',
            }}
          >
            {categories.map(cat => (
              <div
                key={cat.id}
                onClick={() => onNavigate('catalogo', `categoria=${cat.id}`)}
                style={{
                  position: 'relative',
                  aspectRatio: '4/5',
                  borderRadius: 'var(--cv-radius-lg)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  boxShadow: 'var(--cv-shadow-sm)',
                  border: '1px solid var(--cv-border-subtle)',
                }}
                className="category-card"
              >
                <img
                  src={cat.imagen}
                  alt={cat.nombre}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.4s ease',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(20, 20, 18, 0.85) 0%, rgba(20, 20, 18, 0.2) 60%, transparent 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: '24px',
                    color: '#FFFFFF',
                  }}
                >
                  <h3 style={{ fontSize: '1.375rem', fontFamily: 'var(--font-serif)', color: '#FFFFFF', marginBottom: '4px' }}>
                    {cat.nombre}
                  </h3>
                  <p style={{ fontSize: '0.8125rem', color: '#E0DCD3', lineHeight: 1.3, marginBottom: '8px' }}>
                    {cat.descripcion}
                  </p>
                  <span style={{ fontSize: '0.8125rem', color: '#FFFFFF', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    Explorar colección <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Featured Products Showcase */}
      <section className="cv-section" style={{ backgroundColor: 'var(--cv-bg-warm)' }}>
        <div className="cv-container">
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '16px', marginBottom: '40px' }}>
            <div>
              <span style={{ fontSize: '0.8125rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--cv-primary)', fontWeight: 600 }}>
                Selección Exclusiva
              </span>
              <h2 style={{ fontSize: '2.5rem', color: 'var(--cv-text-main)', marginTop: '4px' }}>
                Piezas destacadas de temporada
              </h2>
            </div>
            <Button variant="secondary" size="md" onClick={() => onNavigate('catalogo')}>
              Ver Todo el Catálogo <ArrowRight size={16} />
            </Button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
            {featuredProducts.slice(0, 4).map(p => (
              <ProductCard key={p.id} product={p} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Section: Novedades bajo S/ 100 */}
      <section className="cv-section" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="cv-container">
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '16px', marginBottom: '40px' }}>
            <div>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--cv-accent)', fontWeight: 700 }}>
                <Tag size={16} /> Diseño Accesible
              </span>
              <h2 style={{ fontSize: '2.5rem', color: 'var(--cv-text-main)', marginTop: '4px' }}>
                Novedades bajo S/ 100
              </h2>
              <p style={{ color: 'var(--cv-text-muted)', maxWidth: '540px', marginTop: '6px' }}>
                Textiles en lino, velas botánicas, organizadores de bambú y cerámicas artesanales a precios que enamoran.
              </p>
            </div>
            <Button variant="accent" size="md" onClick={() => onNavigate('catalogo', 'categoria=bajo_100')}>
              Ver Todos Bajo S/ 100 <ArrowRight size={16} />
            </Button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
            {under100Products.slice(0, 4).map(p => (
              <ProductCard key={p.id} product={p} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Editorial Atmosphere Banner */}
      <section style={{ position: 'relative', width: '100%', minHeight: '480px', backgroundColor: '#20201E', color: '#FFFFFF', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80"
          alt="Atmósfera cálida CasaViva"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.35,
          }}
        />
        <div className="cv-container" style={{ position: 'relative', zIndex: 10, padding: '64px 20px', maxWidth: '680px' }}>
          <span style={{ fontSize: '0.8125rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#CBD8C6', fontWeight: 600 }}>
            Manifiesto CasaViva
          </span>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.2rem, 4vw, 3.25rem)', color: '#FFFFFF', lineHeight: 1.2, margin: '12px 0 20px' }}>
            Tu hogar merece respirar diseño, calidez y orden
          </h2>
          <p style={{ fontSize: '1.0625rem', color: '#E0DCD3', lineHeight: 1.6, marginBottom: '28px' }}>
            Creemos en las piezas que resisten el paso del tiempo: maderas nobles de roble y olivo, lino lavado europeo y cerámicas moldeadas a mano. Menos objetos, mayor presencia.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            <button
              onClick={() => onNavigate('catalogo')}
              className="btn-primary"
              style={{ padding: '14px 28px', fontSize: '1rem', backgroundColor: '#FFFFFF', color: 'var(--cv-text-main)' }}
            >
              Explorar Catálogo <ArrowRight size={18} />
            </button>
            <button
              onClick={() => onNavigate('catalogo', 'categoria=cat-sala')}
              className="btn-secondary"
              style={{ padding: '14px 28px', fontSize: '1rem', color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.4)', backgroundColor: 'transparent' }}
            >
              Ver Colección Sala
            </button>
          </div>
        </div>
      </section>

      {/* 6. Customer Testimonials */}
      <section className="cv-section" style={{ backgroundColor: 'var(--cv-bg-warm)' }}>
        <div className="cv-container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span style={{ fontSize: '0.8125rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--cv-primary)', fontWeight: 600 }}>
              Testimonios Reales
            </span>
            <h2 style={{ fontSize: '2.5rem', color: 'var(--cv-text-main)', marginTop: '4px' }}>
              Hogares que ya viven la experiencia
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {customerReviews.map((rev, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--cv-radius-lg)',
                  border: '1px solid var(--cv-border-subtle)',
                  padding: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: 'var(--cv-shadow-sm)',
                }}
              >
                <div style={{ marginBottom: '12px' }}>
                  <RatingStars rating={rev.rating} size={16} />
                </div>
                <p style={{ fontSize: '0.9375rem', color: 'var(--cv-text-muted)', lineHeight: 1.6, flex: 1, marginBottom: '20px', fontStyle: 'italic' }}>
                  "{rev.comment}"
                </p>
                <div style={{ borderTop: '1px solid var(--cv-border-subtle)', paddingTop: '14px' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--cv-text-main)' }}>
                    {rev.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--cv-text-light)' }}>
                    {rev.city} · Compró <strong>{rev.product}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Newsletter Section */}
      <section className="cv-section" style={{ backgroundColor: 'var(--cv-primary-light)' }}>
        <div className="cv-container" style={{ maxWidth: '680px', textAlign: 'center' }}>
          <span style={{ fontSize: '0.8125rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--cv-primary)', fontWeight: 700 }}>
            Club CasaViva
          </span>
          <h2 style={{ fontSize: '2.25rem', color: 'var(--cv-text-main)', marginTop: '6px', marginBottom: '12px' }}>
            Recibe 15% de descuento en tu primera compra
          </h2>
          <p style={{ color: 'var(--cv-text-muted)', fontSize: '0.9375rem', marginBottom: '28px' }}>
            Suscríbete para recibir lanzamientos exclusivos, guías de decoración y el cupón <strong>BIENVENIDO15</strong>.
          </p>

          {newsSuccess ? (
            <div style={{ padding: '16px', backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid var(--cv-primary)', color: 'var(--cv-primary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <Check size={20} /> ¡Gracias por suscribirte! Usa el cupón <strong>BIENVENIDO15</strong> en tu checkout.
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} style={{ display: 'flex', gap: '10px', maxWidth: '480px', margin: '0 auto' }}>
              <input
                type="email"
                placeholder="Tu correo electrónico..."
                value={newsEmail}
                onChange={e => setNewsEmail(e.target.value)}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: 'var(--cv-radius-md)',
                  border: '1px solid var(--cv-border)',
                  backgroundColor: '#FFFFFF',
                  fontSize: '0.9375rem',
                }}
                required
              />
              <Button type="submit" variant="primary" size="md" isLoading={isSubmittingNews}>
                Unirme
              </Button>
            </form>
          )}
        </div>
      </section>

      <style>{`
        .category-card:hover img {
          transform: scale(1.06);
        }
      `}</style>
    </div>
  );
};
