import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Zap, Bot, MessageSquare, Send, X, Check, TrendingUp, Users, BarChart3, Shield } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { useToast } from "@/hooks/use-toast";

const growthData = [
  { m: "Jan", v: 120 }, { m: "Fev", v: 210 }, { m: "Mar", v: 380 },
  { m: "Abr", v: 520 }, { m: "Mai", v: 710 }, { m: "Jun", v: 950 },
  { m: "Jul", v: 1340 }, { m: "Ago", v: 1800 },
];

const plans = [
  {
    name: "Starter",
    price: "197",
    agents: "3",
    conversations: "2.000",
    credits: "3.000",
    highlight: false,
    features: ["3 Agentes de IA", "2.000 conversas/mês", "3.000 créditos IA", "Suporte por email", "Relatórios básicos"],
  },
  {
    name: "Profissional",
    price: "497",
    agents: "10",
    conversations: "5.000",
    credits: "10.000",
    highlight: true,
    features: ["10 Agentes de IA", "5.000 conversas/mês", "10.000 créditos IA", "Suporte prioritário", "Analytics avançado", "Integrações ilimitadas"],
  },
  {
    name: "Enterprise",
    price: "997",
    agents: "Ilimitados",
    conversations: "Ilimitadas",
    credits: "50.000",
    highlight: false,
    features: ["Agentes ilimitados", "Conversas ilimitadas", "50.000 créditos IA", "Gerente dedicado", "SLA garantido", "API personalizada"],
  },
];

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

type ChatMessage = { role: "user" | "bot"; text: string };

const Landing = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const plansRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "bot", text: "Olá! 👋 Sou o Agente VerbiA. Como posso ajudar você a escalar sua operação hoje?" },
  ]);
  const [isHotLead, setIsHotLead] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [checkoutForm, setCheckoutForm] = useState({ name: "", email: "" });

  const hotKeywords = ["preço", "comprar", "contratar", "plano", "valor", "custo", "assinar"];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleChat = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.toLowerCase();
    setMessages((prev) => [...prev, { role: "user", text: chatInput }]);
    setChatInput("");

    if (hotKeywords.some((kw) => userMsg.includes(kw))) {
      setIsHotLead(true);
    }

    setTimeout(() => {
      const matchedKey = Object.keys(faqResponses).find((k) => userMsg.includes(k));
      setMessages((prev) => [...prev, { role: "bot", text: matchedKey ? faqResponses[matchedKey] : defaultResponse }]);
    }, 600);
  };

  const handleBuy = (planName: string) => {
    setSelectedPlan(planName);
    setCheckoutOpen(true);
  };

  const handleCheckoutConfirm = () => {
    if (!checkoutForm.name || !checkoutForm.email) {
      toast({ title: "Preencha todos os campos", variant: "destructive" });
      return;
    }
    setCheckoutOpen(false);
    toast({ title: "Compra confirmada!", description: `Plano ${selectedPlan} ativado. Redirecionando...` });
    setTimeout(() => navigate("/configuracoes"), 1500);
  };

  const scrollToPlans = () => {
    plansRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="dark min-h-screen bg-[hsl(160,10%,6%)] text-[hsl(150,20%,95%)] overflow-x-hidden">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
        {/* Heatmap BG effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[hsl(120,100%,62%)] opacity-[0.06] blur-[120px]" />
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-[hsl(160,70%,45%)] opacity-[0.05] blur-[100px]" />
          <div className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full bg-[hsl(45,100%,60%)] opacity-[0.04] blur-[80px]" />
        </div>

        {/* Growth SVG lines */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.08]" preserveAspectRatio="none" viewBox="0 0 1200 800">
          <path d="M0 700 Q200 650 400 500 T800 300 T1200 100" stroke="hsl(120,100%,62%)" strokeWidth="2" fill="none" />
          <path d="M0 750 Q300 700 500 550 T900 350 T1200 200" stroke="hsl(160,70%,45%)" strokeWidth="1.5" fill="none" />
          <path d="M0 780 Q250 730 450 600 T850 400 T1200 280" stroke="hsl(45,100%,60%)" strokeWidth="1" fill="none" />
        </svg>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-14 w-14 rounded-2xl bg-[hsl(120,100%,62%)]/20 flex items-center justify-center border border-[hsl(120,100%,62%)]/30 shadow-[0_0_30px_hsl(120,100%,62%,0.2)]">
              <Zap className="h-8 w-8 text-[hsl(120,100%,62%)]" />
            </div>
            <span className="text-3xl font-bold font-display text-[hsl(120,100%,62%)] drop-shadow-[0_0_15px_hsl(120,100%,62%,0.5)]">
              VerbiA
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold font-display leading-tight">
            Escale sua operação com{" "}
            <span className="text-[hsl(120,100%,62%)] drop-shadow-[0_0_20px_hsl(120,100%,62%,0.4)]">
              Agentes de IA
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-[hsl(150,10%,55%)] max-w-2xl mx-auto">
            Automatize atendimento, qualifique leads e converta mais clientes 24/7.
            Inteligência artificial que trabalha enquanto você dorme.
          </p>

          <Button
            onClick={scrollToPlans}
            size="lg"
            className="bg-[hsl(120,100%,62%)] text-[hsl(160,10%,6%)] hover:bg-[hsl(120,100%,55%)] text-lg px-10 py-6 font-bold shadow-[0_0_40px_hsl(120,100%,62%,0.3)] transition-all hover:shadow-[0_0_60px_hsl(120,100%,62%,0.5)]"
          >
            <Zap className="h-5 w-5 mr-2" />
            Escalar Minha Operação
          </Button>
        </div>
      </section>

      {/* Analytics Section */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-[hsl(120,100%,62%)] opacity-[0.03] blur-[150px]" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-center mb-4">
            Analytics que <span className="text-[hsl(120,100%,62%)]">impulsionam</span> resultados
          </h2>
          <p className="text-center text-[hsl(150,10%,55%)] mb-12 max-w-xl mx-auto">
            Dados em tempo real para decisões estratégicas
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {[
              { icon: TrendingUp, label: "Conversões", value: "+340%", color: "hsl(120,100%,62%)" },
              { icon: Users, label: "Leads qualificados", value: "12.4k", color: "hsl(160,70%,45%)" },
              { icon: MessageSquare, label: "Atendimentos/mês", value: "48k", color: "hsl(45,100%,60%)" },
              { icon: BarChart3, label: "Tempo de resposta", value: "<2s", color: "hsl(200,80%,55%)" },
            ].map((m, i) => (
              <Card key={i} className="bg-[hsl(160,12%,9%)]/80 border-[hsl(160,10%,18%)] backdrop-blur-sm">
                <CardContent className="p-5 text-center space-y-2">
                  <m.icon className="h-6 w-6 mx-auto" style={{ color: m.color }} />
                  <div className="text-2xl sm:text-3xl font-bold font-display" style={{ color: m.color }}>
                    {m.value}
                  </div>
                  <p className="text-xs sm:text-sm text-[hsl(150,10%,55%)]">{m.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-[hsl(160,12%,9%)]/80 border-[hsl(160,10%,18%)] backdrop-blur-sm overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-[hsl(120,100%,62%)]" />
                <span className="font-display font-semibold">Crescimento de conversões</span>
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={growthData}>
                    <defs>
                      <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(120,100%,62%)" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="hsl(120,100%,62%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="m" stroke="hsl(150,10%,55%)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(150,10%,55%)" fontSize={12} tickLine={false} axisLine={false} />
                    <Area type="monotone" dataKey="v" stroke="hsl(120,100%,62%)" fill="url(#growthGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Plans */}
      <section ref={plansRef} id="planos" className="py-20 px-4 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-[hsl(160,70%,45%)] opacity-[0.03] blur-[150px]" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-center mb-4">
            Escolha seu <span className="text-[hsl(120,100%,62%)]">plano</span>
          </h2>
          <p className="text-center text-[hsl(150,10%,55%)] mb-12">Escale conforme sua necessidade</p>

          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative bg-[hsl(160,12%,9%)]/80 backdrop-blur-sm transition-all hover:scale-[1.02] ${
                  plan.highlight
                    ? "border-[hsl(120,100%,62%)]/50 shadow-[0_0_30px_hsl(120,100%,62%,0.15)]"
                    : "border-[hsl(160,10%,18%)]"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-[hsl(120,100%,62%)] text-[hsl(160,10%,6%)] font-bold px-4 py-1">
                      Mais Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-2 pt-8">
                  <CardTitle className="font-display text-xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold font-display text-[hsl(120,100%,62%)]">R$ {plan.price}</span>
                    <span className="text-[hsl(150,10%,55%)]">/mês</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-[hsl(120,100%,62%)] flex-shrink-0" />
                        <span className="text-[hsl(150,10%,55%)]">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={() => handleBuy(plan.name)}
                    className={`w-full font-bold ${
                      plan.highlight
                        ? "bg-[hsl(120,100%,62%)] text-[hsl(160,10%,6%)] hover:bg-[hsl(120,100%,55%)] shadow-[0_0_20px_hsl(120,100%,62%,0.3)]"
                        : "bg-[hsl(160,12%,16%)] text-[hsl(150,20%,95%)] hover:bg-[hsl(160,12%,20%)] border border-[hsl(160,10%,18%)]"
                    }`}
                  >
                    Começar Agora
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[hsl(160,10%,18%)] py-10 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-[hsl(120,100%,62%)]" />
            <span className="font-display font-bold text-[hsl(120,100%,62%)]">VerbiA</span>
          </div>
          <div className="flex gap-6 text-sm text-[hsl(150,10%,55%)]">
            <span className="hover:text-[hsl(150,20%,95%)] cursor-pointer transition-colors">Termos</span>
            <span className="hover:text-[hsl(150,20%,95%)] cursor-pointer transition-colors">Privacidade</span>
            <span className="hover:text-[hsl(150,20%,95%)] cursor-pointer transition-colors">Contato</span>
          </div>
          <p className="text-xs text-[hsl(150,10%,55%)]">© 2026 VerbiA. Todos os direitos reservados.</p>
        </div>
      </footer>

      {/* Chat Widget */}
      <div className="fixed bottom-6 right-6 z-50">
        {chatOpen && (
          <Card className="absolute bottom-16 right-0 w-80 sm:w-96 bg-[hsl(160,12%,9%)] border-[hsl(160,10%,18%)] shadow-2xl overflow-hidden">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-[hsl(160,10%,18%)] bg-[hsl(160,12%,7%)]">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-[hsl(120,100%,62%)]" />
                <span className="font-display font-semibold text-sm">Agente VerbiA</span>
                {isHotLead && (
                  <Badge className="bg-[hsl(0,72%,51%)] text-[hsl(0,0%,100%)] text-xs animate-pulse">
                    Lead Quente 🔥
                  </Badge>
                )}
              </div>
              <button onClick={() => setChatOpen(false)} className="text-[hsl(150,10%,55%)] hover:text-[hsl(150,20%,95%)]">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="h-64 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                      msg.role === "user"
                        ? "bg-[hsl(120,100%,62%)] text-[hsl(160,10%,6%)]"
                        : "bg-[hsl(160,12%,16%)] text-[hsl(150,20%,95%)]"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-[hsl(160,10%,18%)] flex gap-2">
              <Input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleChat()}
                placeholder="Digite sua dúvida..."
                className="bg-[hsl(160,12%,16%)] border-[hsl(160,10%,18%)] text-[hsl(150,20%,95%)] placeholder:text-[hsl(150,10%,55%)] text-sm"
              />
              <Button onClick={handleChat} size="icon" className="bg-[hsl(120,100%,62%)] text-[hsl(160,10%,6%)] hover:bg-[hsl(120,100%,55%)] shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        )}

        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="h-14 w-14 rounded-full bg-[hsl(120,100%,62%)] text-[hsl(160,10%,6%)] flex items-center justify-center shadow-[0_0_30px_hsl(120,100%,62%,0.4)] hover:shadow-[0_0_50px_hsl(120,100%,62%,0.6)] transition-all"
        >
          {chatOpen ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
        </button>
      </div>

      {/* Checkout Dialog */}
      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent className="bg-[hsl(160,12%,9%)] border-[hsl(160,10%,18%)] text-[hsl(150,20%,95%)]">
          <DialogHeader>
            <DialogTitle className="font-display flex items-center gap-2">
              <Shield className="h-5 w-5 text-[hsl(120,100%,62%)]" />
              Checkout — Plano {selectedPlan}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm text-[hsl(150,10%,55%)]">Nome completo</label>
              <Input
                value={checkoutForm.name}
                onChange={(e) => setCheckoutForm((p) => ({ ...p, name: e.target.value }))}
                className="bg-[hsl(160,12%,16%)] border-[hsl(160,10%,18%)] text-[hsl(150,20%,95%)]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-[hsl(150,10%,55%)]">Email</label>
              <Input
                type="email"
                value={checkoutForm.email}
                onChange={(e) => setCheckoutForm((p) => ({ ...p, email: e.target.value }))}
                className="bg-[hsl(160,12%,16%)] border-[hsl(160,10%,18%)] text-[hsl(150,20%,95%)]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-[hsl(150,10%,55%)]">Cartão de crédito</label>
              <Input
                placeholder="•••• •••• •••• ••••"
                className="bg-[hsl(160,12%,16%)] border-[hsl(160,10%,18%)] text-[hsl(150,20%,95%)]"
                disabled
              />
              <p className="text-xs text-[hsl(150,10%,55%)]">Integração de pagamento em breve</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCheckoutOpen(false)} className="border-[hsl(160,10%,18%)] text-[hsl(150,20%,95%)]">
              Cancelar
            </Button>
            <Button
              onClick={handleCheckoutConfirm}
              className="bg-[hsl(120,100%,62%)] text-[hsl(160,10%,6%)] hover:bg-[hsl(120,100%,55%)]"
            >
              Confirmar Compra
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Landing;
