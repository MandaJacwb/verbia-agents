import { useState, DragEvent, useEffect, useRef } from "react";
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
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
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
  UserCog,
  Building2,
  Tag,
  Star,
  ArrowUpDown,
  MessageCircle,
  Filter,
} from "lucide-react";
import {
  addOutcome,
  getOutcomeForConversation,
  type OutcomeType,
  outcomeLabels,
} from "@/lib/outcomeStore";
import {
  findContactByName,
  addContact,
  updateContact,
  subscribe as subscribeContacts,
  getContacts,
  TAG_COLORS,
  type Contact,
} from "@/lib/contactsStore";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

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
  activityMinutes: number;
}

const mockConversations: Conversation[] = [
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

const mockMessagesMap: Record<string, Message[]> = {
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

// ── Interaction row type (from Supabase) ──────────────────────────
interface InteractionRow {
  id: string;
  agent_name: string;
  lead_name: string;
  action: string;
  is_hot: boolean;
  interaction_type: string;
  created_at: string;
  account_id: string | null;
  phone_number: string | null;
  message_content: string | null;
  contact_name: string | null;
}

function buildLiveData(rows: InteractionRow[]): {
  conversations: Conversation[];
  messagesMap: Record<string, Message[]>;
} {
  // Group by phone_number, falling back to lead_name
  const groups: Record<string, InteractionRow[]> = {};
  for (const row of rows) {
    const key = row.phone_number || row.lead_name;
    if (!groups[key]) groups[key] = [];
    groups[key].push(row);
  }

  const conversations: Conversation[] = Object.entries(groups).map(([key, groupRows]) => {
    const latest = groupRows[groupRows.length - 1];
    const name = latest.contact_name || latest.lead_name || key;
    const initials = name
      .split(" ")
      .slice(0, 2)
      .map((w: string) => w[0]?.toUpperCase() || "")
      .join("") || "?";
    const diffMin = Math.round((Date.now() - new Date(latest.created_at).getTime()) / 60000);
    const lastActivity = diffMin < 60 ? `${diffMin}min` : `${Math.round(diffMin / 60)}h`;
    return {
      id: `live-${key}`,
      name,
      initials,
      tag: "vendas" as TagColor,
      controlledBy: "ia" as const,
      unread: groupRows.filter((r) => !r.is_hot).length > 0 ? 1 : 0,
      lastActivity,
    };
  });

  const messagesMap: Record<string, Message[]> = {};
  for (const [key, groupRows] of Object.entries(groups)) {
    messagesMap[`live-${key}`] = groupRows.map((row) => ({
      id: row.id,
      sender: (row.action === "message_sent" ? (row.agent_name === "ia" ? "ia" : "humano") : "cliente") as MsgSender,
      text: row.message_content || row.action,
      time: new Date(row.created_at).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }));
  }

  return { conversations, messagesMap };
}

export default function Atendimento() {
  const { profile } = useAuth();
  const [liveRows, setLiveRows] = useState<InteractionRow[]>([]);
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

  // Contact edit modal state
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    phone: "",
    empresa: "",
    email: "",
    redesSociais: "",
    tags: "",
    opportunityValue: "",
  });
  const [linkedContactId, setLinkedContactId] = useState<string | null>(null);
  const [contactsVersion, setContactsVersion] = useState(0);

  // Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [filterUnread, setFilterUnread] = useState(false);
  const [filterFavorites, setFilterFavorites] = useState(false);
  const [filterIA, setFilterIA] = useState(false);
  const [filterTag, setFilterTag] = useState<TagColor | null>(null);
  const [sortOrder, setSortOrder] = useState<"recent" | "oldest">("recent");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Subscribe to contacts changes
  useEffect(() => {
    return subscribeContacts(() => setContactsVersion((v) => v + 1));
  }, []);

  // Fetch interactions from Supabase + subscribe to realtime inserts
  useEffect(() => {
    const query = supabase
      .from("interactions")
      .select("*")
      .order("created_at", { ascending: true });

    query.then(({ data, error }) => {
      if (error) console.error("[Atendimento] Supabase fetch error:", error);
      console.log("[Atendimento] rows fetched:", data?.length, "profile.account_id:", profile?.account_id);
      if (data) setLiveRows(data as InteractionRow[]);
    });

    const channel = supabase
      .channel("atendimento-interactions")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "interactions" },
        (payload) => {
          const newRow = payload.new as InteractionRow;
          setLiveRows((prev) => {
            // Replace optimistic temp message with real one if content matches
            const tempIdx = prev.findIndex(
              (r) => r.id.startsWith("temp-") &&
                r.phone_number === newRow.phone_number &&
                r.message_content === newRow.message_content
            );
            if (tempIdx !== -1) {
              const next = [...prev];
              next[tempIdx] = newRow;
              return next;
            }
            return [...prev, newRow];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile?.account_id]);

  // Derive live conversations + messages from DB rows
  const { conversations: liveConversations, messagesMap: liveMessagesMap } = buildLiveData(liveRows);

  // Merge: DB conversations first, then mock fallback
  const allConversations = [...liveConversations, ...mockConversations];
  const messagesMap = { ...mockMessagesMap, ...liveMessagesMap };

  // Parse lastActivity to minutes for sorting
  const parseActivityToMin = (activity: string): number => {
    const num = parseInt(activity) || 0;
    if (activity.includes("h")) return num * 60;
    return num;
  };

  // Apply search, filters & sort
  const conversations = allConversations
    .filter((c) => {
      // Search by name
      if (searchTerm.trim() && !c.name.toLowerCase().includes(searchTerm.trim().toLowerCase())) return false;
      if (filterUnread && c.unread === 0) return false;
      if (filterFavorites && !favorites.has(c.id)) return false;
      if (filterIA) {
        const ctrl = humanControl[c.id] ?? c.controlledBy;
        if (ctrl !== "ia") return false;
      }
      if (filterTag && c.tag !== filterTag) return false;
      return true;
    })
    .sort((a, b) => {
      const aMin = parseActivityToMin(a.lastActivity);
      const bMin = parseActivityToMin(b.lastActivity);
      // "recent" = smallest minutes first (most recent activity), "oldest" = largest minutes first
      return sortOrder === "recent" ? aMin - bMin : bMin - aMin;
    });

  const selected = conversations.find((c) => c.id === selectedId) ?? conversations[0];
  const messages = messagesMap[selectedId] ?? defaultMessages;

  // Auto-scroll to bottom when messages change or conversation switches
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, selectedId]);
  const memory = memoryMap[selectedId] ?? defaultMemory;
  const isHuman = humanControl[selectedId] ?? selected.controlledBy === "humano";
  const leadStatus = getLeadStatus(selectedId);

  // Extract phone from live conversation id (format: "live-+5541991271813")
  const selectedPhone = selectedId.startsWith("live-") ? selectedId.replace("live-", "") : null;

  // Send message via Supabase edge function → N8N → Evolution API
  const [isSending, setIsSending] = useState(false);
  const handleSendMessage = async () => {
    const text = msgInput.trim();
    if (!text || !selectedPhone) {
      if (!selectedPhone) toast({ title: "Sem WhatsApp", description: "Esta conversa não tem número de telefone associado.", variant: "destructive" });
      return;
    }
    setIsSending(true);
    // Optimistically add message to UI immediately
    const tempMsg: InteractionRow = {
      id: `temp-${Date.now()}`,
      agent_name: "humano",
      lead_name: selected.name,
      action: "message_sent",
      is_hot: false,
      interaction_type: "whatsapp_message",
      created_at: new Date().toISOString(),
      account_id: profile?.account_id ?? null,
      phone_number: selectedPhone,
      message_content: text,
      contact_name: selected.name,
    };
    setLiveRows((prev) => [...prev, tempMsg]);
    setMsgInput("");
    try {
      const { error } = await supabase.functions.invoke("send-message", {
        body: { phone: selectedPhone, message: text },
      });
      if (error) throw error;
      // Also persist to Supabase so it survives refresh
      await supabase.from("interactions").insert({
        phone_number: selectedPhone,
        message_content: text,
        lead_name: selected.name,
        contact_name: selected.name,
        action: "message_sent",
        agent_name: "humano",
        account_id: profile?.account_id ?? "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      });
    } catch (err: unknown) {
      // Remove optimistic message on error
      setLiveRows((prev) => prev.filter((r) => r.id !== tempMsg.id));
      setMsgInput(text);
      const msg = err instanceof Error ? err.message : "Erro ao enviar mensagem";
      toast({ title: "Erro ao enviar", description: msg, variant: "destructive" });
    } finally {
      setIsSending(false);
    }
  };

  // Smart Recognition: find linked contact by name
  const linkedContact = findContactByName(selected.name);

  // Open contact edit dialog
  const openContactEditor = () => {
    if (linkedContact) {
      setLinkedContactId(linkedContact.id);
      setContactForm({
        name: linkedContact.name,
        phone: linkedContact.phone,
        empresa: linkedContact.empresa || "",
        email: linkedContact.email || "",
        redesSociais: linkedContact.redesSociais || linkedContact.instagram || "",
        tags: linkedContact.tags.join(", "),
        opportunityValue: linkedContact.opportunityValue?.toString() || "",
      });
    } else {
      setLinkedContactId(null);
      setContactForm({
        name: selected.name,
        phone: "",
        empresa: "",
        email: "",
        redesSociais: "",
        tags: "",
        opportunityValue: "",
      });
    }
    setContactDialogOpen(true);
  };

  const saveContact = () => {
    if (!contactForm.name || !contactForm.phone) {
      toast({ title: "Nome e telefone são obrigatórios", variant: "destructive" });
      return;
    }
    const tags = contactForm.tags
      ? contactForm.tags.split(",").map((t) => t.trim().toUpperCase()).filter(Boolean)
      : [];
    const oppValue = contactForm.opportunityValue ? parseFloat(contactForm.opportunityValue) : undefined;

    if (linkedContactId) {
      updateContact(linkedContactId, {
        name: contactForm.name,
        phone: contactForm.phone,
        empresa: contactForm.empresa || undefined,
        email: contactForm.email || undefined,
        redesSociais: contactForm.redesSociais || undefined,
        instagram: contactForm.redesSociais || undefined,
        tags,
        opportunityValue: oppValue,
      });
      toast({ title: "Contato atualizado com sucesso!" });
    } else {
      const newC = addContact({
        name: contactForm.name,
        phone: contactForm.phone,
        empresa: contactForm.empresa || undefined,
        email: contactForm.email || undefined,
        redesSociais: contactForm.redesSociais || undefined,
        instagram: contactForm.redesSociais || undefined,
        tags,
        opportunityValue: oppValue,
      });
      setLinkedContactId(newC.id);
      toast({ title: "Contato cadastrado no CRM!" });
    }
    setContactDialogOpen(false);
  };

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
    const oppValue = linkedContact?.opportunityValue;
    addOutcome({
      conversationId: selectedId,
      outcome: type,
      reason,
      opportunityValue: (type === "venda" || type === "agendamento") ? oppValue : undefined,
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
                <Input
                  placeholder="Buscar conversa..."
                  className="h-8 text-sm bg-background"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* ── Smart Filters ────────────────────────────── */}
              <div className="px-3 py-2 border-b border-border flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() => setFilterUnread((v) => !v)}
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium border transition-all ${
                    filterUnread
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted/50 text-muted-foreground border-border hover:border-primary/50"
                  }`}
                >
                  <MessageCircle className="h-3 w-3" />
                  Não Lidas
                </button>
                <button
                  onClick={() => setFilterFavorites((v) => !v)}
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium border transition-all ${
                    filterFavorites
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted/50 text-muted-foreground border-border hover:border-primary/50"
                  }`}
                >
                  <Star className="h-3 w-3" />
                  Favoritos
                </button>
                <button
                  onClick={() => setFilterIA((v) => !v)}
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium border transition-all ${
                    filterIA
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted/50 text-muted-foreground border-border hover:border-primary/50"
                  }`}
                >
                  <Bot className="h-3 w-3" />
                  IA Ativa
                </button>
                <select
                  value={filterTag ?? ""}
                  onChange={(e) => setFilterTag(e.target.value ? (e.target.value as TagColor) : null)}
                  className={`rounded-full px-2.5 py-1 text-[11px] font-medium border transition-all bg-muted/50 outline-none cursor-pointer ${
                    filterTag
                      ? "border-primary text-primary bg-primary/15"
                      : "border-border text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  <option value="">Setor</option>
                  {(Object.keys(tagLabels) as TagColor[]).map((t) => (
                    <option key={t} value={t}>{tagLabels[t]}</option>
                  ))}
                </select>
                <button
                  onClick={() => setSortOrder((v) => (v === "recent" ? "oldest" : "recent"))}
                  className="ml-auto inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium border border-border bg-muted/50 text-muted-foreground hover:border-primary/50 transition-all"
                  title={sortOrder === "recent" ? "Mais Recentes" : "Mais Antigas"}
                >
                  <ArrowUpDown className="h-3 w-3" />
                  {sortOrder === "recent" ? "Recentes" : "Antigas"}
                </button>
              </div>

              <ScrollArea className="flex-1">
                <div className="p-2 space-y-1">
                  {conversations.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-6">Nenhuma conversa encontrada</p>
                  )}
                  {conversations.map((conv) => {
                    const active = conv.id === selectedId;
                    const isCtrlHuman = humanControl[conv.id] ?? conv.controlledBy === "humano";
                    const isFav = favorites.has(conv.id);
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
                        <div className="flex flex-col items-center gap-1 shrink-0">
                          <Star
                            className={`h-3.5 w-3.5 cursor-pointer transition-colors ${
                              isFav ? "fill-primary text-primary" : "text-muted-foreground/40 hover:text-primary/60"
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(conv.id);
                            }}
                          />
                          {conv.unread > 0 && (
                            <span className="h-5 w-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                              {conv.unread}
                            </span>
                          )}
                        </div>
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
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground">{selected.name}</p>
                      {linkedContact?.empresa && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-chart-2/15 text-chart-2 border-chart-2/30">
                          <Building2 className="h-2.5 w-2.5 mr-0.5" />
                          {linkedContact.empresa}
                        </Badge>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      {isHuman ? "Atendente humano no controle" : "Agente IA no controle"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs border-primary/30 text-primary hover:bg-primary/10"
                    onClick={openContactEditor}
                  >
                    <UserCog className="h-3.5 w-3.5 mr-1" />
                    {linkedContact ? "Editar Contato" : "Salvar Contato"}
                  </Button>
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
                  <div ref={messagesEndRef} />
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
                        onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                        className="h-9 text-sm bg-background"
                        disabled={isSending}
                      />
                      <Button size="icon" className="h-9 w-9 shrink-0 neon-glow-sm" onClick={handleSendMessage} disabled={isSending || !msgInput.trim()}>
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

              {/* Contact Summary Card */}
              {linkedContact && (
                <div className="p-3 border-b border-border space-y-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-3.5 w-3.5 text-chart-2" />
                    <span className="text-xs font-medium text-foreground">
                      {linkedContact.empresa ? `Cliente da ${linkedContact.empresa}` : "Empresa não informada"}
                    </span>
                  </div>
                  {linkedContact.tags.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <Tag className="h-3 w-3 text-muted-foreground shrink-0" />
                      {linkedContact.tags.map((tag) => {
                        const colors = TAG_COLORS[tag];
                        return (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                            style={
                              colors
                                ? { backgroundColor: colors.bg, color: colors.text }
                                : undefined
                            }
                          >
                            {tag}
                          </span>
                        );
                      })}
                    </div>
                  )}
                  {linkedContact.opportunityValue && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-3.5 w-3.5 text-primary" />
                      <span className="text-xs text-primary font-semibold">
                        Oportunidade: R$ {linkedContact.opportunityValue.toLocaleString("pt-BR")}
                      </span>
                    </div>
                  )}
                </div>
              )}

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
                      {/* Contact CRM summary in memory */}
                      {linkedContact && (
                        <div className="p-3 rounded-lg bg-chart-2/5 border border-chart-2/15">
                          <p className="text-xs font-semibold text-chart-2 mb-2 flex items-center gap-1.5">
                            <Building2 className="h-3.5 w-3.5" /> Dados do CRM
                          </p>
                          <ul className="space-y-1.5 text-sm text-foreground/80">
                            <li className="flex items-center gap-2">
                              <span className="text-chart-2">•</span>
                              <span className="font-medium">{linkedContact.name}</span>
                              {linkedContact.empresa && (
                                <span className="text-muted-foreground">— {linkedContact.empresa}</span>
                              )}
                            </li>
                            {linkedContact.phone && (
                              <li className="flex items-center gap-2">
                                <span className="text-chart-2">•</span>
                                <span className="font-mono text-xs">{linkedContact.phone}</span>
                              </li>
                            )}
                            {linkedContact.email && (
                              <li className="flex items-center gap-2">
                                <span className="text-chart-2">•</span>
                                {linkedContact.email}
                              </li>
                            )}
                            {linkedContact.opportunityValue && (
                              <li className="flex items-center gap-2">
                                <span className="text-chart-2">•</span>
                                <span className="text-primary font-semibold">
                                  Oportunidade: R$ {linkedContact.opportunityValue.toLocaleString("pt-BR")}
                                </span>
                              </li>
                            )}
                          </ul>
                        </div>
                      )}

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

      {/* ── Contact Edit/Save Dialog ─────────────────────── */}
      <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCog className="h-5 w-5 text-primary" />
              {linkedContactId ? "Editar Contato" : "Cadastrar Contato"}
            </DialogTitle>
            <DialogDescription>
              {linkedContactId
                ? "Atualize os dados deste contato no CRM."
                : "Salve este lead como contato no CRM."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Nome *</Label>
              <Input
                value={contactForm.name}
                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                placeholder="Nome completo"
                className="h-9 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Telefone *</Label>
              <Input
                value={contactForm.phone}
                onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                placeholder="+55 11 99999-9999"
                className="h-9 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Empresa</Label>
              <Input
                value={contactForm.empresa}
                onChange={(e) => setContactForm({ ...contactForm, empresa: e.target.value })}
                placeholder="Nome da empresa"
                className="h-9 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">E-mail</Label>
              <Input
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                placeholder="email@exemplo.com"
                className="h-9 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Redes Sociais</Label>
              <Input
                value={contactForm.redesSociais}
                onChange={(e) => setContactForm({ ...contactForm, redesSociais: e.target.value })}
                placeholder="@usuario"
                className="h-9 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs flex items-center gap-1">
                <DollarSign className="h-3 w-3 text-primary" /> Valor da Oportunidade
              </Label>
              <Input
                type="number"
                value={contactForm.opportunityValue}
                onChange={(e) => setContactForm({ ...contactForm, opportunityValue: e.target.value })}
                placeholder="R$ 0,00"
                className="h-9 text-sm"
              />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label className="text-xs">Etiquetas</Label>
              <Input
                value={contactForm.tags}
                onChange={(e) => setContactForm({ ...contactForm, tags: e.target.value })}
                placeholder="VIP, LEAD QUALIFICADO (separar por vírgula)"
                className="h-9 text-sm"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setContactDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={saveContact} className="neon-glow-sm">
              {linkedContactId ? "Salvar Alterações" : "Cadastrar no CRM"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
