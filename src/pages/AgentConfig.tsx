import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Brain,
  Clock,
  Calendar,
  FileText,
  Flame,
  ToggleLeft,
  Webhook,
  Users,
  Key,
  Upload,
  Link2,
  Plus,
  X,
} from "lucide-react";

const AgentConfig = () => {
  const navigate = useNavigate();
  const [retentionDays, setRetentionDays] = useState([30]);
  const [abundanceMode, setAbundanceMode] = useState(true);
  const [humanTransfer, setHumanTransfer] = useState(false);
  const [keywords, setKeywords] = useState(["preço", "disponibilidade", "urgente"]);
  const [newKeyword, setNewKeyword] = useState("");

  const addKeyword = () => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      setKeywords([...keywords, newKeyword.trim()]);
      setNewKeyword("");
    }
  };

  const removeKeyword = (kw: string) => {
    setKeywords(keywords.filter((k) => k !== kw));
  };

  const retentionLabel = retentionDays[0] >= 365 ? "Para Sempre" : `${retentionDays[0]} dias`;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/agentes")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold font-display">Configurar Agente</h1>
          <p className="text-muted-foreground mt-1">Personalize o comportamento do seu agente</p>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Prompt Mestre */}
        <Card className="glass-card neon-border">
          <CardHeader>
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" /> Prompt Mestre
            </CardTitle>
            <CardDescription>Defina a personalidade e comportamento do agente</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Ex: Você é a assistente virtual da Manda Já Logística. Seu tom é profissional mas acolhedor. Sempre confirme o CEP antes de calcular o frete..."
              className="min-h-[140px] bg-background/50"
            />
          </CardContent>
        </Card>

        {/* Memória Persistente */}
        <Card className="glass-card neon-border">
          <CardHeader>
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" /> Memória Persistente
            </CardTitle>
            <CardDescription>
              Quanto tempo o agente deve lembrar do histórico de cada lead
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Retenção de Contexto</Label>
              <Badge variant="outline" className="neon-border text-primary">{retentionLabel}</Badge>
            </div>
            <Slider
              value={retentionDays}
              onValueChange={setRetentionDays}
              min={7}
              max={365}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>7 dias</span>
              <span>30 dias</span>
              <span>Para Sempre</span>
            </div>
            <p className="text-xs text-muted-foreground italic">
              "Oi, fulano! Conseguiu pensar sobre aquela proposta que falamos na terça?"
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Booking Engine */}
          <Card className="glass-card neon-border">
            <CardHeader>
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" /> Sincronização de Agenda
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start gap-2">
                <img src="https://www.gstatic.com/images/branding/product/1x/calendar_48dp.png" alt="Google" className="h-5 w-5" />
                Conectar Google Calendar
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Calendar className="h-5 w-5 text-blue-400" />
                Conectar Outlook
              </Button>
              <p className="text-xs text-muted-foreground">O agente consultará os horários livres automaticamente</p>
            </CardContent>
          </Card>

          {/* Filtro de Discernimento */}
          <Card className="glass-card neon-border">
            <CardHeader>
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <ToggleLeft className="h-5 w-5 text-primary" /> Filtro de Discernimento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Modo Abundância</Label>
                  <p className="text-xs text-muted-foreground mt-0.5">Abordagem consultiva e relacional</p>
                </div>
                <Switch checked={abundanceMode} onCheckedChange={setAbundanceMode} />
              </div>
              <div className="p-3 rounded-lg bg-background/50">
                <p className="text-xs text-muted-foreground">
                  {abundanceMode
                    ? "✨ O agente usará uma abordagem consultiva, focando em construir relacionamento e confiança."
                    : "⚡ O agente focará em gatilhos de fechamento rápido para promoções pontuais."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Knowledge Base */}
        <Card className="glass-card neon-border">
          <CardHeader>
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" /> Base de Conhecimento (RAG)
            </CardTitle>
            <CardDescription>Faça upload de documentos para o agente consultar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Arraste PDFs ou clique para fazer upload</p>
              <p className="text-xs text-muted-foreground mt-1">Tabelas de preço, manuais, catálogos</p>
            </div>
            <div className="flex gap-2">
              <Input placeholder="Ou insira um link (ex: tabela de preços)" className="bg-background/50" />
              <Button variant="outline" size="icon">
                <Link2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Lead Scoring */}
        <Card className="glass-card neon-border">
          <CardHeader>
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-400" /> Termômetro de Lead
            </CardTitle>
            <CardDescription>Defina palavras-chave que marcam um lead como 🔥</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Adicionar palavra-chave..."
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addKeyword()}
                className="bg-background/50"
              />
              <Button variant="outline" onClick={addKeyword}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {keywords.map((kw) => (
                <Badge key={kw} variant="secondary" className="gap-1 pr-1">
                  {kw}
                  <button onClick={() => removeKeyword(kw)} className="ml-1 hover:text-destructive">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Connectivity */}
          <Card className="glass-card neon-border">
            <CardHeader>
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <Webhook className="h-5 w-5 text-primary" /> Conectividade
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label>Webhook URL (n8n)</Label>
                <Input placeholder="https://seu-n8n.com/webhook/..." className="mt-1.5 bg-background/50" />
              </div>
              <div>
                <Label>API Key de Memória</Label>
                <Input type="password" placeholder="sk-..." className="mt-1.5 bg-background/50" />
              </div>
            </CardContent>
          </Card>

          {/* Transbordo */}
          <Card className="glass-card neon-border">
            <CardHeader>
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" /> Transbordo Humano
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Modo Negociação Humana</Label>
                  <p className="text-xs text-muted-foreground mt-0.5">Transferir para humano em casos complexos</p>
                </div>
                <Switch checked={humanTransfer} onCheckedChange={setHumanTransfer} />
              </div>
              {humanTransfer && (
                <div>
                  <Label>E-mail do Atendente</Label>
                  <Input placeholder="atendente@empresa.com" className="mt-1.5 bg-background/50" />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => navigate("/agentes")}>Cancelar</Button>
          <Button className="gap-2">
            <Key className="h-4 w-4" /> Salvar Agente
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AgentConfig;
