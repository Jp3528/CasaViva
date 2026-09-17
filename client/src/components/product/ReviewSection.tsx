import React, { useState, useEffect } from 'react';
import { Review } from '../../types';
import { reviewService } from '../../services/reviewService';
import { RatingStars } from '../ui/RatingStars';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { useToast } from '../../context/ToastContext';
import { MessageSquarePlus, CheckCircle2 } from 'lucide-react';

interface ReviewSectionProps {
  productId: string;
  averageRating: number;
  totalReviews: number;
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({
  productId,
  averageRating,
  totalReviews,
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  // New review form state
  const [nombre, setNombre] = useState('');
  const [calificacion, setCalificacion] = useState(5);
  const [titulo, setTitulo] = useState('');
  const [comentario, setComentario] = useState('');

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const res = await reviewService.getReviewsByProduct(productId);
        setReviews(res.resenas || []);
      } catch (err) {
        console.error('Error cargando reseñas:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadReviews();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !comentario.trim()) {
      showToast('Por favor completa todos los campos requeridos', 'advertencia');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await reviewService.addReview({
        producto_id: productId,
        usuario_nombre: nombre.trim(),
        calificacion,
        titulo: titulo.trim(),
        comentario: comentario.trim(),
      });

      setReviews(prev => [res.resena, ...prev]);
      showToast(res.message, 'exito');
      setIsModalOpen(false);
      setNombre('');
      setTitulo('');
      setComentario('');
      setCalificacion(5);
    } catch (err: any) {
      showToast(err.message || 'Error al enviar reseña', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ marginTop: '32px' }}>
      {/* Reviews Summary Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px',
          padding: '24px',
          backgroundColor: 'var(--cv-bg-warm)',
          borderRadius: 'var(--cv-radius-lg)',
          marginBottom: '32px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '3rem', fontFamily: 'var(--font-serif)', fontWeight: 600, color: 'var(--cv-text-main)', lineHeight: 1 }}>
              {averageRating.toFixed(1)}
            </span>
            <div style={{ marginTop: '4px' }}>
              <RatingStars rating={averageRating} size={16} />
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--cv-text-muted)', display: 'block', marginTop: '2px' }}>
              {totalReviews} {totalReviews === 1 ? 'opinión' : 'opiniones'}
            </span>
          </div>
          <div style={{ borderLeft: '1px solid var(--cv-border)', paddingLeft: '20px' }}>
            <h4 style={{ fontSize: '1.125rem', marginBottom: '4px', color: 'var(--cv-text-main)' }}>
              Opiniones de nuestros clientes
            </h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--cv-text-muted)', margin: 0 }}>
              Todas las opiniones provienen de compradores verificados en CasaViva.
            </p>
          </div>
        </div>

        <Button variant="primary" size="md" icon={<MessageSquarePlus size={16} />} onClick={() => setIsModalOpen(true)}>
          Escribir una Reseña
        </Button>
      </div>

      {/* Reviews List */}
      {isLoading ? (
        <div style={{ padding: '24px', textAlign: 'center', color: 'var(--cv-text-muted)' }}>
          Cargando opiniones...
        </div>
      ) : reviews.length === 0 ? (
        <div style={{ padding: '32px', textAlign: 'center', backgroundColor: '#FFFFFF', borderRadius: 'var(--cv-radius-md)', border: '1px solid var(--cv-border-subtle)' }}>
          <p style={{ color: 'var(--cv-text-muted)', marginBottom: '16px' }}>
            Aún no hay reseñas para este producto. ¡Sé el primero en compartir tu experiencia!
          </p>
          <Button variant="secondary" size="sm" onClick={() => setIsModalOpen(true)}>
            Escribir primera reseña
          </Button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {reviews.map(rev => (
            <div
              key={rev.id}
              style={{
                padding: '20px',
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--cv-radius-md)',
                border: '1px solid var(--cv-border-subtle)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--cv-text-main)' }}>
                    {rev.usuario_nombre}
                  </span>
                  {rev.verificada && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '0.6875rem', color: 'var(--cv-primary)', backgroundColor: 'var(--cv-primary-light)', padding: '2px 6px', borderRadius: '4px' }}>
                      <CheckCircle2 size={12} /> Compra verificada
                    </span>
                  )}
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--cv-text-light)' }}>
                  {new Date(rev.creado_en).toLocaleDateString('es-PE', { year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
              </div>

              <div style={{ marginBottom: '8px' }}>
                <RatingStars rating={rev.calificacion} size={14} />
              </div>

              {rev.titulo && (
                <h5 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--cv-text-main)', marginBottom: '4px' }}>
                  {rev.titulo}
                </h5>
              )}

              <p style={{ fontSize: '0.875rem', color: 'var(--cv-text-muted)', lineHeight: 1.5 }}>
                {rev.comentario}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Add Review Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Escribir una reseña">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">Tu Calificación general</label>
            <RatingStars rating={calificacion} interactive onRatingChange={setCalificacion} size={28} />
          </div>

          <div className="form-group">
            <label className="form-label">Tu Nombre o Iniciales *</label>
            <input
              type="text"
              className="form-input"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              placeholder="Ej. Sofía R."
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Título de tu opinión (opcional)</label>
            <input
              type="text"
              className="form-input"
              value={titulo}
              onChange={e => setTitulo(e.target.value)}
              placeholder="Ej. Excelente calidad de materiales"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Comentario detallado *</label>
            <textarea
              className="form-textarea"
              value={comentario}
              onChange={e => setComentario(e.target.value)}
              placeholder="Cuéntanos qué tal luce en tu espacio, la textura, acabados o la comodidad..."
              rows={4}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              Publicar Reseña
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
