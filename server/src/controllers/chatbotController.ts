import { Request, Response } from 'express';
import { chatbotService } from '../services/chatbotService';

export class ChatbotController {
  public async handleMessage(req: Request, res: Response) {
    try {
      const { mensaje } = req.body;
      if (!mensaje) {
        return res.status(400).json({ success: false, message: 'El mensaje no puede estar vacío' });
      }

      const response = await chatbotService.processMessage(mensaje);
      res.json({ success: true, respuesta: response });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

export const chatbotController = new ChatbotController();
