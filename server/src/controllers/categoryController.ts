import { Request, Response } from 'express';
import { categoryRepository } from '../repositories/categoryRepository';

export class CategoryController {
  public async getCategories(req: Request, res: Response) {
    try {
      const categorias = await categoryRepository.findAll();
      res.json({ success: true, categorias });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

export const categoryController = new CategoryController();
