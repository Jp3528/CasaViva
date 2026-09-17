import { apiRequest } from './api';
import { Subscriber } from '../types';

export const subscriberService = {
  async subscribe(email: string, origen: string = 'newsletter_home'): Promise<{ suscriptor: Subscriber; message: string }> {
    return apiRequest('/subscribers/suscribir', {
      method: 'POST',
      body: JSON.stringify({ email, origen }),
    });
  },

  async getAllSubscribers(): Promise<{ suscriptores: Subscriber[] }> {
    return apiRequest('/subscribers/admin/todos');
  },

  async getEmailLogs(): Promise<{ logs: any[] }> {
    return apiRequest('/subscribers/admin/logs-correos');
  },
};
