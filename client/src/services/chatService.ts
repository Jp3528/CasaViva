import { apiRequest } from './api';

export interface BotResponsePayload {
  id: string;
  sender: 'bot';
  text: string;
  timestamp: string;
  products?: Array<{
    id: string;
    slug: string;
    nombre: string;
    precio_base: number;
    imagen_principal: string;
  }>;
  quickReplies?: string[];
}

export const chatService = {
  async sendMessage(mensaje: string): Promise<{ respuesta: BotResponsePayload }> {
    return apiRequest('/chat/mensaje', {
      method: 'POST',
      body: JSON.stringify({ mensaje }),
    });
  },
};
