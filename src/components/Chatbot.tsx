import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Phone, MapPin, ArrowRight, CornerDownLeft, Sparkles } from 'lucide-react';
import { businessConfig } from '../data/businessConfig.ts';
import { ProductCategory, NavigationTab } from '../types.ts';
import { BrandLogo } from './BrandLogo.tsx';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  action?: {
    type: 'navigate' | 'call' | 'whatsapp';
    label: string;
    tab?: NavigationTab;
    category?: ProductCategory;
    href?: string;
  };
}

interface ChatbotProps {
  onNavigate: (tab: NavigationTab, category?: ProductCategory) => void;
}

export const Chatbot: React.FC<ChatbotProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: `Hi! 👋 Welcome to Classic Fashions.\nChoose an option or type your question:\n• View Catalogue\n• Can't Find Material?\n• Laces\n• Fabrics\n• Denim\n• Mesh\n• Accessories\n• Reach Us\n• Talk to Us`,
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [isOpen, messages]);

  const quickOptions = [
    { label: 'View Catalogue', query: 'View Catalogue' },
    { label: "Can't Find Material?", query: "Can't find material" },
    { label: 'Laces', query: 'Laces' },
    { label: 'Fabrics', query: 'Fabrics' },
    { label: 'Denim', query: 'Denim' },
    { label: 'Mesh', query: 'Mesh' },
    { label: 'Accessories', query: 'Accessories' },
    { label: 'Reach Us', query: 'Reach Us' },
    { label: 'Talk to Us', query: 'Talk to Us' },
  ];

  const processUserQuery = (query: string): Message => {
    const q = query.trim().toLowerCase();

    // Specific intent matching
    if (
      q.includes('hello') ||
      q.includes('hi') ||
      q.includes('hey') ||
      q.includes('vanakkam') ||
      q.includes('good morning') ||
      q.includes('good afternoon')
    ) {
      return {
        id: Date.now().toString(),
        sender: 'bot',
        text: 'Welcome to CLASSIC FASHIONS. We are a supplier and sourcing partner for garment accessories and fabrics. How can I assist you today?',
      };
    }

    if (
      q.includes('catalogue') ||
      q.includes('catalog') ||
      q.includes('products') ||
      q.includes('materials') ||
      q.includes('items')
    ) {
      return {
        id: Date.now().toString(),
        sender: 'bot',
        text: `We provide:\n- Garment Laces (Embroidery, Cotton, Lycra, Ric Rac)\n- Fabrics (Woven Fabric, Gada, Chambray, Dyed, Fur)\n- Denim (Denim Fabric, Premium Denim, Garment Denim)\n- Mesh (Mesh Fabric, Lycra Mesh)\n- Accessories (Brand Tags, Buttons, Tapes)\n- Processing (Edge Cutting / Scalping)\n\nWould you like to explore our digital catalogue?`,
        action: {
          type: 'navigate',
          label: 'Open Digital Catalogue',
          tab: 'catalogue',
        },
      };
    }

    if (q.includes('lace') || q.includes('laces')) {
      return {
        id: Date.now().toString(),
        sender: 'bot',
        text: 'Our lace range includes Embroidery Lace, Cotton Lace, Lycra Lace, Ric Rac, Imported Lace and other varieties for garments and fashion wear.',
        action: {
          type: 'navigate',
          label: 'View Laces in Catalogue',
          tab: 'catalogue',
          category: 'laces',
        },
      };
    }

    if (q.includes('fabric') || q.includes('fabrics') || q.includes('gada') || q.includes('chambray') || q.includes('poplin')) {
      return {
        id: Date.now().toString(),
        sender: 'bot',
        text: 'We offer Woven Fabric, Chambray, Poplin Gada, Twill Gada, Drill Gada, Dyed Fabric, Fur Fabric and other varieties for garment businesses and designers.',
        action: {
          type: 'navigate',
          label: 'View Fabrics in Catalogue',
          tab: 'catalogue',
          category: 'fabrics',
        },
      };
    }

    if (q.includes('denim') || q.includes('jeans')) {
      return {
        id: Date.now().toString(),
        sender: 'bot',
        text: 'We supply Denim Fabric, Premium Denim, Garment Denim and other denim varieties for apparel makers.',
        action: {
          type: 'navigate',
          label: 'View Denim in Catalogue',
          tab: 'catalogue',
          category: 'denim',
        },
      };
    }

    if (q.includes('mesh') || q.includes('net')) {
      return {
        id: Date.now().toString(),
        sender: 'bot',
        text: 'Our mesh collection includes Mesh Fabric, Lycra Mesh and other mesh varieties for garment and activewear applications.',
        action: {
          type: 'navigate',
          label: 'View Mesh in Catalogue',
          tab: 'catalogue',
          category: 'mesh',
        },
      };
    }

    if (
      q.includes('accessory') ||
      q.includes('accessories') ||
      q.includes('tag') ||
      q.includes('tags') ||
      q.includes('button') ||
      q.includes('buttons') ||
      q.includes('tape') ||
      q.includes('tapes')
    ) {
      return {
        id: Date.now().toString(),
        sender: 'bot',
        text: 'We supply Brand Tags, Custom Buttons, Tapes and other garment-related accessories.',
        action: {
          type: 'navigate',
          label: 'View Accessories in Catalogue',
          tab: 'catalogue',
          category: 'accessories',
        },
      };
    }

    if (
      q.includes('processing') ||
      q.includes('service') ||
      q.includes('scalping') ||
      q.includes('cutting') ||
      q.includes('slit')
    ) {
      return {
        id: Date.now().toString(),
        sender: 'bot',
        text: 'We provide fabric processing services including Edge Cutting / Scalping. Please enquire with your fabric requirements.',
        action: {
          type: 'navigate',
          label: 'View Processing Details',
          tab: 'catalogue',
          category: 'processing',
        },
      };
    }

    if (
      q.includes('reach') ||
      q.includes('location') ||
      q.includes('where') ||
      q.includes('address') ||
      q.includes('map') ||
      q.includes('visit')
    ) {
      return {
        id: Date.now().toString(),
        sender: 'bot',
        text: 'You can find our full physical address, location map, and visiting directions inside the Reach Us section.',
        action: {
          type: 'navigate',
          label: 'Visit Reach Us Page',
          tab: 'reach-us',
        },
      };
    }

    // Sourcing / Can't find material / Custom requirement intent
    if (
      q.includes("can't find") ||
      q.includes('cant find') ||
      q.includes('cannot find') ||
      q.includes('not listed') ||
      q.includes('not in catalogue') ||
      q.includes('not found') ||
      q.includes('source another') ||
      q.includes('something similar') ||
      q.includes('specific fabric') ||
      q.includes('specific material') ||
      q.includes('custom material') ||
      q.includes('custom fabric') ||
      q.includes('source material') ||
      q.includes('request material') ||
      q.includes('special order') ||
      q.includes('new material')
    ) {
      return {
        id: Date.now().toString(),
        sender: 'bot',
        text: "Sure. If the exact material isn't listed in our catalogue, you can share your requirement with us. We'll review suitable sourcing options.",
        action: {
          type: 'navigate',
          label: 'REQUEST A MATERIAL',
          tab: 'material-request',
        },
      };
    }

    // Manufacturer question intent
    if (
      q.includes('manufacture') ||
      q.includes('manufacturer') ||
      q.includes('factory') ||
      q.includes('do you make') ||
      q.includes('do you produce')
    ) {
      return {
        id: Date.now().toString(),
        sender: 'bot',
        text: 'Classic Fashions is a supplier and sourcing partner. We source materials from suitable manufacturing and supply sources based on customer requirements.',
        action: {
          type: 'navigate',
          label: 'REQUEST A MATERIAL',
          tab: 'material-request',
        },
      };
    }

    if (
      q.includes('talk') ||
      q.includes('call') ||
      q.includes('contact') ||
      q.includes('phone') ||
      q.includes('whatsapp') ||
      q.includes('email') ||
      q.includes('mobile') ||
      q.includes('number')
    ) {
      return {
        id: Date.now().toString(),
        sender: 'bot',
        text: `You can reach us at:\nPhone: ${businessConfig.phonePlaceholder}\nWhatsApp: ${businessConfig.whatsappPlaceholder}\nEmail: ${businessConfig.emailPlaceholder}`,
        action: {
          type: 'call',
          label: 'CALL US',
          href: `tel:${businessConfig.phonePlaceholder}`,
        },
      };
    }

    // Strict Rule: Never invent prices, stock, delivery time, MOQ, GSM
    if (
      q.includes('price') ||
      q.includes('cost') ||
      q.includes('rate') ||
      q.includes('stock') ||
      q.includes('available') ||
      q.includes('moq') ||
      q.includes('delivery') ||
      q.includes('dispatch') ||
      q.includes('gsm') ||
      q.includes('width') ||
      q.includes('sample')
    ) {
      return {
        id: Date.now().toString(),
        sender: 'bot',
        text: 'Contact us for current product specifications and availability.',
        action: {
          type: 'call',
          label: 'CALL US',
          href: `tel:${businessConfig.phonePlaceholder}`,
        },
      };
    }

    // Default Fallback
    return {
      id: Date.now().toString(),
      sender: 'bot',
      text: "I'm not able to provide that information here. Please contact our team directly.",
      action: {
        type: 'call',
        label: 'CALL US',
        href: `tel:${businessConfig.phonePlaceholder}`,
      },
    };
  };

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: text.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputText('');

    setTimeout(() => {
      const botResponse = processUserQuery(text);
      setMessages((prev) => [...prev, botResponse]);
    }, 250);
  };

  const handleActionClick = (action: Message['action']) => {
    if (!action) return;
    if (action.type === 'navigate' && action.tab) {
      onNavigate(action.tab, action.category);
      setIsOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (action.type === 'call' && action.href) {
      window.location.href = action.href;
    }
  };

  return (
    <>
      {/* Floating Toggle Button (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open Classic Fashions Assistant"
          className="w-14 h-14 rounded-full bg-[#181715] text-white shadow-xl hover:bg-[#302D29] hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center border-2 border-[#E8E6E0]"
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <span className="text-2xl select-none" role="img" aria-label="chat">
              💬
            </span>
          )}
        </button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 bg-white rounded-2xl shadow-2xl border border-[#DCD7CD] overflow-hidden flex flex-col h-[520px] max-h-[80vh] animate-in fade-in slide-in-from-bottom-4 duration-200"
          role="dialog"
          aria-label="Classic Fashions Assistant Chat Window"
        >
          {/* Header */}
          <div className="bg-[#181715] text-white px-4 py-3.5 flex items-center justify-between border-b border-[#2C2926]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-[#2D2A26] flex items-center justify-center p-1 border border-[#444038] shrink-0">
                <BrandLogo variant="white" size="xs" className="w-full h-auto" />
              </div>
              <div>
                <h3 className="font-serif text-sm font-semibold tracking-wide text-white leading-tight">
                  Classic Fashions Assistant
                </h3>
                <span className="text-[10px] text-[#A8A29A] block font-mono">
                  Direct Wholesale Support
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-[#A8A29A] hover:text-white rounded-md transition-colors"
              aria-label="Close assistant"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#FAF9F6]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-line ${
                    msg.sender === 'user'
                      ? 'bg-[#181715] text-white rounded-br-none'
                      : 'bg-white text-[#181715] border border-[#E5E0D6] shadow-sm rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Inline Action Button if provided */}
                {msg.action && (
                  <div className="mt-1.5 pl-1">
                    {msg.action.type === 'navigate' ? (
                      <button
                        onClick={() => handleActionClick(msg.action)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#82553E] hover:bg-[#6B422F] text-white text-[11px] font-semibold uppercase tracking-wider rounded transition-colors shadow-sm"
                      >
                        <span>{msg.action.label}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    ) : (
                      <a
                        href={msg.action.href}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#181715] hover:bg-[#302D29] text-white text-[11px] font-semibold uppercase tracking-wider rounded transition-colors shadow-sm font-mono"
                      >
                        <Phone className="w-3 h-3 text-[#E5D7CC]" />
                        <span>{msg.action.label}</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Option Buttons */}
          <div className="p-2 bg-white border-t border-[#EAE6DE]">
            <div className="text-[10px] font-mono text-[#8C877E] px-2 mb-1.5 uppercase font-medium">
              Quick Topics:
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none no-scrollbar px-1">
              {quickOptions.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => handleSend(opt.query)}
                  className="px-2.5 py-1 text-[11px] font-medium bg-[#F2EFEA] hover:bg-[#181715] hover:text-white text-[#4A4742] rounded-full whitespace-nowrap transition-colors border border-[#E3DFD7]"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-white border-t border-[#E8E6E0]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask about laces, fabrics, denim..."
                className="flex-1 px-3 py-2 text-xs bg-[#FAF9F6] border border-[#D5D0C6] rounded-md text-[#181715] focus:outline-none focus:border-[#181715]"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2 bg-[#181715] text-white rounded-md hover:bg-[#302D29] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Send message"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
