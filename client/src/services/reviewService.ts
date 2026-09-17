import { apiRequest } from './api';
import { Review } from '../types';

export const reviewService = {
  async getReviewsByProduct(productId: string): Promise<{ resenas: Review[] }> {
    return apiRequest(`/reviews/producto/${productId}`);
  },

  async addReview(data: {
    producto_id: string;
    usuario_nombre: string;
    calificacion: number;
    titulo: string;
    comentario: string;
  }): Promise<{ resena: Review; message: string }> {
    return apiRequest('/reviews/crear', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
