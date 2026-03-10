import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bot, Send, X } from "lucide-react";

const faqResponses: Record<string, string> = {
  "preço": "Nossos planos começam em R$ 197/mês. O plano Profissional (R$ 497/mês) é o mais popular! Posso te ajudar a escolher o ideal?",
  "plano": "Temos 3 planos: Starter (R$ 197), Profissional (R$ 497) e Enterprise (R$ 997). Qual se encaixa melhor na sua operação?",
  "comprar": "Ótimo! Você pode escolher seu plano na seção abaixo. Quer que eu te direcione?",
  "contratar": "Excelente decisão! Role até a seção de planos e clique em 'Começar Agora' para iniciar.",
  "agente": "Nossos agentes de IA automatizam atendimento 24/7, qualificam leads e integram com WhatsApp, Instagram e mais.",
  "integração": "Integramos com WhatsApp, Instagram, Telegram, e-mail e mais de 50 plataformas via API.",
  "suporte": "Oferecemos suporte por email no Starter, prioritário no Profissional e gerente dedicado no Enterprise.",
  "funciona": "A VerbiA usa IA avançada para criar agentes que atendem, qualificam e convertem leads automaticamente.",
};

const defaultResponse = "Interessante! Posso ajudar com informações sobre planos, agentes de IA, integrações ou como a VerbiA pode escalar sua operação. O que gostaria de saber?";
const hotKeywords = ["preço", "comprar", "contratar", "plano", "valor", "custo", "assinar"];

type ChatMessage = { role: "user" | "bot"; text: string };

const ChatWidget = () => {
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [isHotLead, setIsHotLead] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "bot", text: "Olá! 👋 Sou o Agente VerbiA. Como posso ajudar você a escalar sua operação hoje?" },
  ]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleChat = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.toLowerCase();
    setMessages((prev) => [...prev, { role: "user", text: chatInput }]);
    setChatInput("");

    if (hotKeywords.some((kw) => userMsg.includes(kw))) setIsHotLead(true);

    setTimeout(() => {
      const matchedKey = Object.keys(faqResponses).find((k) => userMsg.includes(k));
      setMessages((prev) => [...prev, { role: "bot", text: matchedKey ? faqResponses[matchedKey] : defaultResponse }]);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="absolute bottom-16 right-0"
          >
            <Card className="w-80 sm:w-96 bg-card border-border shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border bg-muted/50">
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-primary" />
                  <span className="font-display font-semibold text-sm">Agente VerbiA</span>
                  {isHotLead && (
                    <Badge className="bg-destructive text-destructive-foreground text-xs animate-pulse">
                      Lead Quente 🔥
                    </Badge>
                  )}
                </div>
                <button onClick={() => setChatOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Messages */}
              <div className="h-64 overflow-y-auto p-4 space-y-3">
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div
                      className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <div className="p-3 border-t border-border flex gap-2">
                <Input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleChat()}
                  placeholder="Digite sua dúvida..."
                  className="text-sm"
                />
                <Button onClick={handleChat} size="icon" className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setChatOpen(!chatOpen)}
        className="h-14 w-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-[0_0_30px_hsl(var(--primary)/0.4)] hover:shadow-[0_0_50px_hsl(var(--primary)/0.6)] transition-all"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {chatOpen ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
      </motion.button>
    </div>
  );
};

export default ChatWidget;
