import { useState, DragEvent, useEffect } from "react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Bot,
  User,
  Headphones,
  Paperclip,
  Smile,
  Send,
  CheckCircle2,
  Circle,
  GripVertical,
  Brain,
  CalendarDays,
  ListTodo,
  XCircle,
  ShoppingCart,
  CalendarCheck,
  PhoneOff,
  ThumbsDown,
  DollarSign,
  MoreHorizontal,
} from "lucide-react";
import {
  addOutcome,
  getOutcomeForConversation,
  type OutcomeType,
  outcomeLabels,
} from "@/lib/outcomeStore";

// ── Mock Data ──────────────────────────────────────────────────────

type TagColor = "vendas" | "suporte" | "mandaja" | "estetica";

const tagStyles: Record<TagColor, string> = {
  vendas: "bg-chart-1/20 text-chart-1 border-chart-1/30",
  suporte: "bg-chart-4/20 text-chart-4 border-chart-4/30",
  mandaja: "bg-chart-3/20 text-chart-3 border-chart-3/30",
  estetica: "bg-chart-5/20 text-chart-5 border-chart-5/30",
};

const tagLabels: Record<TagColor, string> = {
  vendas: "Vendas",
  suporte: "Suporte",
  mandaja: "Manda Já",
  estetica: "Estética",
};

interface Conversation {
  id: string;
  name: string;
  initials: string;
  tag: TagColor;
  controlledBy: "ia" | "humano";
  unread: number;
  lastActivity: string;
}

const conversations: Conversation[] = [
  { id: "1", name: "Lucas Mendes", initials: "LM", tag: "vendas", controlledBy: "ia", unread: 3, lastActivity: "2min" },
  { id: "2", name: "Ana Oliveira", initials: "AO", tag: "suporte", controlledBy: "humano", unread: 0, lastActivity: "5min" },
  { id: "3", name: "Carlos Silva", initials: "CS", tag: "mandaja", controlledBy: "ia", unread: 1, lastActivity: "12min" },
  { id: "4", name: "Fernanda Costa", initials: "FC", tag: "estetica", controlledBy: "ia", unread: 5, lastActivity: "1min" },
  { id: "5", name: "Roberto Lima", initials: "RL", tag: "vendas", controlledBy: "humano", unread: 0, lastActivity: "30min" },
  { id: "6", name: "Juliana Rocha", initials: "JR", tag: "suporte", controlledBy: "ia", unread: 2, lastActivity: "8min" },
];

type MsgSender = "cliente" | "ia" | "humano";

interface Message {
  id: string;
  sender: MsgSender;
  text: string;
  time: string;
}

const messagesMap: Record<string, Message[]> = {
  "1": [
    { id: "m1", sender: "cliente", text: "Oi, gostaria de saber sobre o plano Premium.", time: "14:01" },
    { id: "m2", sender: "ia", text: "Olá Lucas! O plano Premium inclui 5 agentes, integrações ilimitadas e suporte prioritário. Posso te enviar uma proposta?", time: "14:01" },
    { id: "m3", sender: "cliente", text: "Sim, por favor! Quanto custa?", time: "14:02" },
    { id: "m4", sender: "ia", text: "O plano Premium sai por R$ 297/mês. Temos um desconto de 20% no plano anual.", time: "14:02" },
    { id: "m5", sender: "cliente", text: "Interessante. Vocês aceitam PIX?", time: "14:03" },
    { id: "m6", sender: "ia", text: "Sim! Aceitamos PIX, cartão de crédito e boleto. Deseja fechar agora?", time: "14:03" },
    { id: "m7", sender: "cliente", text: "Vou pensar um pouco. Pode me ligar amanhã?", time: "14:05" },
    { id: "m8", sender: "humano", text: "Claro, Lucas! Vou agendar uma ligação para amanhã às 10h. Combinado?", time: "14:06" },
    { id: "m9", sender: "cliente", text: "Perfeito, obrigado!", time: "14:06" },
    { id: "m10", sender: "humano", text: "Por nada! Até amanhã 😊", time: "14:07" },
  ],
  "2": [
    { id: "m1", sender: "cliente", text: "Meu agente parou de responder no WhatsApp.", time: "13:40" },
    { id: "m2", sender: "ia", text: "Entendo, Ana. Vou verificar o status da integração. Um momento...", time: "13:40" },
    { id: "m3", sender: "ia", text: "Identifiquei que o token do WhatsApp expirou. Um atendente vai te ajudar.", time: "13:41" },
    { id: "m4", sender: "humano", text: "Oi Ana! Já renovei o token. Pode testar agora?", time: "13:45" },
    { id: "m5", sender: "cliente", text: "Funcionou! Muito obrigada.", time: "13:47" },
  ],
  "4": [
    { id: "m1", sender: "cliente", text: "Quero agendar um procedimento de limpeza de pele.", time: "14:10" },
    { id: "m2", sender: "ia", text: "Olá Fernanda! Temos horários disponíveis para quinta e sexta. Qual prefere?", time: "14:10" },
    { id: "m3", sender: "cliente", text: "Quinta seria ótimo. Pela manhã.", time: "14:11" },
    { id: "m4", sender: "ia", text: "Perfeito! Agendei para quinta às 9h com a Dra. Mariana. Deseja mais alguma coisa?", time: "14:11" },
    { id: "m5", sender: "cliente", text: "Quanto custa a sessão?", time: "14:12" },
    { id: "m6", sender: "ia", text: "A limpeza de pele profunda custa R$ 180. Na primeira sessão você ganha 15% de desconto!", time: "14:12" },
    { id: "m7", sender: "cliente", text: "Ótimo! Fechado.", time: "14:13" },
    { id: "m8", sender: "ia", text: "Maravilha! Vou te enviar a confirmação por WhatsApp. Até quinta! 🌟", time: "14:13" },
  ],
};

const defaultMessages: Message[] = [
  { id: "m1", sender: "cliente", text: "Olá, preciso de ajuda.", time: "14:00" },
  { id: "m2", sender: "ia", text: "Claro! Como posso te ajudar hoje?", time: "14:00" },
  { id: "m3", sender: "cliente", text: "Gostaria de mais informações sobre os serviços.", time: "14:01" },
];

interface Task {
  id: string;
  text: string;
  status: "pendente" | "concluido";
}

const initialTasks: Task[] = [
  { id: "t1", text: "Confirmar entrega amanhã 10h", status: "pendente" },
  { id: "t2", text: "Enviar proposta para Lucas", status: "pendente" },
  { id: "t3", text: "Ligar para Roberto às 14h", status: "pendente" },
  { id: "t4", text: "Verificar estoque Manda Já", status: "concluido" },
];

const memoryMap: Record<string, string[]> = {
  "1": [
    "Lucas demonstrou interesse no plano Premium (R$ 297/mês).",
    "Perguntou sobre formas de pagamento — aceita PIX.",
    "Pediu para ser contatado amanhã (ligação agendada 10h).",
    "Perfil: decisor, empresa de médio porte.",
  ],
  "2": [
    "Ana reportou falha na integração WhatsApp.",
    "Problema resolvido: token expirado renovado.",
    "Cliente satisfeita com o atendimento.",
  ],
  "4": [
    "Fernanda agendou limpeza de pele para quinta 9h.",
    "Profissional: Dra. Mariana.",
    "Valor: R$ 180 com 15% desconto na primeira sessão.",
    "Lead quente — potencial para pacotes mensais.",
  ],
};

const defaultMemory = [
  "Primeiro contato do lead.",
  "Aguardando mais informações para traçar perfil.",
];

const appointments = [
  { time: "10:00", label: "Ligar para Lucas Mendes" },
  { time: "14:00", label: "Follow-up Roberto Lima" },
  { time: "16:30", label: "Reunião — plano Enterprise" },
];

// ── Sender styles ──────────────────────────────────────────────────

const senderConfig: Record<MsgSender, { label: string; bubble: string; icon: typeof Bot; align: string }> = {
  cliente: {
    label: "Cliente",
    bubble: "bg-muted text-foreground",
    icon: User,
    align: "justify-start",
  },
  ia: {
    label: "Agente IA",
    bubble: "bg-primary/15 text-foreground border border-primary/20",
    icon: Bot,
    align: "justify-end",
  },
  humano: {
    label: "Atendente",
    bubble: "bg-chart-4/15 text-foreground border border-chart-4/20",
    icon: Headphones,
    align: "justify-end",
  },
};

// ── Outcome helpers ────────────────────────────────────────────────

type LeadStatus = "aberto" | "efetivado" | "perdido" | "sem_resposta";

function getLeadStatus(conversationId: string): LeadStatus {
  const outcome = getOutcomeForConversation(conversationId);
  if (!outcome) return "aberto";
  if (outcome.outcome === "venda" || outcome.outcome === "agendamento") return "efetivado";
  if (outcome.outcome === "sem_resposta") return "sem_resposta";
  return "perdido";
}

const statusConfig: Record<LeadStatus, { label: string; class: string }> = {
  aberto: { label: "Em Aberto", class: "bg-muted text-muted-foreground border-border" },
  efetivado: { label: "Efetivado", class: "bg-primary/20 text-primary border-primary/30" },
  perdido: { label: "Perdido", class: "bg-destructive/20 text-destructive border-destructive/30" },
  sem_resposta: { label: "Sem Resposta", class: "bg-chart-3/20 text-chart-3 border-chart-3/30" },
};

// ── Outcome buttons config ─────────────────────────────────────────

const outcomeButtons: { type: OutcomeType; icon: typeof ShoppingCart; color: string }[] = [
  { type: "venda", icon: ShoppingCart, color: "bg-primary/15 hover:bg-primary/25 text-primary border-primary/30" },
  { type: "agendamento", icon: CalendarCheck, color: "bg-chart-2/15 hover:bg-chart-2/25 text-chart-2 border-chart-2/30" },
  { type: "sem_resposta", icon: PhoneOff, color: "bg-chart-3/15 hover:bg-chart-3/25 text-chart-3 border-chart-3/30" },
  { type: "desinteresse", icon: ThumbsDown, color: "bg-destructive/15 hover:bg-destructive/25 text-destructive border-destructive/30" },
  { type: "preco", icon: DollarSign, color: "bg-chart-5/15 hover:bg-chart-5/25 text-chart-5 border-chart-5/30" },
  { type: "outros", icon: MoreHorizontal, color: "bg-muted hover:bg-muted/80 text-foreground border-border" },
];

// ── Component ──────────────────────────────────────────────────────

export default function Atendimento() {
  const [selectedId, setSelectedId] = useState("1");
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [humanControl, setHumanControl] = useState<Record<string, boolean>>({});
  const [msgInput, setMsgInput] = useState("");
  const [whisperInput, setWhisperInput] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  // Closure modal state
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);
  const [closureReason, setClosureReason] = useState("");
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [, forceRender] = useState(0);

  const selected = conversations.find((c) => c.id === selectedId)!;
  const messages = messagesMap[selectedId] ?? defaultMessages;
  const memory = memoryMap[selectedId] ?? defaultMemory;
  const isHuman = humanControl[selectedId] ?? selected.controlledBy === "humano";
  const leadStatus = getLeadStatus(selectedId);

  // Drag handlers
  const onDragStart = (e: DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.effectAllowed = "move";
  };

  const onDrop = (targetStatus: "pendente" | "concluido") => {
    if (!draggedTaskId) return;
    setTasks((prev) =>
      prev.map((t) => (t.id === draggedTaskId ? { ...t, status: targetStatus } : t))
    );
    setDraggedTaskId(null);
  };

  const handleOutcome = (type: OutcomeType) => {
    if (type === "outros") {
      setShowOtherInput(true);
      return;
    }
    commitOutcome(type);
  };

  const commitOutcome = (type: OutcomeType, reason?: string) => {
    addOutcome({
      conversationId: selectedId,
      outcome: type,
      reason,
      timestamp: new Date(),
    });

    // Auto follow-up for "sem_resposta"
    if (type === "sem_resposta") {
      const followupDate = new Date();
      followupDate.setDate(followupDate.getDate() + 2);
      const dateStr = followupDate.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
      setTasks((prev) => [
        ...prev,
        {
          id: `t-followup-${Date.now()}`,
          text: `Follow-up: ${selected.name} — ${dateStr}`,
          status: "pendente",
        },
      ]);
    }

    setCloseDialogOpen(false);
    setShowOtherInput(false);
    setClosureReason("");
    forceRender((n) => n + 1);
  };

  const pendentes = tasks.filter((t) => t.status === "pendente");
  const concluidos = tasks.filter((t) => t.status === "concluido");

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display">Centro de Atendimento</h1>
          <p className="text-sm text-muted-foreground">Atendimento em tempo real</p>
        </div>
        <Badge className="bg-primary/20 text-primary border-primary/30">
          {conversations.length} conversas ativas
        </Badge>
      </div>

      <div className="flex-1 min-h-0 rounded-lg border border-border overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          {/* ── LEFT: Chat List ─────────────────────────────── */}
          <ResizablePanel defaultSize={25} minSize={20} maxSize={35}>
            <div className="h-full flex flex-col bg-card/50">
              <div className="p-3 border-b border-border">
                <Input placeholder="Buscar conversa..." className="h-8 text-sm bg-background" />
              </div>
              <ScrollArea className="flex-1">
                <div className="p-2 space-y-1">
                  {conversations.map((conv) => {
                    const active = conv.id === selectedId;
                    const isCtrlHuman = humanControl[conv.id] ?? conv.controlledBy === "humano";
                    return (
                      <button
                        key={conv.id}
                        onClick={() => setSelectedId(conv.id)}
                        className={`w-full flex items-start gap-3 p-3 rounded-lg text-left transition-all ${
                          active
                            ? "bg-accent neon-border"
                            : "hover:bg-accent/50"
                        }`}
                      >
                        <Avatar className="h-9 w-9 shrink-0">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                            {conv.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-sm font-medium text-foreground truncate">{conv.name}</span>
                            <span className="text-[10px] text-muted-foreground shrink-0">{conv.lastActivity}</span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-1">
                            <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${tagStyles[conv.tag]}`}>
                              {tagLabels[conv.tag]}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={`text-[10px] px-1.5 py-0 ${
                                isCtrlHuman
                                  ? "bg-chart-4/20 text-chart-4 border-chart-4/30"
                                  : "bg-primary/20 text-primary border-primary/30"
                              }`}
                            >
                              {isCtrlHuman ? "Humano" : "IA"}
                            </Badge>
                          </div>
                        </div>
                        {conv.unread > 0 && (
                          <span className="h-5 w-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center shrink-0">
                            {conv.unread}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* ── CENTER: Chat Window ─────────────────────────── */}
          <ResizablePanel defaultSize={45} minSize={30}>
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-3 border-b border-border bg-card/50">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {selected.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-foreground">{selected.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {isHuman ? "Atendente humano no controle" : "Agente IA no controle"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="destructive"
                    className="text-xs"
                    onClick={() => {
                      setShowOtherInput(false);
                      setClosureReason("");
                      setCloseDialogOpen(true);
                    }}
                  >
                    <XCircle className="h-3.5 w-3.5 mr-1" /> Encerrar
                  </Button>
                  <Button
                    size="sm"
                    variant={isHuman ? "outline" : "default"}
                    className={`text-xs ${!isHuman ? "neon-glow-sm" : ""}`}
                    onClick={() =>
                      setHumanControl((prev) => ({ ...prev, [selectedId]: !isHuman }))
                    }
                  >
                    {isHuman ? (
                      <>
                        <Bot className="h-3.5 w-3.5 mr-1" /> Devolver ao Agente
                      </>
                    ) : (
                      <>
                        <Headphones className="h-3.5 w-3.5 mr-1" /> Assumir Atendimento
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-3">
                  {messages.map((msg) => {
                    const cfg = senderConfig[msg.sender];
                    const Icon = cfg.icon;
                    return (
                      <div key={msg.id} className={`flex ${cfg.align} gap-2`}>
                        {msg.sender === "cliente" && (
                          <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center shrink-0 mt-1">
                            <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                          </div>
                        )}
                        <div className={`max-w-[75%] rounded-xl px-3 py-2 ${cfg.bubble}`}>
                          <p className="text-[11px] font-medium text-muted-foreground mb-0.5">{cfg.label}</p>
                          <p className="text-sm leading-relaxed">{msg.text}</p>
                          <p className="text-[10px] text-muted-foreground mt-1 text-right">{msg.time}</p>
                        </div>
                        {msg.sender !== "cliente" && (
                          <div
                            className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                              msg.sender === "ia" ? "bg-primary/20" : "bg-chart-4/20"
                            }`}
                          >
                            <Icon
                              className={`h-3.5 w-3.5 ${
                                msg.sender === "ia" ? "text-primary" : "text-chart-4"
                              }`}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>

              {/* Footer with Tabs */}
              <div className="border-t border-border bg-card/50">
                <Tabs defaultValue="chat" className="w-full">
                  <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent h-8">
                    <TabsTrigger value="chat" className="text-xs h-7 data-[state=active]:bg-accent">
                      💬 Chat
                    </TabsTrigger>
                    <TabsTrigger value="sussurro" className="text-xs h-7 data-[state=active]:bg-accent">
                      👁️ Sussurro
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="chat" className="p-3 mt-0">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0 text-muted-foreground">
                        <Paperclip className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0 text-muted-foreground">
                        <Smile className="h-4 w-4" />
                      </Button>
                      <Input
                        placeholder="Digite sua mensagem..."
                        value={msgInput}
                        onChange={(e) => setMsgInput(e.target.value)}
                        className="h-9 text-sm bg-background"
                      />
                      <Button size="icon" className="h-9 w-9 shrink-0 neon-glow-sm">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </TabsContent>
                  <TabsContent value="sussurro" className="p-3 mt-0">
                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Nota interna (o cliente não verá)..."
                        value={whisperInput}
                        onChange={(e) => setWhisperInput(e.target.value)}
                        className="min-h-[36px] h-9 text-sm bg-background resize-none"
                        rows={1}
                      />
                      <Button size="icon" variant="secondary" className="h-9 w-9 shrink-0">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* ── RIGHT: Intelligence & Follow-up ─────────────── */}
          <ResizablePanel defaultSize={30} minSize={20} maxSize={40}>
            <div className="h-full flex flex-col bg-card/50">
              {/* Lead Status Badge */}
              <div className="p-3 border-b border-border flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Status do Lead:</span>
                <Badge variant="outline" className={`text-xs ${statusConfig[leadStatus].class}`}>
                  {statusConfig[leadStatus].label}
                </Badge>
                {getOutcomeForConversation(selectedId) && (
                  <span className="text-[10px] text-muted-foreground ml-auto">
                    {outcomeLabels[getOutcomeForConversation(selectedId)!.outcome]}
                  </span>
                )}
              </div>

              <Tabs defaultValue="tarefas" className="flex flex-col h-full">
                <TabsList className="mx-3 mt-3 bg-muted/50">
                  <TabsTrigger value="tarefas" className="text-xs gap-1">
                    <ListTodo className="h-3.5 w-3.5" /> Tarefas
                  </TabsTrigger>
                  <TabsTrigger value="memoria" className="text-xs gap-1">
                    <Brain className="h-3.5 w-3.5" /> Memória
                  </TabsTrigger>
                  <TabsTrigger value="agenda" className="text-xs gap-1">
                    <CalendarDays className="h-3.5 w-3.5" /> Agenda
                  </TabsTrigger>
                </TabsList>

                {/* Tasks with drag-and-drop */}
                <TabsContent value="tarefas" className="flex-1 overflow-auto mt-0">
                  <ScrollArea className="h-full">
                    <div className="p-3 space-y-4">
                      <div
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => onDrop("pendente")}
                      >
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                          ⏳ Pendente ({pendentes.length})
                        </p>
                        <div className="space-y-1.5">
                          {pendentes.map((task) => (
                            <div
                              key={task.id}
                              draggable
                              onDragStart={(e) => onDragStart(e, task.id)}
                              className="flex items-center gap-2 p-2.5 rounded-lg bg-background border border-border hover:neon-border transition-all cursor-grab active:cursor-grabbing"
                            >
                              <GripVertical className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                              <Circle className="h-3.5 w-3.5 text-chart-3 shrink-0" />
                              <span className="text-sm text-foreground">{task.text}</span>
                            </div>
                          ))}
                          {pendentes.length === 0 && (
                            <p className="text-xs text-muted-foreground italic p-2">Nenhuma tarefa pendente</p>
                          )}
                        </div>
                      </div>

                      <Separator />

                      <div
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => onDrop("concluido")}
                      >
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                          ✅ Concluído ({concluidos.length})
                        </p>
                        <div className="space-y-1.5">
                          {concluidos.map((task) => (
                            <div
                              key={task.id}
                              draggable
                              onDragStart={(e) => onDragStart(e, task.id)}
                              className="flex items-center gap-2 p-2.5 rounded-lg bg-background/50 border border-border/50 cursor-grab active:cursor-grabbing opacity-70"
                            >
                              <GripVertical className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                              <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                              <span className="text-sm text-muted-foreground line-through">{task.text}</span>
                            </div>
                          ))}
                          {concluidos.length === 0 && (
                            <p className="text-xs text-muted-foreground italic p-2">Nenhuma tarefa concluída</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </TabsContent>

                {/* Memory */}
                <TabsContent value="memoria" className="flex-1 overflow-auto mt-0">
                  <ScrollArea className="h-full">
                    <div className="p-3 space-y-3">
                      <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                        <p className="text-xs font-semibold text-primary mb-2 flex items-center gap-1.5">
                          <Brain className="h-3.5 w-3.5" /> Resumo de Memória — {selected.name}
                        </p>
                        <ul className="space-y-2">
                          {memory.map((item, i) => (
                            <li key={i} className="text-sm text-foreground/80 flex items-start gap-2">
                              <span className="text-primary mt-1">•</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <p className="text-[10px] text-muted-foreground text-center">
                        Gerado automaticamente pelo agente IA
                      </p>
                    </div>
                  </ScrollArea>
                </TabsContent>

                {/* Calendar / Agenda */}
                <TabsContent value="agenda" className="flex-1 overflow-auto mt-0">
                  <ScrollArea className="h-full">
                    <div className="p-3 space-y-3">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-lg border border-border mx-auto"
                      />
                      <Separator />
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                          Agendamentos de hoje
                        </p>
                        <div className="space-y-2">
                          {appointments.map((apt, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-3 p-2.5 rounded-lg bg-background border border-border"
                            >
                              <span className="text-xs font-mono text-primary font-medium">{apt.time}</span>
                              <span className="text-sm text-foreground">{apt.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* ── Closure Dialog ────────────────────────────────── */}
      <Dialog open={closeDialogOpen} onOpenChange={setCloseDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Classificar Desfecho</DialogTitle>
            <DialogDescription>
              Encerrar conversa com <strong>{selected.name}</strong>. Selecione o resultado:
            </DialogDescription>
          </DialogHeader>

          {!showOtherInput ? (
            <div className="grid grid-cols-2 gap-3 pt-2">
              {outcomeButtons.map(({ type, icon: Icon, color }) => (
                <button
                  key={type}
                  onClick={() => handleOutcome(type)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${color}`}
                >
                  <Icon className="h-6 w-6" />
                  <span className="text-sm font-medium">{outcomeLabels[type]}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-3 pt-2">
              <Textarea
                placeholder="Descreva o motivo..."
                value={closureReason}
                onChange={(e) => setClosureReason(e.target.value)}
                className="bg-background"
              />
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowOtherInput(false)}>
                  Voltar
                </Button>
                <Button className="flex-1" onClick={() => commitOutcome("outros", closureReason)}>
                  Confirmar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
