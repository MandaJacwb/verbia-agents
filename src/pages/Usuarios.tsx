import { useState, useMemo } from "react";
import { Search, Plus, Shield, ShieldCheck, Headphones, Trash2, Edit } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  getUsers,
  addUser,
  removeUser,
  getRoleLabel,
  getPlanUserLimit,
  type UserRole,
  type AppUser,
} from "@/lib/usersStore";
import { useToast } from "@/hooks/use-toast";

const roleBadge = (role: UserRole) => {
  switch (role) {
    case "admin_conta":
      return (
        <Badge className="bg-chart-3/20 text-chart-3 border-chart-3/30 gap-1">
          <ShieldCheck className="h-3 w-3" />
          {getRoleLabel(role)}
        </Badge>
      );
    case "admin":
      return (
        <Badge className="bg-primary/15 text-primary border-primary/30 gap-1">
          <Shield className="h-3 w-3" />
          {getRoleLabel(role)}
        </Badge>
      );
    case "atendente":
      return (
        <Badge variant="secondary" className="gap-1">
          <Headphones className="h-3 w-3" />
          {getRoleLabel(role)}
        </Badge>
      );
  }
};

export default function Usuarios() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [users, setUsers] = useState<AppUser[]>(getUsers());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newLogin, setNewLogin] = useState("");
  const [newRole, setNewRole] = useState<UserRole>("atendente");

  const limit = getPlanUserLimit();
  const atLimit = users.length >= limit;

  const filtered = useMemo(() => {
    let list = users;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((u) => u.name.toLowerCase().includes(q) || u.login.toLowerCase().includes(q));
    }
    if (filterRole !== "all") {
      list = list.filter((u) => u.role === filterRole);
    }
    // admin_conta always first
    return list.sort((a, b) => {
      if (a.role === "admin_conta") return -1;
      if (b.role === "admin_conta") return 1;
      return 0;
    });
  }, [users, search, filterRole]);

  const handleAdd = () => {
    if (!newName || !newLogin) return;
    const u = addUser({ name: newName, login: newLogin, role: newRole });
    setUsers(getUsers());
    setDialogOpen(false);
    setNewName("");
    setNewLogin("");
    setNewRole("atendente");
    toast({ title: "Usuário adicionado", description: `${u.name} foi convidado como ${getRoleLabel(u.role)}.` });
  };

  const handleRemove = (id: string) => {
    const user = users.find((u) => u.id === id);
    if (user?.role === "admin_conta") return;
    removeUser(id);
    setUsers(getUsers());
    toast({ title: "Usuário removido" });
  };

  const initials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display">Configuração de Usuários</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Gerencie os membros da sua equipe e seus perfis de acesso.
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)} disabled={atLimit} className="gap-2">
          <Plus className="h-4 w-4" /> Novo
        </Button>
      </div>

      {/* Plan limit banner */}
      {atLimit && (
        <Alert className="border-chart-3/40 bg-chart-3/10">
          <AlertDescription className="text-chart-3 font-medium">
            Você atingiu o total de {limit} usuários contratados. Entre em contato para alterar seu plano.
          </AlertDescription>
        </Alert>
      )}

      {/* Search & filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou login..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={filterRole} onValueChange={setFilterRole}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filtrar por perfil" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os perfis</SelectItem>
            <SelectItem value="admin_conta">Administrador da Conta</SelectItem>
            <SelectItem value="admin">Administrador</SelectItem>
            <SelectItem value="atendente">Atendente</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Users table */}
      <Card className="glass-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuário</TableHead>
                <TableHead>Login</TableHead>
                <TableHead>Perfil</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback
                          className={
                            user.role === "admin_conta"
                              ? "bg-chart-3/20 text-chart-3 font-semibold text-xs"
                              : "bg-secondary text-secondary-foreground font-semibold text-xs"
                          }
                        >
                          {initials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{user.login}</TableCell>
                  <TableCell>{roleBadge(user.role)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                        <Edit className="h-4 w-4" />
                      </Button>
                      {user.role !== "admin_conta" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => handleRemove(user.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    Nenhum usuário encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add user dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Convidar Novo Membro</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Nome completo" />
            </div>
            <div className="space-y-2">
              <Label>Login / E-mail</Label>
              <Input value={newLogin} onChange={(e) => setNewLogin(e.target.value)} placeholder="email@empresa.com" />
            </div>
            <div className="space-y-2">
              <Label>Perfil de Acesso</Label>
              <Select value={newRole} onValueChange={(v) => setNewRole(v as UserRole)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="atendente">Atendente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAdd} disabled={!newName || !newLogin}>
              Convidar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
