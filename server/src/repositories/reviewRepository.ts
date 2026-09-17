import { db } from './db';
import { Review } from '../models/types';

export class ReviewRepository {
  public async findByProductId(productId: string): Promise<Review[]> {
    return db.reviews.filter(r => r.producto_id === productId);
  }

  public async create(review: Review): Promise<Review> {
    db.reviews.unshift(review);

    // Recalculate average rating on product
    const prodReviews = db.reviews.filter(r => r.producto_id === review.producto_id);
    const avg = prodReviews.reduce((sum, r) => sum + r.calificacion, 0) / prodReviews.length;
    const prod = db.products.find(p => p.id === review.producto_id);
    if (prod) {
      prod.calificacion_promedio = Number(avg.toFixed(1));
      prod.total_resenas = prodReviews.length;
    }

    if (db.isPostgresConnected && db.pool) {
      try {
        await db.pool.query(
          `INSERT INTO resenas (id, producto_id, usuario_nombre, calificacion, titulo, comentario, verificada, creado_en)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [review.id, review.producto_id, review.usuario_nombre, review.calificacion, review.titulo, review.comentario, review.verificada, review.creado_en]
        );
        if (prod) {
          await db.pool.query(
            'UPDATE productos SET calificacion_promedio = $1, total_resenas = $2 WHERE id = $3',
            [prod.calificacion_promedio, prod.total_resenas, prod.id]
          );
        }
      } catch (err) {
        console.error('Error insertando reseña en PostgreSQL:', err);
      }
    }

    return { ...review };
  }
}

export const reviewRepository = new ReviewRepository();
