import { Request, Response } from 'express';
import { subscriberRepository } from '../repositories/subscriberRepository';

export class SubscriberController {
  public async subscribe(req: Request, res: Response) {
    try {
      const { email, origen } = req.body;
      if (!email || !email.includes('@')) {
        return res.status(400).json({ success: false, message: 'Por favor ingresa un correo electrónico válido' });
      }

      const subscriber = await subscriberRepository.subscribe(email, origen);
      res.status(201).json({
        success: true,
        suscriptor: subscriber,
        message: '¡Gracias por unirte! Te hemos enviado tu cupón de 15% de descuento.'
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  public async getAll(req: Request, res: Response) {
    try {
      const suscriptores = await subscriberRepository.findAll();
      res.json({ success: true, suscriptores });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  public async getLogs(req: Request, res: Response) {
    try {
      const logs = await subscriberRepository.getEmailLogs();
      res.json({ success: true, logs });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

export const subscriberController = new SubscriberController();
