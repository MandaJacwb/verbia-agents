import { useState, useEffect, useRef, useMemo } from "react";
import { Search, Upload, Download, Plus, X, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import {
  getContacts,
  addContact,
  getAllTags,
  importContactsFromCSV,
  exportContactsToCSV,
  subscribe,
  TAG_COLORS,
  type Contact,
} from "@/lib/contactsStore";

export default function Contatos() {
  const [contacts, setContacts] = useState<Contact[]>(getContacts());
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newOpen, setNewOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", instagram: "", email: "", empresa: "", opportunityValue: "", tags: "" });
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return subscribe(() => setContacts(getContacts()));
  }, []);

  const allTags = useMemo(() => getAllTags(), [contacts]);

  const filtered = useMemo(() => {
    let list = contacts;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) => c.name.toLowerCase().includes(q) || c.phone.replace(/\D/g, "").includes(q.replace(/\D/g, ""))
      );
    }
    if (selectedTags.length > 0) {
      list = list.filter((c) => selectedTags.some((t) => c.tags.includes(t)));
    }
    return list;
  }, [contacts, search, selectedTags]);

  const toggleTag = (tag: string) =>
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));

  const handleNew = () => {
    if (!form.name || !form.phone) {
      toast({ title: "Preencha nome e telefone", variant: "destructive" });
      return;
    }
    addContact({
      name: form.name,
      phone: form.phone,
      instagram: form.instagram || undefined,
      email: form.email || undefined,
      tags: form.tags ? form.tags.split(",").map((t) => t.trim().toUpperCase()) : [],
    });
    setForm({ name: "", phone: "", instagram: "", email: "", tags: "" });
    setNewOpen(false);
    toast({ title: "Contato adicionado com sucesso!" });
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const count = importContactsFromCSV(text);
      toast({ title: `${count} contatos importados!` });
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleExport = () => {
    const csv = exportContactsToCSV();
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "contatos_verbia.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Contatos exportados!" });
  };

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();

  const getTagStyle = (tag: string) => {
    const colors = TAG_COLORS[tag];
    if (colors) return { backgroundColor: colors.bg, color: colors.text };
    return { backgroundColor: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display neon-text">Gestão de Contatos</h1>
          <p className="text-sm text-muted-foreground mt-1">
            CRM inteligente — {contacts.length} contatos cadastrados
          </p>
        </div>
        <div className="flex gap-2">
          <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleImport} />
          <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
            <Upload className="h-4 w-4 mr-1" /> Importar CSV
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-1" /> Exportar
          </Button>
          <Button size="sm" onClick={() => setNewOpen(true)}>
            <Plus className="h-4 w-4 mr-1" /> Novo Contato
          </Button>
        </div>
      </div>

      {/* Search + Tag Filters */}
      <div className="space-y-3">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou telefone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className="px-3 py-1 rounded-full text-xs font-semibold transition-all border"
              style={{
                ...(selectedTags.includes(tag)
                  ? { ...getTagStyle(tag), borderColor: "transparent" }
                  : {
                      backgroundColor: "transparent",
                      color: "hsl(var(--muted-foreground))",
                      borderColor: "hsl(var(--border))",
                    }),
              }}
            >
              {tag}
              {selectedTags.includes(tag) && <X className="inline h-3 w-3 ml-1" />}
            </button>
          ))}
          {selectedTags.length > 0 && (
            <button
              onClick={() => setSelectedTags([])}
              className="text-xs text-muted-foreground hover:text-foreground underline"
            >
              Limpar filtros
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="glass-card rounded-xl overflow-hidden neon-border">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border/50 hover:bg-transparent">
              <TableHead className="w-[280px]">Contato</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Instagram</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Etiquetas</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                  Nenhum contato encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((c) => (
                <TableRow key={c.id} className="border-b border-border/30 hover:bg-accent/30">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
                          {getInitials(c.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-foreground">{c.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">{c.phone}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{c.instagram || "—"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{c.email || "—"}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1.5">
                      {c.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide"
                          style={getTagStyle(tag)}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Smart Recognition Info */}
      <div className="glass-card rounded-xl p-4 neon-border">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Smart Recognition Ativo</p>
            <p className="text-xs text-muted-foreground">
              Quando um contato salvo inicia conversa, o agente IA identifica automaticamente pelo telefone e usa o nome na saudação.
            </p>
          </div>
        </div>
      </div>

      {/* New Contact Dialog */}
      <Dialog open={newOpen} onOpenChange={setNewOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Novo Contato</DialogTitle>
            <DialogDescription>Preencha os dados do contato para cadastro rápido.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Nome *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nome completo" />
            </div>
            <div>
              <Label>Telefone *</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+55 11 99999-9999" />
            </div>
            <div>
              <Label>Instagram</Label>
              <Input value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} placeholder="@usuario" />
            </div>
            <div>
              <Label>E-mail</Label>
              <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@exemplo.com" />
            </div>
            <div>
              <Label>Etiquetas</Label>
              <Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="VIP, ESTÉTICA (separar por vírgula)" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewOpen(false)}>Cancelar</Button>
            <Button onClick={handleNew}>Salvar Contato</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
