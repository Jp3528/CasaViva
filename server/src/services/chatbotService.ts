import { productRepository } from '../repositories/productRepository';
import { orderRepository } from '../repositories/orderRepository';
import { Product } from '../models/types';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
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

export class ChatbotService {
  public async processMessage(userMessage: string): Promise<ChatMessage> {
    const text = userMessage.toLowerCase().trim();
    const timestamp = new Date().toISOString();
    const id = `msg-${Date.now()}`;

    // 1. Payment Questions
    if (text.includes('pago') || text.includes('yape') || text.includes('tarjeta') || text.includes('paypal') || text.includes('pagar')) {
      return {
        id,
        sender: 'bot',
        text: 'En CasaViva aceptamos múltiples métodos de pago seguros:\n\n• **Yape / Plin**: Escanea nuestro código QR al finalizar tu compra.\n• **Tarjetas de Débito y Crédito**: Visa, Mastercard y Amex sin recargos.\n• **PayPal**: Para pagos seguros internacionales.\n\n*Nota*: En esta versión de demostración, todos los pagos se validan en entorno seguro sin cargos reales.',
        timestamp,
        quickReplies: ['Ver novedades bajo S/ 100', '¿Costo de envío?', '¿Tienen cupones?']
      };
    }

    // 2. Shipping Questions
    if (text.includes('envio') || text.includes('envío') || text.includes('entrega') || text.includes('costo') || text.includes('provincia') || text.includes('lima') || text.includes('tiempo')) {
      return {
        id,
        sender: 'bot',
        text: 'Información de envíos en CasaViva:\n\n• **Envío Gratuito**: En compras desde **S/ 199.00** a todo el Perú.\n• **Lima Metropolitana**: Tarifa fija de S/ 15.00 (Entrega en 24 a 48 horas).\n• **Provincias**: Tarifa plana de S/ 25.00 (Entrega en 3 a 5 días hábiles vía Courier certificado).\n\nTodos los paquetes viajan con seguro y embalaje protector ecológico.',
        timestamp,
        quickReplies: ['Buscar lámparas', 'Ver ofertas', '¿Cómo pagar con Yape?']
      };
    }

    // 3. Coupons & Deals
    if (text.includes('cupon') || text.includes('cupón') || text.includes('descuento') || text.includes('oferta') || text.includes('promocion') || text.includes('promoción') || text.includes('rebaja')) {
      return {
        id,
        sender: 'bot',
        text: '¡Claro que sí! Puedes aprovechar estos cupones activos hoy:\n\n• **BIENVENIDO15**: 15% de descuento en tu primera compra (mínimo S/ 100).\n• **CASAVIVA10**: 10% de descuento en cualquier pedido desde S/ 50.\n• **HOGAR2026**: S/ 30 de descuento directo en compras desde S/ 200.\n\nSolo ingrésalos en el carrito o en el checkout.',
        timestamp,
        quickReplies: ['Ir al catálogo', 'Productos bajo S/ 100', 'Ver lámparas']
      };
    }

    // 4. Order Tracking
    if (text.includes('cv-2026') || text.includes('pedido') || text.includes('orden') || text.includes('rastrear') || text.includes('seguimiento')) {
      const match = text.match(/cv-2026-\d+/i);
      if (match) {
        const orderCode = match[0].toUpperCase();
        const order = await orderRepository.findByCode(orderCode);
        if (order) {
          return {
            id,
            sender: 'bot',
            text: `He encontrado tu pedido **${order.codigo_orden}**:\n\n• **Estado actual**: ${order.estado_pedido}\n• **Destinatario**: ${order.datos_cliente.nombre}\n• **Dirección**: ${order.direccion_envio.direccion}, ${order.direccion_envio.distrito}\n• **Total pagado**: S/ ${order.total.toFixed(2)}\n• **Comprobante**: ${order.tipo_comprobante.toUpperCase()}\n\n¡Gracias por tu compra en CasaViva!`,
            timestamp,
            quickReplies: ['Buscar más productos', 'Hablar de envíos', 'Ver catálogo']
          };
        } else {
          return {
            id,
            sender: 'bot',
            text: `No encontré el pedido con código **${orderCode}**. Por favor verifica el número o consúltalo en la sección "Mis Pedidos" de tu cuenta.`,
            timestamp,
            quickReplies: ['Ver mis pedidos', 'Contactar soporte']
          };
        }
      }

      return {
        id,
        sender: 'bot',
        text: 'Para consultar el estado de tu pedido, escribe tu código de compra (por ejemplo: **CV-2026-1001**) o inicia sesión para verlo en tu perfil.',
        timestamp,
        quickReplies: ['CV-2026-1001', '¿Cómo comprar?', 'Ver ofertas']
      };
    }

    // 5. Product Search through chatbot
    const searchTerms = ['sofa', 'sofá', 'lampara', 'lámpara', 'mesa', 'cojin', 'cojín', 'toalla', 'cesta', 'florero', 'vela', 'vajilla', 'espejo', 'duvet', 'lino', 'roble', 'yute', 'bano', 'baño', 'cocina', 'sala', 'dormitorio', 'decoracion', 'decoración', '100', 'barato', 'novedad'];
    const matchedTerm = searchTerms.find(term => text.includes(term));

    if (matchedTerm || text.length > 2) {
      const query = matchedTerm || text;
      const { productos } = await productRepository.findAll({
        busqueda: query === '100' || query === 'barato' ? undefined : query,
        disponibilidad: (query === '100' || query === 'barato') ? 'bajo_100' : undefined,
        limite: 3
      });

      if (productos.length > 0) {
        return {
          id,
          sender: 'bot',
          text: `Encontré estas opciones inspiradoras para "${query}":`,
          timestamp,
          products: productos.map(p => ({
            id: p.id,
            slug: p.slug,
            nombre: p.nombre,
            precio_base: p.precio_base,
            imagen_principal: p.imagen_principal
          })),
          quickReplies: ['Ver catálogo completo', '¿Cómo pagar con Yape?', 'Costos de envío']
        };
      }
    }

    // Default friendly greeting / fallback
    return {
      id,
      sender: 'bot',
      text: '¡Hola! Soy el asistente virtual de **CasaViva** 🌿. ¿En qué te puedo ayudar hoy?\n\nPuedo ayudarte a encontrar productos, explicarte métodos de pago (Yape, Tarjetas, PayPal), guiarte con los envíos o rastrear tus compras.',
      timestamp,
      quickReplies: ['Buscar lámparas', 'Ofertas bajo S/ 100', '¿Cómo pagar con Yape?', 'Costos de envío']
    };
  }
}

export const chatbotService = new ChatbotService();
