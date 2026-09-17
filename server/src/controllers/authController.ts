import { Request, Response } from 'express';
import { authService } from '../services/authService';
import { userRepository } from '../repositories/userRepository';

export class AuthController {
  public async register(req: Request, res: Response) {
    try {
      const { nombre, email, password, telefono } = req.body;
      const result = await authService.register({ nombre, email, password, telefono });
      res.status(201).json({ success: true, ...result, message: '¡Cuenta creada con éxito!' });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  public async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.json({ success: true, ...result, message: '¡Bienvenido de vuelta a CasaViva!' });
    } catch (error: any) {
      res.status(401).json({ success: false, message: error.message });
    }
  }

  public async recoverPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const result = await authService.recoverPassword(email);
      res.json({ success: true, ...result });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  public async getProfile(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const profile = await authService.getProfile(userId);
      if (!profile) {
        return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      }
      res.json({ success: true, usuario: profile });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  public async getAddresses(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const direcciones = await userRepository.findAddressesByUserId(userId);
      res.json({ success: true, direcciones });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  public async addAddress(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const address = await userRepository.addAddress({
        id: `addr-${Date.now()}`,
        usuario_id: userId,
        ...req.body
      });
      res.status(201).json({ success: true, direccion: address, message: 'Dirección guardada con éxito' });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  public async deleteAddress(req: Request, res: Response) {
    try {
      const { userId, addressId } = req.params;
      const deleted = await userRepository.deleteAddress(addressId, userId);
      res.json({ success: deleted, message: deleted ? 'Dirección eliminada' : 'No se pudo eliminar' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  public async setDefaultAddress(req: Request, res: Response) {
    try {
      const { userId, addressId } = req.params;
      const updated = await userRepository.setDefaultAddress(addressId, userId);
      res.json({ success: updated, message: 'Dirección establecida como principal' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

export const authController = new AuthController();
