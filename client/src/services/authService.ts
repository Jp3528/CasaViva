import { apiRequest } from './api';
import { User, Address } from '../types';

export const authService = {
  async register(data: { nombre: string; email: string; password: string; telefono?: string }): Promise<{ user: User; token: string; message: string }> {
    return apiRequest('/auth/registro', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async login(data: { email: string; password: string }): Promise<{ user: User; token: string; message: string }> {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async recoverPassword(email: string): Promise<{ message: string; code?: string }> {
    return apiRequest('/auth/recuperar-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  async getProfile(userId: string): Promise<{ usuario: User }> {
    return apiRequest(`/auth/perfil/${userId}`);
  },

  async getAddresses(userId: string): Promise<{ direcciones: Address[] }> {
    return apiRequest(`/auth/direcciones/${userId}`);
  },

  async addAddress(userId: string, address: Omit<Address, 'id' | 'usuario_id'>): Promise<{ direccion: Address; message: string }> {
    return apiRequest(`/auth/direcciones/${userId}`, {
      method: 'POST',
      body: JSON.stringify(address),
    });
  },

  async deleteAddress(userId: string, addressId: string): Promise<{ success: boolean; message: string }> {
    return apiRequest(`/auth/direcciones/${userId}/${addressId}`, {
      method: 'DELETE',
    });
  },

  async setDefaultAddress(userId: string, addressId: string): Promise<{ success: boolean; message: string }> {
    return apiRequest(`/auth/direcciones/${userId}/${addressId}/default`, {
      method: 'PATCH',
    });
  },
};
