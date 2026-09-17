import { db } from './db';
import { Category } from '../models/types';

export class CategoryRepository {
  public async findAll(): Promise<Category[]> {
    return [...db.categories].sort((a, b) => a.orden - b.orden);
  }

  public async findBySlug(slug: string): Promise<Category | null> {
    const cat = db.categories.find(c => c.slug === slug || c.id === slug);
    return cat ? { ...cat } : null;
  }
}

export const categoryRepository = new CategoryRepository();
