import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CreditCard, Zap, Bot, MessageSquare, Download } from "lucide-react";

const invoices = [
  { id: "INV-2026-003", date: "01/03/2026", amount: "R$ 497,00", status: "Pago" },
  { id: "INV-2026-002", date: "01/02/2026", amount: "R$ 497,00", status: "Pago" },
  { id: "INV-2026-001", date: "01/01/2026", amount: "R$ 497,00", status: "Pago" },
  { id: "INV-2025-012", date: "01/12/2025", amount: "R$ 297,00", status: "Pago" },
];

const Faturamento = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-display">Faturamento</h1>
        <p className="text-muted-foreground mt-1">Gerencie seu plano e faturas</p>
      </div>

      {/* Current Plan */}
      <Card className="glass-card neon-border neon-glow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold font-display">Plano Profissional</h2>
                  <Badge className="bg-primary/20 text-primary border-primary/30">Ativo</Badge>
                </div>
                <p className="text-muted-foreground text-sm">R$ 497/mês · Renovação em 01/04/2026</p>
              </div>
            </div>
            <Button variant="outline">Alterar Plano</Button>
          </div>
        </CardContent>
      </Card>

      {/* Usage Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="glass-card neon-border">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MessageSquare className="h-4 w-4" />
                <span className="text-sm">Conversas</span>
              </div>
              <span className="text-sm font-medium">2.480 / 5.000</span>
            </div>
            <Progress value={49.6} className="h-2" />
          </CardContent>
        </Card>
        <Card className="glass-card neon-border">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Bot className="h-4 w-4" />
                <span className="text-sm">Agentes Ativos</span>
              </div>
              <span className="text-sm font-medium">4 / 10</span>
            </div>
            <Progress value={40} className="h-2" />
          </CardContent>
        </Card>
        <Card className="glass-card neon-border">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <CreditCard className="h-4 w-4" />
                <span className="text-sm">Créditos IA</span>
              </div>
              <span className="text-sm font-medium">7.200 / 10.000</span>
            </div>
            <Progress value={72} className="h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Invoice History */}
      <Card className="glass-card neon-border">
        <CardHeader>
          <CardTitle className="font-display text-lg">Histórico de Faturas</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead>Fatura</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((inv) => (
                <TableRow key={inv.id} className="border-border">
                  <TableCell className="font-medium">{inv.id}</TableCell>
                  <TableCell className="text-muted-foreground">{inv.date}</TableCell>
                  <TableCell>{inv.amount}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-primary border-primary/30">{inv.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
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
};

export default Faturamento;
