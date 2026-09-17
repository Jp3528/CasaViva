import { db } from './db';
import { User, Address } from '../models/types';

export class UserRepository {
  public async findByEmail(email: string): Promise<User | null> {
    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    return user ? { ...user } : null;
  }

  public async findById(id: string): Promise<User | null> {
    const user = db.users.find(u => u.id === id);
    return user ? { ...user } : null;
  }

  public async create(user: User): Promise<User> {
    db.users.push(user);
    if (db.isPostgresConnected && db.pool) {
      try {
        await db.pool.query(
          `INSERT INTO usuarios (id, nombre, email, password_hash, telefono, rol)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [user.id, user.nombre, user.email, user.password_hash, user.telefono || null, user.rol]
        );
      } catch (err) {
        console.error('Error insertando usuario en PostgreSQL:', err);
      }
    }
    return { ...user };
  }

  public async update(id: string, updates: Partial<User>): Promise<User | null> {
    const idx = db.users.findIndex(u => u.id === id);
    if (idx === -1) return null;

    db.users[idx] = { ...db.users[idx], ...updates };

    if (db.isPostgresConnected && db.pool) {
      try {
        await db.pool.query(
          `UPDATE usuarios 
           SET nombre = COALESCE($1, nombre),
               telefono = COALESCE($2, telefono),
               password_hash = COALESCE($3, password_hash)
           WHERE id = $4`,
          [updates.nombre, updates.telefono, updates.password_hash, id]
        );
      } catch (err) {
        console.error('Error actualizando usuario en PostgreSQL:', err);
      }
    }

    return { ...db.users[idx] };
  }

  public async findAddressesByUserId(userId: string): Promise<Address[]> {
    return db.addresses.filter(a => a.usuario_id === userId);
  }

  public async addAddress(address: Address): Promise<Address> {
    if (address.es_principal) {
      db.addresses.forEach(a => {
        if (a.usuario_id === address.usuario_id) a.es_principal = false;
      });
    }
    db.addresses.push(address);
    return { ...address };
  }

  public async deleteAddress(addressId: string, userId: string): Promise<boolean> {
    const initLen = db.addresses.length;
    db.addresses = db.addresses.filter(a => !(a.id === addressId && a.usuario_id === userId));
    return db.addresses.length < initLen;
  }

  public async setDefaultAddress(addressId: string, userId: string): Promise<boolean> {
    let found = false;
    db.addresses.forEach(a => {
      if (a.usuario_id === userId) {
        if (a.id === addressId) {
          a.es_principal = true;
          found = true;
        } else {
          a.es_principal = false;
        }
      }
    });
    return found;
  }
}

export const userRepository = new UserRepository();
