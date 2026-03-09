import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare, Calendar, Flame, TrendingUp, Bot } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { getConvertedROI, subscribe as subscribeOutcomes } from "@/lib/outcomeStore";
import { useChartColors } from "@/hooks/useChartColors";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

const baseROI = 45200;

interface Interaction {
  id: string;
  agent_name: string;
  lead_name: string;
  action: string;
  is_hot: boolean;
  interaction_type: string;
  created_at: string;
}

function getStartOfMonth() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
}

function buildChartData(interactions: Interaction[]) {
  const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const counts: Record<string, { conversoes: number; leads: number }> = {};
  days.forEach((d) => (counts[d] = { conversoes: 0, leads: 0 }));

  for (const i of interactions) {
    const day = days[new Date(i.created_at).getDay()];
    counts[day].leads++;
    if (i.interaction_type === "conversao" || i.interaction_type === "agendamento") {
      counts[day].conversoes++;
    }
  }

  // Return Mon-Sun order
  return ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((name) => ({
    name,
    conversoes: counts[name].conversoes,
    leads: counts[name].leads,
  }));
}

const Dashboard = () => {
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [convertedROI, setConvertedROI] = useState(getConvertedROI());
  const chart = useChartColors();

  // Fetch interactions for current month
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("interactions")
        .select("*")
        .gte("created_at", getStartOfMonth())
        .order("created_at", { ascending: false });

      if (!error && data) {
        setInteractions(data);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  // Realtime listener
  useEffect(() => {
    const channel = supabase
      .channel("interactions-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "interactions" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setInteractions((prev) => [payload.new as Interaction, ...prev]);
          } else if (payload.eventType === "DELETE") {
            setInteractions((prev) => prev.filter((i) => i.id !== (payload.old as any).id));
          } else if (payload.eventType === "UPDATE") {
            setInteractions((prev) =>
              prev.map((i) => (i.id === (payload.new as Interaction).id ? (payload.new as Interaction) : i))
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Outcome store (ROI)
  useEffect(() => {
    return subscribeOutcomes(() => setConvertedROI(getConvertedROI()));
  }, []);

  // Computed metrics
  const conversasAtivas = interactions.length;
  const agendamentos = interactions.filter((i) => i.interaction_type === "agendamento").length;
  const leadsQuentes = interactions.filter((i) => i.is_hot).length;
  const totalROI = baseROI + convertedROI;
  const roiFormatted = totalROI >= 1000 ? `R$ ${(totalROI / 1000).toFixed(1)}k` : `R$ ${totalROI}`;

  const chartData = useMemo(() => buildChartData(interactions), [interactions]);
  const recentInteractions = interactions.slice(0, 8);

  const metrics = [
    { title: "Conversas Ativas", value: String(conversasAtivas), change: "+12%", icon: MessageSquare },
    { title: "Agendamentos Realizados", value: String(agendamentos), change: "+23%", icon: Calendar },
    { title: "Leads Quentes", value: String(leadsQuentes), change: "+8%", icon: Flame },
    { title: "ROI Mensal", value: roiFormatted, change: "+31%", icon: TrendingUp },
  ];

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
              {loading ? (
                <div className="space-y-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-3 w-32" />
                </div>
              ) : (
                <>
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
                </>
              )}
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
            {loading ? (
              <Skeleton className="h-[280px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorConversoes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(120, 100%, 62%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(120, 100%, 62%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={chart.grid} />
                  <XAxis dataKey="name" stroke={chart.axis} fontSize={12} />
                  <YAxis stroke={chart.axis} fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: chart.tooltipBg,
                      border: `1px solid ${chart.tooltipBorder}`,
                      borderRadius: "8px",
                      color: chart.tooltipText,
                    }}
                  />
                  <Area type="monotone" dataKey="conversoes" stroke={chart.primary} fillOpacity={1} fill="url(#colorConversoes)" strokeWidth={2} />
                  <Area type="monotone" dataKey="leads" stroke={chart.secondary} fillOpacity={0.1} fill={chart.secondary} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            )}
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
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3 p-2.5">
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              ))
            ) : recentInteractions.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">Nenhuma interação registrada ainda.</p>
            ) : (
              recentInteractions.map((item) => (
                <div key={item.id} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium truncate">{item.agent_name}</span>
                      {item.is_hot && <Flame className="h-3.5 w-3.5 text-orange-400 shrink-0" />}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{item.lead_name} — {item.action}</p>
                    <p className="text-xs text-muted-foreground/60 mt-0.5">
                      {formatDistanceToNow(new Date(item.created_at), { addSuffix: true, locale: ptBR })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
