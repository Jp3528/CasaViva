import { db } from './db';
import { Subscriber, EmailLog } from '../models/types';

export class SubscriberRepository {
  public async subscribe(email: string, origen: string = 'newsletter_home'): Promise<Subscriber> {
    const existing = db.subscribers.find(s => s.email.toLowerCase() === email.toLowerCase());
    if (existing) return existing;

    const sub: Subscriber = {
      id: `sub-${Date.now()}`,
      email: email.toLowerCase().trim(),
      origen,
      creado_en: new Date().toISOString()
    };

    db.subscribers.unshift(sub);

    if (db.isPostgresConnected && db.pool) {
      try {
        await db.pool.query(
          'INSERT INTO suscriptores (id, email, origen, creado_en) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO NOTHING',
          [sub.id, sub.email, sub.origen, sub.creado_en]
        );
      } catch (err) {
        console.error('Error insertando suscriptor en PostgreSQL:', err);
      }
    }

    // Log welcome email
    await this.logEmail({
      id: `mail-${Date.now()}`,
      destinatario: sub.email,
      asunto: '¡Bienvenido a CasaViva! 15% de descuento en tu primera compra',
      tipo: 'bienvenida_newsletter',
      cuerpo_resumen: 'Gracias por unirte al club CasaViva. Usa el cupón BIENVENIDO15 en tu checkout.',
      enviado_en: new Date().toISOString()
    });

    return sub;
  }

  public async findAll(): Promise<Subscriber[]> {
    return [...db.subscribers];
  }

  public async logEmail(log: EmailLog): Promise<void> {
    db.emailLogs.unshift(log);
    if (db.isPostgresConnected && db.pool) {
      try {
        await db.pool.query(
          'INSERT INTO logs_correos (id, destinatario, asunto, tipo, cuerpo_resumen, enviado_en) VALUES ($1, $2, $3, $4, $5, $6)',
          [log.id, log.destinatario, log.asunto, log.tipo, log.cuerpo_resumen, log.enviado_en]
        );
      } catch (err) {
        console.error('Error guardando log de correo en PostgreSQL:', err);
      }
    }
  }

  public async getEmailLogs(): Promise<EmailLog[]> {
    return [...db.emailLogs];
  }
}

export const subscriberRepository = new SubscriberRepository();
