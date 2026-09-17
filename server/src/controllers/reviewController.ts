import { Request, Response } from 'express';
import { reviewRepository } from '../repositories/reviewRepository';

export class ReviewController {
  public async getByProduct(req: Request, res: Response) {
    try {
      const { productId } = req.params;
      const resenas = await reviewRepository.findByProductId(productId);
      res.json({ success: true, resenas });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  public async addReview(req: Request, res: Response) {
    try {
      const { producto_id, usuario_nombre, calificacion, titulo, comentario } = req.body;
      if (!producto_id || !usuario_nombre || !calificacion || !comentario) {
        return res.status(400).json({ success: false, message: 'Faltan campos obligatorios' });
      }

      const review = await reviewRepository.create({
        id: `rev-${Date.now()}`,
        producto_id,
        usuario_nombre,
        calificacion: Number(calificacion),
        titulo: titulo || '',
        comentario,
        verificada: true,
        creado_en: new Date().toISOString()
      });

      res.status(201).json({ success: true, resena: review, message: '¡Gracias por tu reseña!' });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

export const reviewController = new ReviewController();
