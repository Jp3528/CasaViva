import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories/userRepository';
import { subscriberRepository } from '../repositories/subscriberRepository';
import { User } from '../models/types';

const JWT_SECRET = process.env.JWT_SECRET || 'casaviva-demo-secret-change-me';

export class AuthService {
  public async register(data: { nombre: string; email: string; password: string; telefono?: string }): Promise<{ user: Omit<User, 'password_hash'>; token: string }> {
    const existing = await userRepository.findByEmail(data.email);
    if (existing) {
      throw new Error('Ya existe una cuenta registrada con este correo electrónico');
    }

    if (!data.password || data.password.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }

    const password_hash = await bcrypt.hash(data.password, 10);
    const user: User = {
      id: `usr-${Date.now()}`,
      nombre: data.nombre.trim(),
      email: data.email.toLowerCase().trim(),
      password_hash,
      telefono: data.telefono?.trim(),
      rol: 'cliente',
      creado_en: new Date().toISOString()
    };

    const saved = await userRepository.create(user);
    const token = this.generateToken(saved);

    const { password_hash: _, ...safeUser } = saved;
    return { user: safeUser, token };
  }

  public async login(email: string, password: string): Promise<{ user: Omit<User, 'password_hash'>; token: string }> {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Credenciales incorrectas');
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      throw new Error('Credenciales incorrectas');
    }

    const token = this.generateToken(user);
    const { password_hash: _, ...safeUser } = user;
    return { user: safeUser, token };
  }

  public async recoverPassword(email: string): Promise<{ message: string; code?: string }> {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      // Return vague message for security or helpful info
      return { message: 'Si el correo está registrado, recibirás un enlace de restablecimiento.' };
    }

    const recoveryCode = Math.floor(100000 + Math.random() * 900000).toString();

    await subscriberRepository.logEmail({
      id: `mail-${Date.now()}`,
      destinatario: user.email,
      asunto: 'Restablecimiento de contraseña - CasaViva',
      tipo: 'recuperacion_clave',
      cuerpo_resumen: `Hola ${user.nombre}, usa el código de seguridad ${recoveryCode} para cambiar tu contraseña en CasaViva.`,
      enviado_en: new Date().toISOString()
    });

    return {
      message: `Hemos enviado las instrucciones a ${user.email}. (Código demo para pruebas: ${recoveryCode})`,
      code: recoveryCode
    };
  }

  public generateToken(user: User): string {
    return jwt.sign(
      { id: user.id, email: user.email, rol: user.rol, nombre: user.nombre },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
  }

  public verifyToken(token: string): any {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch {
      return null;
    }
  }

  public async getProfile(userId: string): Promise<Omit<User, 'password_hash'> | null> {
    const user = await userRepository.findById(userId);
    if (!user) return null;
    const { password_hash, ...safeUser } = user;
    return safeUser;
  }
}

export const authService = new AuthService();
