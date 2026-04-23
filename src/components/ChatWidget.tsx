'use client';

import { useState, useRef, useEffect, useSyncExternalStore } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, User, Mail } from 'lucide-react';
import { portfolioStore, Conversation, ChatMessage } from '@/lib/portfolioStore';

export default function ChatWidget() {
  const { conversations } = useSyncExternalStore(
    portfolioStore.subscribe,
    portfolioStore.getSnapshot,
    portfolioStore.getServerSnapshot
  );

  const [isOpen, setIsOpen] = useState(false);
  const [sessionConvId, setSessionConvId] = useState<string | null>(null);
  
  // Form states for new leads
  const [visitorName, setVisitorName] = useState('');
  const [visitorEmail, setVisitorEmail] = useState('');
  const [composeText, setComposeText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations, isOpen]);

  // Find active conversation
  const activeConv = conversations.find(c => c.id === sessionConvId);

  const startConversation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName || !visitorEmail) return;

    const newIdStr = `conv-${Math.floor(Math.random() * 1000000)}`;
    const newConv: Conversation = {
      id: newIdStr,
      visitorName,
      visitorEmail,
      status: 'new',
      lastUpdate: new Date().toISOString(),
      messages: [
        {
          id: `msg-bot-${Math.floor(Math.random() * 1000000)}`,
          sender: 'bot',
          text: `Hi ${visitorName}! Thanks for reaching out. What can I help you with today?`,
          timestamp: new Date().toISOString()
        }
      ]
    };

    portfolioStore.updateConversations([...conversations, newConv]);
    setSessionConvId(newIdStr);
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeText.trim() || !activeConv) return;

    const newId = `msg-${Math.floor(Math.random() * 1000000)}`;
    const newMsg: ChatMessage = {
      id: newId,
      sender: 'visitor',
      text: composeText.trim(),
      timestamp: new Date().toISOString()
    };

    const updatedConv = {
      ...activeConv,
      messages: [...activeConv.messages, newMsg],
      lastUpdate: new Date().toISOString(),
      status: 'new' as const
    };

    const newConvs = conversations.map(c => c.id === activeConv.id ? updatedConv : c);
    portfolioStore.updateConversations(newConvs);
    setComposeText('');
  };

  return (
    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999 }}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            style={{
              position: 'absolute',
              bottom: '5rem',
              right: 0,
              width: '350px',
              height: '500px',
              background: 'rgba(15,15,15,0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '1.5rem',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
            }}
          >
            {/* Header */}
            <div style={{ padding: '1.5rem', background: 'var(--accent)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontWeight: 800, fontSize: '1.1rem', margin: 0 }}>Start a Project</h3>
                <p style={{ fontSize: '0.75rem', opacity: 0.8, margin: 0 }}>We typically reply in a few hours.</p>
              </div>
              <button onClick={() => setIsOpen(false)} style={{ background: 'rgba(0,0,0,0.2)', border: 'none', color: 'white', padding: '0.5rem', borderRadius: '50%', cursor: 'pointer', display: 'flex' }}>
                <X size={16} />
              </button>
            </div>

            {/* Content Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }} className="admin-scroll">
              {!activeConv ? (
                /* Registration Form */
                <form onSubmit={startConversation} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: 'auto', marginBottom: 'auto' }}>
                  <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginBottom: '1rem' }}>Please introduce yourself before we chat.</p>
                  <div style={{ position: 'relative' }}>
                    <User size={16} style={{ position: 'absolute', top: '12px', left: '12px', color: 'rgba(255,255,255,0.3)' }} />
                    <input 
                      required 
                      placeholder="Your Name" 
                      value={visitorName} 
                      onChange={e => setVisitorName(e.target.value)}
                      className="admin-input" 
                      style={{ paddingLeft: '40px' }} 
                    />
                  </div>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', top: '12px', left: '12px', color: 'rgba(255,255,255,0.3)' }} />
                    <input 
                      required 
                      type="email" 
                      placeholder="Email Address" 
                      value={visitorEmail} 
                      onChange={e => setVisitorEmail(e.target.value)}
                      className="admin-input" 
                      style={{ paddingLeft: '40px' }} 
                    />
                  </div>
                  <button type="submit" className="btn-luxury" style={{ padding: '0.8rem', width: '100%', fontSize: '0.8rem', background: 'var(--accent)', border: 'none' }}>
                    Start Chat
                  </button>
                </form>
              ) : (
                /* Chat Messages */
                <>
                  {activeConv.messages.map(msg => (
                    <div key={msg.id} style={{ alignSelf: msg.sender === 'visitor' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                       <div style={{ 
                         background: msg.sender === 'visitor' ? 'var(--accent)' : 'rgba(255,255,255,0.05)', 
                         color: 'white', 
                         padding: '0.75rem 1rem', 
                         borderRadius: '1rem',
                         borderBottomRightRadius: msg.sender === 'visitor' ? 0 : '1rem',
                         borderBottomLeftRadius: msg.sender === 'bot' ? 0 : '1rem',
                         fontSize: '0.85rem',
                         lineHeight: 1.4
                       }}>
                         {msg.text}
                       </div>
                       <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.3rem', display: 'block', textAlign: msg.sender === 'visitor' ? 'right' : 'left' }}>
                         {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                       </span>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input Area */}
            {activeConv && (
              <form onSubmit={sendMessage} style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.5)', display: 'flex', gap: '0.5rem' }}>
                <input
                  required
                  placeholder="Type your message..."
                  value={composeText}
                  onChange={e => setComposeText(e.target.value)}
                  className="admin-input"
                  style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: '100px', background: 'rgba(255,255,255,0.05)' }}
                />
                <button type="submit" disabled={!composeText.trim()} style={{ background: composeText.trim() ? 'var(--accent)' : 'rgba(255,255,255,0.1)', border: 'none', color: 'white', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: composeText.trim() ? 'pointer' : 'not-allowed', transition: '0.3s' }}>
                  <Send size={16} style={{ marginLeft: '-2px' }} />
                </button>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '60px', height: '60px', borderRadius: '50%', background: 'var(--accent)', color: 'white',
          border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 10px 30px rgba(59, 130, 246, 0.4)', cursor: 'pointer', zIndex: 1000
        }}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </motion.button>
    </div>
  );
}
