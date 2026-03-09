import { useState } from "react";
import {
  BarChart3,
  Clock,
  Download,
  TrendingUp,
  Users,
  Target,
  CalendarCheck,
  Bot,
  Trophy,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  FunnelChart,
  Funnel,
  LabelList,
  Cell,
  AreaChart,
  Area,
  PieChart,
  Pie,
} from "recharts";
import { getOutcomeCounts } from "@/lib/outcomeStore";

// ── Mock Data ──────────────────────────────────────────────

const funnelData = [
  { name: "Contatos Abordados", value: 2480, fill: "hsl(120,100%,62%)" },
  { name: "Taxa de Resposta", value: 1736, fill: "hsl(120,80%,50%)" },
  { name: "Leads Qualificados", value: 868, fill: "hsl(160,70%,45%)" },
  { name: "Conversão Final", value: 347, fill: "hsl(200,80%,55%)" },
];

const heatmapDays = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
const heatmapHours = Array.from({ length: 14 }, (_, i) => `${i + 7}h`);

const generateHeatmap = () =>
  heatmapDays.map((day) => ({
    day,
    hours: heatmapHours.map((hour) => ({
      hour,
      value: Math.floor(Math.random() * 100),
    })),
  }));

const heatmapRows = generateHeatmap();

const agentComparison = [
  {
    name: "Manda Já — Logística",
    conversations: 1240,
    conversion: 18.2,
    avgTime: "1m 42s",
    bestPrompt: "Olá [NOME], seu pedido já está a caminho! Quer rastrear?",
    score: 92,
    color: "hsl(120,100%,62%)",
  },
  {
    name: "Estética Premium",
    conversations: 890,
    conversion: 24.6,
    avgTime: "2m 10s",
    bestPrompt: "Oi [NOME]! Temos horários exclusivos essa semana. Posso agendar?",
    score: 97,
    color: "hsl(45,100%,60%)",
  },
  {
    name: "Imobiliária Digital",
    conversations: 640,
    conversion: 12.8,
    avgTime: "3m 05s",
    bestPrompt: "Bom dia [NOME], encontrei imóveis que combinam com seu perfil!",
    score: 78,
    color: "hsl(200,80%,55%)",
  },
];

const volumeByHour = Array.from({ length: 24 }, (_, i) => ({
  hour: `${String(i).padStart(2, "0")}h`,
  envios: i >= 8 && i <= 20 ? Math.floor(Math.random() * 80 + 20) : Math.floor(Math.random() * 10),
  conversoes: i >= 8 && i <= 20 ? Math.floor(Math.random() * 30 + 5) : Math.floor(Math.random() * 3),
}));

// ── Helpers ────────────────────────────────────────────────

function getHeatColor(value: number) {
  if (value >= 80) return "bg-primary/90";
  if (value >= 60) return "bg-primary/60";
  if (value >= 40) return "bg-primary/35";
  if (value >= 20) return "bg-primary/15";
  return "bg-muted/40";
}

// ── Component ──────────────────────────────────────────────

export default function Relatorios() {
  const [activeTab, setActiveTab] = useState("overview");

  const totalConversas = 2480;
  const tempoHumanoMin = totalConversas * 5;
  const tempoHumanoH = Math.round(tempoHumanoMin / 60);
  const tempoHumanoDias = (tempoHumanoH / 8).toFixed(1);

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display neon-text">
            Relatórios Avançados
          </h1>
          <p className="text-muted-foreground mt-1">
            ROI real dos seus Agentes Inteligentes
          </p>
        </div>
        <Button onClick={handleExportPDF} className="gap-2">
          <Download className="h-4 w-4" />
          Exportar Relatório Mensal
        </Button>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          icon={Users}
          title="Contatos Abordados"
          value="2.480"
          subtitle="Últimos 30 dias"
          trend="+12% vs mês anterior"
          trendUp
        />
        <KPICard
          icon={Target}
          title="Leads Qualificados"
          value="868"
          subtitle="SDR Score ≥ 7"
          trend="Taxa: 35%"
          trendUp
        />
        <KPICard
          icon={CalendarCheck}
          title="Conversão Final"
          value="347"
          subtitle="Agendamentos + Vendas"
          trend="14% do funil"
          trendUp
        />
        <KPICard
          icon={Clock}
          title="Tempo Humano Economizado"
          value={`${tempoHumanoH}h`}
          subtitle={`≈ ${tempoHumanoDias} dias úteis`}
          trend="Base: 5 min/conversa"
          trendUp
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-card border border-border">
          <TabsTrigger value="overview">Funil & Volume</TabsTrigger>
          <TabsTrigger value="heatmap">Mapa de Calor</TabsTrigger>
          <TabsTrigger value="agents">Comparativo de Agentes</TabsTrigger>
        </TabsList>

        {/* ── Tab: Overview ──────────────────────────── */}
        <TabsContent value="overview" className="space-y-6 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Funnel */}
            <Card className="glass-card neon-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Funil de Conversão
                </CardTitle>
                <CardDescription>Jornada completa do lead</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {funnelData.map((step, idx) => {
                    const pct = Math.round((step.value / funnelData[0].value) * 100);
                    return (
                      <div key={step.name}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">{step.name}</span>
                          <span className="font-mono font-semibold text-foreground">
                            {step.value.toLocaleString()} ({pct}%)
                          </span>
                        </div>
                        <div className="h-8 rounded-md overflow-hidden bg-muted/30">
                          <div
                            className="h-full rounded-md transition-all duration-700"
                            style={{ width: `${pct}%`, background: step.fill }}
                          />
                        </div>
                        {idx < funnelData.length - 1 && (
                          <div className="text-center text-xs text-muted-foreground mt-1">
                            ↓ {Math.round(
                              (funnelData[idx + 1].value / step.value) * 100
                            )}% avança
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Volume Chart */}
            <Card className="glass-card neon-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Volume de Envios vs. Conversões
                </CardTitle>
                <CardDescription>Distribuição por hora do dia</CardDescription>
              </CardHeader>
              <CardContent className="h-[340px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={volumeByHour}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(160,10%,18%)" />
                    <XAxis dataKey="hour" stroke="hsl(150,10%,55%)" tick={{ fontSize: 11 }} />
                    <YAxis stroke="hsl(150,10%,55%)" tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(160,12%,9%)",
                        border: "1px solid hsl(160,10%,18%)",
                        borderRadius: "8px",
                        color: "hsl(150,20%,95%)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="envios"
                      stroke="hsl(120,100%,62%)"
                      fill="hsl(120,100%,62%)"
                      fillOpacity={0.15}
                      name="Envios"
                    />
                    <Area
                      type="monotone"
                      dataKey="conversoes"
                      stroke="hsl(200,80%,55%)"
                      fill="hsl(200,80%,55%)"
                      fillOpacity={0.15}
                      name="Conversões"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Efficiency Card */}
          <Card className="glass-card neon-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Zap className="h-5 w-5 text-primary" />
                Eficiência por Lead — Volume por Agente Ativo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {agentComparison.map((agent) => (
                  <div key={agent.name} className="text-center space-y-2">
                    <p className="text-sm font-medium text-foreground">{agent.name}</p>
                    <p className="text-3xl font-bold font-display" style={{ color: agent.color }}>
                      {agent.conversations}
                    </p>
                    <p className="text-xs text-muted-foreground">conversas gerenciadas</p>
                    <p className="text-sm font-mono text-primary">
                      {(agent.conversations / 30).toFixed(0)} leads/dia
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          {/* Loss Reasons Pie Chart */}
          <Card className="glass-card neon-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="h-5 w-5 text-primary" />
                Motivos de Perda / Desfecho
              </CardTitle>
              <CardDescription>Distribuição dos resultados de atendimento</CardDescription>
            </CardHeader>
            <CardContent className="h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={getOutcomeCounts().filter((d) => d.value > 0)}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={110}
                    paddingAngle={3}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {getOutcomeCounts()
                      .filter((d) => d.value > 0)
                      .map((entry, idx) => (
                        <Cell key={idx} fill={entry.fill} />
                      ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(160,12%,9%)",
                      border: "1px solid hsl(160,10%,18%)",
                      borderRadius: "8px",
                      color: "hsl(150,20%,95%)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="heatmap" className="mt-4">
          <Card className="glass-card neon-border">
            <CardHeader>
              <CardTitle className="text-lg">Mapa de Calor — Volume de Conversão</CardTitle>
              <CardDescription>
                Identifique os melhores horários para configurar o 'Horário de Pico' no módulo de Envios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <div className="min-w-[640px]">
                  {/* Header */}
                  <div className="flex">
                    <div className="w-12 shrink-0" />
                    {heatmapHours.map((h) => (
                      <div
                        key={h}
                        className="flex-1 text-center text-xs text-muted-foreground pb-2"
                      >
                        {h}
                      </div>
                    ))}
                  </div>
                  {/* Rows */}
                  {heatmapRows.map((row) => (
                    <div key={row.day} className="flex items-center gap-1 mb-1">
                      <div className="w-12 text-xs text-muted-foreground shrink-0">
                        {row.day}
                      </div>
                      {row.hours.map((cell) => (
                        <div
                          key={cell.hour}
                          className={`flex-1 h-8 rounded-sm ${getHeatColor(cell.value)} transition-colors cursor-pointer hover:ring-1 hover:ring-primary/50`}
                          title={`${row.day} ${cell.hour}: ${cell.value} conversões`}
                        />
                      ))}
                    </div>
                  ))}
                  {/* Legend */}
                  <div className="flex items-center gap-4 mt-4 justify-center">
                    <span className="text-xs text-muted-foreground">Menor</span>
                    {[10, 30, 50, 70, 90].map((v) => (
                      <div
                        key={v}
                        className={`w-6 h-4 rounded-sm ${getHeatColor(v)}`}
                      />
                    ))}
                    <span className="text-xs text-muted-foreground">Maior</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Tab: Agent Comparison ──────────────────── */}
        <TabsContent value="agents" className="mt-4 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {agentComparison.map((agent, idx) => (
              <Card key={agent.name} className="glass-card neon-border relative overflow-hidden">
                {idx === agentComparison.findIndex(
                  (a) => a.conversion === Math.max(...agentComparison.map((x) => x.conversion))
                ) && (
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-primary/20 text-primary border-primary/30 gap-1">
                      <Trophy className="h-3 w-3" />
                      Melhor Taxa
                    </Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Bot className="h-5 w-5" style={{ color: agent.color }} />
                    {agent.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <MetricItem label="Conversas" value={agent.conversations.toLocaleString()} />
                    <MetricItem label="Conversão" value={`${agent.conversion}%`} highlight />
                    <MetricItem label="Tempo Médio" value={agent.avgTime} />
                    <MetricItem label="Score IA" value={`${agent.score}/100`} />
                  </div>

                  <Separator className="bg-border/50" />

                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Melhor Prompt</p>
                    <p className="text-sm bg-muted/30 rounded-md p-2 border border-border/50 italic text-foreground/80">
                      "{agent.bestPrompt}"
                    </p>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Score de Performance</span>
                      <span className="font-mono text-primary">{agent.score}%</span>
                    </div>
                    <Progress value={agent.score} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────

function KPICard({
  icon: Icon,
  title,
  value,
  subtitle,
  trend,
  trendUp,
}: {
  icon: React.ElementType;
  title: string;
  value: string;
  subtitle: string;
  trend: string;
  trendUp: boolean;
}) {
  return (
    <Card className="glass-card neon-border">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">{title}</p>
            <p className="text-2xl font-bold font-display text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
        <p className={`text-xs mt-2 ${trendUp ? "text-primary" : "text-destructive"}`}>
          {trend}
        </p>
      </CardContent>
    </Card>
  );
}

function MetricItem({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`text-sm font-semibold font-mono ${highlight ? "text-primary" : "text-foreground"}`}>
        {value}
      </p>
    </div>
  );
}
