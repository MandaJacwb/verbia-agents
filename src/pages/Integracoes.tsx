import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  MessageCircle, Instagram, Facebook, Globe,
  CheckCircle2, XCircle, Settings, Copy, Pencil, Trash2
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ChannelCard {
  id: string;
  name: string;
  icon: React.ElementType;
  colorClass: string;
  identifier: string;
  connected: boolean;
  assignedAgent: string;
}

interface AgentRow {
  id: string;
  name: string;
  channel: string;
  channelIcon: React.ElementType;
  channelColor: string;
  team: "Vendas" | "Suporte";
  status: "Em uso" | "Rascunho";
}

const initialChannels: ChannelCard[] = [
  { id: "whatsapp", name: "WhatsApp", icon: MessageCircle, colorClass: "text-green-400", identifier: "+55 11 99999-0000", connected: true, assignedAgent: "SDR Manda Já" },
  { id: "instagram", name: "Instagram", icon: Instagram, colorClass: "text-pink-400", identifier: "@manda.ja", connected: true, assignedAgent: "Atendente IG" },
  { id: "messenger", name: "Messenger", icon: Facebook, colorClass: "text-blue-400", identifier: "Manda Já Logística", connected: true, assignedAgent: "Bot Messenger" },
  { id: "site", name: "Site", icon: Globe, colorClass: "text-teal-400", identifier: "mandaja.com.br", connected: false, assignedAgent: "" },
];

const agentOptions = ["SDR Manda Já", "Atendente IG", "Bot Messenger", "Closer Vendas", "Suporte Geral"];

const agents: AgentRow[] = [
  { id: "a1", name: "SDR Manda Já", channel: "WhatsApp", channelIcon: MessageCircle, channelColor: "text-green-400", team: "Vendas", status: "Em uso" },
  { id: "a2", name: "Atendente IG", channel: "Instagram", channelIcon: Instagram, channelColor: "text-pink-400", team: "Vendas", status: "Em uso" },
  { id: "a3", name: "Bot Messenger", channel: "Messenger", channelIcon: Facebook, channelColor: "text-blue-400", team: "Suporte", status: "Em uso" },
  { id: "a4", name: "Closer Vendas", channel: "WhatsApp", channelIcon: MessageCircle, channelColor: "text-green-400", team: "Vendas", status: "Rascunho" },
  { id: "a5", name: "Suporte Geral", channel: "Site", channelIcon: Globe, channelColor: "text-teal-400", team: "Suporte", status: "Rascunho" },
];

const Integracoes = () => {
  const navigate = useNavigate();
  const [channels, setChannels] = useState(initialChannels);

  const handleAgentChange = (channelId: string, agent: string) => {
    setChannels((prev) =>
      prev.map((ch) => (ch.id === channelId ? { ...ch, assignedAgent: agent } : ch))
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-display">Configuração de Agentes por Canal</h1>
        <p className="text-muted-foreground mt-1">Gerencie conexões e vincule agentes a cada canal</p>
      </div>

      {/* Channel connection cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {channels.map((ch) => (
          <Card key={ch.id} className="glass-card neon-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ch.icon className={`h-6 w-6 ${ch.colorClass}`} />
                  <CardTitle className="font-display text-base">{ch.name}</CardTitle>
                </div>
                <Badge variant={ch.connected ? "default" : "secondary"} className="text-xs gap-1">
                  {ch.connected ? <><CheckCircle2 className="h-3 w-3" /> On</> : <><XCircle className="h-3 w-3" /> Off</>}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground truncate">{ch.identifier}</p>
              <Select value={ch.assignedAgent} onValueChange={(v) => handleAgentChange(ch.id, v)}>
                <SelectTrigger className="bg-background/50 h-9 text-xs">
                  <SelectValue placeholder="Selecionar agente" />
                </SelectTrigger>
                <SelectContent>
                  {agentOptions.map((a) => (
                    <SelectItem key={a} value={a}>{a}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Agents table */}
      <Card className="glass-card neon-border">
        <CardHeader>
          <CardTitle className="font-display text-lg">Agentes Ativos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agente</TableHead>
                <TableHead>Canal</TableHead>
                <TableHead>Equipe</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agents.map((ag) => (
                <TableRow key={ag.id}>
                  <TableCell className="font-medium">{ag.name}</TableCell>
                  <TableCell>
                    <span className="flex items-center gap-1.5">
                      <ag.channelIcon className={`h-4 w-4 ${ag.channelColor}`} />
                      {ag.channel}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={ag.team === "Vendas" ? "default" : "secondary"} className="text-xs">
                      {ag.team}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={ag.status === "Em uso"
                        ? "border-primary/50 text-primary text-xs"
                        : "border-muted-foreground/30 text-muted-foreground text-xs"}
                    >
                      {ag.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(`/agentes/${ag.id}`)}>
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Integracoes;
