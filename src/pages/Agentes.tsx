import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import {
  Bot,
  Plus,
  Truck,
  Heart,
  Building2,
  Scale,
  Plane,
  Handshake,
  Settings2,
} from "lucide-react";

const segments = [
  { id: "logistica", name: "Manda Já", subtitle: "Logística Last-Mile", icon: Truck, color: "text-blue-400" },
  { id: "saude", name: "Saúde & Estética", subtitle: "Agendamento de Consultas", icon: Heart, color: "text-pink-400" },
  { id: "imobiliario", name: "Imobiliário", subtitle: "Qualificação & Visitas", icon: Building2, color: "text-amber-400" },
  { id: "advocacia", name: "Advocacia", subtitle: "Triagem de Casos", icon: Scale, color: "text-purple-400" },
  { id: "turismo", name: "Turismo", subtitle: "Cotações & Pacotes", icon: Plane, color: "text-cyan-400" },
  { id: "consorcio", name: "Consórcio", subtitle: "Fechamento de Clientes", icon: Handshake, color: "text-emerald-400" },
];

const mockAgents = [
  { id: 1, name: "Manda Já SDR", segment: "logistica", active: true, conversations: 142, leads: 28 },
  { id: 2, name: "Dra. Ana - Estética", segment: "saude", active: true, conversations: 89, leads: 15 },
  { id: 3, name: "ImobBot Premium", segment: "imobiliario", active: false, conversations: 56, leads: 8 },
  { id: 4, name: "JurisIA", segment: "advocacia", active: true, conversations: 34, leads: 12 },
];

const Agentes = () => {
  const navigate = useNavigate();
  const [agents, setAgents] = useState(mockAgents);

  const toggleAgent = (id: number) => {
    setAgents((prev) =>
      prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a))
    );
  };

  const getSegment = (segId: string) => segments.find((s) => s.id === segId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display">Meus Agentes</h1>
          <p className="text-muted-foreground mt-1">Gerencie seus agentes de IA</p>
        </div>
        <Button
          className="gap-2"
          onClick={() => navigate("/agentes/novo")}
        >
          <Plus className="h-4 w-4" /> Criar Agente
        </Button>
      </div>

      {/* Segment Selector */}
      <div>
        <h2 className="text-lg font-display font-semibold mb-3">Selecione o Cérebro do Agente</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {segments.map((seg) => (
            <Card
              key={seg.id}
              className="glass-card neon-border cursor-pointer hover:neon-glow-sm transition-all group"
              onClick={() => navigate(`/agentes/novo?segment=${seg.id}`)}
            >
              <CardContent className="p-4 text-center">
                <div className="mx-auto h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2 group-hover:bg-primary/20 transition-colors">
                  <seg.icon className={`h-5 w-5 ${seg.color}`} />
                </div>
                <p className="text-sm font-medium">{seg.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{seg.subtitle}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Agent List */}
      <div className="space-y-3">
        <h2 className="text-lg font-display font-semibold">Agentes Ativos</h2>
        {agents.map((agent) => {
          const seg = getSegment(agent.segment);
          return (
            <Card key={agent.id} className="glass-card neon-border">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    {seg ? <seg.icon className={`h-5 w-5 ${seg.color}`} /> : <Bot className="h-5 w-5 text-primary" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{agent.name}</span>
                      <Badge variant={agent.active ? "default" : "secondary"} className="text-xs">
                        {agent.active ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {agent.conversations} conversas · {agent.leads} leads capturados
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Switch checked={agent.active} onCheckedChange={() => toggleAgent(agent.id)} />
                  <Button variant="ghost" size="icon" onClick={() => navigate(`/agentes/${agent.id}`)}>
                    <Settings2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Agentes;
