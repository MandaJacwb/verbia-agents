import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Flame } from "lucide-react";

const leads = [
  { id: 1, name: "Carlos Silva", agent: "Manda Já SDR", segment: "Logística", score: "hot", lastContact: "Hoje, 14:32", action: "Cotação enviada" },
  { id: 2, name: "Maria Santos", agent: "Dra. Ana", segment: "Saúde", score: "warm", lastContact: "Hoje, 11:15", action: "Consulta agendada" },
  { id: 3, name: "João Oliveira", agent: "ImobBot", segment: "Imobiliário", score: "hot", lastContact: "Ontem, 18:40", action: "Visita confirmada" },
  { id: 4, name: "Ana Costa", agent: "JurisIA", segment: "Advocacia", score: "cold", lastContact: "Ontem, 09:22", action: "Triagem em andamento" },
  { id: 5, name: "Pedro Lima", agent: "TurIA", segment: "Turismo", score: "hot", lastContact: "Hoje, 16:05", action: "Pacote selecionado" },
  { id: 6, name: "Fernanda Alves", agent: "ConsórcioPro", segment: "Consórcio", score: "warm", lastContact: "Hoje, 10:30", action: "Simulação enviada" },
  { id: 7, name: "Ricardo Gomes", agent: "Manda Já SDR", segment: "Logística", score: "cold", lastContact: "3 dias atrás", action: "Sem resposta" },
  { id: 8, name: "Luciana Ferreira", agent: "Dra. Ana", segment: "Saúde", score: "hot", lastContact: "Hoje, 09:10", action: "Retorno agendado" },
];

const scoreConfig = {
  hot: { label: "Quente", color: "bg-orange-500/20 text-orange-400 border-orange-500/30", icon: "🔥" },
  warm: { label: "Morno", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", icon: "🌤" },
  cold: { label: "Frio", color: "bg-blue-500/20 text-blue-400 border-blue-500/30", icon: "❄️" },
};

const Leads = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-display">Leads Qualificados</h1>
        <p className="text-muted-foreground mt-1">Acompanhe e gerencie seus leads</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="glass-card neon-border">
          <CardContent className="p-4 flex items-center gap-3">
            <span className="text-2xl">🔥</span>
            <div>
              <p className="text-2xl font-bold font-display">{leads.filter((l) => l.score === "hot").length}</p>
              <p className="text-xs text-muted-foreground">Leads Quentes</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card neon-border">
          <CardContent className="p-4 flex items-center gap-3">
            <span className="text-2xl">🌤</span>
            <div>
              <p className="text-2xl font-bold font-display">{leads.filter((l) => l.score === "warm").length}</p>
              <p className="text-xs text-muted-foreground">Leads Mornos</p>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card neon-border">
          <CardContent className="p-4 flex items-center gap-3">
            <span className="text-2xl">❄️</span>
            <div>
              <p className="text-2xl font-bold font-display">{leads.filter((l) => l.score === "cold").length}</p>
              <p className="text-xs text-muted-foreground">Leads Frios</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar lead..." className="pl-9 bg-background/50" />
        </div>
        <Select>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Segmento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="logistica">Logística</SelectItem>
            <SelectItem value="saude">Saúde</SelectItem>
            <SelectItem value="imobiliario">Imobiliário</SelectItem>
            <SelectItem value="advocacia">Advocacia</SelectItem>
            <SelectItem value="turismo">Turismo</SelectItem>
            <SelectItem value="consorcio">Consórcio</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Score" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="hot">🔥 Quente</SelectItem>
            <SelectItem value="warm">🌤 Morno</SelectItem>
            <SelectItem value="cold">❄️ Frio</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card className="glass-card neon-border">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead>Lead</TableHead>
                <TableHead>Agente</TableHead>
                <TableHead>Segmento</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Última Ação</TableHead>
                <TableHead>Contato</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => {
                const sc = scoreConfig[lead.score as keyof typeof scoreConfig];
                return (
                  <TableRow key={lead.id} className="border-border hover:bg-accent/50 cursor-pointer">
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell className="text-muted-foreground">{lead.agent}</TableCell>
                    <TableCell><Badge variant="outline">{lead.segment}</Badge></TableCell>
                    <TableCell>
                      <Badge className={sc.color}>{sc.icon} {sc.label}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{lead.action}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">{lead.lastContact}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Leads;
