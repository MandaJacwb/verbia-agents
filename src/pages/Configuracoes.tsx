import { useState } from "react";
import { Building2, Mail, Phone, MapPin, Clock, Radio, Save, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";
import { getAccountData, setAccountData, formatCNPJ, validateCNPJ, type AccountData } from "@/lib/accountStore";

const tabs = [
  { id: "conta", label: "Conta", icon: Building2 },
  { id: "horario", label: "Horário de Atendimento", icon: Clock },
  { id: "canais", label: "Canais de Atendimento", icon: Radio },
] as const;

type TabId = (typeof tabs)[number]["id"];

const empresaTipos = ["Tecnologia", "Saúde", "Educação", "Varejo", "Serviços", "Indústria", "Outros"];

export default function Configuracoes() {
  const [activeTab, setActiveTab] = useState<TabId>("conta");
  const [form, setForm] = useState<AccountData>(getAccountData);

  const update = (field: keyof AccountData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (form.cnpj && !validateCNPJ(form.cnpj)) {
      toast({ title: "CNPJ inválido", description: "Informe um CNPJ válido com 14 dígitos.", variant: "destructive" });
      return;
    }

    const situacao = validateCNPJ(form.cnpj) ? "Ativa" : "Inativa";
    const updated = { ...form, situacao } as AccountData;
    setForm(updated);
    setAccountData(updated);
    toast({ title: "Configurações salvas", description: situacao === "Ativa" ? "Conta ativa — agentes liberados." : "Preencha um CNPJ válido para ativar a conta." });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display">Configurações da Conta</h1>
        <p className="text-muted-foreground">Gerencie os dados e preferências da sua conta.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar navigation */}
        <nav className="md:w-56 shrink-0 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm transition-colors ${
                activeTab === tab.id
                  ? "bg-accent text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              }`}
            >
              <tab.icon className="h-4 w-4 shrink-0" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="flex-1 space-y-6">
          {activeTab === "conta" && (
            <>
              {/* Dados da Empresa */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Building2 className="h-5 w-5 text-primary" />
                    Dados da Empresa
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Nome</Label>
                    <Input value={form.nome} onChange={(e) => update("nome", e.target.value)} placeholder="Nome da empresa" />
                  </div>
                  <div className="space-y-2">
                    <Label>Tipo da Empresa</Label>
                    <Select value={form.tipo} onValueChange={(v) => update("tipo", v)}>
                      <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>
                        {empresaTipos.map((t) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Razão Social</Label>
                    <Input value={form.razaoSocial} onChange={(e) => update("razaoSocial", e.target.value)} placeholder="Razão social" />
                  </div>
                  <div className="space-y-2">
                    <Label>CNPJ</Label>
                    <Input
                      value={form.cnpj}
                      onChange={(e) => update("cnpj", formatCNPJ(e.target.value))}
                      placeholder="00.000.000/0000-00"
                      maxLength={18}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Administrador</Label>
                    <Input value={form.administrador} onChange={(e) => update("administrador", e.target.value)} placeholder="Nome do administrador" />
                  </div>
                  <div className="space-y-2">
                    <Label>Situação da Conta</Label>
                    <div className="flex items-center h-10">
                      <Badge variant={form.situacao === "Ativa" ? "default" : "secondary"}>
                        {form.situacao}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Dados para Contato */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Phone className="h-5 w-5 text-primary" />
                    Dados para Contato
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5" /> Email
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>Email principal de contato da empresa.</TooltipContent>
                      </Tooltip>
                    </Label>
                    <Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="email@empresa.com" />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5" /> Telefone
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>Telefone principal para contato.</TooltipContent>
                      </Tooltip>
                    </Label>
                    <Input value={form.telefone} onChange={(e) => update("telefone", e.target.value)} placeholder="(00) 00000-0000" />
                  </div>
                </CardContent>
              </Card>

              {/* Endereço */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MapPin className="h-5 w-5 text-primary" />
                    Endereço
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>CEP</Label>
                    <Input value={form.cep} onChange={(e) => update("cep", e.target.value)} placeholder="00000-000" />
                  </div>
                  <div className="space-y-2">
                    <Label>Rua</Label>
                    <Input value={form.rua} onChange={(e) => update("rua", e.target.value)} placeholder="Nome da rua" />
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button onClick={handleSave} className="gap-2">
                  <Save className="h-4 w-4" /> Salvar Alterações
                </Button>
              </div>
            </>
          )}

          {activeTab === "horario" && (
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Clock className="h-5 w-5 text-primary" />Horário de Atendimento</CardTitle></CardHeader>
              <CardContent><p className="text-muted-foreground">Em breve você poderá configurar os horários de atendimento por canal.</p></CardContent>
            </Card>
          )}

          {activeTab === "canais" && (
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Radio className="h-5 w-5 text-primary" />Canais de Atendimento</CardTitle></CardHeader>
              <CardContent><p className="text-muted-foreground">Em breve você poderá gerenciar os canais de atendimento disponíveis.</p></CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
