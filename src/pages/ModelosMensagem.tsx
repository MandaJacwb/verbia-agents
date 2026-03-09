import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sparkles,
  Variable,
  Clock,
  Users,
  Send,
  Mail,
  MessageSquare,
  FileText,
  Smartphone,
  CheckCircle2,
  Loader2,
  PenLine,
  Activity,
  Shield,
  Copy,
  Plus,
} from "lucide-react";

// --- Variables ---
const dynamicVariables = [
  { label: "Nome do Cliente", value: "[NOME_DO_CLIENTE]" },
  { label: "Horário", value: "[HORARIO]" },
  { label: "Nome do Agente", value: "[NOME_DO_AGENTE]" },
];

// --- Mock campaigns ---
const initialCampaigns = [
  { id: 1, name: "Promoção Black Friday", date: "2026-03-15 09:00", recipients: 245, channel: "whatsapp", status: "concluido" },
  { id: 2, name: "Follow-up Leads Quentes", date: "2026-03-10 14:00", recipients: 82, channel: "whatsapp", status: "enviando" },
  { id: 3, name: "Newsletter Março", date: "2026-03-20 08:00", recipients: 1340, channel: "email", status: "rascunho" },
  { id: 4, name: "Confirmação de Agendamento", date: "2026-03-09 10:00", recipients: 37, channel: "whatsapp", status: "concluido" },
  { id: 5, name: "Reativação de Clientes", date: "2026-03-12 16:00", recipients: 520, channel: "email", status: "rascunho" },
];

// --- Mock send log ---
const sendLog = [
  { time: "14:32:07", to: "João Silva", status: "ok", delay: "4.2min" },
  { time: "14:27:51", to: "Maria Souza", status: "ok", delay: "7.8min" },
  { time: "14:20:03", to: "Carlos Lima", status: "ok", delay: "3.1min" },
  { time: "14:16:55", to: "Ana Ribeiro", status: "ok", delay: "11.2min" },
  { time: "14:05:42", to: "Pedro Santos", status: "ok", delay: "6.5min" },
  { time: "13:59:10", to: "Fernanda Alves", status: "ok", delay: "9.3min" },
];

const warmupData = { day: 3, limit: 30, used: 18, health: "safe" as const };

const statusColors: Record<string, string> = {
  rascunho: "bg-muted text-muted-foreground",
  enviando: "bg-chart-4/20 text-[hsl(var(--chart-4))]",
  concluido: "bg-primary/20 text-primary",
};

const statusLabels: Record<string, string> = {
  rascunho: "Rascunho",
  enviando: "Enviando...",
  concluido: "Concluído",
};

const toneOptions = [
  { label: "Formal", emoji: "🎩" },
  { label: "Amigável", emoji: "😊" },
  { label: "Conversão", emoji: "🎯" },
  { label: "Urgente", emoji: "⚡" },
];

export default function ModelosMensagem() {
  const [messageText, setMessageText] = useState(
    "Olá [NOME_DO_CLIENTE]! 👋\n\nAqui é o [NOME_DO_AGENTE] da VerbIA. Gostaria de confirmar seu agendamento para [HORARIO].\n\nPosso te ajudar com algo mais?"
  );
  const [isRefining, setIsRefining] = useState(false);
  const [campaignTab, setCampaignTab] = useState("campanhas");

  const insertVariable = (variable: string) => {
    setMessageText((prev) => prev + " " + variable);
  };

  const handleRefine = (tone: string) => {
    setIsRefining(true);
    setTimeout(() => {
      const toneMap: Record<string, string> = {
        Formal: `Prezado(a) [NOME_DO_CLIENTE],\n\nEm nome da VerbIA, eu, [NOME_DO_AGENTE], venho confirmar o seu compromisso agendado para [HORARIO].\n\nFico à disposição para qualquer necessidade adicional.\n\nAtenciosamente.`,
        Amigável: `Ei, [NOME_DO_CLIENTE]! Tudo bem? 😄\n\nAqui é o [NOME_DO_AGENTE]! Só passando pra lembrar do nosso encontro às [HORARIO]. Vai ser ótimo!\n\nQualquer coisa, me chama! 💬`,
        Conversão: `[NOME_DO_CLIENTE], oportunidade exclusiva! 🔥\n\nAqui é [NOME_DO_AGENTE] da VerbIA. Seu horário das [HORARIO] está garantido — mas tenho uma condição especial que expira hoje.\n\nVamos conversar?`,
        Urgente: `⚠️ [NOME_DO_CLIENTE], atenção!\n\n[NOME_DO_AGENTE] aqui. Seu agendamento para [HORARIO] precisa de confirmação URGENTE.\n\nResponda SIM para confirmar ou ligue agora.`,
      };
      setMessageText(toneMap[tone] || messageText);
      setIsRefining(false);
    }, 1200);
  };

  // Preview with replaced variables
  const previewText = messageText
    .replace(/\[NOME_DO_CLIENTE\]/g, "Maria Souza")
    .replace(/\[HORARIO\]/g, "14:30")
    .replace(/\[NOME_DO_AGENTE\]/g, "Agente VerbIA");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display neon-text">Modelos de Mensagem</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Crie, refine e gerencie os templates dos seus Agentes.
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Campanha
        </Button>
      </div>

      {/* Top row: Editor + Phone Preview + Account Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Editor */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="glass-card neon-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <PenLine className="h-4 w-4 text-primary" />
                Editor de Mensagem
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="min-h-[180px] bg-background/50 border-border font-mono text-sm resize-none"
                placeholder="Digite sua mensagem aqui..."
              />

              {/* Dynamic variables */}
              <div>
                <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                  <Variable className="h-3 w-3" /> Variáveis dinâmicas
                </p>
                <div className="flex flex-wrap gap-2">
                  {dynamicVariables.map((v) => (
                    <Button
                      key={v.value}
                      variant="outline"
                      size="sm"
                      className="text-xs h-7 font-mono"
                      onClick={() => insertVariable(v.value)}
                    >
                      {v.value}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* AI Composer */}
              <div>
                <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-primary" /> Refinar com IA — escolha o tom
                </p>
                <div className="flex flex-wrap gap-2">
                  {toneOptions.map((tone) => (
                    <Button
                      key={tone.label}
                      variant="secondary"
                      size="sm"
                      className="text-xs h-8 gap-1"
                      disabled={isRefining}
                      onClick={() => handleRefine(tone.label)}
                    >
                      {isRefining ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <span>{tone.emoji}</span>
                      )}
                      {tone.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Phone Preview */}
        <div className="lg:col-span-4 flex justify-center">
          <div className="w-[280px]">
            <p className="text-xs text-muted-foreground mb-2 text-center flex items-center justify-center gap-1">
              <Smartphone className="h-3 w-3" /> Preview em Tempo Real
            </p>
            <div className="relative mx-auto w-[270px] rounded-[2rem] border-2 border-border bg-background p-2 shadow-lg neon-border">
              {/* Phone notch */}
              <div className="mx-auto mb-1 h-5 w-24 rounded-full bg-muted" />
              {/* Screen */}
              <div className="rounded-[1.5rem] bg-[hsl(160,12%,12%)] min-h-[420px] flex flex-col overflow-hidden">
                {/* WhatsApp Header */}
                <div className="bg-primary/20 px-3 py-2 flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-primary/30 flex items-center justify-center text-xs font-bold text-primary">
                    V
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">Agente VerbIA</p>
                    <p className="text-[10px] text-primary">online</p>
                  </div>
                </div>

                {/* Chat area */}
                <ScrollArea className="flex-1 p-3">
                  <div className="space-y-2">
                    {/* Incoming message bubble */}
                    <div className="flex justify-start">
                      <div className="max-w-[85%] rounded-xl rounded-tl-sm bg-accent px-3 py-2">
                        <p className="text-xs text-foreground whitespace-pre-wrap leading-relaxed">
                          {previewText}
                        </p>
                        <p className="text-[9px] text-muted-foreground text-right mt-1">14:30 ✓✓</p>
                      </div>
                    </div>
                  </div>
                </ScrollArea>

                {/* Input bar */}
                <div className="bg-muted/50 px-2 py-2 flex items-center gap-1">
                  <div className="flex-1 h-7 rounded-full bg-background/60 px-3 flex items-center">
                    <span className="text-[10px] text-muted-foreground">Mensagem</span>
                  </div>
                  <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center">
                    <Send className="h-3 w-3 text-primary-foreground" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Account Status + Send Log */}
        <div className="lg:col-span-3 space-y-4">
          {/* Account Health Card */}
          <Card className="glass-card neon-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                Status da Conta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Saúde do Chip</span>
                <Badge className="bg-primary/20 text-primary border-0 text-xs">
                  🟢 Segura
                </Badge>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">Limite Diário</span>
                  <span className="text-xs font-mono text-primary">
                    {warmupData.used}/{warmupData.limit}
                  </span>
                </div>
                <Progress value={(warmupData.used / warmupData.limit) * 100} className="h-2" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Dia de Aquecimento</span>
                <span className="text-xs font-mono text-foreground">Dia {warmupData.day}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Proteção Anti-Ban</span>
                <Badge className="bg-primary/20 text-primary border-0 text-[10px]">
                  <Activity className="h-3 w-3 mr-1" /> Ativa
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Send Log */}
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Log de Envios
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[200px]">
                <div className="px-4 pb-3 space-y-2">
                  {sendLog.map((entry, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-3 w-3 text-primary" />
                        <div>
                          <p className="text-xs font-medium text-foreground">{entry.to}</p>
                          <p className="text-[10px] text-muted-foreground">{entry.time}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-[10px] h-5 font-mono">
                        +{entry.delay}
                      </Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom: Campaigns Table */}
      <Card className="glass-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Campanhas
            </CardTitle>
            <div className="flex gap-2">
              <Badge variant="outline" className="text-xs">
                {initialCampaigns.length} campanhas
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="text-xs">Nome</TableHead>
                <TableHead className="text-xs">Data de Disparo</TableHead>
                <TableHead className="text-xs">Destinatários</TableHead>
                <TableHead className="text-xs">Canal</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-xs text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialCampaigns.map((c) => (
                <TableRow key={c.id} className="border-border/30 hover:bg-accent/50">
                  <TableCell className="font-medium text-sm">{c.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground font-mono">{c.date}</TableCell>
                  <TableCell>
                    <span className="text-sm flex items-center gap-1">
                      <Users className="h-3 w-3 text-muted-foreground" />
                      {c.recipients.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs gap-1">
                      {c.channel === "whatsapp" ? (
                        <MessageSquare className="h-3 w-3" />
                      ) : (
                        <Mail className="h-3 w-3" />
                      )}
                      {c.channel === "whatsapp" ? "WhatsApp" : "E-mail"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-xs border-0 ${statusColors[c.status]}`}>
                      {c.status === "enviando" && <Loader2 className="h-3 w-3 animate-spin mr-1" />}
                      {statusLabels[c.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                      <Copy className="h-3 w-3" /> Duplicar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
