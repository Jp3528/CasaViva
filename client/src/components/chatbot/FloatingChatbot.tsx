import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Sparkles, ShoppingBag, ArrowRight } from 'lucide-react';
import { chatService, BotResponsePayload } from '../../services/chatService';

interface FloatingChatbotProps {
  onNavigate: (page: string, param?: string) => void;
}

interface UiChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  products?: BotResponsePayload['products'];
  quickReplies?: string[];
}

export const FloatingChatbot: React.FC<FloatingChatbotProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<UiChatMessage[]>([
    {
      id: 'init-1',
      sender: 'bot',
      text: '¡Hola! 🌿 Soy tu **Asistente Virtual de CasaViva**.\n\n¿Buscas una pieza para tu sala, dormitorio o terraza? ¿O tienes consultas sobre pagos y envíos?',
      timestamp: new Date().toISOString(),
      quickReplies: ['Buscar sofás de lino', '¿Cómo pagar con Yape?', 'Costos de envío', 'Novedades bajo S/ 100', 'Rastrear pedido'],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim()) return;

    const userMsg: UiChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsLoading(true);

    try {
      const res = await chatService.sendMessage(query.trim());
      const botMsg: UiChatMessage = {
        id: res.respuesta.id,
        sender: 'bot',
        text: res.respuesta.text,
        timestamp: res.respuesta.timestamp,
        products: res.respuesta.products,
        quickReplies: res.respuesta.quickReplies,
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'bot',
          text: 'Disculpa, ocurrió un inconveniente momentáneo. Por favor prueba nuevamente o revisa nuestro catálogo.',
          timestamp: new Date().toISOString(),
          quickReplies: ['Ver catálogo completo', '¿Cómo pagar con Yape?'],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 950,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--cv-primary)',
            color: '#FFFFFF',
            padding: '12px 18px',
            borderRadius: 'var(--cv-radius-full)',
            boxShadow: 'var(--cv-shadow-lg)',
            border: '2px solid rgba(255, 255, 255, 0.4)',
            cursor: 'pointer',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
          className="chatbot-launcher"
          aria-label="Abrir asistente de compras"
        >
          <Sparkles size={18} />
          <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Asistente CasaViva</span>
        </button>
      )}

      {/* Chatbot Stable Sized Window */}
      {isOpen && (
        <div className="chatbot-window">
          {/* Header */}
          <div
            style={{
              padding: '14px 18px',
              backgroundColor: 'var(--cv-primary)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(255,255,255,0.15)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#FFFFFF', color: 'var(--cv-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.875rem' }}>
                CV
              </div>
              <div>
                <h4 style={{ fontSize: '0.9375rem', color: '#FFFFFF', margin: 0, fontWeight: 600 }}>
                  Asistente CasaViva
                </h4>
                <span style={{ fontSize: '0.6875rem', color: '#CBD8C6', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }} /> En línea
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{ color: '#FFFFFF', padding: '4px', background: 'none' }}
              aria-label="Cerrar chat"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', backgroundColor: 'var(--cv-bg-main)' }}>
            {messages.map(msg => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                {/* Text Bubble */}
                <div
                  style={{
                    maxWidth: '85%',
                    padding: '10px 14px',
                    borderRadius: msg.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                    backgroundColor: msg.sender === 'user' ? 'var(--cv-primary)' : '#FFFFFF',
                    color: msg.sender === 'user' ? '#FFFFFF' : 'var(--cv-text-main)',
                    fontSize: '0.875rem',
                    lineHeight: 1.45,
                    boxShadow: 'var(--cv-shadow-sm)',
                    border: msg.sender === 'user' ? 'none' : '1px solid var(--cv-border-subtle)',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {msg.text}
                </div>

                {/* Product Recommendations inside message */}
                {msg.products && msg.products.length > 0 && (
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                    {msg.products.map(p => (
                      <div
                        key={p.id}
                        onClick={() => {
                          setIsOpen(false);
                          onNavigate('producto', p.slug || p.id);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '8px 12px',
                          backgroundColor: '#FFFFFF',
                          borderRadius: '8px',
                          border: '1px solid var(--cv-border)',
                          cursor: 'pointer',
                          boxShadow: 'var(--cv-shadow-sm)',
                          transition: 'background-color 0.15s ease',
                        }}
                      >
                        <img src={p.imagen_principal} alt={p.nombre} style={{ width: '42px', height: '42px', objectFit: 'cover', borderRadius: '4px' }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--cv-text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {p.nombre}
                          </div>
                          <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--cv-primary)' }}>
                            S/ {p.precio_base.toFixed(2)}
                          </div>
                        </div>
                        <ArrowRight size={14} color="var(--cv-text-light)" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Quick replies */}
                {msg.quickReplies && msg.quickReplies.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                    {msg.quickReplies.map((reply, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(reply)}
                        style={{
                          fontSize: '0.75rem',
                          padding: '4px 10px',
                          borderRadius: 'var(--cv-radius-full)',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid var(--cv-primary)',
                          color: 'var(--cv-primary)',
                          fontWeight: 500,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--cv-text-muted)', fontSize: '0.8125rem' }}>
                <span className="typing-dot" /> Escribiendo respuesta...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input */}
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSendMessage();
            }}
            style={{
              padding: '12px 14px',
              backgroundColor: '#FFFFFF',
              borderTop: '1px solid var(--cv-border)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <input
              type="text"
              placeholder="Pregunta sobre lámparas, Yape, envíos..."
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              style={{
                flex: 1,
                padding: '9px 12px',
                borderRadius: 'var(--cv-radius-full)',
                border: '1px solid var(--cv-border)',
                fontSize: '0.875rem',
                outline: 'none',
                color: 'var(--cv-text-main)',
              }}
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'var(--cv-primary)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: !inputMessage.trim() ? 'not-allowed' : 'pointer',
                opacity: !inputMessage.trim() ? 0.5 : 1,
              }}
              aria-label="Enviar mensaje"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      <style>{`
        .chatbot-launcher:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(83, 99, 75, 0.4);
        }
      `}</style>
    </>
  );
};
