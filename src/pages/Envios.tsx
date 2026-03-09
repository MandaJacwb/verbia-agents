import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Shield,
  Zap,
  Mail,
  MessageSquare,
  Clock,
  TrendingUp,
  AlertTriangle,
  Activity,
  Smartphone,
  Send,
  Ban,
  CheckCircle2,
  Timer,
  BarChart3,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

// --- Mock data for volume chart ---
const generateVolumeData = () => {
  const hours = [];
  for (let h = 6; h <= 22; h++) {
    const isPeak = h >= 9 && h <= 12 || h >= 14 && h <= 18;
    const base = isPeak ? 8 : 3;
    const variance = Math.floor(Math.random() * 5);
    hours.push({
      hora: `${String(h).padStart(2, "0")}:00`,
      envios: base + variance,
      limite: isPeak ? 15 : 8,
    });
  }
  return hours;
};

// --- Warm-up schedule ---
const warmupSchedule = [
  { dia: 1, limite: 7 },
  { dia: 2, limite: 15 },
  { dia: 3, limite: 30 },
  { dia: 4, limite: 50 },
  { dia: 5, limite: 80 },
  { dia: 6, limite: 120 },
  { dia: 7, limite: 200 },
];

// --- Send log mock ---
const sendLog = [
  { id: 1, dest: "+55 11 9****-1234", status: "enviado", delay: "4m 23s", hora: "09:12" },
  { id: 2, dest: "+55 21 9****-5678", status: "enviado", delay: "7m 51s", hora: "09:19" },
  { id: 3, dest: "+55 31 9****-9012", status: "enviado", delay: "11m 07s", hora: "09:31" },
  { id: 4, dest: "+55 11 9****-3456", status: "aguardando", delay: "—", hora: "—" },
  { id: 5, dest: "+55 85 9****-7890", status: "aguardando", delay: "—", hora: "—" },
];

const Envios = () => {
  const [provider, setProvider] = useState<string>("meta");
  const [antiBlock, setAntiBlock] = useState(true);
  const [intervalRange, setIntervalRange] = useState([3, 15]);
  const [peakStart, setPeakStart] = useState("09:00");
  const [peakEnd, setPeakEnd] = useState("18:00");
  const [bulkAttempt, setBulkAttempt] = useState(false);

  // Warm-up simulation: current day = 1, sent = 3
  const [warmupDay] = useState(1);
  const [sentToday] = useState(3);
  const currentLimit = warmupSchedule.find((w) => w.dia === warmupDay)?.limite ?? 7;
  const warmupProgress = (warmupDay / 7) * 100;
  const dailyProgress = (sentToday / currentLimit) * 100;

  const volumeData = useMemo(() => generateVolumeData(), []);

  const handleBulkSend = () => {
    setBulkAttempt(true);
    setTimeout(() => setBulkAttempt(false), 5000);
  };

  const healthScore = sentToday < currentLimit * 0.7 ? "safe" : sentToday < currentLimit ? "warning" : "danger";
  const healthConfig = {
    safe: { emoji: "🟢", label: "Segura", color: "text-primary" },
    warning: { emoji: "🟡", label: "Atenção", color: "text-yellow-400" },
    danger: { emoji: "🔴", label: "Risco", color: "text-destructive" },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-display">Gestão de Envios</h1>
        <p className="text-muted-foreground mt-1">Automação inteligente com proteção anti-bloqueio</p>
      </div>

      {/* Bulk attempt alert */}
      {bulkAttempt && (
        <Alert variant="destructive" className="border-destructive/50 bg-destructive/10 animate-pulse">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle className="font-display">Segurança VerbIA</AlertTitle>
          <AlertDescription>
            Protegendo sua conta contra bloqueios da Meta. Envio em massa bloqueado — use a cadência humana para envios seguros.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ===== LEFT COLUMN — Provider + Account Status ===== */}
        <div className="space-y-6">
          {/* Provider Selection */}
          <Card className="glass-card neon-border">
            <CardHeader>
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-primary" /> Provedor de Envio
              </CardTitle>
              <CardDescription>Escolha o canal de disparo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ToggleGroup
                type="single"
                value={provider}
                onValueChange={(v) => v && setProvider(v)}
                className="flex flex-col gap-2"
              >
                <ToggleGroupItem
                  value="meta"
                  className="w-full justify-start gap-3 px-4 py-3 data-[state=on]:bg-primary/10 data-[state=on]:border-primary/50 border border-border rounded-lg"
                >
                  <MessageSquare className="h-5 w-5 text-green-400" />
                  <div className="text-left">
                    <p className="text-sm font-medium">API Oficial (Meta)</p>
                    <p className="text-xs text-muted-foreground">Cobrança por mensagem</p>
                  </div>
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="evolution"
                  className="w-full justify-start gap-3 px-4 py-3 data-[state=on]:bg-primary/10 data-[state=on]:border-primary/50 border border-border rounded-lg"
                >
                  <Zap className="h-5 w-5 text-yellow-400" />
                  <div className="text-left">
                    <p className="text-sm font-medium">Evolution API</p>
                    <p className="text-xs text-muted-foreground">WhatsApp Instance</p>
                  </div>
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="email"
                  className="w-full justify-start gap-3 px-4 py-3 data-[state=on]:bg-primary/10 data-[state=on]:border-primary/50 border border-border rounded-lg"
                >
                  <Mail className="h-5 w-5 text-blue-400" />
                  <div className="text-left">
                    <p className="text-sm font-medium">E-mail</p>
                    <p className="text-xs text-muted-foreground">SMTP / API</p>
                  </div>
                </ToggleGroupItem>
              </ToggleGroup>
            </CardContent>
          </Card>

          {/* Account Health */}
          <Card className="glass-card neon-border">
            <CardHeader>
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" /> Status da Conta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Saúde do Chip</span>
                <span className={`text-sm font-semibold ${healthConfig[healthScore].color}`}>
                  {healthConfig[healthScore].emoji} {healthConfig[healthScore].label}
                </span>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Limite Diário</span>
                  <span className="font-mono text-primary">{sentToday}/{currentLimit}</span>
                </div>
                <Progress value={dailyProgress} className="h-2" />
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Aquecimento</span>
                  <Badge variant="outline" className="neon-border text-primary">Dia {warmupDay}/7</Badge>
                </div>
                <Progress value={warmupProgress} className="h-2" />
              </div>
              <div className="space-y-1 pt-2">
                <p className="text-xs text-muted-foreground font-medium">Cronograma de Aquecimento</p>
                <div className="grid grid-cols-7 gap-1">
                  {warmupSchedule.map((w) => (
                    <div
                      key={w.dia}
                      className={`text-center rounded p-1 text-xs ${
                        w.dia <= warmupDay
                          ? "bg-primary/20 text-primary border border-primary/30"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <div className="font-bold">D{w.dia}</div>
                      <div className="font-mono">{w.limite}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ===== CENTER COLUMN — Cadence + Controls ===== */}
        <div className="space-y-6">
          {/* Anti-Block Toggle */}
          <Card className="glass-card neon-border">
            <CardHeader>
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" /> Proteção Anti-Bloqueio
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm">Cadência Humana Ativa</Label>
                  <p className="text-xs text-muted-foreground mt-0.5">Randomiza intervalos entre envios</p>
                </div>
                <Switch checked={antiBlock} onCheckedChange={setAntiBlock} />
              </div>

              {antiBlock && (
                <div className="space-y-4 pt-2">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm">Intervalo Aleatório</Label>
                      <Badge variant="outline" className="neon-border text-primary font-mono">
                        {intervalRange[0]}–{intervalRange[1]} min
                      </Badge>
                    </div>
                    <Slider
                      value={intervalRange}
                      onValueChange={setIntervalRange}
                      min={1}
                      max={30}
                      step={1}
                      minStepsBetweenThumbs={2}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>1 min</span>
                      <span>30 min</span>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-sm mb-2 block">
                      <Clock className="h-4 w-4 inline mr-1" /> Horário de Pico
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="time"
                        value={peakStart}
                        onChange={(e) => setPeakStart(e.target.value)}
                        className="bg-background/50 w-28"
                      />
                      <span className="text-muted-foreground text-sm">até</span>
                      <Input
                        type="time"
                        value={peakEnd}
                        onChange={(e) => setPeakEnd(e.target.value)}
                        className="bg-background/50 w-28"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      A IA será mais ativa nesse período, respeitando os intervalos
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Volume Chart */}
          <Card className="glass-card neon-border">
            <CardHeader>
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" /> Volume de Envios vs. Horário
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={volumeData}>
                    <defs>
                      <linearGradient id="enviosGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(120, 100%, 62%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(120, 100%, 62%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(160, 10%, 18%)" />
                    <XAxis dataKey="hora" tick={{ fontSize: 10, fill: "hsl(150, 10%, 55%)" }} />
                    <YAxis tick={{ fontSize: 10, fill: "hsl(150, 10%, 55%)" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(160, 12%, 9%)",
                        border: "1px solid hsl(160, 10%, 18%)",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="envios"
                      stroke="hsl(120, 100%, 62%)"
                      fill="url(#enviosGrad)"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="limite"
                      stroke="hsl(0, 72%, 51%)"
                      fill="none"
                      strokeWidth={1}
                      strokeDasharray="5 5"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-0.5 bg-primary inline-block rounded" /> Envios
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-0.5 bg-destructive inline-block rounded" style={{ borderTop: "1px dashed" }} /> Limite
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Bulk send test button */}
          <Card className="glass-card border-destructive/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Envio Manual em Massa</p>
                  <p className="text-xs text-muted-foreground">Testar a trava de segurança</p>
                </div>
                <Button variant="destructive" size="sm" onClick={handleBulkSend} className="gap-2">
                  <Ban className="h-4 w-4" /> Forçar Envio
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ===== RIGHT COLUMN — Send Log ===== */}
        <div className="space-y-6">
          {/* Next send countdown */}
          <Card className="glass-card neon-border">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <Timer className="h-8 w-8 mx-auto text-primary animate-pulse-neon" />
                <p className="text-xs text-muted-foreground">Próximo envio em</p>
                <p className="text-3xl font-display font-bold neon-text">
                  {Math.floor(Math.random() * (intervalRange[1] - intervalRange[0]) + intervalRange[0])}:
                  {String(Math.floor(Math.random() * 59)).padStart(2, "0")}
                </p>
                <p className="text-xs text-muted-foreground">Intervalo aleatório ativo</p>
              </div>
            </CardContent>
          </Card>

          {/* Send Log */}
          <Card className="glass-card neon-border">
            <CardHeader>
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <Send className="h-5 w-5 text-primary" /> Log de Envios
              </CardTitle>
              <CardDescription>Últimos disparos com delay aleatório</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <div className="space-y-3">
                  {sendLog.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50"
                    >
                      <div className="flex items-center gap-3">
                        {log.status === "enviado" ? (
                          <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                        ) : (
                          <Clock className="h-4 w-4 text-muted-foreground shrink-0 animate-pulse" />
                        )}
                        <div>
                          <p className="text-sm font-mono">{log.dest}</p>
                          <p className="text-xs text-muted-foreground">{log.hora}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={log.status === "enviado" ? "default" : "secondary"}
                          className={log.status === "enviado" ? "bg-primary/20 text-primary border-primary/30" : ""}
                        >
                          {log.status === "enviado" ? "Enviado" : "Aguardando"}
                        </Badge>
                        {log.delay !== "—" && (
                          <p className="text-xs text-muted-foreground mt-0.5 font-mono">delay: {log.delay}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Cadence Explanation */}
          <Card className="glass-card neon-border">
            <CardContent className="pt-6 space-y-2">
              <p className="text-xs text-muted-foreground font-display font-medium flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5" /> Como funciona
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                O algoritmo de <span className="text-primary font-medium">Cadência Humana</span> randomiza
                o intervalo entre cada mensagem, imitando o comportamento natural de um atendente.
                Isso reduz drasticamente o risco de bloqueio pela Meta, enquanto mantém a eficiência
                dos disparos.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Envios;
