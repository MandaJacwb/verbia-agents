import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Calendar, Flame, TrendingUp, Bot } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const metrics = [
  { title: "Conversas Ativas", value: "248", change: "+12%", icon: MessageSquare },
  { title: "Agendamentos Realizados", value: "89", change: "+23%", icon: Calendar },
  { title: "Leads Quentes", value: "34", change: "+8%", icon: Flame },
  { title: "ROI Mensal", value: "R$ 45.2k", change: "+31%", icon: TrendingUp },
];

const chartData = [
  { name: "Seg", conversoes: 12, leads: 24 },
  { name: "Ter", conversoes: 19, leads: 31 },
  { name: "Qua", conversoes: 15, leads: 28 },
  { name: "Qui", conversoes: 22, leads: 38 },
  { name: "Sex", conversoes: 28, leads: 42 },
  { name: "Sáb", conversoes: 18, leads: 26 },
  { name: "Dom", conversoes: 10, leads: 18 },
];

const recentInteractions = [
  { id: 1, agent: "Manda Já SDR", lead: "Carlos Silva", action: "Cotação de frete enviada", time: "2 min", hot: true },
  { id: 2, agent: "Dra. Ana - Estética", lead: "Maria Santos", action: "Consulta agendada para 15/03", time: "5 min", hot: false },
  { id: 3, agent: "ImobBot Premium", lead: "João Oliveira", action: "Visita confirmada - Apt 302", time: "8 min", hot: true },
  { id: 4, agent: "JurisIA", lead: "Ana Costa", action: "Triagem concluída - Caso trabalhista", time: "12 min", hot: false },
  { id: 5, agent: "TurIA Viagens", lead: "Pedro Lima", action: "Pacote Cancún enviado", time: "15 min", hot: true },
  { id: 6, agent: "ConsórcioPro", lead: "Fernanda Alves", action: "Simulação de consórcio auto", time: "20 min", hot: false },
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-display">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Visão geral dos seus agentes VerbIA</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.title} className="glass-card neon-border">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{metric.title}</p>
                  <p className="text-2xl font-bold font-display mt-1">{metric.value}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <metric.icon className="h-5 w-5 text-primary" />
                </div>
              </div>
              <p className="text-xs text-primary mt-2">{metric.change} vs. semana anterior</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Chart */}
        <Card className="glass-card neon-border lg:col-span-3">
          <CardHeader>
            <CardTitle className="font-display text-lg">Desempenho Semanal</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorConversoes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(120, 100%, 62%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(120, 100%, 62%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(160, 10%, 18%)" />
                <XAxis dataKey="name" stroke="hsl(150, 10%, 55%)" fontSize={12} />
                <YAxis stroke="hsl(150, 10%, 55%)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(160, 12%, 9%)",
                    border: "1px solid hsl(120, 100%, 62%, 0.3)",
                    borderRadius: "8px",
                    color: "hsl(150, 20%, 95%)",
                  }}
                />
                <Area type="monotone" dataKey="conversoes" stroke="hsl(120, 100%, 62%)" fillOpacity={1} fill="url(#colorConversoes)" strokeWidth={2} />
                <Area type="monotone" dataKey="leads" stroke="hsl(160, 70%, 45%)" fillOpacity={0.1} fill="hsl(160, 70%, 45%)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Live Feed */}
        <Card className="glass-card neon-border lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse-neon" />
              Últimas Interações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 max-h-[300px] overflow-y-auto">
            {recentInteractions.map((item) => (
              <div key={item.id} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-accent/50 transition-colors">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate">{item.agent}</span>
                    {item.hot && <Flame className="h-3.5 w-3.5 text-orange-400 shrink-0" />}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{item.lead} — {item.action}</p>
                  <p className="text-xs text-muted-foreground/60 mt-0.5">{item.time} atrás</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
